import { useState, useEffect } from 'react'

const incidents = [
  {
    id: 'INC-9923-DELTA', title: 'Database Shard Latency Spike', severity: 'CRITICAL', severityColor: 'text-error', severityDot: 'bg-error',
    time: '02:45m ago', desc: 'Region US-East-1 reporting >500ms latency on secondary shards. Potential data drift detected.',
    agents: 2, border: 'border-l-error', bg: 'bg-error/5',
    latency: '842ms', users: '12.4k', replication: '18.2s',
    steps: [
      'Identified bottleneck at Shard-04 (AWS Region: us-east-1a). Resource contention detected on I/O operations.',
      'Proposed Action: Initiate automated shard migration to warm-standby cluster in Region us-east-1b.',
      'Estimated Resolution: 120s. Impact: Negligible read-only mode during 5s cutover.',
    ],
  },
  { id: 'INC-9922', title: 'API Rate Limit Threshold', severity: 'HIGH PRIORITY', severityColor: 'text-[#ff9800]', severityDot: 'bg-[#ff9800]', time: '14:20m ago', desc: 'Payment gateway microservice approaching 95% of allocated burst capacity.', agents: 1, border: 'border-l-[#ff9800]', bg: '' },
  { id: 'INC-9921', title: 'Auth Service Cache Miss', severity: 'MEDIUM', severityColor: 'text-[#ffeb3b]', severityDot: 'bg-[#ffeb3b]', time: '45:10m ago', desc: 'Slight increase in cache misses for session validation. Investigation required.', agents: 0, border: 'border-l-[#ffeb3b]', bg: '' },
]

const telemetryLogs = [
  { time: '[14:02:11]', tag: 'SENTINEL_ALPHA:', msg: 'Probing shard connection pools...', color: 'text-primary' },
  { time: '[14:02:15]', tag: 'WARN:', msg: 'Pool 04 exhaustion imminent.', color: 'text-[#ff9800]' },
  { time: '[14:02:18]', tag: 'SENTINEL_ALPHA:', msg: 'Scaling IOPS limit for Shard-04 (temporary override).', color: 'text-primary' },
  { time: '[14:02:22]', tag: 'SYSTEM:', msg: 'Telemetry pulse received from us-east-1b.', color: 'text-secondary' },
  { time: '[14:02:30]', tag: 'SENTINEL_ALPHA:', msg: 'Ready for automated migration. Awaiting commander approval.', color: 'text-primary' },
  { time: '[14:02:35]', tag: 'CRITICAL:', msg: 'Latency spike confirmed 842ms.', color: 'text-error' },
]

