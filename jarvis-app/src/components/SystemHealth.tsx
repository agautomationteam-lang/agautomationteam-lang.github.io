'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  status: string;
  latency: number;
  error: string;
}

interface HealthData {
  vapi: HealthStatus;
  twilio: HealthStatus;
  n8n: HealthStatus;
  openai: HealthStatus;
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkHealth() {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error('Health check failed', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !health) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">Checking system health...</div>
    );
  }

  const services = [
    { name: 'Vapi.ai', data: health.vapi, color: 'blue' },
    { name: 'Twilio', data: health.twilio, color: 'purple' },
    { name: 'n8n Cloud', data: health.n8n, color: 'emerald' },
    { name: 'OpenAI', data: health.openai, color: 'pink' },
  ];

  return (
    <div className="space-y-3">
      {services.map((svc) => {
        const isOnline = svc.data.status === 'online';
        return (
          <div key={svc.name} className="p-3 bg-slate-800/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium">{svc.name}</span>
              <span className={`text-xs font-semibold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                {isOnline ? `● Online (${svc.data.latency}ms)` : `● Offline${svc.data.error ? ': ' + svc.data.error.slice(0, 30) : ''}`}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: isOnline ? `${Math.min(100, Math.max(10, 100 - svc.data.latency / 10))}%` : '10%' }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
