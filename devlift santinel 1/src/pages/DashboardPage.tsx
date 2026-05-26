import { motion } from 'framer-motion'

const kpiData = [
  { label: 'REVENUE TODAY', value: '$42,891.00', icon: 'payments', delta: '+12.4%', bars: [20, 30, 40, 50, 80], barColor: 'bg-primary' },
  { label: 'ACTIVE INVENTORY', value: '1,204 Units', icon: 'inventory_2', delta: 'Optimal', bars: [40, 60, 20, 50, 30], barColor: 'bg-primary' },
  { label: 'OPEN ALERTS', value: '07 CRITICAL', icon: 'emergency', delta: 'Priority High', bars: [50, 30, 60, 40, 20], barColor: 'bg-error' },
  { label: 'SYSTEM UPTIME', value: '99.998%', icon: 'lan', delta: 'Stable', bars: [60, 60, 60, 60, 100], barColor: 'bg-primary' },
]

const agentActivities = [
  { agent: 'MONITORING_AGENT_7', time: '2m ago', task: 'Detected anomaly in APAC distribution logistics. Confidence: 0.98', color: 'text-secondary-fixed', icon: 'troubleshoot', bg: 'bg-secondary-container/20', border: 'border-secondary/30' },
  { agent: 'INTELLIGENCE_AGENT_ALPHA', time: '5m ago', task: 'Recalculating predictive maintenance for Node-04 infrastructure. Confidence: 0.92', color: 'text-primary', icon: 'psychology', bg: 'bg-primary/10', border: 'border-primary/30' },
  { agent: 'EXECUTION_AGENT_V9', time: '12m ago', task: 'Successfully rerouted 420kg payload to bypass weather obstruction. Confidence: 1.00', color: 'text-tertiary', icon: 'next_plan', bg: 'bg-on-tertiary-container/20', border: 'border-tertiary/30' },
  { agent: 'GOVERNANCE_WATCHDOG', time: '15m ago', task: 'Compliance check passed for 4,200 transactions. Confidence: 0.99', color: 'text-secondary-fixed', icon: 'security', bg: 'bg-secondary-container/20', border: 'border-secondary/30' },
]

const riskCards = [
  { severity: 'Critical Risk', eta: 'ETA: 45m', title: 'Inventory Shortage Detected', desc: 'Node-02 stock levels dropping below 5% for SKU-9901 due to rapid fulfillment spikes.', color: 'border-t-error/50', badgeBg: 'bg-error/10', badgeText: 'text-error', buttonBg: 'bg-error-container', buttonText: 'text-on-error-container', buttonIcon: 'auto_fix_high', buttonLabel: 'Auto-Replenish Now' },
  { severity: 'Efficiency Warning', eta: 'ETA: 2h', title: 'Network Congestion Predicted', desc: 'Data throughput for analytics pipeline projected to exceed capacity by 14%.', color: 'border-t-primary/50', badgeBg: 'bg-primary/10', badgeText: 'text-primary', buttonBg: 'bg-surface-container-high', buttonText: 'text-primary', buttonIcon: 'alt_route', buttonLabel: 'Reroute Traffic' },
  { severity: 'Agent Advisory', eta: 'ETA: Next Cycle', title: 'Workflow Optimization Available', desc: 'Execution Agent V9 suggests a 12% faster routing path for current active orders.', color: 'border-t-secondary/50', badgeBg: 'bg-secondary/10', badgeText: 'text-secondary', buttonBg: 'bg-secondary-container', buttonText: 'text-on-secondary-container', buttonIcon: 'verified', buttonLabel: 'Approve Optimization' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-headline-lg text-on-surface tracking-tight">Command Overview</h2>
          <p className="text-on-surface-variant text-body-md mt-1">Autonomous monitoring for all connected Sentinel nodes.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-high border border-outline-variant/30 text-on-surface px-6 py-2.5 rounded-lg flex items-center gap-2 text-label-md hover:border-primary/50 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Telemetry
          </button>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-label-md glow-cyan hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            Deploy Agent
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="glass-panel p-6 rounded-xl flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-on-surface-variant text-label-md">{kpi.label}</p>
                <h3 className="text-headline-md text-on-surface mt-1">{kpi.value}</h3>
              </div>
              <span className={`material-symbols-outlined ${kpi.label === 'OPEN ALERTS' ? 'text-error' : 'text-primary'}`}>{kpi.icon}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 flex items-end gap-1">
                {kpi.bars.map((h, i) => (
                  <div key={i} className={`w-full ${kpi.barColor}/20 h-full rounded-t relative`}>
                    <div className={`absolute bottom-0 w-full ${kpi.barColor} rounded-t`} style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <span className={`text-technical-xs ${kpi.label === 'OPEN ALERTS' ? 'text-error' : 'text-primary'}`}>{kpi.delta}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Health Score & Agent Activity */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Business Health Gauge */}
        <div className="xl:col-span-4 glass-panel p-8 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <h3 className="text-headline-md text-on-surface mb-8">Business Health</h3>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle className="text-surface-container-highest" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeWidth="12" />
              <circle className="text-primary glow-cyan" cx="128" cy="128" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeDashoffset="62.8" strokeLinecap="round" strokeWidth="12" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-display-lg text-primary">92</span>
              <span className="text-technical-xs text-on-surface-variant tracking-widest uppercase">Index Score</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="p-3 bg-surface-container-low rounded border border-outline-variant/10">
              <p className="text-technical-xs text-on-surface-variant">EFFICIENCY</p>
              <p className="text-body-md font-bold text-primary">98.2%</p>
            </div>
            <div className="p-3 bg-surface-container-low rounded border border-outline-variant/10">
              <p className="text-technical-xs text-on-surface-variant">SECURITY</p>
              <p className="text-body-md font-bold text-primary">Grade A</p>
            </div>
          </div>
        </div>

        {/* Agent Activity Feed */}
        <div className="xl:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
              <h3 className="text-headline-md text-on-surface">Agent Activity Feed</h3>
            </div>
            <span className="text-technical-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">LIVE STREAM</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px] custom-scrollbar p-6 space-y-4">
            {agentActivities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="ai-card bg-surface-container-low/30 p-4 rounded-lg flex items-start justify-between group hover:bg-surface-container-low transition-colors"
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded ${act.bg} flex items-center justify-center border ${act.border}`}>
                    <span className={`material-symbols-outlined ${act.color} text-[20px]`}>{act.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-technical-xs ${act.color}`}>{act.agent}</span>
                      <span className="text-technical-xs text-on-surface-variant">&bull; {act.time}</span>
                    </div>
                    <p className="text-body-md text-on-surface mt-1">{act.task}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">open_in_new</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictive Risk Analysis */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <h3 className="text-headline-md text-on-surface">Predictive Risk Analysis</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {riskCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-6 rounded-xl flex flex-col justify-between border-t-2 ${card.color}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-technical-xs ${card.badgeBg} ${card.badgeText} px-2 py-1 rounded border border-${card.badgeText}/20 uppercase`}>{card.severity}</span>
                  <span className="text-technical-xs text-on-surface-variant">{card.eta}</span>
                </div>
                <h4 className="text-body-lg font-bold text-on-surface">{card.title}</h4>
                <p className="text-body-md text-on-surface-variant mt-2">{card.desc}</p>
              </div>
              <div className="mt-6">
                <button className={`w-full ${card.buttonBg} ${card.buttonText} py-2 rounded-lg text-label-md hover:brightness-125 transition-all flex items-center justify-center gap-2`}>
                  <span className="material-symbols-outlined text-[18px]">{card.buttonIcon}</span>
                  {card.buttonLabel}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
