import { Resend } from 'resend';
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Allow OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing body parameters');
    }
    const body = JSON.parse(event.body);
    const { name, track, html, subject } = body;

    const resend = new Resend('re_Rau6jNd3_EQwTXSY9jiegFH5ypqzEwdhu');

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['admissions@krishnaite.dev'],
      subject: subject || `KGA Manifest: ${name} (${track})`,
      html: html,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
