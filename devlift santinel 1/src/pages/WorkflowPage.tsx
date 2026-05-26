import { motion } from 'framer-motion'

const workflows = [
  { name: 'Auto Inventory Reorder', desc: 'Monitors stock levels and auto-creates POs when thresholds breached', active: true, runs: 147, last: '2m ago' },
  { name: 'Revenue Anomaly Alert', desc: 'Flags unusual transaction patterns and routes to human approval queue', active: true, runs: 89, last: '10m ago' },
  { name: 'Daily Sales Report', desc: 'Generates and emails daily sales summary to all managers at 18:00', active: true, runs: 104, last: '1d ago' },
]

const categories = [
  {
    label: 'Triggers',
    items: ['Inventory Threshold', 'Revenue Drop', 'Time Schedule', 'Webhook'],
  },
  {
    label: 'Conditions',
    items: ['AND/OR Logic', 'Numeric Compare', 'Time Window'],
  },
  {
    label: 'Actions',
    items: ['Send WhatsApp', 'Create PO', 'Send Email', 'Generate Report'],
  },
]

export default function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Automation Workflows</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Visual workflow builder for autonomous operations</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-sm">add</span> New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-4 rounded-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${wf.active ? 'bg-primary/10' : 'bg-surface-variant'}`}>
                  <span className={`material-symbols-outlined ${wf.active ? 'text-primary' : 'text-on-surface-variant'}`}>account_tree</span>
                </div>
                <div>
                  <p className="text-body-lg font-semibold text-on-surface">{wf.name}</p>
                  <p className="text-technical-xs text-on-surface-variant mt-0.5">{wf.desc}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-technical-xs rounded ${wf.active ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                {wf.active ? 'Active' : 'Paused'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
              <div className="flex items-center gap-3 text-technical-xs text-on-surface-variant">
                <span>{wf.runs} runs</span>
                <span>Last: {wf.last}</span>
              </div>
              <button className="flex items-center gap-1 px-2 py-1 text-technical-xs rounded bg-surface-variant hover:bg-surface-variant/80 transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">{wf.active ? 'pause' : 'play_arrow'}</span>
                {wf.active ? 'Pause' : 'Resume'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-xl text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-headline-md text-on-surface mb-2">Workflow Canvas</h3>
          <p className="text-body-md text-on-surface-variant mb-4">
            Drag and drop triggers, conditions, and actions to build powerful automation pipelines.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {categories.map((cat) => (
              <div key={cat.label} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <p className="text-label-md text-on-surface mb-2">{cat.label}</p>
                {cat.items.map((item) => (
                  <span key={item} className="block px-2 py-1 text-[10px] rounded bg-surface-variant/50 text-on-surface-variant mb-1 hover:bg-primary/10 hover:text-primary transition-colors cursor-grab">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
