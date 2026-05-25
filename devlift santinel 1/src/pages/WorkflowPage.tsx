import { useWorkflows } from '../hooks/useDashboardData'
import GlassCard from '../components/ui/GlassCard'
import Badge from '../components/ui/Badge'
import { motion } from 'framer-motion'
import { Play, Pause, Plus, Activity } from 'lucide-react'

export default function WorkflowPage() {
  const { data: workflows } = useWorkflows()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sentinel-text-primary">Automation Workflows</h1>
          <p className="text-sm text-sentinel-text-muted mt-1">Visual workflow builder for autonomous operations</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-sentinel-cyan to-sentinel-blue text-white hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows?.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-4" hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${wf.isActive ? 'bg-sentinel-green/10' : 'bg-sentinel-border'}`}>
                    <Activity size={16} className={wf.isActive ? 'text-sentinel-green' : 'text-sentinel-text-muted'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sentinel-text-primary">{wf.name}</p>
                    <p className="text-xs text-sentinel-text-muted mt-0.5">{wf.description}</p>
                  </div>
                </div>
                <Badge variant={wf.isActive ? 'success' : 'default'} size="sm">
                  {wf.isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-sentinel-border">
                <div className="flex items-center gap-3 text-xs text-sentinel-text-muted">
                  <span>{wf.executionCount} runs</span>
                  {wf.lastTriggered && (
                    <span>Last: {Math.floor((Date.now() - new Date(wf.lastTriggered).getTime()) / 60000)}m ago</span>
                  )}
                </div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-sentinel-border hover:bg-sentinel-border/80 transition-colors text-sentinel-text-secondary">
                  {wf.isActive ? <Pause size={12} /> : <Play size={12} />}
                  {wf.isActive ? 'Pause' : 'Resume'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-sentinel-text-primary mb-2">Workflow Canvas</h3>
          <p className="text-xs text-sentinel-text-muted mb-4">
            Drag and drop triggers, conditions, and actions to build powerful automation pipelines.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Triggers', items: ['Inventory Threshold', 'Revenue Drop', 'Time Schedule', 'Webhook'] },
              { label: 'Conditions', items: ['AND/OR Logic', 'Numeric Compare', 'Time Window'] },
              { label: 'Actions', items: ['Send WhatsApp', 'Create PO', 'Send Email', 'Generate Report'] },
            ].map((cat) => (
              <div key={cat.label} className="p-3 rounded-lg bg-sentinel-bg/50 border border-sentinel-border">
                <p className="text-xs font-medium text-sentinel-text-primary mb-2">{cat.label}</p>
                {cat.items.map((item) => (
                  <span key={item} className="block px-2 py-1 text-[10px] rounded bg-sentinel-border/50 text-sentinel-text-muted mb-1 cursor-grab hover:bg-sentinel-cyan/10 hover:text-sentinel-cyan transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
