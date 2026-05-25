import { useState } from 'react'
import { useAlerts } from '../hooks/useDashboardData'
import AlertCard from '../components/ui/AlertCard'
import IncidentDrawer from '../components/ui/IncidentDrawer'
import GlassCard from '../components/ui/GlassCard'
import Badge from '../components/ui/Badge'
import { Loader2, Bell, Filter } from 'lucide-react'
import type { Alert } from '../types'

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts()
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filter, setFilter] = useState<string>('all')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-sentinel-cyan" />
      </div>
    )
  }

  const filtered = alerts?.filter((a) => filter === 'all' || a.priority === filter) || []
  const openCount = alerts?.filter((a) => a.status === 'open').length || 0
  const criticalCount = alerts?.filter((a) => a.priority === 'critical').length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sentinel-text-primary">Alerts & Incident Center</h1>
          <p className="text-sm text-sentinel-text-muted mt-1">Centralized operational incident management</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="error" size="md" pulse>{criticalCount} critical</Badge>
          <Badge variant="warning" size="md">{openCount} open</Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-sentinel-cyan/10 text-sentinel-cyan border border-sentinel-cyan/20'
                : 'text-sentinel-text-muted hover:text-sentinel-text-primary'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-sentinel-text-muted hover:text-sentinel-text-primary transition-colors">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} onClick={() => setSelectedAlert(alert)} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center">
          <Bell size={32} className="mx-auto mb-3 text-sentinel-text-muted" />
          <p className="text-sm text-sentinel-text-muted">All clear — no {filter !== 'all' ? filter : ''} alerts</p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="mt-2 text-xs text-sentinel-cyan hover:underline">View all</button>
          )}
        </GlassCard>
      )}

      <IncidentDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  )
}
