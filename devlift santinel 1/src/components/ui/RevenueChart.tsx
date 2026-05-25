import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import GlassCard from './GlassCard'

const data = Array.from({ length: 14 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (13 - i))
  const revenue = 2.0 + Math.sin(i * 0.5) * 0.4 + Math.random() * 0.3
  const previous = 1.8 + Math.sin(i * 0.5 + 0.3) * 0.3 + Math.random() * 0.3
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue,
    previous,
  }
})

export default function RevenueChart() {
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold text-sentinel-text-primary mb-1">Revenue</h3>
      <p className="text-xs text-sentinel-text-muted mb-4">Last 14 days vs previous period</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2D40" />
          <XAxis dataKey="date" tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
          <Tooltip
            contentStyle={{
              background: '#161B27',
              border: '1px solid #1E2D40',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
          />
          <Area type="monotone" dataKey="previous" stroke="#7C5CFF" strokeWidth={1.5} fill="url(#prevGrad)" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
