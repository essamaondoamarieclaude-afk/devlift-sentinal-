import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import GlassCard from './GlassCard'
import Sparkline from './Sparkline'
import type { KPI } from '../../types'

interface KPICardProps {
  kpi: KPI
  index?: number
}

export default function KPICard({ kpi, index = 0 }: KPICardProps) {
  const isPositive = kpi.delta >= 0
  const statusColor = kpi.status === 'healthy' ? 'text-sentinel-green' : kpi.status === 'warning' ? 'text-sentinel-orange' : 'text-red-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-4" hover>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium text-sentinel-text-muted uppercase tracking-wider">{kpi.label}</span>
          <span className={`text-xs font-semibold ${statusColor}`}>
            {kpi.status === 'healthy' ? '●' : kpi.status === 'warning' ? '●' : '●'}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-sentinel-text-primary">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <TrendingUp size={14} className="text-sentinel-green" />
              ) : (
                <TrendingDown size={14} className="text-sentinel-orange" />
              )}
              <span className={`text-xs font-medium ${isPositive ? 'text-sentinel-green' : 'text-sentinel-orange'}`}>
                {isPositive ? '+' : ''}{kpi.delta}%
              </span>
              <span className="text-xs text-sentinel-text-muted ml-1">{kpi.deltaLabel}</span>
            </div>
          </div>
          <div className="w-20 h-10">
            <Sparkline data={kpi.sparklineData.map((d) => ({ value: d.value }))} color={isPositive ? '#00FF88' : '#FF6B35'} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
