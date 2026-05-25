import { motion } from 'framer-motion'

interface HealthScoreProps {
  score: number
  trend: 'up' | 'down' | 'stable'
}

export default function HealthScore({ score, trend }: HealthScoreProps) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#00FF88' : score >= 60 ? '#FF6B35' : '#FF4444'

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1E2D40" strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-sentinel-text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-sentinel-text-muted uppercase tracking-wider">Health</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-sentinel-text-secondary">Business Health</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-sentinel-green' : trend === 'down' ? 'text-sentinel-orange' : 'text-sentinel-text-muted'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
          <span className="text-xs text-sentinel-text-muted">vs yesterday</span>
        </div>
      </div>
    </div>
  )
}
