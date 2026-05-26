import { useState } from 'react'

const metrics = [
  { label: 'TOTAL REVENUE (Q3)', value: '$1,248,302.00', change: '+12.4% vs prev', changeIcon: 'trending_up', color: 'text-primary' },
  { label: 'ACTIVE AGENTS', value: '482 / 500', change: '96% Capacity', changeIcon: 'bolt', color: 'text-secondary' },
  { label: 'PROCESSING COST', value: '$14,022.40', change: '-2.1% Optimization', changeIcon: 'trending_down', color: 'text-error' },
  { label: 'SUCCESS RATE', value: '99.98%', change: 'Mission Critical', changeIcon: 'verified', color: 'text-primary' },
]

const tableData = [
  { region: 'North America (NA-East)', icon: 'public', flows: '1,244', latency: '12ms', efficiency: 92, status: 'OPTIMAL', statusColor: 'text-primary', statusBg: 'bg-primary/10' },
  { region: 'Europe (EU-Central)', icon: 'public', flows: '892', latency: '48ms', efficiency: 74, status: 'OPTIMAL', statusColor: 'text-primary', statusBg: 'bg-primary/10' },
  { region: 'Asia Pacific (AP-South)', icon: 'public', flows: '411', latency: '156ms', efficiency: 45, iconColor: 'text-secondary', status: 'DEGRADED', statusColor: 'text-secondary', statusBg: 'bg-secondary/10' },
]

export default function AnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState('DAY')

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-technical-xs text-secondary mb-2 tracking-[0.2em] uppercase">Enterprise Intelligence</h3>
          <h1 className="text-display-lg text-on-surface">Analytics & Insights</h1>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
            {['DAY', 'WEEK', 'MONTH'].map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-1.5 text-technical-xs rounded transition-all ${
                  activePeriod === p ? 'bg-primary text-on-primary-fixed shadow-[0_0_10px_rgba(0,212,255,0.2)]' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="bg-primary px-6 py-2 rounded-lg text-on-primary text-label-md flex items-center gap-2 glow-cyan hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            GENERATE REPORT
          </button>
        </div>
      </section>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass-panel p-6 rounded-xl flex flex-col gap-2">
            <span className="text-technical-xs text-on-surface-variant">{m.label}</span>
            <div className={`text-headline-md ${m.color}`}>{m.value}</div>
            <div className={`text-technical-xs ${m.color} flex items-center gap-1`}>
              <span className="material-symbols-outlined text-xs">{m.changeIcon}</span> {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-headline-md text-on-surface">Revenue Projection & Anomalies</h4>
              <p className="text-body-md text-on-surface-variant">Agent-driven market predictive modeling</p>
            </div>
            <div className="flex items-center gap-4 text-technical-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> PROJECTED</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /> ACTUAL</div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px] bg-surface-container-lowest/50 rounded-lg relative overflow-hidden flex items-end px-4 gap-2">
            <div className="absolute inset-0 grid grid-rows-5 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-b border-outline-variant/10" />
              ))}
            </div>
            {[40, 55, 45, 70, 60, 80, 75, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative" style={{ height: `${h}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t" style={{ height: `${h * 0.8}%`, opacity: 0.5 + (i === 3 ? 0 : 0) }} />
                {i === 3 && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface border border-secondary text-secondary text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                    ANOMALY DETECTED +18%
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-technical-xs text-on-surface-variant">
            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel ai-border rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="material-symbols-outlined text-secondary opacity-30 text-4xl">psychology</span>
            </div>
            <h4 className="text-label-md text-secondary uppercase tracking-widest">AI Command Intelligence</h4>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest/50 p-4 rounded border border-outline-variant/20">
                <p className="text-technical-sm leading-relaxed text-on-surface">
                  <span className="text-secondary font-bold">ANALYSIS:</span> Significant traffic spike detected from EU-West-1 node. Revenue correlation suggests early holiday volume. Recommendation: Scale Agent clusters by 15%.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-technical-xs text-on-surface-variant">
                  <span>CONFIDENCE SCORE</span>
                  <span>98.4%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[98%] shadow-[0_0_8px_#cabeff]" />
                </div>
              </div>
              <button className="w-full py-2 border border-secondary text-secondary text-technical-xs rounded hover:bg-secondary/10 transition-colors uppercase">Execute Auto-Scale</button>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h4 className="text-label-md text-on-surface mb-4">Inventory Telemetry</h4>
            <div className="space-y-4">
              {[
                { label: 'Silicon Units', icon: 'inventory_2', value: '1,420', change: '▼', changeColor: 'text-error' },
                { label: 'Logic Cores', icon: 'memory', value: '8,912', change: '▲', changeColor: 'text-primary' },
                { label: 'Network Hubs', icon: 'router', value: '244', change: '=', changeColor: 'text-on-surface-variant' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                    </div>
                    <span className="text-body-md">{item.label}</span>
                  </div>
                  <span className="text-technical-sm text-on-surface">{item.value} <span className={`${item.changeColor} text-xs`}>{item.change}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Node Performance Matrix */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h4 className="text-headline-md text-on-surface">Node Performance Matrix</h4>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">filter_list</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                {['Region Node', 'Active Flows', 'Latencey (ms)', 'Efficiency', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-technical-xs text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {tableData.map((row) => (
                <tr key={row.region} className="hover:bg-primary/5 transition-colors cursor-default">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${row.iconColor || 'text-primary'}`}>{row.icon}</span>
                      <span className="text-technical-sm">{row.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-technical-sm">{row.flows}</td>
                  <td className="px-6 py-4 text-technical-sm">{row.latency}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${row.status === 'OPTIMAL' ? 'bg-primary' : 'bg-secondary'} rounded-full`} style={{ width: `${row.efficiency}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 ${row.statusBg} ${row.statusColor} text-technical-xs rounded`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
