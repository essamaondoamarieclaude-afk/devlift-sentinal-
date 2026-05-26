import { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [autoScaled, setAutoScaled] = useState(false);
  const [scalingProgress, setScalingProgress] = useState(false);

  // Revenue projection mockup data
  const data = [
    { name: '08:00', Projected: 1200, Actual: 1100 },
    { name: '10:00', Projected: 1600, Actual: 1540 },
    { name: '12:00', Projected: 1400, Actual: 1350 },
    { name: '14:00', Projected: 2200, Actual: 2596, isAnomaly: true }, // anomaly peak
    { name: '16:00', Projected: 1800, Actual: 1750 },
    { name: '18:00', Projected: 2400, Actual: 2300 },
    { name: '20:00', Projected: 2100, Actual: 2050 },
  ];

  const handleAutoScale = () => {
    setScalingProgress(true);
    setTimeout(() => {
      setScalingProgress(false);
      setAutoScaled(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 min-w-0">
      
      {/* HEADER CONTROLS */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 min-w-0">
        <div className="min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold block mb-1">
            Enterprise Intelligence
          </span>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight font-sans">Analytics & Insights</h2>
        </div>

        <div className="flex gap-3 flex-wrap shrink-0">
          <div className="flex bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            {['day', 'week', 'month'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md uppercase cursor-pointer transition-all ${
                  activeTab === tab
                    ? 'bg-[#00d4ff] text-slate-950 shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="bg-cyan-400 select-none text-slate-950 px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span>
            Generate Report
          </button>
        </div>
      </section>

      {/* HIGHLIGHT KPI GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <div className="glass-panel p-5 rounded-xl flex flex-col gap-1.5 min-w-0 overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">TOTAL REVENUE (Q3)</span>
          <div className="text-xl font-bold font-mono text-cyan-400 break-words">$1,248,302.00</div>
          <div className="text-[10px] text-cyan-400 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">trending_up</span> +12.4% vs prev
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col gap-1.5 min-w-0 overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ACTIVE AGENTS</span>
          <div className="text-xl font-bold font-mono text-purple-400 break-words">482 / 500</div>
          <div className="text-[10px] text-[#cabeff] flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">bolt</span> 96% Capacity
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col gap-1.5 min-w-0 overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">PROCESSING COST</span>
          <div className="text-xl font-bold font-mono text-slate-200 break-words">$14,022.40</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">trending_down</span> -2.1% Optimization
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col gap-1.5 min-w-0 overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SUCCESS RATE</span>
          <div className="text-xl font-bold font-mono text-cyan-400 break-words">99.98%</div>
          <div className="text-[10px] text-cyan-400 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">verified</span> Mission Critical
          </div>
        </div>
      </section>

      {/* CORE PERFORMANCE ANALYTICS DETAIL GIGA-GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">

        {/* COMBINED CHART */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-xl flex flex-col justify-between overflow-hidden min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-200 tracking-tight font-sans">Revenue Projections & Anomalies</h3>
              <p className="text-xs text-slate-400 break-words">Agent-driven market predictive modelling results for Node-01.</p>
            </div>
            <div className="flex gap-4 font-mono text-[10px] text-slate-400 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full shrink-0"></span>
                <span>PROJECTED Actuals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-purple-400 rounded-full shrink-0"></span>
                <span>ACTUAL Streams</span>
              </div>
            </div>
          </div>

          {/* Recharts dynamic container */}
          <div className="h-64 w-full pr-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,64,0.3)" />
                <XAxis dataKey="name" stroke="#8892a4" fontSize={10} tickLine={false} />
                <YAxis stroke="#8892a4" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b27', borderColor: '#1e2d40', borderRadius: '8px' }}
                  labelStyle={{ color: '#CDD5E0', fontFamily: 'monospace', fontSize: '11px' }}
                />
                
                {/* Projected layer rendered as bars */}
                <Bar dataKey="Projected" fill="rgba(0, 192, 255, 0.15)" stroke="rgba(0, 192, 255, 0.4)" strokeWidth={1} radius={[2, 2, 0, 0]} />
                
                {/* Actual layers rendered as interactive line */}
                <Line type="monotone" dataKey="Actual" stroke="#7c5cff" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Anomaly Indicator overlay absolute positioned */}
            <div className="absolute top-[3.5rem] left-[42%] bg-[#1a1f2c] border border-cyan-400 text-[#00d4ff] text-[9.5px] font-mono font-bold uppercase py-1 px-2.5 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.2)] flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] font-fill text-yellow-400 animate-pulse">warning</span>
              ANOMALY DETECTED +18%
            </div>
          </div>
        </div>

        {/* AI COMMAND INTELLIGENCE STRIP CARD */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
          <div className="glass-panel p-5 rounded-xl border-l-2 border-l-[#cabeff] relative overflow-hidden flex-1 flex flex-col justify-between min-w-0">
            <div className="absolute top-0 right-0 p-3 opacity-20 text-indigo-400">
              <span className="material-symbols-outlined text-4xl">psychology</span>
            </div>
            
            <div className="space-y-4 min-w-0">
              <h3 className="text-xs font-mono font-semibold text-[#cabeff] uppercase tracking-widest">
                AI Command Intelligence
              </h3>
              
              <div className="bg-[#0a0e1a]/80 p-4 border border-slate-800 rounded-lg min-w-0">
                <p className="text-xs text-slate-300 font-mono leading-relaxed break-words">
                  <span className="text-[#cabeff] font-bold">ANALYSIS:</span> Significant traffic spike detected from EU-West-1 node. Revenue correlation suggests early holiday volume. Recommendation: Scale Agent clusters by 15%.
                </p>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>SYSTEM CONFIDENCE SCORE</span>
                  <span className="text-[#00d4ff] font-bold">98.4%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              {scalingProgress ? (
                <button disabled className="w-full py-2 bg-slate-900 border border-[#7c5cff]/30 text-purple-300 rounded text-xs font-mono font-bold flex items-center justify-center gap-2">
                  <span className="animate-spin text-sm">refresh</span>
                  INITIATING AUTOSCALE...
                </button>
              ) : autoScaled ? (
                <button disabled className="w-full py-2 bg-emerald-950 text-emerald-400 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 border border-emerald-500/20">
                  <span className="material-symbols-outlined text-sm font-fill">verified_user</span>
                  CLUSTERS SCALED (+15%)
                </button>
              ) : (
                <button 
                  onClick={handleAutoScale}
                  className="w-full py-2 border border-[#7c5cff] text-[#cabeff] hover:bg-[#7c5cff]/10 text-xs font-mono font-bold rounded uppercase transition-colors cursor-pointer"
                >
                  Execute Auto-scale
                </button>
              )}
            </div>
          </div>

          {/* TELEMETRY STOCK LEVEL HIGHLIGHT */}
          <div className="glass-panel p-4 rounded-xl space-y-3 min-w-0 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-300">Inventory Telemetry</h4>
            
            <div className="space-y-2 min-w-0">
              <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-900/30 rounded transition-colors min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#00d4ff] text-sm shrink-0">inventory_2</span>
                  <span className="text-slate-300 truncate">Silicon Units</span>
                </div>
                <span className="font-mono text-slate-200 shrink-0">1,420 <span className="text-red-400 text-[10px]">▼</span></span>
              </div>

              <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-900/30 rounded transition-colors min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#00d4ff] text-sm shrink-0">memory</span>
                  <span className="text-slate-300 truncate">Logic Cores</span>
                </div>
                <span className="font-mono text-slate-200 shrink-0">8,912 <span className="text-[#00d4ff] text-[10px]">▲</span></span>
              </div>

              <div className="flex items-center justify-between text-xs p-1.5 hover:bg-slate-900/30 rounded transition-colors min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#00d4ff] text-sm shrink-0">router</span>
                  <span className="text-slate-300 truncate">Network Hubs</span>
                </div>
                <span className="font-mono text-slate-200 font-bold shrink-0">244 <span className="text-slate-500 text-[10px] font-normal">=</span></span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* REGIONAL MATRIX TABLE PANEL */}
      <section className="glass-panel rounded-xl overflow-hidden shadow-xl min-w-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/10 min-w-0">
          <h3 className="text-sm font-semibold text-slate-200">Regional Gateway Performance</h3>
          <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-slate-200 shrink-0">filter_list</span>
        </div>

        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 text-slate-500 font-mono text-[9px] uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-3">Region Node Domain</th>
                <th className="px-6 py-3">Active Data Flows</th>
                <th className="px-6 py-3">Uplink Latency (ms)</th>
                <th className="px-6 py-3">Efficiency Level</th>
                <th className="px-6 py-3">Status Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="px-6 py-3.5 flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-cyan-400 text-sm">public</span>
                  <span>North America (NA-East)</span>
                </td>
                <td className="px-6 py-3.5 font-mono text-slate-300">1,244</td>
                <td className="px-6 py-3.5 font-mono text-cyan-400">12ms</td>
                <td className="px-6 py-3.5">
                  <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="px-1.5 py-0.5 bg-cyan-400/10 text-cyan-400 font-mono text-[9px] font-bold rounded">OPTIMAL</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="px-6 py-3.5 flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-cyan-400 text-sm">public</span>
                  <span>Europe (EU-Central)</span>
                </td>
                <td className="px-6 py-3.5 font-mono text-slate-300">892</td>
                <td className="px-6 py-3.5 font-mono text-cyan-400">48ms</td>
                <td className="px-6 py-3.5">
                  <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="px-1.5 py-0.5 bg-cyan-400/10 text-cyan-400 font-mono text-[9px] font-bold rounded">OPTIMAL</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="px-6 py-3.5 flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-purple-400 text-sm">public</span>
                  <span>Asia Pacific (AP-South)</span>
                </td>
                <td className="px-6 py-3.5 font-mono text-slate-300">411</td>
                <td className="px-6 py-3.5 font-mono text-purple-400">156ms</td>
                <td className="px-6 py-3.5">
                  <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="px-1.5 py-0.5 bg-purple-400/10 text-purple-300 font-mono text-[9px] font-bold rounded">DEGRADED</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
