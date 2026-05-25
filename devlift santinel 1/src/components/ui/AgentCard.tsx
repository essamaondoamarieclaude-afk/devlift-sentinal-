import { motion } from 'framer-motion'
import { Cpu, Memory, Activity } from 'lucide-react'
import GlassCard from './GlassCard'
import Badge from './Badge'
import type { Agent } from '../../types'

interface AgentCardProps {
  agent: Agent
  index?: number
}

const statusConfig = {
  active: { color: 'bg-sentinel-green', label: 'Active', variant: 'success' as const },
  idle: { color: 'bg-sentinel-text-muted', label: 'Idle', variant: 'default' as const },
  processing: { color: 'bg-sentinel-cyan', label: 'Processing', variant: 'info' as const },
  error: { color: 'bg-red-400', label: 'Error', variant: 'error' as const },
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const status = statusConfig[agent.status]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className={`p-4 ${agent.status === 'processing' ? 'gradient-border' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.color} ${agent.status === 'active' || agent.status === 'processing' ? 'status-active' : ''}`} />
              <h3 className="text-sm font-semibold text-sentinel-text-primary">{agent.name}</h3>
            </div>
            <p className="text-xs text-sentinel-text-muted mt-1 font-mono">{agent.type}</p>
          </div>
          <Badge variant={status.variant} size="sm" pulse={agent.status === 'active' || agent.status === 'processing'}>
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-sentinel-text-secondary mb-3 line-clamp-2">{agent.currentTask}</p>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sentinel-border">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-sentinel-text-muted" />
            <div>
              <p className="text-xs text-sentinel-text-muted">CPU</p>
              <p className="text-xs font-semibold text-sentinel-text-primary">{agent.cpuUsage}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Memory size={14} className="text-sentinel-text-muted" />
            <div>
              <p className="text-xs text-sentinel-text-muted">RAM</p>
              <p className="text-xs font-semibold text-sentinel-text-primary">{agent.memoryUsage}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-sentinel-text-muted" />
            <div>
              <p className="text-xs text-sentinel-text-muted">Dec/min</p>
              <p className="text-xs font-semibold text-sentinel-text-primary">{agent.decisionsPerMinute}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
