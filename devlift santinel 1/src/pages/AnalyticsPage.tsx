import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ComposedChart,
} from 'recharts'
import GlassCard from '../components/ui/GlassCard'
import AIInsightPanel from '../components/ui/AIInsightPanel'
import { Download } from 'lucide-react'

const tabs = ['Revenue', 'Inventory', 'Customers', 'Forecasts']

const revenueData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    actual: 2.0 + Math.sin(i * 0.4) * 0.5 + Math.random() * 0.4,
    forecast: 2.0 + Math.sin(i * 0.4) * 0.5 + 0.1,
    previous: 1.8 + Math.sin(i * 0.4 + 0.3) * 0.4 + Math.random() * 0.3,
  }
})

const inventoryData = [
  { name: 'Paracetamol', stock: 120, threshold: 200, reorder: 500 },
  { name: 'Amoxicillin', stock: 340, threshold: 100, reorder: 300 },
  { name: 'Vitamin C', stock: 560, threshold: 150, reorder: 400 },
  { name: 'Ibuprofen', stock: 80, threshold: 100, reorder: 250 },
  { name: 'Antimalarial', stock: 420, threshold: 200, reorder: 350 },
]

const sentimentData = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  score: 4.0 + Math.sin(i * 0.6) * 0.3 + Math.random() * 0.2,
}))

const forecastData = [
  { period: 'Next 7 Days', revenue: 'XAF 16.8M', lower: '15.2M', upper: '18.4M', confidence: 92 },
  { period: 'Next 14 Days', revenue: 'XAF 34.1M', lower: '30.5M', upper: '37.8M', confidence: 87 },
  { period: 'Next 30 Days', revenue: 'XAF 72.4M', lower: '64.1M', upper: '80.9M', confidence: 81 },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Revenue')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sentinel-text-primary">Business Analytics</h1>
          <p className="text-sm text-sentinel-text-muted mt-1">Historical trends, forecasts, and AI-powered insights</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-sentinel-cyan/10 text-sentinel-cyan hover:bg-sentinel-cyan/20 transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="flex gap-2 border-b border-sentinel-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-sentinel-cyan/10 text-sentinel-cyan border border-sentinel-cyan/20'
                : 'text-sentinel-text-muted hover:text-sentinel-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold text-sentinel-text-primary mb-1">Revenue — Actual vs Forecast vs Previous</h3>
              <p className="text-xs text-sentinel-text-muted mb-4">30-day view with AI forecast overlay</p>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={revenueData}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
                  <XAxis dataKey="date" tick={{ fill: '#8892A4', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                  <Tooltip contentStyle={{ background: '#161B27', border: '1px solid #1E2D40', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                  <Area type="monotone" dataKey="previous" stroke="#7C5CFF" strokeWidth={1} fill="#7C5CFF" fillOpacity={0.05} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="actual" stroke="#00D4FF" strokeWidth={2} fill="url(#actualGrad)" />
                  <Line type="monotone" dataKey="forecast" stroke="#00FF88" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
          <div className="space-y-4">
            <AIInsightPanel />
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold text-sentinel-text-primary mb-3">Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Location 1 — Douala', value: 'XAF 1.1M', pct: 46, color: 'bg-sentinel-cyan' },
                  { label: 'Location 2 — Yaoundé', value: 'XAF 0.8M', pct: 33, color: 'bg-sentinel-blue' },
                  { label: 'Location 3 — Bastos', value: 'XAF 0.5M', pct: 21, color: 'bg-sentinel-purple' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-sentinel-text-primary">{item.label}</span>
                      <span className="text-sentinel-text-secondary">{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-sentinel-border overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'Inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-sentinel-text-primary mb-4">Stock Levels vs Threshold</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
                <XAxis dataKey="name" tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#161B27', border: '1px solid #1E2D40', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                <Bar dataKey="stock" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-sentinel-text-primary mb-4">Depletion Forecasts</h3>
            <div className="space-y-3">
              {[
                { name: 'Ibuprofen', eta: '12 hours', status: 'critical' as const },
                { name: 'Paracetamol', eta: '18 hours', status: 'critical' as const },
                { name: 'Amoxicillin', eta: '4 days', status: 'warning' as const },
                { name: 'Vitamin C', eta: '8 days', status: 'healthy' as const },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-sentinel-bg/50 border border-sentinel-border">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'critical' ? 'bg-red-400' : item.status === 'warning' ? 'bg-sentinel-orange' : 'bg-sentinel-green'
                    }`} />
                    <span className="text-xs text-sentinel-text-primary">{item.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    item.status === 'critical' ? 'text-red-400' : item.status === 'warning' ? 'text-sentinel-orange' : 'text-sentinel-green'
                  }`}>{item.eta}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'Customers' && (
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-sentinel-text-primary mb-1">Customer Sentiment Trend</h3>
          <p className="text-xs text-sentinel-text-muted mb-4">14-day aggregated sentiment from all channels</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
              <XAxis dataKey="date" tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3, 5]} tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#161B27', border: '1px solid #1E2D40', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
              <Area type="monotone" dataKey="score" stroke="#00FF88" strokeWidth={2} fill="url(#sentimentGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {activeTab === 'Forecasts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecastData.map((f, i) => (
            <motion.div
              key={f.period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-4 gradient-border">
                <p className="text-xs text-sentinel-text-muted mb-2">{f.period}</p>
                <p className="text-2xl font-bold text-sentinel-text-primary mb-1">{f.revenue}</p>
                <div className="flex items-center gap-2 text-xs text-sentinel-text-muted mb-3">
                  <span>Range: {f.lower} – {f.upper}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-sentinel-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-sentinel-green"
                      initial={{ width: 0 }}
                      animate={{ width: `${f.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-sentinel-green">{f.confidence}%</span>
                </div>
                <p className="text-[10px] text-sentinel-text-muted mt-1">Confidence</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
