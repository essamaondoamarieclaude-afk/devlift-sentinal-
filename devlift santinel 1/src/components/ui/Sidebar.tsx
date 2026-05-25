import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Activity, BarChart3, Bell, Workflow, MessageSquare,
  Settings, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents', icon: Activity, label: 'AI Agents' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/workflows', icon: Workflow, label: 'Workflows' },
  { to: '/communications', icon: MessageSquare, label: 'Communications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen bg-sentinel-bg border-r border-sentinel-border flex flex-col shrink-0 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sentinel-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sentinel-cyan to-sentinel-purple flex items-center justify-center shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-bold text-sentinel-text-primary">Devlift</p>
            <p className="text-[10px] text-sentinel-text-muted tracking-wider uppercase">Sentinel</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-sentinel-cyan/10 text-sentinel-cyan border border-sentinel-cyan/20'
                  : 'text-sentinel-text-muted hover:text-sentinel-text-primary hover:bg-sentinel-surface'
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && (
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sentinel-border text-sentinel-text-muted hover:text-sentinel-text-primary transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  )
}
