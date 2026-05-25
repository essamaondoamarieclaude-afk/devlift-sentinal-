import { motion } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'
import GlassCard from './GlassCard'
import Badge from './Badge'
import type { MCPConnection } from '../../types'

interface MCPConnectionCardProps {
  connection: MCPConnection
  index?: number
}

export default function MCPConnectionCard({ connection, index = 0 }: MCPConnectionCardProps) {
  const statusConfig = {
    connected: { icon: Wifi, color: 'text-sentinel-green', bg: 'bg-sentinel-green/10', variant: 'success' as const },
    disconnected: { icon: WifiOff, color: 'text-sentinel-text-muted', bg: 'bg-sentinel-border', variant: 'default' as const },
    error: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', variant: 'error' as const },
  }

  const status = statusConfig[connection.status]
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="p-4" hover>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status.bg}`}>
              <StatusIcon size={16} className={status.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-sentinel-text-primary">{connection.name}</p>
              <p className="text-xs text-sentinel-text-muted">{connection.category}</p>
            </div>
          </div>
          <Badge variant={status.variant} size="sm" pulse={connection.status === 'connected'}>
            {connection.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {connection.capabilities.map((cap) => (
              <span key={cap} className="px-1.5 py-0.5 text-[10px] rounded bg-sentinel-border/50 text-sentinel-text-muted font-mono">
                {cap}
              </span>
            ))}
          </div>
          {connection.status === 'error' && (
            <button className="p-1.5 rounded-lg hover:bg-sentinel-border transition-colors">
              <RefreshCw size={12} className="text-sentinel-text-muted" />
            </button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}
