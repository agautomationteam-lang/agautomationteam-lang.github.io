'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  voice: string;
  model: string;
  status: string;
  firstMessage: string;
  createdAt: string;
}

export default function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  async function loadAgents() {
    setLoading(true);
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setConnected(data.connected);
      setAgents(data.agents || []);
      setError(data.error || '');
    } catch (e: any) {
      setError(e.message);
      setConnected(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading agents from Vapi.ai...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
        <div className="text-red-400 font-bold mb-2">⚠️ Not Connected to Vapi.ai</div>
        <div className="text-sm text-slate-300 mb-4">{error || 'VAPI_PRIVATE_KEY not set in .env.local'}</div>
        <div className="text-xs text-slate-400">
          1. Open jarvis-app/.env.local<br/>
          2. Paste your Vapi private key<br/>
          3. Restart the app
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="text-yellow-400 font-bold mb-2">⚡ Connected but No Agents Found</div>
        <div className="text-sm text-slate-300">Your Vapi account is connected but has no assistants yet.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-emerald-400">● Connected — {agents.length} agent{agents.length !== 1 ? 's' : ''} found</div>
        <button onClick={loadAgents} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition">🔄 Refresh</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-white text-lg">{agent.name}</div>
                <div className="text-xs text-slate-400">ID: {agent.id.slice(0, 8)}...</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}`}>
                {agent.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Voice</span>
                <span className="text-slate-300">{agent.voice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model</span>
                <span className="text-slate-300">{agent.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-300">{new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {agent.firstMessage && (
              <div className="mt-3 p-2 bg-slate-900/50 rounded-lg text-xs text-slate-400 italic">
                "{agent.firstMessage.slice(0, 100)}{agent.firstMessage.length > 100 ? '...' : ''}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
