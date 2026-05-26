import { useState, FormEvent } from 'react';
import { useAuditStore } from '../stores/auditStore';

interface SettingsUser {
  name: string;
  email: string;
  role: 'ROOT_ADMIN' | 'OPERATOR' | 'VIEWER';
  agents: string;
  status: 'ONLINE' | 'OFFLINE';
  avatar: string;
}

export default function SettingsScreen() {
  const { logs, addLog } = useAuditStore();

  const [users, setUsers] = useState<SettingsUser[]>([
    {
      name: 'Alex Vanguard',
      email: 'alex@sentinel.ai',
      role: 'ROOT_ADMIN',
      agents: '12 Active',
      status: 'ONLINE',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5zcvJxNd_60sPvcqv7dnwYdhr2cwK9Ts1srkBhWjZZnoOwYOau7JdSbZ-ibJrJB-O9sEHuD5uzVRX2TglU0NMytLVF36DMDnpjrKcLD6JsafhWL8BraHgmEaldo2nufXpIXXyoeLq-KcFXUkiGbnVkabk_3eNFMardhJdjS2YFXyBWVU3QuTfLHp1FdazaJIJVhMezOaLWVrq-uJyfpW0jBQfAcI5tqeeAu99WhpG1_ADnAcSr9niLEPbTYWxFidGpKLLJ4F0YFK2',
    },
    {
      name: 'Sarah Connor',
      email: 's.connor@sentinel.ai',
      role: 'OPERATOR',
      agents: '4 Active',
      status: 'OFFLINE',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCghC7Cp9KH1kyHX9NcKrMZXClMrbXerierfLsE_0XFEQ3mUZ9Qt7APNMw21PIzcGWrxv3UqfHBLsjegSKzTshFiAi1JNiLoqj73MIhWR3oKtAAppPwC64HKgwBN8uhmUCDryMugogfldUY41se3YVVHZRlJhxJgsKm1FuCBHTQcYt9uQ913BLsmbjllhRDoJIadh9PXj5lZbr9PsIJ_aRO6jJA3tx8Se9avL1t0lT8zRwvoSbHNRjMkaEr9CewhwbtVj_WLRxvna3p',
    },
  ]);

  const [dur, setDur] = useState(4);
  const [persistence, setPersistence] = useState<'strict' | 'standard'>('strict');
  const [safetyLock, setSafetyLock] = useState(false);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ROOT_ADMIN' | 'OPERATOR' | 'VIEWER'>('OPERATOR');

  const handleInviteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newUser: SettingsUser = {
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      agents: '0 Active',
      status: 'ONLINE',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNvtOydJawg9c41q-ht2b5mb3U71sep565jHdUMaKqYZGcHrJea63_vprVceoT-nILRrPcOBPZcaYyyj67d3D3Zicvb_WCcTYEBrSPtBhIegjdbJ-LBsEIbSUdWzVOWi8mKW2KwXMpvajRaAUx20tQlne9Ip4oTAYagEvnkR7eoR9AKFdH8ZItTAqCztoc36ZtQfZwvX3FEY0A2-EbanAoHSdgrzND5-no7S3Bl97C0FpzFhIpvXNeMyscg57U1bzQ4m-jIUeDjF-B',
    };

    setUsers(prev => [...prev, newUser]);
    addLog('AUTH_EVENT', `New User ${inviteEmail} invited to organization as ${inviteRole}`, '#cabeff');
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('OPERATOR');
  };

  const handleSafetyLockToggle = () => {
    const nextState = !safetyLock;
    setSafetyLock(nextState);

    if (nextState) {
      addLog('CRIT_WARN', 'SAFETY LOCKDOWN PROTOCOL INITIATED. TERMINATING NON-ESSENTIAL CONTAINERS.', '#ff5555');
      alert("CRITICAL WARNING: Safety lockdown issued. Non-essential agent subtasks suspended.");
    } else {
      addLog('SYSTEM', 'Safety lockdown overridden. Sentinel processes restoring nominal baseline.', '#00ff88');
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      
      <section className="mb-8 min-w-0">
        <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Governance & Settings</h2>
        <p className="text-xs text-slate-400 mt-1 break-words">Global infrastructure controls, user permission configurations, and system audit logs.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">

        <div className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-xl min-w-0 overflow-hidden">
          <div className="flex justify-between items-center mb-6 min-w-0">
            <h3 className="text-sm font-semibold text-[#00d4ff] uppercase tracking-wider font-mono">User Management Database</h3>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg cyan-glow shrink-0"
            >
              <span className="material-symbols-outlined text-sm font-fill">person_add</span>
              Invite User
            </button>
          </div>

          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                  <th className="pb-3 px-2">Identity Credentials</th>
                  <th className="pb-3 px-2">RBAC Permission</th>
                  <th className="pb-3 px-2">Assigned Agent Loads</th>
                  <th className="pb-3 px-2">Diagnostic State</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((val, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={val.avatar} 
                          alt="Avatar profile view" 
                          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-200 truncate">{val.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{val.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] tracking-wide border ${
                        val.role === 'ROOT_ADMIN' 
                          ? 'bg-purple-950/20 text-[#cabeff] border-purple-500/20' 
                          : 'bg-slate-900 text-slate-400 border-slate-850'
                      }`}>
                        {val.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-mono text-slate-300">{val.agents}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <div className={`w-2 h-2 rounded-full ${
                          val.status === 'ONLINE' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'
                        }`} />
                        <span>{val.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right text-slate-500">
                      <span className="material-symbols-outlined text-sm cursor-pointer hover:text-cyan-400">more_vert</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-panel p-6 rounded-xl border-l-2 border-l-[#cabeff] flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="space-y-6 min-w-0">
            <h3 className="text-sm font-semibold text-[#cabeff] uppercase tracking-widest font-mono flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base font-fill">bolt</span>
              Autonomy Protocols
            </h3>

            <div className="space-y-3 min-w-0">
              <div className="flex justify-between items-end font-mono text-[10px]">
                <label className="text-slate-200">LLM AGENCY THRESHOLD</label>
                <span className="text-cyan-400 font-bold">LEVEL {dur}/5</span>
              </div>
              <input 
                type="range" 
                max={5} 
                min={1} 
                className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer accent-cyan-400"
                value={dur}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDur(val);
                  addLog('AUTH_EVENT', `LLM autonomy threshold shifted to LEVEL ${val}/5`, '#cabeff');
                }}
              />
              <p className="text-[10px] text-slate-400 leading-normal font-sans break-words">
                Allows Sentinel agents to initiate sub-workflows without requiring manual commander confirmations.
              </p>
            </div>

            <div className="space-y-2.5 min-w-0">
              <div className="flex justify-between items-end font-mono text-[10px]">
                <label className="text-slate-200">DATA SECURE PERSISTENCE</label>
                <span className="text-[#cabeff] font-bold">{persistence.toUpperCase()}</span>
              </div>
              <div className="flex gap-2 font-mono text-[11px] font-bold">
                <button 
                  onClick={() => setPersistence('strict')}
                  className={`flex-1 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    persistence === 'strict' 
                      ? 'bg-purple-950/20 text-[#cabeff] border-purple-500/40' 
                      : 'bg-slate-900 text-slate-500 border-transparent'
                  }`}
                >
                  Strict
                </button>
                <button 
                  onClick={() => setPersistence('standard')}
                  className={`flex-1 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    persistence === 'standard' 
                      ? 'bg-[#00d4ff]/10 text-cyan-400 border-cyan-400/20' 
                      : 'bg-slate-900 text-slate-500 border-transparent'
                  }`}
                >
                  Standard
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 mt-6 md:mt-0 min-w-0">
            <div className="flex items-center justify-between mb-3 text-[10px] font-mono leading-none">
              <span className="text-slate-200 font-bold uppercase">Emergency Safety Lockdown</span>
              
              <button 
                onClick={handleSafetyLockToggle}
                className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer shrink-0 ${
                  safetyLock ? 'bg-red-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-sm bg-white transition-transform ${safetyLock ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
            <p className="text-[9.5px] text-red-400 font-mono uppercase font-bold tracking-wide break-words">
              Immediate termination override of all active agent subtasks.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-xl space-y-4 min-w-0 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 font-sans">Connected MCP Integrations</h3>
          
          <div className="space-y-3 min-w-0">
            
            <div className="flex items-center justify-between p-4 bg-[#0a0e1a]/85 border border-slate-850 rounded-lg min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded shrink-0">
                  <span className="material-symbols-outlined text-cyan-400 text-sm">database</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">PostgreSQL Vector Extension</h4>
                  <p className="text-[10px] font-mono text-slate-500 truncate">Connected: v2.4.1 partition baseline</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-cyan-400 text-base font-fill shrink-0">check_circle</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0a0e1a]/85 border border-slate-850 rounded-lg min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded shrink-0">
                  <span className="material-symbols-outlined text-[#cabeff] text-sm">cloud_sync</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">GitHub Workflow Bridge</h4>
                  <p className="text-[10px] font-mono text-slate-500 truncate">Establishing handshake link...</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#cabeff] animate-pulse shrink-0"></span>
            </div>

          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between min-w-0 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 font-sans">Resource Ingestion Consumption</h3>
          
          <div className="grid grid-cols-2 gap-4 min-w-0">
            <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-lg min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Current billing cycle</span>
              <p className="text-lg font-bold font-mono text-[#00d4ff] mt-1 break-words">$4,281.04</p>
            </div>
            
            <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-lg min-w-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Token Volume Ingest</span>
              <p className="text-lg font-bold font-mono text-[#cabeff] mt-1 break-words">842M</p>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex justify-between font-mono text-[9px] text-slate-550 font-bold tracking-wider">
              <span>QUOTA USAGE CAPACITY INDEX (BETA-NODE-01)</span>
              <span className="text-slate-300 shrink-0">78% CAPACITY LIMIT</span>
            </div>
            <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#7c5cff]" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 glass-panel p-6 rounded-xl border-t-2 border-t-[#00d4ff] space-y-4 min-w-0 overflow-hidden">
          <div className="flex justify-between items-center min-w-0">
            <h3 className="text-sm font-semibold text-slate-200 font-sans">System Audit Trail</h3>
            <div className="flex gap-2 shrink-0">
              <button className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-[10px] font-mono font-bold hover:bg-slate-800 rounded cursor-pointer">EXPORT.CSV</button>
              <button className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-[10px] font-mono font-bold hover:bg-slate-800 rounded cursor-pointer">FILTER</button>
            </div>
          </div>

          <div className="bg-[#050811] p-5 border border-slate-900 rounded-lg font-mono text-[10.5px] leading-relaxed select-text space-y-2 max-h-60 overflow-y-auto no-scrollbar min-w-0">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-4 min-w-0">
                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                <span className="font-bold shrink-0" style={{ color: log.color }}>{log.category}</span>
                <span className="text-slate-300 break-words">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-[#050811]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel border-[#cabeff]/30 w-full max-w-md p-6 rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-0">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-6 animate-fade-in min-w-0">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cabeff] font-fill">person_add</span>
                Invite Command Operator
              </h3>
              <p className="text-xs text-slate-400 mt-1 break-words">
                Grant secure RBAC cryptographic credentials to register on Sentinel Command center.
              </p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 min-w-0">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Operator Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Sarah Connor" 
                  className="w-full bg-[#0a0e1a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#cabeff] font-sans"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Work Email</label>
                <input 
                  type="email" 
                  placeholder="e.g., s.connor@sentinel.ai" 
                  className="w-full bg-[#0a0e1a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#cabeff] font-mono"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">RBAC Permission Role</label>
                <select 
                  className="w-full bg-[#0a0e1a] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#cabeff] font-sans"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                >
                  <option value="ROOT_ADMIN">ROOT_ADMIN</option>
                  <option value="OPERATOR">OPERATOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#cabeff] hover:brightness-110 text-[#0c101b] font-bold text-xs uppercase rounded-lg tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(202,190,255,0.3)]"
                >
                  Confirm Cryptographic Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
