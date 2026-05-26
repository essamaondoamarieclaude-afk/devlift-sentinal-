import { useState } from 'react';
import { useAuditStore } from '../stores/auditStore';

export default function WorkflowBuilderScreen() {
  const { addLog } = useAuditStore();
  const [isSimulating, setIsSimulating] = useState(false);

  const nodes = [
    {
      id: 'TRG-902',
      label: 'High Latency Trigger',
      type: 'trigger',
      code: 'TRG-902',
      description: 'System response latency > 500ms in Node-01',
      icon: 'bolt',
      themeColor: 'border-l-cyan-400 bg-cyan-950/20 text-cyan-400',
    },
    {
      id: 'CND-441',
      label: 'Region Validation',
      type: 'condition',
      code: 'CND-441',
      description: 'Check if traffic is routed from US-EAST-1',
      icon: 'alt_route',
      themeColor: 'border-l-[#7c5cff] bg-purple-950/20 text-[#cabeff]',
    },
    {
      id: 'ACT-001',
      label: 'Reroute Traffic',
      type: 'action',
      code: 'ACT-001',
      description: 'Shift 40% current ingestion load to Node-02 backup',
      icon: 'settings_input_component',
      themeColor: 'border-l-teal-400 bg-teal-950/20 text-teal-400',
    },
    {
      id: 'ACT-002',
      label: 'Notify Admin',
      type: 'action',
      code: 'ACT-002',
      description: 'Dispatch urgent Slack & SMS pager alerts',
      icon: 'notifications_active',
      themeColor: 'border-l-slate-400 bg-slate-900/60 text-slate-400',
    },
  ];

  const handleToggleSimulation = () => {
    const nextState = !isSimulating;
    setIsSimulating(nextState);

    if (nextState) {
      addLog('SYS_DEPLOY', 'Autonomous workflow simulation initiated: High Latency Mitigation Cycle', '#00d4ff');
    } else {
      addLog('SYSTEM', 'Autonomous workflow simulation terminated', '#888');
    }
  };

  return (
    <div className="flex flex-col h-[78vh] relative overflow-hidden bg-slate-950/20 rounded-2xl border border-slate-900 shadow-inner min-w-0">
      
      <div className="absolute inset-0 canvas-grid pointer-events-none opacity-60 z-0"></div>

      <div className="absolute top-4 left-4 z-10 space-y-1 bg-[#161b27]/85 backdrop-blur border border-slate-800 p-3 rounded-xl max-w-sm pointer-events-auto min-w-0">
        <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 leading-none">
          <span className="material-symbols-outlined text-sm font-fill text-cyan-400">schema</span>
          Operations Orchestrator Workspace
        </h3>
        <p className="text-[10px] text-slate-400 leading-normal pt-1 flex items-center gap-2 break-words">
          Create declarative automation graphs with direct model bindings.
        </p>
      </div>

      {isSimulating && (
        <div className="absolute top-4 right-16 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[9px] uppercase tracking-widest font-bold animate-pulse shadow-[0_0_10px_rgba(124,92,255,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cff]"></span>
          Simulation Active
        </div>
      )}

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="cyanPurpleFlow" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
        </defs>

        <path 
          d="M 190 148 L 274 148" 
          fill="none" 
          stroke={isSimulating ? "url(#cyanPurpleFlow)" : "#3c494e"} 
          strokeWidth="2" 
          className={isSimulating ? "execution-path" : ""}
        />

        <path 
          d="M 406 148 C 450 148, 450 90, 506 90" 
          fill="none" 
          stroke={isSimulating ? "url(#cyanPurpleFlow)" : "#3c494e"} 
          strokeWidth="2" 
          className={isSimulating ? "execution-path" : ""}
        />

        <path 
          d="M 406 148 C 450 148, 450 206, 506 206" 
          fill="none" 
          stroke={isSimulating ? "#7c5cff" : "#3c494e"} 
          strokeWidth="1.5" 
          strokeDasharray={isSimulating ? "4 4" : "none"} 
          className={isSimulating ? "execution-path" : ""}
        />
      </svg>

      <div className="flex-1 relative z-20 overflow-auto min-w-0">
        
        <div 
          className="absolute left-10 md:left-16 top-28 w-44 glass-panel rounded-lg shadow-2xl overflow-hidden border-l-2 border-l-cyan-400 bg-slate-950/80"
          style={{ boxShadow: isSimulating ? '0 0 20px rgba(0,212,255,0.15)' : '' }}
        >
          <div className="bg-cyan-500/10 px-3 py-1.5 flex items-center justify-between border-b border-slate-800/60 font-mono text-[9px] text-[#00d4ff]">
            <span>TRG-902</span>
            <span className="material-symbols-outlined text-[13px] font-fill">bolt</span>
          </div>
          <div className="p-3 space-y-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200">High Latency</h4>
            <p className="text-[10px] text-slate-400 leading-normal break-words">System response &gt; 500ms Node-01</p>
          </div>
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-cyan-400 bg-[#070b14] flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          </div>
        </div>

        <div 
          className="absolute left-64 md:left-72 top-28 w-44 glass-panel rounded-lg shadow-2xl overflow-hidden border-l-2 border-l-[#7c5cff] bg-slate-950/80 animate-[float_4s_ease-in-out_infinite]"
          style={{ boxShadow: isSimulating ? '0 0 20px rgba(124,92,255,0.15)' : '' }}
        >
          <div className="bg-purple-500/10 px-3 py-1.5 flex items-center justify-between border-b border-slate-800/60 font-mono text-[9px] text-[#cabeff]">
            <span>CND-441</span>
            <span className="material-symbols-outlined text-[13px]">alt_route</span>
          </div>
          <div className="p-3 space-y-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 font-sans">Region Check</h4>
            <p className="text-[10px] text-slate-400 leading-normal break-words">Check if traffic is routed US-EAST-1</p>
          </div>
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#7c5cff] bg-[#070b14]"></div>
          
          <div className="absolute right-[-4px] top-[40%] -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#7c5cff] bg-[#070b14] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#7c5cff] rounded-full"></div>
          </div>
          <div className="absolute right-[-4px] bottom-[30%] -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-slate-600 bg-[#070b14]"></div>
        </div>

        <div 
          className={`absolute left-[31rem] md:left-[33rem] top-[4.5rem] w-44 glass-panel rounded-lg shadow-2xl overflow-hidden border-l-2 border-l-[#00d4ff] bg-slate-950/80 ${
            isSimulating ? 'animate-[pulse_1.5s_infinite]' : ''
          }`}
          style={{ boxShadow: isSimulating ? '0 0 25px rgba(0,212,255,0.35)' : '' }}
        >
          <div className="bg-[#00d4ff]/10 px-3 py-1.5 flex items-center justify-between border-b border-slate-800/60 font-mono text-[9px] text-cyan-400">
            <span>ACT-001</span>
            <span className="material-symbols-outlined text-[13px] font-fill">settings_input_component</span>
          </div>
          <div className="p-3 space-y-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 font-sans">Reroute traffic</h4>
            <p className="text-[10px] text-slate-400 leading-normal break-words">Shift 40% load to Node-02 backup</p>
          </div>
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-cyan-400 bg-[#070b14]"></div>
        </div>

        <div 
          className="absolute left-[31rem] md:left-[33rem] top-44 w-44 glass-panel rounded-lg shadow-2xl overflow-hidden border-l-2 border-l-neutral-400 bg-slate-950/80"
        >
          <div className="bg-slate-800/40 px-3 py-1.5 flex items-center justify-between border-b border-slate-800/60 font-mono text-[9px] text-slate-400">
            <span>ACT-002</span>
            <span className="material-symbols-outlined text-[13px]">notifications_active</span>
          </div>
          <div className="p-3 space-y-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 font-sans">Notify Admin</h4>
            <p className="text-[10px] text-slate-400 leading-normal break-words">Dispatch Slack and SMS alerts</p>
          </div>
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-slate-600 bg-[#070b14]"></div>
        </div>

      </div>

      <div className="absolute top-20 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={() => alert("Custom triggers can be declared in the Settings panel.")}
          className="w-10 h-10 glass-panel hover:bg-slate-900 text-cyan-400 border border-slate-800/80 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
          title="Add flow node"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
        <button className="w-10 h-10 glass-panel text-slate-400 border border-slate-800/80 rounded-xl flex items-center justify-center cursor-pointer shadow-lg active:scale-95" title="Zoom canvas">
          <span className="material-symbols-outlined text-lg">zoom_in</span>
        </button>
        <button className="w-10 h-10 glass-panel text-slate-400 border border-slate-800/80 rounded-xl flex items-center justify-center cursor-pointer shadow-lg active:scale-95" title="Configure triggers">
          <span className="material-symbols-outlined text-lg">layers</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-[#0d1222]/90 backdrop-blur rounded-full border border-cyan-400/20 shadow-[0_0_30px_rgba(0,0,0,0.6)] z-30 pointer-events-auto select-none">
        
        <div className="flex items-center gap-3.5 pr-4 border-r border-[#1e2d40]/60">
          <button 
            onClick={handleToggleSimulation}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90 ${
              isSimulating 
                ? 'bg-purple-600 text-purple-100 shadow-[0_0_15px_rgba(124,92,255,0.4)]' 
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
            }`}
          >
            <span className="material-symbols-outlined font-fill text-lg">
              {isSimulating ? 'stop' : 'play_arrow'}
            </span>
          </button>
          
          <div className="flex flex-col text-left font-mono min-w-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none font-semibold">Simulation Target</span>
            <span className={`text-xs font-bold mt-1 ${isSimulating ? 'text-[#cabeff]' : 'text-cyan-400'}`}>
              {isSimulating ? 'RUNNING' : 'READY'}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => alert("Simulation telemetry output streams are logged in BigQuery archives.")}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#00d4ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">history</span>
            <span className="text-[9px] font-mono font-semibold tracking-wider uppercase">Logs</span>
          </button>
          <button 
            onClick={() => addLog('AUTH_EVENT', 'Workflow canvas rules successfully updated.', '#cabeff')}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#00d4ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span className="text-[9px] font-mono font-semibold tracking-wider uppercase">Save</span>
          </button>
        </div>

      </div>

    </div>
  );
}
