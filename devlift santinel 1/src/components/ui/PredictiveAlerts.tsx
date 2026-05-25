import { motion } from 'framer-motion'
import { AlertTriangle, Zap } from 'lucide-react'
import GlassCard from './GlassCard'

interface PredictiveAlert {
  id: string
  title: string
  description: string
  confidence: number
  timeToImpact: string
  severity: 'high' | 'medium' | 'low'
}

interface PredictiveAlertsProps {
  alerts: PredictiveAlert[]
  onResolve: (id: string) => void
}

export default function PredictiveAlerts({ alerts, onResolve }: PredictiveAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-sentinel-purple" />
        <h3 className="text-sm font-semibold text-sentinel-text-primary">Predictive Intelligence</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-lg bg-sentinel-bg/50 border border-sentinel-border"
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${alert.severity === 'high' ? 'bg-red-500/10' : 'bg-sentinel-orange/10'}`}>
                <AlertTriangle size={14} className={alert.severity === 'high' ? 'text-red-400' : 'text-sentinel-orange'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-sentinel-text-primary">{alert.title}</p>
                  <span className="text-[10px] text-sentinel-text-muted">{alert.timeToImpact}</span>
                </div>
                <p className="text-[11px] text-sentinel-text-secondary mt-1">{alert.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 rounded-full bg-sentinel-border overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${alert.confidence > 0.8 ? 'bg-sentinel-orange' : 'bg-sentinel-blue'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${alert.confidence * 100}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-sentinel-text-muted">{Math.round(alert.confidence * 100)}%</span>
                  <button
                    onClick={() => onResolve(alert.id)}
                    className="text-[10px] px-2 py-0.5 rounded bg-sentinel-cyan/10 text-sentinel-cyan hover:bg-sentinel-cyan/20 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
