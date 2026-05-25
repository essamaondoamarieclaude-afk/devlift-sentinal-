import { motion } from 'framer-motion'
import { Check, X, AlertTriangle } from 'lucide-react'
import GlassCard from './GlassCard'
import Badge from './Badge'

interface ApprovalItem {
  id: string
  title: string
  description: string
  riskScore: number
  agentType: string
  evidence: string[]
}

interface ApprovalQueueProps {
  items: ApprovalItem[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function ApprovalQueue({ items, onApprove, onReject }: ApprovalQueueProps) {
  if (items.length === 0) return null

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-sentinel-text-primary">Human Approval Queue</h3>
        <Badge variant="warning" size="sm">{items.length} pending</Badge>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-lg bg-sentinel-bg/50 border border-sentinel-border"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sentinel-orange/10">
                <AlertTriangle size={16} className="text-sentinel-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-sentinel-text-primary">{item.title}</p>
                  <Badge variant="warning" size="sm">Risk: {Math.round(item.riskScore * 100)}%</Badge>
                </div>
                <p className="text-xs text-sentinel-text-secondary mb-2">{item.description}</p>
                <p className="text-xs text-sentinel-text-muted mb-2">From: {item.agentType}</p>
                {item.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.evidence.map((e, j) => (
                      <span key={j} className="px-1.5 py-0.5 text-[10px] rounded bg-sentinel-border/50 text-sentinel-text-muted">{e}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-sentinel-green/10 text-sentinel-green hover:bg-sentinel-green/20 transition-colors"
                  >
                    <Check size={12} /> Approve
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <X size={12} /> Reject
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
