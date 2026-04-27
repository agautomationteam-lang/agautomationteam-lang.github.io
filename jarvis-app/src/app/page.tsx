import AgentGrid from '@/components/AgentGrid';
import ActivityLog from '@/components/ActivityLog';
import SystemHealth from '@/components/SystemHealth';
import CommandPanel from '@/components/CommandPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              JARVIS
            </h1>
            <p className="text-slate-400 mt-1">Real-Time Agent Command Center</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 text-sm font-semibold">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Agents', value: '—', color: 'text-blue-400', sub: 'Loading...' },
            { label: 'Calls Today', value: '—', color: 'text-purple-400', sub: 'Loading...' },
            { label: 'Success Rate', value: '—', color: 'text-pink-400', sub: 'Loading...' },
            { label: 'Revenue', value: '$0', color: 'text-emerald-400', sub: 'No deals yet' },
          ].map((metric) => (
            <div key={metric.label} className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <div className="text-slate-400 text-sm mb-1">{metric.label}</div>
              <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-xs text-slate-500 mt-1">{metric.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agents */}
            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🤖</span> Your Agents
              </h2>
              <AgentGrid />
            </div>

            {/* Activity Log */}
            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📞</span> Recent Calls
              </h2>
              <ActivityLog />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Command Panel */}
            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🎮</span> Command Center
              </h2>
              <CommandPanel />
            </div>

            {/* System Health */}
            <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">System Health</h2>
              <SystemHealth />
            </div>

            {/* Quick Info */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <h3 className="font-bold text-blue-400 mb-2">ℹ️ Setup Required</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p>1. Open <code className="bg-slate-700 px-1 rounded">.env.local</code></p>
                <p>2. Paste your <strong>Vapi Private Key</strong></p>
                <p>3. Run <code className="bg-slate-700 px-1 rounded">npm run dev</code></p>
                <p>4. Dashboard connects to LIVE APIs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
