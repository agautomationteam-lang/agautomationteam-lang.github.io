const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS enabled so MJ can access from anywhere
app.use(cors());
app.use(express.json());

const VAPI_KEY = '6c4ddf36-dac3-47d9-9165-db42e8ec4d7a';
const VAPI_BASE = 'https://api.vapi.ai';

// ─── PROXY: /api/agents → Vapi /assistant ───
app.get('/api/agents', async (req, res) => {
  try {
    const response = await fetch(`${VAPI_BASE}/assistant`, {
      headers: { Authorization: `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json({
      connected: true,
      count: Array.isArray(data) ? data.length : 0,
      agents: Array.isArray(data) ? data.map(a => ({
        id: a.id,
        name: a.name || 'Unnamed Agent',
        voice: a.voice?.voiceId || a.voice?.provider || 'default',
        model: a.model?.model || 'unknown',
        status: a.status || 'active',
        firstMessage: a.firstMessage || '',
        voicemailMessage: a.voicemailMessage || '',
        createdAt: a.createdAt,
        voiceSpeed: a.voice?.speed || 1,
        voiceSettings: a.voice,
        modelConfig: a.model,
      })) : []
    });
  } catch (err) {
    res.json({ connected: false, error: err.message, agents: [] });
  }
});

// ─── PROXY: /api/calls → Vapi /call ───
app.get('/api/calls', async (req, res) => {
  try {
    const response = await fetch(`${VAPI_BASE}/call`, {
      headers: { Authorization: `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json({
      connected: true,
      count: Array.isArray(data) ? data.length : 0,
      calls: Array.isArray(data) ? data.slice(0, 50).map(c => ({
        id: c.id,
        status: c.status,
        direction: c.direction,
        assistant: c.assistant?.name || c.assistantId || 'Unknown',
        phone: c.customer?.number || c.phoneNumber || '',
        startedAt: c.startedAt,
        endedAt: c.endedAt,
        duration: c.duration || 0,
        recordingUrl: c.recordingUrl || '',
        transcript: c.transcript || '',
        cost: c.cost || 0,
        messages: c.messages?.length || 0,
      })) : []
    });
  } catch (err) {
    res.json({ connected: false, error: err.message, calls: [] });
  }
});

// ─── PROXY: /api/health → Ping all services ───
app.get('/api/health', async (req, res) => {
  const results = { vapi: { status: 'unknown', latency: 0 }, twilio: { status: 'unknown', latency: 0 }, n8n: { status: 'unknown', latency: 0 }, openai: { status: 'unknown', latency: 0 } };
  
  const vstart = Date.now();
  try { await fetch(`${VAPI_BASE}/assistant`, { headers: { Authorization: `Bearer ${VAPI_KEY}` } }); results.vapi = { status: 'online', latency: Date.now() - vstart }; } catch (e) { results.vapi = { status: 'offline', latency: Date.now() - vstart }; }
  
  res.json(results);
});

// ─── COMMAND: POST /api/command ───
app.post('/api/command', async (req, res) => {
  const { agent, action, params } = req.body;
  console.log('[COMMAND]', agent, action, params);
  res.json({ success: true, message: `Command "${action}" queued for ${agent}`, timestamp: new Date().toISOString() });
});

// ─── STATIC: Serve jarvis-live.html ───
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'jarvis-live.html'));
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════════════════╗`);
  console.log(`║     🚀 JARVIS PROXY SERVER RUNNING                        ║`);
  console.log(`║     http://localhost:${PORT}                                ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
});
