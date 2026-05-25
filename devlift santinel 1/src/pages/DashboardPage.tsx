import { useDashboardData, useAgents, useAlerts } from '../hooks/useDashboardData'
import GlassCard from '../components/ui/GlassCard'
import KPICard from '../components/ui/KPICard'
import HealthScore from '../components/ui/HealthScore'
import RevenueChart from '../components/ui/RevenueChart'
import AgentFlowDiagram from '../components/ui/AgentFlowDiagram'
import AIInsightPanel from '../components/ui/AIInsightPanel'
import PredictiveAlerts from '../components/ui/PredictiveAlerts'
import AlertCard from '../components/ui/AlertCard'
import { motion } from 'framer-motion'
import { Loader2, Bell } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { data: dashboard, isLoading: dashLoading } = useDashboardData()
  const { data: agents } = useAgents()
  const { data: alerts } = useAlerts()
  const navigate = useNavigate()
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([])

  if (dashLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-sentinel-cyan" />
      </div>
    )
  }

  const predictiveAlerts = alerts?.slice(0, 2).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    confidence: a.priority === 'critical' ? 0.94 : 0.78,
    timeToImpact: a.priority === 'critical' ? '18 hours' : '2 hours',
    severity: a.priority === 'critical' ? 'high' as const : 'medium' as const,
  })) || []

  const agentTimeline = agents?.map((a) => ({
    name: a.name,
    task: a.currentTask,
    time: a.lastActive,
    status: a.status,
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sentinel-text-primary">Operations Dashboard</h1>
          <p className="text-sm text-sentinel-text-muted mt-1">Real-time business intelligence and AI-driven operations</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-sentinel-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-sentinel-green status-active" />
          Live monitoring
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {dashboard && (
          <>
            <div className="lg:col-span-1">
              <HealthScore score={dashboard.score} trend={dashboard.trend} />
            </div>
            {dashboard.kpis.slice(0, 3).map((kpi, i) => (
              <KPICard key={kpi.label} kpi={kpi} index={i} />
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-4">
          <AIInsightPanel />
          <PredictiveAlerts
            alerts={predictiveAlerts}
            onResolve={(id) => setResolvedAlerts([...resolvedAlerts, id])}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AgentFlowDiagram />
        </div>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-sentinel-text-primary">Agent Activity</h3>
            <button onClick={() => navigate('/agents')} className="text-[10px] text-sentinel-cyan hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {agentTimeline.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-sentinel-bg/50"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  a.status === 'active' ? 'bg-sentinel-green status-active' :
                  a.status === 'processing' ? 'bg-sentinel-cyan status-active' : 'bg-sentinel-text-muted'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sentinel-text-primary truncate">{a.task}</p>
                  <p className="text-[10px] text-sentinel-text-muted">{a.name}</p>
                </div>
                <span className="text-[10px] text-sentinel-text-muted">
                  {Math.floor((Date.now() - new Date(a.time).getTime()) / 1000)}s ago
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-sentinel-text-primary">Active Incidents</h2>
          <button onClick={() => navigate('/alerts')} className="text-xs text-sentinel-cyan hover:underline">View all alerts</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts?.slice(0, 4).map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} onClick={() => navigate('/alerts')} />
          ))}
        </div>
        {(!alerts || alerts.length === 0) && (
          <GlassCard className="p-8 text-center">
            <Bell size={24} className="mx-auto mb-2 text-sentinel-text-muted" />
            <p className="text-sm text-sentinel-text-muted">No active incidents</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
