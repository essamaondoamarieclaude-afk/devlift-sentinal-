import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/agents', icon: 'monitoring', label: 'Agent Monitor' },
  { to: '/analytics', icon: 'query_stats', label: 'Analytics' },
  { to: '/alerts', icon: 'emergency_home', label: 'Incidents' },
  { to: '/workflows', icon: 'account_tree', label: 'Workflows' },
  { to: '/communications', icon: 'quick_phrases', label: 'Inbox' },
]

const bottomItems = [
  { to: '/settings?tab=security', icon: 'security', label: 'Governance' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-screen w-80 fixed left-0 top-0 z-[60] bg-surface-container-lowest border-r border-outline-variant/20 shadow-2xl">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <div>
            <h2 className="text-label-md text-primary tracking-widest uppercase">Admin Console</h2>
            <p className="text-technical-xs text-on-surface-variant">Sentinel Node-01</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-all rounded ${
                  isActive
                    ? 'bg-secondary-container/20 text-primary border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-8 pb-4">
            <span className="px-4 text-technical-xs text-on-surface-variant/40 uppercase tracking-tighter">System Control</span>
          </div>
          {bottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-all rounded ${
                  isActive
                    ? 'bg-secondary-container/20 text-primary border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-variant/10'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <div className="bg-surface-container-high/50 p-4 rounded-xl border border-outline-variant/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-technical-xs text-on-surface-variant">NODE STATUS</span>
            <span className="text-technical-xs text-primary animate-pulse">ACTIVE</span>
          </div>
          <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary w-4/5" />
          </div>
        </div>
      </div>
    </aside>
  )
}
