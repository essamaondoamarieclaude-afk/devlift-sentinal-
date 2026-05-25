import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

interface FlowNode {
  id: string
  name: string
  status: 'active' | 'idle' | 'processing' | 'error'
  x: number
  y: number
}

const agents: FlowNode[] = [
  { id: 'agent_1', name: 'Monitoring', status: 'active', x: 50, y: 80 },
  { id: 'agent_2', name: 'Intelligence', status: 'processing', x: 200, y: 80 },
  { id: 'agent_3', name: 'Execution', status: 'idle', x: 350, y: 80 },
  { id: 'agent_4', name: 'Communication', status: 'active', x: 500, y: 80 },
]

const edges = [
  { from: 'agent_1', to: 'agent_2' },
  { from: 'agent_2', to: 'agent_3' },
  { from: 'agent_2', to: 'agent_4' },
]

export default function AgentFlowDiagram() {
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold text-sentinel-text-primary mb-3">Agent Communication Flow</h3>
      <div className="relative h-[160px] bg-sentinel-bg/30 rounded-lg border border-sentinel-border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {edges.map((edge) => {
            const from = agents.find((a) => a.id === edge.from)!
            const to = agents.find((a) => a.id === edge.to)!
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <defs>
                  <marker id={`arrowhead-${edge.from}`} markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#00D4FF" />
                  </marker>
                </defs>
                <line
                  x1={from.x + 45} y1={from.y + 20}
                  x2={to.x} y2={to.y + 20}
                  stroke="#1E2D40" strokeWidth={1.5}
                  markerEnd={`url(#arrowhead-${edge.from})`}
                />
                {(from.status === 'active' || from.status === 'processing') && (
                  <motion.line
                    x1={from.x + 45} y1={from.y + 20}
                    x2={to.x} y2={to.y + 20}
                    stroke="#00D4FF" strokeWidth={1.5}
                    strokeDasharray="4 4"
                    markerEnd={`url(#arrowhead-${edge.from})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </g>
            )
          })}
        </svg>
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="absolute flex flex-col items-center"
            style={{ left: agent.x, top: agent.y }}
            animate={{ scale: agent.status === 'processing' ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: agent.status === 'processing' ? Infinity : 0 }}
          >
            <div
              className={`w-[90px] h-[40px] rounded-lg flex items-center justify-center text-[10px] font-medium border ${
                agent.status === 'active'
                  ? 'bg-sentinel-green/10 border-sentinel-green/30 text-sentinel-green'
                  : agent.status === 'processing'
                  ? 'bg-sentinel-cyan/10 border-sentinel-cyan/30 text-sentinel-cyan gradient-border'
                  : agent.status === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-sentinel-surface border-sentinel-border text-sentinel-text-muted'
              }`}
            >
              {agent.name}
            </div>
            <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
              agent.status === 'active' || agent.status === 'processing'
                ? 'bg-sentinel-green status-active'
                : 'bg-sentinel-text-muted'
            }`} />
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
