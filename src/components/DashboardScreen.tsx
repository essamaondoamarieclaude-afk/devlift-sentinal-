import { useState, useEffect, FormEvent } from 'react';
import { KPI, AgentActivity } from '../types';
import { useAuditStore } from '../stores/auditStore';

export default function DashboardScreen() {
  const { addLog, deployAgent } = useAuditStore();

  const [kpis, setKpis] = useState<KPI[]>([
    {
      label: 'REVENUE TODAY',
      value: '$42,891.00',
      delta: '+12.4%',
      isPositive: true,
      icon: 'payments',
      sparkline: [20, 30, 25, 45, 60, 50, 75, 90],
      statusText: '+12.4% vs prev',
    },
    {
      label: 'ACTIVE INVENTORY',
      value: '1,204 Units',
      delta: 'Optimal',
      isPositive: true,
      icon: 'inventory_2',
      sparkline: [80, 85, 70, 90, 88, 92, 85, 91],
      statusText: 'Optimal Health',
    },
    {
      label: 'OPEN ALERTS',
      value: '07 CRITICAL',
      delta: 'Priority High',
      isPositive: false,
      icon: 'emergency',
      sparkline: [5, 4, 6, 8, 7, 5, 9, 7],
      statusText: '7 High Threat',
    },
    {
      label: 'SYSTEM UPTIME',
      value: '99.998%',
      delta: 'Stable',
      isPositive: true,
      icon: 'lan',
      sparkline: [99, 99.8, 99.9, 99.99, 99.99, 99.998, 99.998, 99.998],
      statusText: 'TLS 1.3 Secure',
    },
  ]);

  const [feedItems, setFeedItems] = useState<AgentActivity[]>([
    {
      id: '1',
      agentName: 'MONITORING_AGENT_7',
      timeAgo: '2m ago',
      avatarBg: 'bg-indigo-500/10 border-indigo-500/30',
      iconName: 'troubleshoot',
      description: 'Detected anomaly in APAC distribution logistics. Commencing root cause lookup.',
      confidence: 0.98,
    },
    {
      id: '2',
      agentName: 'INTELLIGENCE_AGENT_ALPHA',
      timeAgo: '5m ago',
      avatarBg: 'bg-cyan-500/10 border-cyan-500/30',
      iconName: 'psychology',
      description: 'Recalculating predictive maintenance benchmarks for European Node-04 infrastructure.',
      confidence: 0.92,
    },
    {
      id: '3',
      agentName: 'EXECUTION_AGENT_V9',
      timeAgo: '12m ago',
      avatarBg: 'bg-purple-500/10 border-purple-500/30',
      iconName: 'next_plan',
      description: 'Successfully routed 420kg logistics payload to bypass critical weather obstruction.',
      confidence: 1.00,
    },
    {
      id: '4',
      agentName: 'GOVERNANCE_WATCHDOG',
      timeAgo: '15m ago',
      avatarBg: 'bg-emerald-500/10 border-emerald-500/30',
      iconName: 'security',
      description: 'Compliance verification completed for 4,200 asset transactions. 0 violations.',
      confidence: 0.99,
    },
  ]);

  const [showDeployModal, setShowDeployModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentFocus, setNewAgentFocus] = useState('');
  const [simulatedLoad, setSimulatedLoad] = useState<'idle' | 'deploying' | 'success'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedItems((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) {
          first.timeAgo = 'Just now';
          first.confidence = Math.min(1.0, parseFloat((0.85 + Math.random() * 0.15).toFixed(2)));
          next.push(first);
        }
        return next;
      });
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentFocus) return;

    setSimulatedLoad('deploying');
    addLog('SYS_DEPLOY', `Initiating micro-container deployment for agent "${newAgentName}"`, '#00d4ff');

    setTimeout(() => {
      setSimulatedLoad('success');
      deployAgent(newAgentName, newAgentFocus);
      addLog('SYS_DEPLOY', `Agent "${newAgentName}" successfully compiled and connected to telemetry grid!`, '#00ff88');

      const freshAgentItem: AgentActivity = {
        id: String(Date.now()),
        agentName: newAgentName.toUpperCase(),
        timeAgo: 'Just now',
        avatarBg: 'bg-cyan-500/10 border-cyan-500/30',
        iconName: 'robot_2',
        description: `Deployed successfully. Target focus: ${newAgentFocus}. Diagnostic baseline clean.`,
        confidence: 0.99,
      };

      setFeedItems(prev => [freshAgentItem, ...prev]);

      setTimeout(() => {
        setShowDeployModal(false);
        setNewAgentName('');
        setNewAgentFocus('');
        setSimulatedLoad('idle');
      }, 800);
    }, 2000);
  };

  const handleExportTelemetry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      node: "Sentinel Node-01 Cameroon",
      timestamp: new Date().toISOString(),
      governanceLevel: "PQC Shield 7.4.2",
      kpis: kpis,
      agents: feedItems
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sentinel_telemetry_dump.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addLog('AUTH_EVENT', 'Owner triggered complete operational telemetry export dump', '#cabeff');
  };

  return (
    <div className="space-y-6 min-w-0">
      
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight font-sans">Command Overview</h2>
          <p className="text-xs text-slate-400 mt-1 break-words">Autonomous monitoring dashboard for connected Sentinel nodes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportTelemetry}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Telemetry
          </button>
          
          <button 
            onClick={() => setShowDeployModal(true)}
            className="bg-[#00d4ff] hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold active:scale-[0.97] transition-all cyan-glow cursor-pointer"
          >
            <span className="material-symbols-outlined text-base font-fill">add_moderator</span>
            Deploy Agent
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl flex flex-col justify-between hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.05)] transition-all relative overflow-hidden group min-w-0">
            
            <div className="flex justify-between items-start min-w-0">
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase truncate">{kpi.label}</p>
                <h3 className="text-xl font-bold font-sans text-slate-100 mt-1 tracking-tight break-words">{kpi.value}</h3>
              </div>
              <span className={`material-symbols-outlined text-lg shrink-0 ${
                kpi.isPositive ? 'text-cyan-400' : 'text-red-400'
              }`}>{kpi.icon}</span>
            </div>

            <div className="flex items-center gap-2 pt-2 min-w-0">
              <div className="flex-1 h-7 flex items-end gap-1">
                {kpi.sparkline.map((val, idx) => {
                  const hPercent = Math.max(10, Math.min(100, Math.round((val / 100) * 100)));
                  return (
                    <div 
                      key={idx} 
                      className={`w-full rounded-t-xs transition-colors duration-300 ${
                        kpi.isPositive 
                          ? 'bg-cyan-500/20 group-hover:bg-cyan-400/40' 
                          : 'bg-red-500/20 group-hover:bg-red-400/40'
                      }`}
                      style={{ height: `${hPercent}%` }}
                    />
                  );
                })}
              </div>
              <span className={`text-[10px] font-mono font-semibold whitespace-nowrap shrink-0 ${
                kpi.isPositive ? 'text-cyan-400' : 'text-red-400'
              }`}>{kpi.delta}</span>
            </div>

          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col items-center text-center relative overflow-hidden min-w-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight font-sans self-start">Business Health Index</h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center mt-6">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle 
                className="text-slate-800" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="74" 
                stroke="currentColor" 
                strokeWidth="10" 
              />
              <circle 
                className="text-cyan-400 stroke-cyan-400" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="74" 
                stroke="currentColor" 
                strokeDasharray="465"
                strokeDashoffset="37.2"
                strokeLinecap="round" 
                strokeWidth="10" 
              />
            </svg>
            <div className="flex flex-col items-center justify-center relative">
              <span className="text-4xl font-extrabold text-[#00d4ff] font-sans">92</span>
              <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase font-semibold mt-1">Index Score</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-normal mt-2 max-w-xs break-words">
            Dynamic business score computed by active agents scanning multi-node pipelines.
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-6 pt-4 border-t border-slate-800/60">
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/50 min-w-0">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">EFFICIENCY</p>
              <p className="text-sm font-bold text-cyan-400 font-sans mt-0.5">98.2%</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/50 min-w-0">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SECURITY</p>
              <p className="text-sm font-bold text-cyan-400 font-sans mt-0.5">Grade A</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col min-w-0">
          <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/30 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-cyan-400 text-base font-fill shrink-0">robot_2</span>
              <h3 className="text-sm font-semibold text-slate-200 tracking-tight font-sans">AI Agent Activity Feed</h3>
            </div>
            <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded font-bold uppercase animate-pulse shrink-0">
              Live Stream
            </span>
          </div>

          <div className="p-5 flex-1 space-y-3 max-h-[290px] overflow-y-auto no-scrollbar min-w-0">
            {feedItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-950/40 p-4 border-l-2 border-[#7c5cff] rounded-r-lg flex items-start justify-between gap-4 hover:bg-slate-900/30 transition-colors min-w-0"
              >
                <div className="flex gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border ${item.avatarBg}`}>
                    <span className="material-symbols-outlined text-slate-200 text-sm">
                      {item.iconName}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-[#cabeff] truncate">{item.agentName}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">• {item.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-normal font-sans break-words">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block">CONFIDENCE</span>
                  <span className="text-[11px] font-mono font-bold text-[#00d4ff]">{item.confidence.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {showDeployModal && (
        <div className="fixed inset-0 bg-[#050811]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel border-cyan-400/30 w-full max-w-md p-6 rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-0">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setShowDeployModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-6 min-w-0">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 font-fill">add_moderator</span>
                Deploy Command Agent
              </h3>
              <p className="text-xs text-slate-400 mt-1 break-words">
                Compile and spin up a dedicated autonomous micro-logic agent for Node-01.
              </p>
            </div>

            <form onSubmit={handleDeploySubmit} className="space-y-4 min-w-0">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Agent Identifier Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., LOGISTICS_ESCORT" 
                  className="w-full bg-[#0a0e1a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Telemetry Focus Domain</label>
                <input 
                  type="text" 
                  placeholder="e.g., Monitoring API shard transaction limits" 
                  className="w-full bg-[#0a0e1a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  value={newAgentFocus}
                  onChange={(e) => setNewAgentFocus(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                {simulatedLoad === 'deploying' ? (
                  <button 
                    disabled
                    className="w-full py-3 bg-cyan-950 text-cyan-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-cyan-400/20"
                  >
                    <span className="animate-spin text-sm">refresh</span>
                    Compiling Sandbox container...
                  </button>
                ) : simulatedLoad === 'success' ? (
                  <button 
                    disabled
                    className="w-full py-3 bg-emerald-950 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-400/20 font-mono"
                  >
                    <span className="material-symbols-outlined text-sm font-fill">verified_user</span>
                    DEPLOYED ONLINE
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Deploy to Cluster Graph
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
