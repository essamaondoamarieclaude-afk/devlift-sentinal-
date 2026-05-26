import { NavLink } from 'react-router-dom'

export default function TopBar() {

  return (
    <header className="bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_15px_rgba(0,212,255,0.1)] flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        <h1 className="text-headline-md font-bold tracking-tight text-primary-container">Sentinel Command</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <NavLink to="/" end className={({ isActive }) => `text-label-md cursor-pointer transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Dashboard</NavLink>
        <NavLink to="/agents" className={({ isActive }) => `text-label-md cursor-pointer transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Agent Monitor</NavLink>
        <NavLink to="/workflows" className={({ isActive }) => `text-label-md cursor-pointer transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Workflows</NavLink>
      </nav>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/30">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-primary pulse-ring absolute" />
            <div className="w-2 h-2 rounded-full bg-primary relative" />
          </div>
          <span className="text-technical-xs text-primary">NODE-01 ACTIVE</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center bg-secondary-container">
          <span className="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
        </div>
      </div>
    </header>
  )
}
