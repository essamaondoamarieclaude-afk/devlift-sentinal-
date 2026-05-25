import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import GlassCard from './GlassCard'
import type { AgentAction } from '../../types'

interface DecisionLogProps {
  actions: AgentAction[]
}

const statusIcon = {
  success: CheckCircle,
  failed: XCircle,
  pending: Clock,
}

const statusColor = {
  success: 'text-sentinel-green',
  failed: 'text-red-400',
  pending: 'text-sentinel-orange',
}

export default function DecisionLog({ actions }: DecisionLogProps) {
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold text-sentinel-text-primary mb-3">Decision Log</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {actions.map((action, i) => {
          const Icon = statusIcon[action.status]
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-lg bg-sentinel-bg/50 border border-sentinel-border"
            >
              <div className="flex items-start gap-2">
                <Icon size={14} className={`${statusColor[action.status]} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-sentinel-text-primary">{action.agentType}</span>
                    <span className="text-xs text-sentinel-text-muted">{action.actionType}</span>
                    <span className="text-xs text-sentinel-text-muted ml-auto">{action.executionMs}ms</span>
                  </div>
                  <p className="text-xs text-sentinel-text-secondary">{action.reasoning}</p>
                  {action.mcpToolsCalled.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {action.mcpToolsCalled.map((tool) => (
                        <span key={tool} className="px-1.5 py-0.5 text-[10px] rounded bg-sentinel-purple/10 text-sentinel-purple font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
