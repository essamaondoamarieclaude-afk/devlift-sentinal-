import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, business, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/agents', label: 'Agent Monitor', icon: 'monitoring' },
    { path: '/analytics', label: 'Analytics', icon: 'query_stats' },
    { path: '/incidents', label: 'Incidents & Alerts', icon: 'emergency_home' },
    { path: '/workflows', label: 'Workflow Builder', icon: 'account_tree' },
    { path: '/inbox', label: 'Inbox & Comms', icon: 'quick_phrases' },
    { path: '/settings', label: 'Governance & Settings', icon: 'security' },
  ] as const;

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const currentTab = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-200 min-w-0">
      
      <div className="fixed inset-0 animated-grid pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0e131f] via-transparent to-cyan-500/5 pointer-events-none z-0"></div>

      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-[#1e2d40]/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[#00d4ff] text-2xl font-fill group-hover:scale-110 transition-transform">hub</span>
            <h1 className="text-lg font-bold font-sans tracking-tight text-white bg-clip-text">
              Sentinel Command
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-full ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#00d4ff] font-medium tracking-wide uppercase">Node-01 Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-right font-mono text-[10px] text-slate-400 space-y-0.5">
            <span className="text-cyan-400 font-semibold uppercase">UTC {liveTime.toISOString().slice(11, 19)}</span>
            <span className="text-slate-500 uppercase text-[8px] tracking-wider font-medium">{business?.name ?? 'Enterprise'}</span>
          </div>

          <div className="h-px w-6 bg-slate-800 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2.5 cursor-pointer group hover:bg-[#161b27] px-2 py-1.5 rounded-lg transition-colors"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNvtOydJawg9c41q-ht2b5mb3U71sep565jHdUMaKqYZGcHrJea63_vprVceoT-nILRrPcOBPZcaYyyj67d3D3Zicvb_WCcTYEBrSPtBhIegjdbJ-LBsEIbSUdWzVOWi8mKW2KwXMpvajRaAUx20tQlne9Ip4oTAYagEvnkR7eoR9AKFdH8ZItTAqCztoc36ZtQfZwvX3FEY0A2-EbanAoHSdgrzND5-no7S3Bl97C0FpzFhIpvXNeMyscg57U1bzQ4m-jIUeDjF-B"
                alt="Profile avatar"
                className="w-7 h-7 rounded-lg border border-cyan-400/40 object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-[#00d4ff]">Admin Console</span>
                <span className="text-[9px] font-mono text-slate-500">{user?.email?.split('@')[0] ?? 'admin'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
              title="Logout Session"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 min-w-0">
        
        <aside 
          className={`hidden md:flex flex-col bg-[#050811]/95 border-r border-[#1e2d40]/40 shadow-2xl h-[calc(100vh-64px)] fixed left-0 top-16 z-40 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-900">
            {sidebarOpen ? (
              <div className="flex flex-col">
                <span className="text-xs font-mono font-semibold text-[#00d4ff]">ADMIN PANEL</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium">Command Tower</span>
              </div>
            ) : null}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-[#161b27] text-slate-400 hover:text-[#00d4ff] rounded-lg transition-colors ml-auto"
            >
              <span className="material-symbols-outlined text-lg">
                {sidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 min-w-0">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs leading-none transition-all cursor-pointer font-medium min-w-0 ${
                    active
                      ? 'bg-cyan-500/10 text-[#00d4ff] border-l-2 border-[#00d4ff] font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#161b27]/60'
                  }`}
                >
                  <span className={`material-symbols-outlined text-base ${active ? 'font-fill' : ''}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span className="translate-y-[1px] truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {sidebarOpen && (
            <div className="p-4 border-t border-slate-900 m-2 rounded-xl bg-slate-950/40 border border-[#1e2d40]/30">
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500">
                <span>NODE HEALTH</span>
                <span className="text-emerald-400 font-semibold">98% OPTIMAL</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          )}
        </aside>

        <main className={`flex-1 min-h-[calc(100vh-64px)] z-10 p-4 md:p-8 pb-24 md:pb-12 min-w-0 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        } transition-all duration-300`}>
          <Outlet />
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 px-3 bg-[#050811]/90 backdrop-blur-xl border-t border-[#1e2d40]/60 flex items-center justify-around z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
          {navItems.slice(0, 5).map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  active 
                    ? 'text-[#00d4ff] scale-110 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${active ? 'font-fill' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] tracking-tight">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
          <button
            onClick={() => navigate(currentTab === 'settings' ? '/' : '/settings')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              currentTab === 'settings' 
                ? 'text-[#00d4ff] scale-110 font-semibold' 
                : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu</span>
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
