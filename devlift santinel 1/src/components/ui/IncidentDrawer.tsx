import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Badge from './Badge'
import type { Alert } from '../../types'

interface IncidentDrawerProps {
  alert: Alert | null
  onClose: () => void
}

export default function IncidentDrawer({ alert, onClose }: IncidentDrawerProps) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[420px] bg-sentinel-surface border-l border-sentinel-border z-50 overflow-y-auto"
        >
          <div className="p-4 border-b border-sentinel-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={alert.priority === 'critical' ? 'error' : alert.priority === 'high' ? 'warning' : 'info'}>
                {alert.priority.toUpperCase()}
              </Badge>
              <Badge variant="default">{alert.alertType}</Badge>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sentinel-border transition-colors">
              <X size={16} className="text-sentinel-text-muted" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-sentinel-text-primary">{alert.title}</h2>
              <p className="text-xs text-sentinel-text-secondary mt-2">{alert.description}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-sentinel-text-muted">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Created {Math.floor((Date.now() - new Date(alert.createdAt).getTime()) / 60000)}m ago</span>
              </div>
              {alert.slaDeadline && (
                <div className="flex items-center gap-1">
                  <AlertTriangle size={12} className="text-sentinel-orange" />
                  <span>SLA: {Math.floor((new Date(alert.slaDeadline).getTime() - Date.now()) / 60000)}m remaining</span>
                </div>
              )}
            </div>

            {alert.aiResolution && (
              <div className="p-3 rounded-lg bg-sentinel-purple/10 border border-sentinel-purple/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle size={12} className="text-sentinel-purple" />
                  <span className="text-xs font-medium text-sentinel-purple">AI Resolution</span>
                </div>
                <p className="text-xs text-sentinel-text-secondary">{alert.aiResolution}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-sentinel-cyan/10 text-sentinel-cyan hover:bg-sentinel-cyan/20 transition-colors">
                Execute Resolution
              </button>
              <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-sentinel-border text-sentinel-text-secondary hover:bg-sentinel-border/80 transition-colors">
                Escalate
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
