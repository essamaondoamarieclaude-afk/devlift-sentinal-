import { useState, useEffect, useRef } from 'react';
import { Incident, TelemetryLog } from '../types';
import { useAuditStore } from '../stores/auditStore';

export default function IncidentScreen() {
  const { addLog } = useAuditStore();

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-9923-DELTA',
      title: 'Database Shard Latency Spike',
      description: 'Region US-East-1 reporting >500ms latency on secondary shards. Potential data drift...',
      priority: 'critical',
      timeAgo: '02:45m ago',
      assignedAgents: ['AI', 'A2'],
      status: 'open',
      latencyPeak: '842ms',
      affectedUsers: '12.4k',
      replicationLag: '18.2s',
      resolutionStrategy: [
        'Identified bottleneck at Shard-04 (AWS Region: us-east-1a) due to high write contention.',
        'Proposed Solution: Initiate automated shard migration to warm-standby cluster in us-east-1b.',
        'Estimated Resolution: 120s. Impact: Negligible read-only mode during 5s cutover.',
      ],
    },
    {
      id: 'INC-3312-BETA',
      title: 'API Rate Limit Threshold Breach',
      description: 'Payment gateway microservice approaching 95% of allocated burst capacity limit values.',
      priority: 'high',
      timeAgo: '14:20m ago',
      assignedAgents: ['A1'],
      status: 'acknowledged',
      latencyPeak: '12ms',
      affectedUsers: '2.1k',
      replicationLag: '0.1s',
      resolutionStrategy: [
        'Enable rate limit throttle scaling for subscription group B.',
        'Re-route burst payload metrics through proxy backup clusters.',
      ],
    },
    {
      id: 'INC-1049-ALPHA',
      title: 'Auth Service Cache Miss Surge',
      description: 'Slight increase in redis cache misses for active user session tokens verification.',
      priority: 'medium',
      timeAgo: '45:10m ago',
      assignedAgents: [],
      status: 'open',
    },
  ]);

  const [activeIncident, setActiveIncident] = useState<Incident>(incidents[0]);
  const [slaTime, setSlaTime] = useState(15 * 60);
  const [isMigrationExecuting, setIsMigrationExecuting] = useState(false);
  const [migrationStep, setMigrationStep] = useState(0);

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    { timestamp: '14:02:11', level: 'system', source: 'SENTINEL_ALPHA', message: 'Probing shard connection pools...' },
    { timestamp: '14:02:15', level: 'warn', source: 'SYSTEM', message: 'Pool 04 exhaustion imminent on US-East-1.' },
    { timestamp: '14:02:18', level: 'system', source: 'SENTINEL_ALPHA', message: 'Scaling IOPS limit override for Shard-04.' },
    { timestamp: '14:02:22', level: 'info', source: 'SYSTEM', message: 'Telemetry pulse received from backup us-east-1b node.' },
    { timestamp: '14:02:30', level: 'system', source: 'SENTINEL_ALPHA', message: 'Ready for automated migration. Awaiting commander approval.' },
    { timestamp: '14:02:35', level: 'critical', source: 'DATABASE', message: 'Latency spike confirmed 842ms on tertiary databases.' },
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlaTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const items: TelemetryLog[] = [
        { timestamp: timeStr, level: 'info', source: 'SENTINEL_ALPHA', message: 'Analysis pulse: stable metrics flowing.' },
        { timestamp: timeStr, level: 'warn', source: 'SYSTEM', message: 'Uplink telemetry drift within normal tolerances.' },
        { timestamp: timeStr, level: 'info', source: 'DATABASE', message: 'Cache miss lookup optimized. Miss rate: 0.04%.' },
      ];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setTelemetryLogs((prev) => [...prev, randomItem].slice(-25));
      
      if (logContainerRef.current) {
        setTimeout(() => {
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }
        }, 50);
      }
    }, 6000);

    return () => clearInterval(logInterval);
  }, []);

  const formatSla = (seconds: number) => {
    if (seconds <= 0) return 'SLA BREACHED';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const handleMigrationSubmit = () => {
    setIsMigrationExecuting(true);
    setMigrationStep(1);
    addLog('SYS_DEPLOY', 'Initiating live Database Shard-04 secure migration to us-east-1b partition', '#cabeff');

    setTimeout(() => {
      setMigrationStep(2);
      setTelemetryLogs(prev => [...prev, {
        timestamp: new Date().toTimeString().split(' ')[0],
        level: 'system',
        source: 'SENTINEL_ALPHA',
        message: 'Locking Shard-04 write access. Initializing zero-data-loss block copy.'
      }]);

      setTimeout(() => {
        setMigrationStep(3);
        setTelemetryLogs(prev => [...prev, {
          timestamp: new Date().toTimeString().split(' ')[0],
          level: 'system',
          source: 'SENTINEL_ALPHA',
          message: 'Uplink synced. Re-routing DNS endpoints. Latency returning to baseline.'
        }]);

        setTimeout(() => {
          setIsMigrationExecuting(false);
          setMigrationStep(0);
          
          setActiveIncident(prev => ({
            ...prev,
            status: 'resolved',
            latencyPeak: '24ms',
            replicationLag: '0.0s'
          }));

          setIncidents(prev => prev.map(inc => inc.id === 'INC-9923-DELTA' ? {
            ...inc,
            status: 'resolved',
            latencyPeak: '24ms',
            replicationLag: '0.0s'
          } : inc));

          addLog('SYS_DEPLOY', 'Shard migration complete! Latency peak stabilized to 24ms.', '#00ff88');
        }, 1500);

      }, 1500);

    }, 2000);
  };

  return (
    <div className="space-y-6 min-w-0">
      
      <section className="flex flex-col md:flex-row justify-between items-start md:on-center gap-4 min-w-0">
        <div className="min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-[#00d4ff] uppercase font-semibold block mb-0.5">
            Command Overviews
          </span>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight font-sans">Incident Center</h2>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold active:scale-95 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">filter_list</span>
            Component Filter
          </button>
          
          <button 
            onClick={() => {
              addLog('CRIT_WARN', 'Manual Incident Incident report generated', '#ff5555');
              alert("Manual diagnostic incident state declared on Cluster Node-01.");
            }}
            className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base font-fill animate-pulse">add_alert</span>
            Manual Incident
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
        
        <div className="lg:col-span-4 space-y-4 max-h-[640px] overflow-y-auto pr-2 no-scrollbar min-w-0">
          <div className="flex justify-between items-center px-1 min-w-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Incident Stream</span>
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] px-2 py-0.5 rounded font-bold shrink-0">
              3 ACTIVE ALERTS
            </span>
          </div>

          <div className="space-y-3 min-w-0">
            {incidents.map((incident) => {
              const active = activeIncident.id === incident.id;
              const priColor = 
                incident.priority === 'critical' ? 'border-l-red-500' :
                incident.priority === 'high' ? 'border-l-amber-500' :
                'border-l-yellow-400';
              
              return (
                <div 
                  key={incident.id}
                  onClick={() => setActiveIncident(incident)}
                  className={`glass-panel p-4 rounded-r-lg border-l-4 cursor-pointer transition-all ${priColor} ${
                    active ? 'bg-slate-900/60 border-y-cyan-400/20 shadow-lg' : 'hover:bg-slate-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start text-[10px] font-mono mb-2 min-w-0">
                    <span className={`font-bold flex items-center gap-1 ${
                      incident.priority === 'critical' ? 'text-red-400' :
                      incident.priority === 'high' ? 'text-amber-400' :
                      'text-yellow-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        incident.priority === 'critical' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'
                      }`} />
                      {incident.priority.toUpperCase()}
                    </span>
                    <span className="text-slate-500 shrink-0">{incident.timeAgo}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-200 truncate">{incident.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed break-words">{incident.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 min-w-0">
          <div className={`glass-panel p-6 rounded-xl border-t-2 relative overflow-hidden min-w-0 ${
            activeIncident.priority === 'critical' ? 'border-t-red-500' : 'border-t-amber-500'
          }`}>
            
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[140px]">warning</span>
            </div>

            <div className="relative z-10 space-y-6 min-w-0">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded border flex items-center justify-center shrink-0 ${
                    activeIncident.priority === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    <span className="material-symbols-outlined text-2xl font-fill">database</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-100 break-words">{activeIncident.title}</h3>
                    <p className="text-[10px] font-mono text-slate-500 font-bold tracking-wide uppercase mt-0.5">{activeIncident.id}</p>
                  </div>
                </div>

                <div className="bg-[#050811] border border-slate-800 p-3 min-w-[130px] rounded-lg text-center shrink-0">
                  <span className="text-[9px] font-mono text-slate-500 tracking-wider">SLA COUNTDOWN</span>
                  <p className={`text-sm font-mono font-extrabold mt-1 tracking-widest ${
                    slaTime < 300 ? 'text-red-400 animate-pulse' : 'text-cyan-400'
                  }`}>{formatSla(slaTime)}</p>
                </div>
              </div>

              {activeIncident.latencyPeak && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
                  <div className="bg-[#0c101b] border border-slate-850 p-4 rounded-lg min-w-0">
                    <span className="text-[10px] font-mono text-slate-500">LATENCY PEAK</span>
                    <p className="text-xl font-mono font-bold text-cyan-400 mt-1 break-words">{activeIncident.latencyPeak}</p>
                  </div>

                  <div className="bg-[#0c101b] border border-slate-850 p-4 rounded-lg min-w-0">
                    <span className="text-[10px] font-mono text-slate-500">AFFECTED USERS</span>
                    <p className="text-xl font-mono font-semibold text-slate-200 mt-1 break-words">{activeIncident.affectedUsers}</p>
                  </div>

                  <div className="bg-[#0c101b] border border-slate-850 p-4 rounded-lg min-w-0">
                    <span className="text-[10px] font-mono text-slate-500">REPLICATION LAG</span>
                    <p className={`text-xl font-mono font-bold mt-1 break-words ${
                      activeIncident.replicationLag === '0.0s' ? 'text-emerald-400' : 'text-red-400'
                    }`}>{activeIncident.replicationLag}</p>
                  </div>
                </div>
              )}

              {activeIncident.resolutionStrategy && (
                <div className="bg-[#111622]/40 border-l-2 border-l-[#00d4ff] p-5 rounded-r-lg space-y-3 min-w-0">
                  <h4 className="text-xs font-mono font-semibold text-[#00d4ff] uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">smart_toy</span>
                    Sentinel-Alpha: Resolution Strategy Checklist
                  </h4>
                  
                  <div className="space-y-2 text-xs text-slate-300 font-mono leading-relaxed min-w-0">
                    {activeIncident.resolutionStrategy.map((step, idx) => (
                      <div key={idx} className="flex gap-2 min-w-0">
                        <span className="text-cyan-500 opacity-60 shrink-0">0{idx + 1}.</span>
                        <p className="break-words">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2 min-w-0">
                {activeIncident.id === 'INC-9923-DELTA' && activeIncident.status !== 'resolved' ? (
                  <>
                    <button 
                      onClick={handleMigrationSubmit}
                      disabled={isMigrationExecuting}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-6 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 cyan-glow transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">play_arrow</span>
                      {migrationStep === 1 ? 'Migrating Shard Stage 1/3...' :
                       migrationStep === 2 ? 'Zero-data copy block copy Master 2/3...' :
                       migrationStep === 3 ? 'DNS cutover partition 3/3...' :
                       'Execute Shard Migration'}
                    </button>
                    <button 
                      onClick={() => addLog('SYSTEM', 'Database incident ignored and archived.', '#888')}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3.5 px-6 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Ignore & log
                    </button>
                  </>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 font-mono text-xs rounded-lg w-full text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">verified</span>
                    INCIDENT RESOLVED & ARCHIVED
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden flex flex-col min-w-0">
            <div className="bg-slate-900/30 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center text-slate-400 min-w-0">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Live Telemetry Stream logs</span>
              <span className="text-[10px] font-mono text-slate-600 shrink-0">v2.0.4-agent</span>
            </div>
            
            <div 
              ref={logContainerRef}
              className="bg-[#050811] p-4 flex-1 font-mono text-[10.5px] leading-relaxed overflow-y-auto select-text space-y-1 min-w-0"
            >
              {telemetryLogs.map((log, idx) => (
                <p key={idx} className="hover:bg-slate-900/30 rounded pl-1 break-words">
                  <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                  <span className={`font-bold mr-1.5 ${
                    log.level === 'critical' ? 'text-red-400' :
                    log.level === 'warn' ? 'text-amber-400' :
                    log.level === 'system' ? 'text-cyan-400' :
                    'text-slate-400'
                  }`}>{log.source}:</span>
                  <span className="text-slate-200">{log.message}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
