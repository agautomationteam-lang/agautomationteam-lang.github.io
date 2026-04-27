export async function fetchVapi(url: string) {
  const key = process.env.VAPI_PRIVATE_KEY;
  if (!key || key === 'YOUR_VAPI_PRIVATE_KEY_HERE') {
    throw new Error('VAPI_PRIVATE_KEY not set in .env.local');
  }
  const res = await fetch(`https://api.vapi.ai${url}`, {
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Vapi API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchTwilio(url: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}${url}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}` },
  });
  if (!res.ok) throw new Error(`Twilio API error: ${res.status}`);
  return res.json();
}

export async function fetchN8n(url: string) {
  const token = process.env.N8N_API_TOKEN;
  const base = process.env.N8N_BASE_URL;
  const res = await fetch(`${base}/api/v1${url}`, {
    headers: { 'X-N8N-API-KEY': token || '', 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`n8n API error: ${res.status}`);
  return res.json();
}

export async function fetchOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });
  return res.ok;
}
