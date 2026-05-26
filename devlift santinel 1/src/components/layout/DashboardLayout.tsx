import { Outlet, NavLink } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import TopBar from '../ui/TopBar'

const mobileNavItems = [
  { to: '/', icon: 'terminal', label: 'Command' },
  { to: '/agents', icon: 'robot_2', label: 'Agents' },
  { to: '/alerts', icon: 'notifications_active', label: 'Alerts' },
  { to: '/workflows', icon: 'schema', label: 'Workflows' },
  { to: '/settings', icon: 'menu', label: 'More' },
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          <Outlet />
        </main>
      </div>
      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 bg-background/80 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50 rounded-t-full">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all duration-150 ${
                isActive
                  ? 'text-primary scale-110'
                  : 'text-on-surface-variant/60'
              }`
            }
          >
            <span className="material-symbols-outlined" style={item.to === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-label-md mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
