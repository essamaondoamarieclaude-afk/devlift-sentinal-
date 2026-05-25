import { Bell, Search, HelpCircle, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export default function TopBar() {
  const { user, business, logout } = useAuthStore()

  return (
    <header className="h-16 border-b border-sentinel-border bg-sentinel-bg/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sentinel-text-muted" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-64 pl-9 pr-3 py-2 text-xs rounded-lg bg-sentinel-surface border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell size={18} className="text-sentinel-text-muted hover:text-sentinel-text-primary cursor-pointer transition-colors" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center text-white">3</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-sentinel-surface transition-colors">
          <HelpCircle size={18} className="text-sentinel-text-muted hover:text-sentinel-text-primary" />
        </button>
        <div className="h-6 w-px bg-sentinel-border" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sentinel-cyan to-sentinel-purple flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-sentinel-text-primary">{user?.name || 'User'}</p>
            <p className="text-[10px] text-sentinel-text-muted">{business?.name || 'Devlift'}</p>
          </div>
        </div>
        <button onClick={logout} className="p-2 rounded-lg hover:bg-sentinel-surface transition-colors" title="Logout">
          <LogOut size={16} className="text-sentinel-text-muted hover:text-red-400" />
        </button>
      </div>
    </header>
  )
}