export default function AlertsPage() {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0])
  const [slaSeconds, setSlaSeconds] = useState(15 * 60)

  useEffect(() => {
    if (slaSeconds <= 0) return
    const interval = setInterval(() => setSlaSeconds((s) => s - 1), 1000)
    return () => clearInterval(interval)
  }, [slaSeconds])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-technical-sm text-primary tracking-widest uppercase mb-1">Command Overviews</p>
          <h2 className="text-headline-lg text-on-surface">Incident Center</h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-4 py-2 flex items-center gap-2 border border-outline-variant/50 hover:border-primary/50 transition-colors active:scale-95 rounded-lg">
            <span className="material-symbols-outlined text-body-md">filter_list</span>
            <span className="text-label-md">Filter Status</span>
          </button>
          <button className="bg-primary-container text-on-primary-container px-6 py-2 flex items-center gap-2 font-bold glow-cyan active:scale-95 transition-all rounded-lg">
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md uppercase">Manual Incident</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Incident Feed */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-technical-sm text-on-surface-variant/70 uppercase">Real-Time Feed</h3>
            <span className="bg-error/10 text-error text-technical-xs px-2 py-0.5 rounded border border-error/20">3 CRITICAL</span>
          </div>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`glass-panel p-4 cursor-pointer border-l-4 ${inc.border} ${inc.bg} relative overflow-hidden group ${selectedIncident?.id === inc.id ? 'ring-1 ring-primary/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`${inc.severityColor} text-technical-xs flex items-center gap-1`}>
                  <span className={`w-2 h-2 rounded-full ${inc.severityDot} ${inc.severity === 'CRITICAL' ? 'critical-pulse' : ''}`} />
                  {inc.severity}
                </span>
                <span className="text-technical-xs text-on-surface-variant">{inc.time}</span>
              </div>
              <h4 className="text-body-lg font-bold text-on-surface mb-1">{inc.title}</h4>
              <p className="text-body-md text-on-surface-variant line-clamp-2 mb-3">{inc.desc}</p>
              {inc.agents > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {Array.from({ length: inc.agents }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold">AI</div>
                    ))}
                  </div>
                  <span className="text-technical-xs text-on-surface-variant/60">{inc.agents} Agent{inc.agents > 1 ? 's' : ''} Assigned</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 rounded-xl border-t-2 border-t-error overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">warning</span>
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-error/20 flex items-center justify-center rounded border border-error/30">
                    <span className="material-symbols-outlined text-error text-3xl">database</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-on-surface">{selectedIncident.title}</h3>
                    <p className="text-technical-sm text-error uppercase">ID: {selectedIncident.id}</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-4 border border-outline-variant/30 text-center min-w-[140px] rounded">
                  <p className="text-technical-xs text-on-surface-variant/60 mb-1">SLA COUNTDOWN</p>
                  <p className={`text-headline-md font-technical-sm tracking-widest leading-none font-bold ${slaSeconds < 300 ? 'text-error' : 'text-error'}`}>
                    {slaSeconds > 0 ? formatTime(slaSeconds) : 'SLA BREACHED'}
                  </p>
                </div>
              </div>

              {selectedIncident.latency && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface-container-low p-4 border border-outline-variant/20 rounded">
                      <p className="text-technical-xs text-on-surface-variant mb-1">LATENCY PEAK</p>
                      <p className="text-headline-md text-primary">{selectedIncident.latency}</p>
                    </div>
                    <div className="bg-surface-container-low p-4 border border-outline-variant/20 rounded">
                      <p className="text-technical-xs text-on-surface-variant mb-1">AFFECTED USERS</p>
                      <p className="text-headline-md text-on-surface">{selectedIncident.users}</p>
                    </div>
                    <div className="bg-surface-container-low p-4 border border-outline-variant/20 rounded">
                      <p className="text-technical-xs text-on-surface-variant mb-1">REPLICATION LAG</p>
                      <p className="text-headline-md text-error">{selectedIncident.replication}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-high/40 border-l-2 border-l-primary p-6 mb-8 relative rounded">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary">smart_toy</span>
                      <h4 className="text-label-md text-primary tracking-widest uppercase">AI Agent Sentinel-Alpha: Resolution Strategy</h4>
                    </div>
                    <div className="space-y-4 text-technical-sm text-on-surface-variant leading-relaxed">
                      {selectedIncident.steps?.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-primary opacity-50">0{i + 1}.</span>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-4">
                <button className="flex-1 bg-primary text-on-primary font-bold py-4 px-8 glow-cyan flex items-center justify-center gap-3 transition-transform active:scale-[0.98] rounded-lg">
                  <span className="material-symbols-outlined">play_arrow</span>
                  EXECUTE ACTION: SHARD MIGRATION
                </button>
                <button className="bg-surface-container-highest text-on-surface border border-outline-variant/50 px-8 py-4 font-bold hover:bg-surface-variant transition-colors rounded-lg">
                  IGNORE & LOG
                </button>
              </div>
            </div>
          </div>

          {/* Live Telemetry Stream */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="bg-surface-container-high px-6 py-3 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-technical-xs text-on-surface-variant uppercase tracking-widest">Live Telemetry Stream</span>
              </div>
              <span className="text-technical-xs text-on-surface-variant/40">v2.0.4-agent</span>
            </div>
            <div className="p-4 bg-[#0a0e1a] flex-1 text-technical-xs h-48 overflow-y-auto font-mono">
              {telemetryLogs.map((log, i) => (
                <p key={i} className="mb-1">
                  <span className="text-on-surface-variant/40">{log.time}</span>{' '}
                  <span className={log.color}>{log.tag}</span> {log.msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
