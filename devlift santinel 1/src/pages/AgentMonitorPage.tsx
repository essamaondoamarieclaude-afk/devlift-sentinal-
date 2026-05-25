import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgents, useAgentActions } from '../hooks/useDashboardData'
import AgentCard from '../components/ui/AgentCard'
import AgentFlowDiagram from '../components/ui/AgentFlowDiagram'
import DecisionLog from '../components/ui/DecisionLog'
import ApprovalQueue from '../components/ui/ApprovalQueue'
import { Loader2 } from 'lucide-react'

const mockApprovals = [
  {
    id: 'apr_1',
    title: 'Unusual transaction pattern — Location 3',
    description: 'Transaction volume 4.2x normal at 23:45. No scheduled events or staff overtime logged.',
    riskScore: 0.78,
    agentType: 'Intelligence Agent',
    evidence: ['4.2x vs baseline', 'Outside business hours', 'No calendar events'],
  },
]

export default function AgentMonitorPage() {
  const { data: agents, isLoading } = useAgents()
  const { data: actions } = useAgentActions()
  const [approvals, setApprovals] = useState(mockApprovals)

  const handleApprove = (id: string) => {
    setApprovals(approvals.filter((a) => a.id !== id))
  }

  const handleReject = (id: string) => {
    setApprovals(approvals.filter((a) => a.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-sentinel-cyan" />
      </div>
    )
  }

  const connectedCount = agents?.filter((a) => a.status === 'active' || a.status === 'processing').length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-sentinel-text-primary">AI Agent Monitor</h1>
        <p className="text-sm text-sentinel-text-muted mt-1">Real-time transparency into every AI decision</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Agents', value: `${connectedCount}/${agents?.length || 0}`, color: 'text-sentinel-green' },
          { label: 'Decisions/min', value: agents?.reduce((a, b) => a + b.decisionsPerMinute, 0) || 0, color: 'text-sentinel-cyan' },
          { label: 'Tool Success', value: '99.7%', color: 'text-sentinel-green' },
          { label: 'Avg Latency', value: '1.2s', color: 'text-sentinel-text-primary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <p className="text-xs text-sentinel-text-muted">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents?.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      <AgentFlowDiagram />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DecisionLog actions={actions || []} />
        <ApprovalQueue items={approvals} onApprove={handleApprove} onReject={handleReject} />
      </div>
    </div>
  )
}
