'use client';

import { useEffect, useState } from 'react';

interface Call {
  id: string;
  status: string;
  direction: string;
  assistant: string;
  phone: string;
  startedAt: string;
  endedAt?: string;
  duration: number;
  cost: number;
  messages: number;
}

export default function ActivityLog() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCalls() {
    setLoading(true);
    try {
      const res = await fetch('/api/calls');
      const data = await res.json();
      setCalls(data.calls || []);
    } catch (e) {
      console.error('Failed to load calls', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCalls();
    const interval = setInterval(loadCalls, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">Loading call history...</div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm">No calls yet. Start making calls to see activity here.</div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {calls.map((call) => (
        <div key={call.id} className="p-3 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${call.status === 'ended' ? 'bg-emerald-400' : call.status === 'in-progress' ? 'bg-yellow-400 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-blue-400 font-mono text-sm">{call.id.slice(0, 8)}</span>
            </div>
            <span className="text-xs text-slate-500">{call.assistant}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-300">{call.phone || 'No number'}</span>
            <span className="text-slate-400">{call.duration}s · {call.messages} msgs · ${call.cost.toFixed(2)}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {new Date(call.startedAt).toLocaleString()} · {call.direction}
          </div>
        </div>
      ))}
    </div>
  );
}
