export default function TopBar() {

  return (
    <header className="bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_15px_rgba(0,212,255,0.1)] flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        <h1 className="text-headline-md font-bold tracking-tight text-primary-container">Sentinel Command</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a className="text-primary font-bold text-label-md cursor-pointer transition-colors duration-200" href="/">Dashboard</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md cursor-pointer" href="/agents">Agent Monitor</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md cursor-pointer" href="/workflows">Workflows</a>
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
