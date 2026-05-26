import { useState } from 'react';

interface DiagnosticLog {
  timestamp: string;
  type: 'TOOL_CALL' | 'REASONING' | 'SYSTEM' | 'ERROR';
  body: string;
  source: string;
}

export default function AgentMonitorScreen() {
  const [selectedAgent, setSelectedAgent] = useState<'observer' | 'logic' | 'action'>('observer');
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      timestamp: '14:22:01.442',
      type: 'TOOL_CALL',
      body: 'MCP: cloud_watch.fetch_logs(query="anomalous 5xx latency spike")',
      source: 'Observer-Prime',
    },
    {
      timestamp: '14:22:04.120',
      type: 'REASONING',
      body: 'Memory leak identified in Bastos pod-xf3, correlated with high DB write transaction spikes. Initiating memory override protocols.',
      source: 'Logic-Core',
    },
    {
      timestamp: '14:22:05.003',
      type: 'SYSTEM',
      body: 'Node-01 cluster diagnostics clean. Core temperatures: 38C nominal.',
      source: 'System',
    },
    {
      timestamp: '14:22:15.890',
      type: 'TOOL_CALL',
      body: 'MCP: postgres_vector.query_embeddings(text="Shard-04 resources connection contention")',
      source: 'Logic-Core',
    },
    {
      timestamp: '14:22:18.112',
      type: 'SYSTEM',
      body: 'Security handshake refreshed with post-quantum CRYSTALS-Kyber exchange.',
      source: 'Action-Runner',
    },
  ]);

  return (
    <div className="space-y-6 min-w-0">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full pulse-ring relative shrink-0"></span>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight font-sans">Agent Telemetry</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 break-words">Real-time supervision of active multi-agent neural streams and tool calls.</p>
        </div>
      </section>

      {/* THREE CARDS GRID FOR THE THREE CORE AGENTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MONITORING AGENT CARD */}
        <div 
          onClick={() => setSelectedAgent('observer')}
          className={`glass-panel p-5 rounded-xl relative cursor-pointer transition-all duration-300 border-l-2 select-none min-w-0 ${
            selectedAgent === 'observer' 
              ? 'border-l-cyan-400 border-cyan-400/40 bg-cyan-400/5' 
              : 'border-l-indigo-400 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start mb-4 min-w-0">
            <div className={`p-1.5 rounded-lg shrink-0 ${selectedAgent === 'observer' ? 'bg-cyan-500/10' : 'bg-slate-900/60'}`}>
              <span className={`material-symbols-outlined text-lg ${selectedAgent === 'observer' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                visibility
              </span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active
            </span>
          </div>

          <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Monitoring Agent</h3>
          <h4 className="text-lg font-bold font-sans text-slate-100 mt-1 break-words">Observer-Prime</h4>

          <div className="mt-4 flex flex-col gap-1.5 min-w-0">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">Scanning Latency</span>
              <span className="text-cyan-400 font-bold">12ms</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850 min-w-0">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Current Focus</span>
            <p className="text-xs text-[#00d4ff] font-mono mt-1 break-words">Ingesting Slack #dev-ops firehose</p>
          </div>
        </div>

        {/* INTELLIGENCE AGENT CARD */}
        <div 
          onClick={() => setSelectedAgent('logic')}
          className={`glass-panel p-5 rounded-xl relative cursor-pointer transition-all duration-300 border-l-2 select-none min-w-0 ${
            selectedAgent === 'logic' 
              ? 'border-l-[#7c5cff] border-[#7c5cff]/40 bg-[#7c5cff]/5' 
              : 'border-l-[#cabeff] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start mb-4 min-w-0">
            <div className={`p-1.5 rounded-lg shrink-0 ${selectedAgent === 'logic' ? 'bg-purple-500/10' : 'bg-slate-900/60'}`}>
              <span className={`material-symbols-outlined text-lg ${selectedAgent === 'logic' ? 'text-[#7c5cff]' : 'text-[#cabeff]'}`}>
                psychology
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#7c5cff]/10 text-purple-300 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cff] animate-pulse"></span>
              Processing
            </span>
          </div>

          <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Intelligence Agent</h3>
          <h4 className="text-lg font-bold font-sans text-slate-100 mt-1 break-words">Logic-Core</h4>

          <div className="mt-4 flex flex-col gap-1.5 min-w-0">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">Reasoning Depth</span>
              <span className="text-[#cabeff] font-bold">Level 07</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850 min-w-0">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Current Task</span>
            <p className="text-xs text-[#cabeff] font-mono mt-1 break-words">Analyzing anomalous spike in 5xx errors</p>
          </div>
        </div>

        {/* EXECUTION AGENT CARD */}
        <div 
          onClick={() => setSelectedAgent('action')}
          className={`glass-panel p-5 rounded-xl relative cursor-pointer transition-all duration-300 border-l-2 select-none min-w-0 ${
            selectedAgent === 'action' 
              ? 'border-l-teal-400 border-teal-400/40 bg-teal-400/5' 
              : 'border-l-slate-400 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start mb-4 min-w-0">
            <div className={`p-1.5 rounded-lg shrink-0 ${selectedAgent === 'action' ? 'bg-teal-500/10' : 'bg-slate-900/60'}`}>
              <span className={`material-symbols-outlined text-lg ${selectedAgent === 'action' ? 'text-teal-400' : 'text-slate-400'}`}>
                terminal
              </span>
            </div>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              Idle
            </span>
          </div>

          <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Execution Agent</h3>
          <h4 className="text-lg font-bold font-sans text-slate-100 mt-1 break-words">Action-Runner</h4>

          <div className="mt-4 flex flex-col gap-1.5 min-w-0">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-500">Resource Usage</span>
              <span className="text-teal-400 font-bold">0.2%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850 min-w-0">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Last Command</span>
            <p className="text-xs text-slate-400 font-mono mt-1 italic break-words">Awaiting trigger from Logic-Core...</p>
          </div>
        </div>

      </section>

        {/* NEURAL COMMUNICATION FLOW & DECISION LOGS BENTO DETAILS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        
        {/* NEURAL NETWORK VISUALIZATION */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl flex flex-col gap-4 overflow-hidden relative min-h-[380px] min-w-0">
          <div className="flex justify-between items-center z-10 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-200 tracking-tight font-sans">Neural Communication Flow</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5 break-words">Real-time execution paths mapped between autonomous nodes.</p>
            </div>
            <div className="flex gap-4 font-mono text-[10px] text-slate-400 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                <span>Telemetry bytes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
                <span>AI Logic Packets</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center py-4">
            {/* High-Fidelity SVG flow graph mapping communication stages */}
            <svg className="w-full h-full max-h-[220px]" fill="none" viewBox="0 0 800 220">
              <defs>
                <linearGradient id="gradientLine" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#7c5cff" />
                </linearGradient>
              </defs>

              {/* Grid dots indicators under graph */}
              <circle cx="200" cy="110" r="38" className="stroke-cyan-500/30 fill-[#0a0e1a]/80" strokeWidth="1" />
              <text x="200" y="114" className="fill-cyan-400 font-mono font-bold text-xs" textAnchor="middle">MONITOR</text>

              <circle cx="400" cy="110" r="46" className="stroke-[#7c5cff]/30 fill-[#0a0e1a]/80 animate-pulse" strokeWidth="1" />
              <text x="400" y="114" className="fill-[#cabeff] font-mono font-bold text-xs" textAnchor="middle">LOGIC</text>

              <circle cx="600" cy="110" r="38" className="stroke-teal-500/30 fill-[#0a0e1a]/80" strokeWidth="1" />
              <text x="600" y="114" className="fill-teal-300 font-mono font-bold text-xs" textAnchor="middle">EXECUTE</text>

              {/* SVG connection lines with active dash arrays */}
              <path className="execution-path stroke-[url(#gradientLine)]" strokeWidth="2.5" d="M 238 110 L 354 110" />
              <path className="execution-path stroke-teal-400/40" strokeWidth="2" strokeDasharray="5 5" d="M 446 110 L 562 110" strokeDashoffset="5" />
              
              {/* Optional arc connection line indicating system oversight feedback */}
              <path className="stroke-slate-700/40" strokeWidth="1" strokeDasharray="3 3" d="M 200 72 Q 400 -10 600 72" />
            </svg>

            {/* floating visual bits */}
            <div className="absolute top-1/4 left-1/4 bg-cyan-400/20 w-1.5 h-1.5 rounded-full cyan-glow animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 bg-purple-400/20 w-2.5 h-2.5 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* DECISION LOGS FEED (RIGHT PANEL) */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-xl flex flex-col gap-4 max-h-[380px] min-w-0 overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 min-w-0">
            <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Decision Logs</h3>
            <span className="material-symbols-outlined text-slate-500 text-sm shrink-0">terminal</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar min-w-0">
            {logs.map((log, index) => {
              const borderCol = 
                log.type === 'TOOL_CALL' ? 'border-cyan-500/30' :
                log.type === 'REASONING' ? 'border-purple-500/30' :
                'border-slate-800';
              return (
                <div key={index} className={`border-l-2 ${borderCol} pl-3 space-y-1 min-w-0`}>
                  <div className="flex items-center justify-between text-[10px] font-mono gap-2">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[8px] uppercase tracking-wider shrink-0 ${
                      log.type === 'TOOL_CALL' ? 'bg-cyan-500/10 text-cyan-400' :
                      log.type === 'REASONING' ? 'bg-purple-500/10 text-[#cabeff]' :
                      'bg-slate-900 text-slate-400'
                    }`}>{log.type}</span>
                  </div>
                  <h4 className="text-[10px] font-mono text-slate-400 tracking-wide font-medium break-words">{log.source}</h4>
                  <p className="text-[11px] text-slate-300 leading-normal font-sans pt-0.5 break-words">{log.body}</p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
}
