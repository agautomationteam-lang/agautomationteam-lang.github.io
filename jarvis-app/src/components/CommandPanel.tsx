'use client';

import { useState } from 'react';

const AGENTS = ['Sarah (HVAC)', 'Mike (Plumbing)', 'Emma (Electrical)', 'David (General)', 'All Agents'];
const COMMANDS = ['Start Campaign', 'Pause', 'Resume', 'Send Test Call', 'Update Prompt', 'Get Status'];

export default function CommandPanel() {
  const [agent, setAgent] = useState('Sarah (HVAC)');
  const [command, setCommand] = useState('Get Status');
  const [params, setParams] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function sendCommand() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, command, params }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ success: false, error: e.message });
    }
    setSending(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Target Agent</label>
        <select
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          {AGENTS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Command</label>
        <select
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          {COMMANDS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Parameters (optional)</label>
        <input
          type="text"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="Phone number, prompt text, etc."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        onClick={sendCommand}
        disabled={sending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded-xl text-sm font-semibold transition"
      >
        {sending ? 'Sending...' : '🚀 Send Command'}
      </button>

      {result && (
        <div className={`p-3 rounded-lg text-xs ${result.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {result.message || result.error || JSON.stringify(result)}
        </div>
      )}
    </div>
  );
}
