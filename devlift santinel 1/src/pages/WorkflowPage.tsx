import { useState } from 'react'

export default function WorkflowPage() {
  const [simulating, setSimulating] = useState(false)

  return (
    <div className="absolute inset-0 flex flex-col -m-6 -mb-24 md:-m-10"
      style={{
        backgroundImage: 'radial-gradient(#1e2d40 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <path d="M160 220 L240 220" fill="none" stroke="#3c494e" strokeWidth="2" />
        <path
          d="M380 220 C420 220, 420 140, 460 140"
          fill="none"
          stroke={simulating ? 'url(#cyan-grad)' : '#3c494e'}
          strokeWidth="2"
          className={simulating ? '' : ''}
          style={simulating ? { strokeDasharray: '10', animation: 'dash 5s linear infinite' } : {}}
        />
        <path d="M380 220 C420 220, 420 300, 460 300" fill="none" stroke="#3c494e" strokeWidth="2" />
        <defs>
          <linearGradient id="cyan-grad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#a8e8ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Node: Trigger */}
      <div className="absolute left-12 top-40 w-44 glass-panel rounded-lg shadow-2xl cursor-grab overflow-hidden border-l-2 border-primary z-10">
        <div className="bg-primary/10 px-3 py-2 flex items-center justify-between border-b border-outline-variant/20">
          <span className="text-technical-xs text-primary tracking-tighter">TRG-902</span>
          <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
        </div>
        <div className="p-3">
          <h3 className="text-label-md text-on-surface mb-1">High Latency</h3>
          <p className="text-[10px] text-on-surface-variant leading-tight">System response &gt; 500ms in Node-01</p>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-surface border border-outline-variant rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
      </div>

      {/* Node: Condition */}
      <div className="absolute left-64 top-40 w-44 glass-panel rounded-lg shadow-2xl cursor-grab overflow-hidden border-l-2 border-secondary z-10">
        <div className="bg-secondary/10 px-3 py-2 flex items-center justify-between border-b border-outline-variant/20">
          <span className="text-technical-xs text-secondary tracking-tighter">CND-441</span>
          <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
        </div>
        <div className="p-3">
          <h3 className="text-label-md text-on-surface mb-1">Region Validation</h3>
          <p className="text-[10px] text-on-surface-variant leading-tight">Check if traffic is US-EAST-1</p>
        </div>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-surface border border-outline-variant rounded-full" />
        <div className="absolute -right-2 top-1/4 w-4 h-4 bg-surface border border-outline-variant rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
        </div>
        <div className="absolute -right-2 bottom-1/4 w-4 h-4 bg-surface border border-outline-variant rounded-full" />
      </div>

      {/* Node: Action 1 */}
      <div className="absolute right-12 top-20 w-44 glass-panel rounded-lg shadow-2xl cursor-grab overflow-hidden border-l-2 border-primary-container z-10"
        style={{ animation: 'pulse-glow 2s infinite ease-in-out' }}
      >
        <div className="bg-primary-container/10 px-3 py-2 flex items-center justify-between border-b border-outline-variant/20">
          <span className="text-technical-xs text-primary-container tracking-tighter">ACT-001</span>
          <span className="material-symbols-outlined text-[16px] text-primary-container">settings_input_component</span>
        </div>
        <div className="p-3">
          <h3 className="text-label-md text-on-surface mb-1">Reroute Traffic</h3>
          <p className="text-[10px] text-on-surface-variant leading-tight">Shift 40% load to Node-02</p>
        </div>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-surface border border-outline-variant rounded-full" />
      </div>

      {/* Node: Action 2 */}
      <div className="absolute right-12 bottom-40 w-44 glass-panel rounded-lg shadow-2xl cursor-grab overflow-hidden border-l-2 border-on-surface-variant z-10">
        <div className="bg-surface-variant/20 px-3 py-2 flex items-center justify-between border-b border-outline-variant/20">
          <span className="text-technical-xs text-on-surface-variant tracking-tighter">ACT-002</span>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">notifications_active</span>
        </div>
        <div className="p-3">
          <h3 className="text-label-md text-on-surface mb-1">Notify Admin</h3>
          <p className="text-[10px] text-on-surface-variant leading-tight">Dispatch Slack/Pager alert</p>
        </div>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-surface border border-outline-variant rounded-full" />
      </div>

      {/* Simulation Toolbar */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 glass-panel rounded-full shadow-2xl z-10"
        style={{ borderColor: 'rgba(0, 212, 255, 0.2)' }}
      >
        <div className="flex items-center gap-3 pr-4 border-r border-outline-variant/30">
          <button
            onClick={() => setSimulating(!simulating)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary shadow-[0_0_15px_rgba(0,212,255,0.3)] active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">{simulating ? 'stop' : 'play_arrow'}</span>
          </button>
          <div className="flex flex-col">
            <span className="text-technical-xs text-on-surface-variant uppercase tracking-widest">Simulation</span>
            <span className={`text-label-md ${simulating ? 'text-secondary' : 'text-primary'}`}>{simulating ? 'RUNNING' : 'READY'}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">history</span>
            <span className="text-technical-xs">LOGS</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">save</span>
            <span className="text-technical-xs">SAVE</span>
          </button>
        </div>
      </div>

      {/* Floating Component Drawer */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-primary shadow-lg"
          style={{ borderColor: 'rgba(0, 212, 255, 0.3)' }}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-on-surface-variant shadow-lg"
          style={{ borderColor: 'rgba(60, 73, 78, 0.3)' }}
        >
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <button className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-on-surface-variant shadow-lg"
          style={{ borderColor: 'rgba(60, 73, 78, 0.3)' }}
        >
          <span className="material-symbols-outlined">layers</span>
        </button>
      </div>
    </div>
  )
}
