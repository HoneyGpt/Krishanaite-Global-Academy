import os
import json
import secrets
from flask import Flask, request, jsonify, send_from_directory, render_template_string
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

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    k_id = data.get("k_id")
    
    # Real-world verification flow initialization
    verification_token = secrets.token_hex(16)

    record = {
        "name": name,
        "email": email,
        "phone": phone,
        "k_id": k_id,
        "verification_token": verification_token,
        "verified": False
    }

    # 1. Fallback Local Storage: Save to applicants.json to prevent data loss
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

    # 2. Sync to Supabase Database
    supabase_success = False
    supabase_error = None
    if supabase:
        try:
            supabase.table('registrations').insert(record).execute()
            print("Successfully saved applicant to Supabase 'registrations' table.")
            supabase_success = True
        except Exception as e1:
            supabase_error = str(e1)
            print(f"Failed to insert into 'registrations': {e1}. Trying 'applicants'...")
            try:
                supabase.table('applicants').insert(record).execute()
                print("Successfully saved applicant to Supabase 'applicants' table.")
                supabase_success = True
            except Exception as e2:
                supabase_error = str(e2)
                print(f"Failed to insert into 'applicants': {e2}. Storing locally.")

    # 3. Print the verification outbox link in the terminal logs clearly
    verification_url = f"http://localhost:8080/verify?token={verification_token}"
    print("\n" + "="*80)
    print(f"✉️ [OUTBOX] Verification Link for {name} ({email})")
    print(f"URL: {verification_url}")
    print("="*80 + "\n")

    return jsonify({
        "success": True,
        "saved_locally": True,
        "supabase_sync": supabase_success,
        "supabase_error": supabase_error,
        "k_id": k_id,
        "verification_url": verification_url  # Send back for developer inspect
    })

@app.route('/verify')
def verify_token():
    token = request.args.get('token')
    if not token:
        return render_template_string(VERIFICATION_ERROR_HTML, error="No verification token was supplied.")

    # Search and verify in local database
    local_file = 'applicants.json'
    found_local = False
    verified_name = ""
    verified_k_id = ""
    
    if os.path.exists(local_file):
        try:
            with open(local_file, 'r') as f:
                records = json.load(f)
            
            for r in records:
                if r.get("verification_token") == token:
                    r["verified"] = True
                    found_local = True
                    verified_name = r.get("name")
                    verified_k_id = r.get("k_id")
                    break
            
            if found_local:
                with open(local_file, 'w') as f:
                    json.dump(records, f, indent=4)
                print(f"Verified local user {verified_name} successfully.")
        except Exception as e:
            print(f"Error updating local file during verification: {e}")

    # Search and verify in Supabase
    found_supabase = False
    if supabase:
        try:
            # We attempt to find the record and update it
            response = supabase.table('registrations').select("*").eq("verification_token", token).execute()
            if response.data:
                record_id = response.data[0].get("id") or response.data[0].get("email")
                # Update by email or id
                if "id" in response.data[0]:
                    supabase.table('registrations').update({"verified": True}).eq("id", record_id).execute()
                else:
                    supabase.table('registrations').update({"verified": True}).eq("email", record_id).execute()
                found_supabase = True
                print("Verified Supabase 'registrations' successfully.")
        except Exception as e1:
            print(f"Failed to update 'registrations': {e1}. Trying 'applicants'...")
            try:
                response = supabase.table('applicants').select("*").eq("verification_token", token).execute()
                if response.data:
                    record_id = response.data[0].get("id") or response.data[0].get("email")
                    if "id" in response.data[0]:
                        supabase.table('applicants').update({"verified": True}).eq("id", record_id).execute()
                    else:
                        supabase.table('applicants').update({"verified": True}).eq("email", record_id).execute()
                    found_supabase = True
                    print("Verified Supabase 'applicants' successfully.")
            except Exception as e2:
                print(f"Failed to update 'applicants': {e2}")

    if found_local or found_supabase:
        return render_template_string(VERIFICATION_SUCCESS_HTML, name=verified_name, k_id=verified_k_id)
    else:
        return render_template_string(VERIFICATION_ERROR_HTML, error="The supplied verification token is invalid or has expired.")

# Beautiful, emoji-free HSL design templates
VERIFICATION_SUCCESS_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Successful | Krishnaite Academy</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .success-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .success-card {
      background: var(--white-glass);
      backdrop-filter: blur(20px);
      border: 2px solid var(--black);
      border-radius: 28px;
      width: 100%;
      max-width: 600px;
      padding: 48px;
      text-align: center;
      box-shadow: 16px 16px 0px var(--black-shadow);
      animation: float-straight 15s ease-in-out infinite alternate;
    }
    .success-title {
      font-size: 2.2rem;
      font-family: var(--font-serif);
      margin-bottom: 24px;
      color: var(--black);
    }
    .success-desc {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      color: hsla(0, 0%, 7%, 0.85);
    }
    .k-badge {
      display: inline-block;
      font-family: var(--font-sans);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      padding: 8px 20px;
      background: var(--gold);
      color: var(--black);
      border: 1.5px solid var(--black);
      border-radius: 100px;
      box-shadow: 3px 3px 0px var(--black);
      margin-bottom: 24px;
    }
    @keyframes float-straight {
      0% { transform: translateY(0); }
      100% { transform: translateY(-12px); }
    }
  </style>
  <meta http-equiv="refresh" content="5;url=https://unstop.com">
</head>
<body>
  <div class="success-container">
    <div class="success-card">
      <div class="k-badge">Identity Verified</div>
      <h1 class="success-title">Verification Successful</h1>
      <p class="success-desc">
        Welcome to the Academy, {{ name }}. Your credentials have been authenticated. Your permanent Krishnaite ID: <strong>{{ k_id }}</strong> is now fully activated.
      </p>
      <p class="success-desc" style="font-size: 0.85rem; font-style: italic; color: var(--red);">
        Unlocking full application manifest... Redirecting to secure Unstop entrance exam in 5 seconds.
      </p>
      <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
        <a href="https://unstop.com" class="entrance-exam-btn" style="text-decoration: none; background: var(--red); color: var(--bg-peach); border-color: var(--black);">
          Proceed to Exam
        </a>
      </div>
    </div>
  </div>
</body>
</html>
"""

VERIFICATION_ERROR_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Error | Krishnaite Academy</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .error-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .error-card {
      background: var(--white-glass);
      backdrop-filter: blur(20px);
      border: 2px solid var(--black);
      border-radius: 28px;
      width: 100%;
      max-width: 600px;
      padding: 48px;
      text-align: center;
      box-shadow: 16px 16px 0px var(--black-shadow);
    }
    .error-title {
      font-size: 2.2rem;
      font-family: var(--font-serif);
      margin-bottom: 24px;
      color: var(--red);
    }
    .error-desc {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
      color: hsla(0, 0%, 7%, 0.85);
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-card">
      <h1 class="error-title">Verification Failed</h1>
      <p class="error-desc">
        {{ error }}
      </p>
      <div class="modal-cta-box" style="margin-top: 24px; display: flex; justify-content: center;">
        <a href="admissions-portal.html" class="entrance-exam-btn" style="text-decoration: none; background: var(--black); color: var(--bg-peach); border-color: var(--black);">
          Back to Portal
        </a>
      </div>
    </div>
  </div>
</body>
</html>
"""

if __name__ == '__main__':
    # Start the Flask app on port 8080 (the development port)
    app.run(host='0.0.0.0', port=8080, debug=True)
