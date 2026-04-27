const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const WORKSPACE = '/root/.openclaw/workspace';

app.use(cors());
app.use(express.json());

const VAPI_KEY = '6c4ddf36-dac3-47d9-9165-db42e8ec4d7a';
const VAPI_BASE = 'https://api.vapi.ai';
const N8N_BASE = 'https://ag-automation.app.n8n.cloud';

// ─── SHARED STATE ───
let agentStates = {};
let leadJourneys = {};
let workflowStates = {};

function logAction(source, action, target, result) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${source} :: ${action} → ${target} :: ${result}`);
  return { timestamp: ts, source, action, target, result };
}

async function vapiFetch(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { Authorization: `Bearer ${VAPI_KEY}`, 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${VAPI_BASE}${endpoint}`, opts);
  if (!res.ok) throw new Error(`Vapi ${res.status}: ${await res.text()}`);
  return res.json();
}

async function n8nWebhook(name, payload) {
  try {
    const res = await fetch(`${N8N_BASE}/webhook/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { success: res.ok, status: res.status, text: await res.text() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ═══════════════════════════════════════════════════════════
// COMMAND PROTOCOL
// ═══════════════════════════════════════════════════════════

app.get('/api/agents', async (req, res) => {
  try {
    const data = await vapiFetch('/assistant');
    const agents = (Array.isArray(data) ? data : []).map(a => {
      const state = agentStates[a.id] || { task: 'idle', status: 'ready', lead_id: null };
      return {
        id: a.id,
        name: a.name || 'Unnamed',
        voice: a.voice?.voiceId || 'default',
        model: a.model?.model || 'unknown',
        vapi_status: a.status || 'active',
        jarvis_status: state.status,
        current_task: state.task,
        assigned_lead: state.lead_id,
        last_updated: state.last_updated,
        firstMessage: a.firstMessage || '',
        voicemailMessage: a.voicemailMessage || '',
        voiceSpeed: a.voice?.speed || 1,
        createdAt: a.createdAt,
      };
    });
    res.json({
      protocol: '→',
      connected: true,
      count: agents.length,
      agents,
      _meta: { pulled_from: 'Vapi.ai', state_source: 'JARVIS shared state' }
    });
  } catch (err) {
    res.status(502).json({ protocol: '→', connected: false, error: err.message, agents: [] });
  }
});

app.get('/api/focus/:lead_id', async (req, res) => {
  const leadId = req.params.lead_id;
  const journey = leadJourneys[leadId] || [];
  let calls = [];
  try {
    const allCalls = await vapiFetch('/call');
    calls = (Array.isArray(allCalls) ? allCalls : [])
      .filter(c => c.customer?.number === leadId || c.id === leadId)
      .slice(0, 20)
      .map(c => ({
        id: c.id,
        agent: c.assistant?.name || c.assistantId,
        status: c.status,
        phone: c.customer?.number,
        duration: c.duration,
        transcript: c.transcript?.slice(0, 200) || '',
        cost: c.cost,
        startedAt: c.startedAt,
      }));
  } catch (e) { /* ignore */ }
  res.json({
    protocol: '/focus',
    lead_id: leadId,
    journey: journey.length ? journey : [{ note: 'No journey recorded yet. Assign an agent to begin.' }],
    calls,
    summary: {
      total_interactions: journey.length + calls.length,
      agents_involved: [...new Set(journey.map(j => j.agent))],
      last_action: journey[journey.length - 1] || null,
    }
  });
});

app.post('/api/assign', async (req, res) => {
  const { agent, task, lead_id, params = {} } = req.body;
  if (!agent || !task) return res.status(400).json({ protocol: '/assign', error: 'agent and task required' });

  const state = { task, status: 'assigned', lead_id: lead_id || null, last_updated: new Date().toISOString(), params };
  agentStates[agent] = state;

  if (lead_id) {
    if (!leadJourneys[lead_id]) leadJourneys[lead_id] = [];
    leadJourneys[lead_id].push({ agent, action: 'assigned', task, timestamp: state.last_updated, result: 'pending' });
  }

  const n8nResult = await n8nWebhook('agent-assigned', { agent_id: agent, task, lead_id: lead_id || null, params, timestamp: state.last_updated });
  const actionLog = logAction('JARVIS', 'ASSIGN', `${agent} → ${task}`, n8nResult.success ? 'n8n triggered' : 'n8n failed');

  res.json({
    protocol: '/assign',
    command_id: `cmd-${Date.now()}`,
    agent, task, lead_id: lead_id || null,
    state, n8n_triggered: n8nResult.success,
    n8n_response: n8nResult,
    log: actionLog
  });
});

app.post('/api/retry', async (req, res) => {
  const { agent, lead_id } = req.body;
  if (!agent) return res.status(400).json({ protocol: '/retry', error: 'agent required' });

  const journey = leadJourneys[lead_id] || [];
  const lastFailed = [...journey].reverse().find(j => j.agent === agent && j.result === 'failed');

  const state = { task: lastFailed ? lastFailed.task : 'retry-manual', status: 'retrying', lead_id: lead_id || null, last_updated: new Date().toISOString() };
  agentStates[agent] = state;

  const n8nResult = await n8nWebhook('agent-retry', { agent_id: agent, lead_id: lead_id || null, previous_failed_action: lastFailed || null, retry_timestamp: state.last_updated });

  if (lead_id) {
    journey.push({ agent, action: 'retry', task: state.task, timestamp: state.last_updated, result: n8nResult.success ? 'retry_triggered' : 'retry_failed' });
  }

  const actionLog = logAction('JARVIS', 'RETRY', `${agent} → ${lead_id || 'unknown'}`, n8nResult.success ? 'n8n retry triggered' : 'n8n retry failed');

  res.json({
    protocol: '/retry',
    command_id: `cmd-${Date.now()}`,
    agent, lead_id: lead_id || null,
    previous_failed: lastFailed || null,
    state, n8n_triggered: n8nResult.success,
    n8n_response: n8nResult,
    log: actionLog
  });
});

app.post('/api/pause', async (req, res) => {
  const { workflow } = req.body;
  if (!workflow) return res.status(400).json({ protocol: '/pause', error: 'workflow required' });
  workflowStates[workflow] = { status: 'paused', paused_at: new Date().toISOString() };
  const n8nResult = await n8nWebhook('workflow-pause', { workflow_id: workflow, paused_at: workflowStates[workflow].paused_at });
  const actionLog = logAction('JARVIS', 'PAUSE', workflow, n8nResult.success ? 'n8n paused' : 'n8n pause failed');
  res.json({ protocol: '/pause', workflow, state: workflowStates[workflow], n8n_triggered: n8nResult.success, log: actionLog });
});

app.post('/api/resume', async (req, res) => {
  const { workflow } = req.body;
  if (!workflow) return res.status(400).json({ protocol: '/resume', error: 'workflow required' });
  const prev = workflowStates[workflow] || { status: 'unknown' };
  workflowStates[workflow] = { status: 'active', resumed_at: new Date().toISOString(), was_paused: prev.paused_at || null };
  const n8nResult = await n8nWebhook('workflow-resume', { workflow_id: workflow, resumed_at: workflowStates[workflow].resumed_at });
  const actionLog = logAction('JARVIS', 'RESUME', workflow, n8nResult.success ? 'n8n resumed' : 'n8n resume failed');
  res.json({ protocol: '/resume', workflow, state: workflowStates[workflow], n8n_triggered: n8nResult.success, log: actionLog });
});

app.get('/api/calls', async (req, res) => {
  try {
    const data = await vapiFetch('/call');
    const calls = (Array.isArray(data) ? data : []).slice(0, 50).map(c => ({
      id: c.id, status: c.status, direction: c.direction,
      agent: c.assistant?.name || c.assistantId || 'Unknown',
      phone: c.customer?.number || c.phoneNumber || '',
      startedAt: c.startedAt, endedAt: c.endedAt, duration: c.duration || 0,
      recordingUrl: c.recordingUrl || '', transcript: c.transcript || '', cost: c.cost || 0,
      messages: c.messages?.length || 0,
    }));
    res.json({ protocol: '/calls', connected: true, count: calls.length, calls });
  } catch (err) {
    res.status(502).json({ protocol: '/calls', connected: false, error: err.message, calls: [] });
  }
});

app.get('/api/health', async (req, res) => {
  const results = { vapi: { status: 'unknown', latency: 0 }, n8n: { status: 'unknown', latency: 0 } };
  const vstart = Date.now();
  try { await vapiFetch('/assistant'); results.vapi = { status: 'online', latency: Date.now() - vstart }; }
  catch (e) { results.vapi = { status: 'offline', latency: Date.now() - vstart, error: e.message }; }
  const nstart = Date.now();
  try {
    const nres = await fetch(`${N8N_BASE}/healthz`);
    results.n8n = { status: nres.ok ? 'online' : 'degraded', latency: Date.now() - nstart };
  } catch (e) { results.n8n = { status: 'offline', latency: Date.now() - nstart, error: e.message }; }
  res.json({ protocol: '/health', services: results, timestamp: new Date().toISOString() });
});

// Serve dashboard HTML
app.get('/dashboard', (req, res) => {
  try {
    const html = fs.readFileSync(`${WORKSPACE}/jarvis-live.html`, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard', detail: err.message });
  }
});

// Static files
app.use('/assets', express.static(`${WORKSPACE}/assets`));

// API root
app.get('/', (req, res) => {
  res.json({
    name: 'JARVIS Command Server v2.0',
    status: 'running',
    commands: ['GET /api/agents (→)', 'GET /api/focus/:lead_id', 'POST /api/assign', 'POST /api/retry', 'POST /api/pause', 'POST /api/resume', 'GET /api/calls', 'GET /api/health'],
    dashboard: '/dashboard',
    connected_services: { vapi: true, n8n: true }
  });
});

app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════════════════╗`);
  console.log(`║     🚀 JARVIS COMMAND SERVER v2.0 — PORT ${PORT}            ║`);
  console.log(`║     Commands: → | /focus | /assign | /retry | /pause | /resume`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
});
