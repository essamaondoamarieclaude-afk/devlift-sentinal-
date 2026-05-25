import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMCPConnections } from '../hooks/useDashboardData'
import GlassCard from '../components/ui/GlassCard'
import MCPConnectionCard from '../components/ui/MCPConnectionCard'
import Badge from '../components/ui/Badge'
import { Users, Shield, Wifi, Bell, Sliders, FileText, Activity } from 'lucide-react'

const settingsTabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'MCP Integrations', icon: Wifi },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai-config', label: 'AI Configuration', icon: Sliders },
  { id: 'audit', label: 'Audit Log', icon: FileText },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations')
  const { data: connections } = useMCPConnections()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-sentinel-text-primary">Settings & Admin</h1>
        <p className="text-sm text-sentinel-text-muted mt-1">Platform configuration and governance</p>
      </div>

      <div className="flex gap-2 border-b border-sentinel-border pb-2 overflow-x-auto">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sentinel-cyan/10 text-sentinel-cyan border border-sentinel-cyan/20'
                  : 'text-sentinel-text-muted hover:text-sentinel-text-primary'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-sentinel-text-primary">MCP Server Connections</h2>
              <p className="text-xs text-sentinel-text-muted mt-1">Secure, bidirectional tool connections for all agents</p>
            </div>
            <Badge variant="success" size="md">
              {connections?.filter((c) => c.status === 'connected').length || 0} Connected
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {connections?.map((conn, i) => (
              <MCPConnectionCard key={conn.id} connection={conn} index={i} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai-config' && (
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold text-sentinel-text-primary mb-4">AI Agent Configuration</h2>
          <div className="space-y-6">
            {[
              { agent: 'Monitoring Agent', threshold: 0.5, autonomy: 'Full', description: 'Polling interval: 30s' },
              { agent: 'Intelligence Agent', threshold: 0.7, autonomy: 'Full', description: 'Model: Gemini 2.5 Pro' },
              { agent: 'Execution Agent', threshold: 0.85, autonomy: 'Conditional', description: 'High-risk requires approval' },
              { agent: 'Communication Agent', threshold: 0.6, autonomy: 'Full', description: 'Multi-language: EN/FR/AR/SW' },
            ].map((config, i) => (
              <motion.div
                key={config.agent}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-sentinel-bg/50 border border-sentinel-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-sentinel-text-primary">{config.agent}</p>
                    <p className="text-xs text-sentinel-text-muted">{config.description}</p>
                  </div>
                  <Badge variant={config.autonomy === 'Full' ? 'success' : 'warning'}>{config.autonomy}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-sentinel-text-muted w-24">Risk Threshold</span>
                  <div className="flex-1 h-1.5 rounded-full bg-sentinel-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-sentinel-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${config.threshold * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-sentinel-text-secondary">{config.threshold}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {(activeTab === 'users' || activeTab === 'security' || activeTab === 'notifications' || activeTab === 'audit') && (
        <GlassCard className="p-12 text-center">
          <Activity size={32} className="mx-auto mb-3 text-sentinel-text-muted" />
          <p className="text-sm text-sentinel-text-muted">{activeTab === 'users' ? 'User management' : activeTab === 'security' ? 'Security settings' : activeTab === 'notifications' ? 'Notification preferences' : 'Audit log'} panel coming soon</p>
          <p className="text-xs text-sentinel-text-muted mt-1">Full implementation in Phase 2 rollout</p>
        </GlassCard>
      )}
    </div>
  )
}
