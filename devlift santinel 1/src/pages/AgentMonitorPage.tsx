const decisionLogs = [
  {
    time: '[14:22:01.442]', tag: 'TOOL_CALL', tagBg: 'bg-secondary-container', tagText: 'text-primary',
    msg: 'MCP: <span class="text-secondary-fixed">cloud_watch.fetch_logs</span>',
    detail: '"Searching for patterns in node-beta timeout logs..."',
    timeColor: 'text-primary', border: 'border-primary/20', isReasoning: false,
  },
  {
    time: '[14:22:04.120]', tag: 'REASONING', tagBg: 'bg-surface-variant', tagText: 'text-on-surface-variant',
    msg: '',
    detail: 'Identified correlation between memory leak in pod-xf3 and DB transaction spikes. Escalating to Execution Agent for potential restart.',
    timeColor: 'text-secondary', border: 'border-secondary/20', isReasoning: true,
  },
  {
    time: '[14:22:05.003]', tag: 'SYSTEM', tagBg: 'bg-surface-variant', tagText: 'text-on-surface-variant',
    msg: 'Heartbeat received from Node-02.',
    detail: '',
    timeColor: 'text-on-surface-variant', border: 'border-on-surface-variant/20', isReasoning: false,
  },
]

const agents = [
  {
    name: 'Monitoring Agent', subtitle: 'Observer-Prime',
    icon: 'visibility', iconBg: 'bg-primary/10', iconColor: 'text-primary',
    status: 'Active', statusDot: 'bg-green-400', statusPulse: false, statusBg: 'bg-green-500/10', statusColor: 'text-green-400',
    statLabel: 'Scanning Latency', statValue: '12ms', statBar: 'w-[85%]', statColor: 'bg-primary', valueColor: 'text-primary',
    focusLabel: 'Current Focus', focusValue: 'Ingesting Slack #dev-ops firehose', focusColor: 'text-primary',
  },
  {
    name: 'Intelligence Agent', subtitle: 'Logic-Core',
    icon: 'psychology', iconBg: 'bg-secondary/10', iconColor: 'text-secondary',
    status: 'Processing', statusDot: 'bg-primary', statusPulse: true, statusBg: 'bg-primary/10', statusColor: 'text-primary',
    statLabel: 'Reasoning Depth', statValue: 'Level 07', statBar: 'w-[62%]', statColor: 'bg-secondary', valueColor: 'text-secondary',
    focusLabel: 'Current Task', focusValue: 'Analyzing anomalous spike in 5xx errors', focusColor: 'text-secondary',
  },
  {
    name: 'Execution Agent', subtitle: 'Action-Runner',
    icon: 'terminal', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary',
    status: 'Idle', statusDot: 'bg-on-surface-variant', statusPulse: false, statusBg: 'bg-surface-variant/50', statusColor: 'text-on-surface-variant',
    statLabel: 'Resource Usage', statValue: '0.2%', statBar: 'w-[5%]', statColor: 'bg-tertiary', valueColor: 'text-tertiary',
    focusLabel: 'Last Command', focusValue: 'Awaiting trigger from Logic-Core...', focusColor: 'text-on-surface-variant italic',
  },
]

export default function AgentMonitorPage() {
  return (
    <div className="flex-1 overflow-y-auto space-y-8 pb-24 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full pulse-ring relative" />
          <h2 className="text-headline-md text-on-surface">Agent Telemetry</h2>
        </div>
        <p className="text-body-md text-on-surface-variant">Real-time supervision of active multi-agent neural streams.</p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {agents.map((a) => (
          <div
            key={a.name}
            className="glass-card ai-intent-strip p-6 rounded-lg relative group transition-all duration-300 hover:border-primary/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${a.iconBg} rounded-lg`}>
                <span className={`material-symbols-outlined ${a.iconColor}`} data-weight="fill">{a.icon}</span>
              </div>
              <span className={`px-2 py-0.5 ${a.statusBg} ${a.statusColor} text-technical-xs rounded flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 ${a.statusDot} rounded-full ${a.statusPulse ? 'animate-pulse' : ''}`} />
                {a.status}
              </span>
            </div>
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">{a.name}</h3>
            <p className="text-headline-md mt-1">{a.subtitle}</p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between text-technical-xs">
                <span className="text-on-surface-variant">{a.statLabel}</span>
                <span className={a.valueColor}>{a.statValue}</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className={`h-full ${a.statColor} ${a.statBar}`} />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/20">
              <p className="text-technical-xs text-on-surface-variant uppercase font-bold">{a.focusLabel}</p>
              <p className={`text-technical-sm mt-1 ${a.focusColor}`}>{a.focusValue}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flow & Logs Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Neural Network Visualization */}
        <div className="lg:col-span-8 glass-card rounded-lg p-6 flex flex-col gap-4 overflow-hidden relative min-h-[400px]">
          <div className="flex justify-between items-center">
            <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">Neural Communication Flow</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-technical-xs">Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-technical-xs">Intelligence</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <svg className="w-full h-full max-h-[300px]" fill="none" viewBox="0 0 800 300">
              <circle className="stroke-primary/40 fill-primary/5" cx="150" cy="150" r="40" strokeWidth="1" />
              <text className="fill-primary font-technical-xs text-[10px]" textAnchor="middle" x="150" y="155">MONITOR</text>
              <circle className="stroke-secondary/40 fill-secondary/5" cx="400" cy="150" r="50" strokeWidth="1" />
              <text className="fill-secondary font-technical-xs text-[10px]" textAnchor="middle" x="400" y="155">LOGIC</text>
              <circle className="stroke-tertiary/40 fill-tertiary/5" cx="650" cy="150" r="40" strokeWidth="1" />
              <text className="fill-tertiary font-technical-xs text-[10px]" textAnchor="middle" x="650" y="155">EXECUTE</text>
              <path className="neural-line stroke-primary/30" d="M190 150 L350 150" strokeWidth="2" />
              <path className="neural-line stroke-secondary/30" d="M450 150 L610 150" strokeWidth="2" />
              <path className="neural-line stroke-on-surface-variant/10" d="M190 150 Q400 50 610 150" strokeDasharray="5" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/3 animate-bounce bg-primary/20 w-1 h-1 rounded-full shadow-[0_0_10px_#a8e8ff]" />
              <div className="absolute bottom-1/3 right-1/4 animate-pulse bg-secondary/20 w-2 h-2 rounded-full shadow-[0_0_10px_#cabeff]" />
            </div>
          </div>
        </div>

        {/* Decision Logs */}
        <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4 max-h-[400px]">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
            <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">Decision Logs</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 font-technical-xs">
            {decisionLogs.map((log, i) => (
              <div key={i} className={`flex flex-col gap-1 border-l ${log.border} pl-3`}>
                <div className="flex justify-between items-center">
                  <span className={log.timeColor}>{log.time}</span>
                  <span className={`px-1.5 py-0.5 rounded ${log.tagBg} ${log.tagText} text-[9px]`}>{log.tag}</span>
                </div>
                {log.msg && <p className="text-on-surface" dangerouslySetInnerHTML={{ __html: log.msg }} />}
                {log.detail && (
                  <div className={`${log.isReasoning ? 'bg-secondary-container/10 p-2 rounded border border-secondary/20 mt-1' : ''}`}>
                    <p className="text-on-surface leading-relaxed">{log.detail}</p>
                    {log.isReasoning && (
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded-full bg-secondary-container text-[8px] font-bold text-on-secondary-container">AI GENERATED</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
