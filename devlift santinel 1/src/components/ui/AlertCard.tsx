import { motion } from 'framer-motion'
import { Clock, AlertTriangle, Package, CreditCard, Truck, Settings, ChevronRight } from 'lucide-react'
import GlassCard from './GlassCard'
import Badge from './Badge'
import type { Alert } from '../../types'

interface AlertCardProps {
  alert: Alert
  index?: number
  onClick?: () => void
}

const priorityConfig = {
  critical: { variant: 'error' as const, icon: AlertTriangle },
  high: { variant: 'warning' as const, icon: AlertTriangle },
  medium: { variant: 'info' as const, icon: Clock },
  low: { variant: 'default' as const, icon: Clock },
}

const typeIcons: Record<string, React.ElementType> = {
  inventory: Package,
  revenue: CreditCard,
  supplier: Truck,
  system: Settings,
}

export default function AlertCard({ alert, index = 0, onClick }: AlertCardProps) {
  const priority = priorityConfig[alert.priority]
  const Icon = typeIcons[alert.alertType] || AlertTriangle
  const isCritical = alert.priority === 'critical'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard
        className={`p-4 border-l-2 ${isCritical ? 'alert-critical border-l-red-500' : alert.priority === 'high' ? 'border-l-sentinel-orange' : alert.priority === 'medium' ? 'border-l-sentinel-blue' : 'border-l-sentinel-border'}`}
        hover
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/10' : 'bg-sentinel-border/50'}`}>
            <Icon size={16} className={isCritical ? 'text-red-400' : 'text-sentinel-text-secondary'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={priority.variant} size="sm">{alert.priority.toUpperCase()}</Badge>
              <Badge variant="default" size="sm">{alert.alertType}</Badge>
              <span className="text-xs text-sentinel-text-muted ml-auto">
                {Math.floor((Date.now() - new Date(alert.createdAt).getTime()) / 60000)}m ago
              </span>
            </div>
            <p className="text-sm font-medium text-sentinel-text-primary truncate">{alert.title}</p>
            <p className="text-xs text-sentinel-text-secondary mt-1 line-clamp-2">{alert.description}</p>
          </div>
          <ChevronRight size={16} className="text-sentinel-text-muted mt-2 shrink-0" />
        </div>
      </GlassCard>
    </motion.div>
  )
}
