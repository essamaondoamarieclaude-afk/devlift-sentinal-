import { useState } from 'react'

const auditLogs = [
  { time: '[2023-11-24 14:22:11]', tag: 'AUTH_EVENT', tagColor: 'text-secondary', msg: 'User AlexVanguard modified Autonomy Protocol: LEVEL_3 -> LEVEL_4' },
  { time: '[2023-11-24 14:15:02]', tag: 'SYS_DEPLOY', tagColor: 'text-[#00e676]', msg: 'MCP Integration "PostgreSQL" successfully re-synced' },
  { time: '[2023-11-24 13:45:59]', tag: 'CRIT_WARN', tagColor: 'text-error', msg: 'Rate limit approaching on API_CLUSTER_G2 (92% capacity)' },
  { time: '[2023-11-24 12:01:44]', tag: 'AUTH_EVENT', tagColor: 'text-secondary', msg: 'API Key generated for SERVICE_ACCOUNT_BETA' },
  { time: '[2023-11-24 11:30:22]', tag: 'INFO_MSG', tagColor: 'text-on-surface-variant', msg: 'Automatic cleanup of 452 cached vector embeddings complete' },
  { time: '[2023-11-24 10:44:09]', tag: 'AUTH_EVENT', tagColor: 'text-secondary', msg: 'New User sarah.connor@sentinel.ai joined organization' },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('users')

  const sections = [
    { id: 'users', label: 'User Management', icon: 'person' },
    { id: 'autonomy', label: 'Autonomy Protocols', icon: 'bolt' },
    { id: 'integrations', label: 'MCP Integrations', icon: 'wifi' },
    { id: 'billing', label: 'Resource Consumption', icon: 'payments' },
    { id: 'audit', label: 'System Audit Trail', icon: 'assignment' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="mb-4">
        <h2 className="text-headline-lg text-on-surface mb-2">Governance & Settings</h2>
        <p className="text-body-lg text-on-surface-variant">Global infrastructure controls and enterprise security configurations.</p>
      </section>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/20 pb-2 overflow-x-auto no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-3 text-label-md transition-all whitespace-nowrap rounded-lg ${
              activeSection === s.id
                ? 'bg-secondary-container/20 text-primary border-l-4 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* User Management */}
      {activeSection === 'users' && (
        <div className="glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-md text-primary">User Management</h3>
            <button className="bg-primary text-on-primary-fixed text-label-md px-4 py-2 rounded shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person_add</span>
              INVITE USER
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-outline-variant/30">
                <tr className="text-technical-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-4 px-2">Identity</th>
                  <th className="pb-4 px-2">RBAC Permission</th>
                  <th className="pb-4 px-2">Assigned Agents</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { name: 'Alex Vanguard', email: 'alex@sentinel.ai', role: 'ROOT_ADMIN', roleBg: 'bg-secondary-container/30', roleText: 'text-secondary', agents: '12 Active', status: 'ONLINE', statusColor: 'bg-[#00e676]' },
                  { name: 'Sarah Connor', email: 's.connor@sentinel.ai', role: 'OPERATOR', roleBg: 'bg-surface-container-highest', roleText: 'text-on-surface-variant', agents: '4 Active', status: 'OFFLINE', statusColor: 'bg-surface-variant' },
                ].map((user) => (
                  <tr key={user.email} className="hover:bg-primary/5 transition-colors group">
                    <td className="py-4 px-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-body-md text-on-surface">{user.name}</div>
                        <div className="text-technical-xs text-on-surface-variant">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded text-technical-xs ${user.roleBg} ${user.roleText} border border-secondary/20`}>{user.role}</span>
                    </td>
                    <td className="py-4 px-2 text-technical-sm">{user.agents}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.statusColor} ${user.status === 'ONLINE' ? 'shadow-[0_0_8px_#00e676]' : ''}`} />
                        <span className="text-technical-xs">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">more_vert</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Autonomy Protocols */}
      {activeSection === 'autonomy' && (
        <div className="glass-panel rounded-xl p-6 ai-intent-strip">
          <h3 className="text-headline-md text-secondary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">bolt</span>
            Autonomy Protocols
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-label-md text-on-surface">LLM AGENCY THRESHOLD</label>
                <span className="text-technical-sm text-primary">LVL 4/5</span>
              </div>
              <input className="w-full h-1 rounded-lg cursor-pointer accent-primary" max="5" min="1" type="range" defaultValue="4" />
              <p className="text-technical-xs text-on-surface-variant">Allows agents to initiate sub-workflows without manual confirmation.</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-label-md text-on-surface">DATA PERSISTENCE</label>
                <span className="text-technical-sm text-secondary">EPHEMERAL</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-secondary-container/20 border border-secondary text-secondary text-label-md rounded">Strict</button>
                <button className="flex-1 py-2 bg-surface-container-highest border border-outline-variant text-on-surface-variant text-label-md rounded">Standard</button>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md">SAFETY LOCKDOWN</span>
                <div className="w-12 h-6 rounded-full bg-error-container/30 border border-error/50 flex items-center px-1">
                  <div className="w-4 h-4 rounded-sm bg-error" />
                </div>
              </div>
              <p className="text-technical-xs text-error/80 uppercase">Immediate termination of all non-essential agent processes.</p>
            </div>
          </div>
        </div>
      )}

      {/* MCP Integrations */}
      {activeSection === 'integrations' && (
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-headline-md text-on-surface mb-6">MCP Integrations</h3>
          <div className="space-y-4">
            {[
              { name: 'PostgreSQL Vector Extension', version: 'v2.4.1', icon: 'database', connected: true },
              { name: 'GitHub Workflow Bridge', version: 'Awaiting Handshake...', icon: 'cloud_sync', iconColor: 'text-secondary', connected: false },
            ].map((mcp) => (
              <div key={mcp.name} className="flex items-center justify-between p-4 bg-surface-container/40 border border-outline-variant/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-surface-container-highest rounded">
                    <span className={`material-symbols-outlined ${mcp.iconColor || 'text-primary'}`}>{mcp.icon}</span>
                  </div>
                  <div>
                    <div className="text-label-md">{mcp.name}</div>
                    <div className="text-technical-xs text-on-surface-variant">Connected: {mcp.version}</div>
                  </div>
                </div>
                {mcp.connected ? (
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing */}
      {activeSection === 'billing' && (
        <div className="glass-panel rounded-xl p-6 border-primary/20">
          <h3 className="text-headline-md text-on-surface mb-6">Resource Consumption</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-lg">
              <div className="text-technical-xs text-on-surface-variant mb-1">CURRENT CYCLE COST</div>
              <div className="text-headline-md text-primary">$4,281.04</div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg">
              <div className="text-technical-xs text-on-surface-variant mb-1">TOTAL TOKENS</div>
              <div className="text-headline-md text-secondary">842M</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-technical-xs mb-2">
              <span className="text-on-surface-variant">QUOTA USAGE (BETA-NODE)</span>
              <span className="text-on-surface">78%</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary w-[78%]" />
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {activeSection === 'audit' && (
        <div className="glass-panel rounded-xl p-6 border-t-2 border-primary">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-md text-on-surface">System Audit Trail</h3>
            <div className="flex gap-2">
              <button className="text-technical-sm px-3 py-1 border border-outline-variant rounded hover:bg-surface-variant/20 transition-all">EXPORT .CSV</button>
              <button className="text-technical-sm px-3 py-1 border border-outline-variant rounded hover:bg-surface-variant/20 transition-all">FILTER</button>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg text-technical-sm border border-outline-variant/20 max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-primary opacity-50 shrink-0">{log.time}</span>
                  <span className={`${log.tagColor} shrink-0`}>{log.tag}</span>
                  <span className="text-on-surface">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
