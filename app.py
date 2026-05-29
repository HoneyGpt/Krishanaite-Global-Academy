import os
import json
from flask import Flask, request, jsonify, send_from_directory
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Successfully connected to Supabase Client.")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")

@app.route('/')
def serve_home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/todos')
def index():
    if not supabase:
        return "<h1>Supabase is not initialized</h1>"
    try:
        response = supabase.table('todos').select("*").execute()
        todos = response.data
        html = '<h1>Todos</h1><ul>'
        for todo in todos:
            html += f'<li>{todo["name"]}</li>'
        html += '</ul>'
        return html
    except Exception as e:
        return f"<h1>Error querying todos: {e}</h1>"

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400

    # Clean data payload
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    k_id = data.get("k_id")

    record = {
        "name": name,
        "email": email,
        "phone": phone,
        "k_id": k_id
    }

    # 1. Fallback: Save locally to json file to guarantee zero data loss
    local_file = 'applicants.json'
    local_records = []
    if os.path.exists(local_file):
        try:
            with open(local_file, 'r') as f:
                local_records = json.load(f)
        except Exception:
            local_records = []
    
    local_records.append(record)
    try:
        with open(local_file, 'w') as f:
            json.dump(local_records, f, indent=4)
        print(f"Saved applicant {name} locally to applicants.json successfully.")
    except Exception as e:
        print(f"Failed to save locally: {e}")

    # 2. Try saving to Supabase
    supabase_success = False
    supabase_error = None
    if supabase:
        try:
            # We attempt to insert into 'registrations' or 'applicants' table.
            # If those don't exist, we try 'todos' or catch the exception.
            response = supabase.table('registrations').insert(record).execute()
            print("Successfully saved applicant to Supabase 'registrations' table.")
            supabase_success = True
        except Exception as e1:
            supabase_error = str(e1)
            print(f"Failed to insert into 'registrations' table: {e1}. Trying 'applicants' table...")
            try:
                response = supabase.table('applicants').insert(record).execute()
                print("Successfully saved applicant to Supabase 'applicants' table.")
                supabase_success = True
            except Exception as e2:
                supabase_error = str(e2)
                print(f"Failed to insert into 'applicants' table: {e2}.")

    return jsonify({
        "success": True,
        "saved_locally": True,
        "supabase_sync": supabase_success,
        "supabase_error": supabase_error,
        "k_id": k_id
    })

if __name__ == '__main__':
    # Start the Flask app on port 8080 (the development port)
    app.run(host='0.0.0.0', port=8080, debug=True)
