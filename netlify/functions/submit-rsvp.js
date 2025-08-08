exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, phone, email, instagram } = JSON.parse(event.body || '{}');

    if (!name || !phone || !email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: name, phone, email' })
      };
    }

    // Forward to Google Apps Script webhook (kept server-side to avoid CORS and expose URL)
    const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyoU64L7GapQNn4mDhk2W5q_bawaozvON2BeIfFLT5wYypojXxQH5NuVbK6el1BADub/exec';

    const payload = { name, phone, email, instagram: instagram || '' };

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Upstream error', status: response.status, data })
      };
    }

    // Try to send WhatsApp notification (non-blocking)
    let whatsapp = { status: 'skipped' };
    try {
      whatsapp = await sendWhatsAppNotification(payload);
    } catch (err) {
      console.error('WhatsApp notify error:', err);
      whatsapp = { status: 'error', message: err.message };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, data, whatsapp })
    };
  } catch (error) {
    console.error('RSVP submit error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};

// Attempt WhatsApp via Cloud API first, then Twilio as a fallback
async function sendWhatsAppNotification(details) {
  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ADMIN_NUMBER) {
    const result = await sendViaWhatsAppCloud(details);
    return { provider: 'cloud', ...result };
  }

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM &&
    process.env.TWILIO_WHATSAPP_TO
  ) {
    const result = await sendViaTwilio(details);
    return { provider: 'twilio', ...result };
  }

  return { status: 'skipped', reason: 'no_whatsapp_env' };
}

function formatWhatsAppMessage({ name, phone, email, instagram }) {
  return [
    'New RSVP',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Instagram: ${instagram || '-'}`
  ].join('\n');
}

async function sendViaWhatsAppCloud(details) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  let to = process.env.WHATSAPP_ADMIN_NUMBER || '';
  // Ensure E.164 without leading plus is acceptable; Meta expects digits only
  to = to.replace(/\D/g, '');

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: formatWhatsAppMessage(details) }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (!res.ok) {
    return { status: 'error', statusCode: res.status, response: json };
  }
  return { status: 'sent', response: json };
}

async function sendViaTwilio(details) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  let from = process.env.TWILIO_WHATSAPP_FROM || '';
  let to = process.env.TWILIO_WHATSAPP_TO || '';

  if (!from.startsWith('whatsapp:')) from = `whatsapp:${from}`;
  if (!to.startsWith('whatsapp:')) to = `whatsapp:${to}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`;
  const bodyParams = new URLSearchParams({
    To: to,
    From: from,
    Body: formatWhatsAppMessage(details)
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyParams.toString()
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (!res.ok) {
    return { status: 'error', statusCode: res.status, response: json };
  }
  return { status: 'sent', response: json };
}