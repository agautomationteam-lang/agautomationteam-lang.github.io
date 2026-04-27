# JARVIS Live — Real Connected Dashboard

## ⚠️ REQUIRED: API Keys Needed

The dashboard needs these keys to connect to your real services. **Without these, it shows static demo data.**

### Where to Get Them

| Service | Where to Find | Paste Here |
|---------|--------------|------------|
| **Vapi.ai Private Key** | dashboard.vapi.ai → Settings → API Keys | `.env.local` |
| **Twilio Auth Token** | Already have: `20db8e90183df8a24dc8405efef2f11e` | `.env.local` |
| **n8n API Token** | Already have in `.credentials.md` | `.env.local` |
| **OpenAI API Key** | Already have in `credentials.md` | `.env.local` |

### Quick Setup

1. Open `.env.local` (in this jarvis-app folder)
2. Paste your Vapi private key:
```
VAPI_PRIVATE_KEY=your_vapi_private_key_here
```
3. Save
4. Run `npm run dev`
5. Open `http://localhost:3000`

**That's it. The dashboard goes LIVE with real data.**

---

## What You See Once Connected

- 🤖 **All your Vapi agents** (Sarah, Mike, Emma, David + any others)
- 📞 **Live call log** — who's being called, duration, outcome
- 📊 **Real metrics** — calls today, success rate, leads captured
- 💬 **Command center** — send instructions to agents
- 🔄 **System health** — n8n, Vapi, Twilio, OpenAI status (real pings)
- 📋 **Task queue** — what's running, what's queued, what's done

---

## Architecture

```
Frontend (React) → API Routes (Next.js) → Real Services (Vapi/Twilio/n8n)
     ↓                    ↓                      ↓
  Dashboard           /api/agents           Vapi API
  Agent Cards         /api/calls            Twilio API
  Activity Log        /api/health           n8n API
  Command Panel       /api/command          OpenAI API
```

## Files Added

| File | Purpose |
|------|---------|
| `.env.local` | API keys (gitignored, never committed) |
| `src/app/api/agents/route.ts` | Fetches all Vapi assistants |
| `src/app/api/calls/route.ts` | Fetches call logs |
| `src/app/api/health/route.ts` | Pings all services |
| `src/app/api/command/route.ts` | Sends commands to agents |
| `src/app/page.tsx` | New real-time dashboard |
| `src/lib/api.ts` | Shared API client |
| `src/components/AgentGrid.tsx` | Live agent cards |
| `src/components/ActivityLog.tsx` | Real-time log |
| `src/components/SystemHealth.tsx` | Health monitors |
| `src/components/CommandPanel.tsx` | Send commands |
