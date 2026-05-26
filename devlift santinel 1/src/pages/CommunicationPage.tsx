import { useState } from 'react'

const conversations = [
  {
    id: 'conv_1', name: 'Alex Rivera', channel: 'mail', channelIcon: 'mail', preview: 'Inquiry regarding the Node-04 deployment failure...',
    time: '2m ago', active: true, badge: 'AI Drafted', badgeIcon: 'translate', badgeLabel: 'ES \u2192 EN',
  },
  {
    id: 'conv_2', name: '+1 (555) 092-11', channel: 'chat', channelIcon: 'chat', channelColor: 'text-green-400',
    preview: 'The system optimization is complete. Ready for phase 2.',
    time: '15m ago', active: false, status: 'done_all', statusLabel: 'Delivered',
  },
  {
    id: 'conv_3', name: 'Operational Unit B', channel: 'sms', channelIcon: 'sms', channelColor: 'text-amber-400',
    preview: 'Awaiting final authorization for local uplink...',
    time: '1h ago', active: false,
  },
]

const messages = [
  { side: 'left', text: 'Estimados compa\u00f1eros, he notado un retraso en la sincronizaci\u00f3n del nodo 4. \u00bfPodr\u00edan revisar los protocolos de enlace?', time: '10:42 AM', translation: true },
  { side: 'right', text: 'Recalibration sequence initiated. Status: 84% complete.', time: '10:55 AM', delivered: true },
]

export default function CommunicationPage() {
  const [activeConv, setActiveConv] = useState(conversations[0].id)

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="material-symbols-outlined text-primary">hub</span>
        <h2 className="text-headline-md font-bold tracking-tight text-primary-container">Communication Center</h2>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-xl border border-outline-variant/20">
        {/* Thread List */}
        <div className="w-full md:w-96 border-r border-outline-variant/20 flex flex-col bg-surface-container-lowest">
          <div className="p-4 space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
              <input className="w-full bg-surface-dim border border-outline-variant/30 rounded px-10 py-2 text-body-md focus:border-primary focus:ring-0 transition-all text-technical-sm" placeholder="Search transmissions..." type="text" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['All', 'WhatsApp', 'Email', 'SMS'].map((ch) => (
                <button key={ch} className="px-3 py-1 bg-primary text-on-primary rounded text-label-md whitespace-nowrap">{ch}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`p-4 cursor-pointer transition-all group ${activeConv === conv.id ? 'bg-secondary-container/10 border-l-4 border-secondary' : 'border-l-4 border-transparent hover:bg-surface-variant/10'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${conv.channelColor || 'text-primary'}`}>{conv.channelIcon}</span>
                    <h3 className="text-body-lg font-semibold text-on-surface">{conv.name}</h3>
                  </div>
                  <span className="text-technical-xs text-primary">{conv.time}</span>
                </div>
                <p className="text-body-md text-on-surface-variant line-clamp-1">{conv.preview}</p>
                {conv.badge && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-secondary/20 text-secondary border border-secondary/30 rounded text-[10px] font-bold uppercase tracking-wider">{conv.badge}</span>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">{conv.badgeIcon}</span>
                    <span className="text-technical-xs text-on-surface-variant">{conv.badgeLabel}</span>
                  </div>
                )}
                {conv.status && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{conv.status}</span>
                    <span className="text-technical-xs text-on-surface-variant">{conv.statusLabel}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col bg-surface-container-low">
          {/* Thread Header */}
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/70 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">AR</div>
              <div>
                <h2 className="text-body-lg font-bold text-on-surface">Alex Rivera</h2>
                <p className="text-technical-xs text-on-surface-variant">arivera@nexus-tech.ai | Project Lead</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-variant/20 rounded transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">videocam</span>
              </button>
              <button className="p-2 hover:bg-surface-variant/20 rounded transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className="p-2 hover:bg-surface-variant/20 rounded transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {messages.map((msg, i) => (
              msg.side === 'left' ? (
                <div key={i} className="flex gap-4 max-w-2xl">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 mt-1 border border-outline-variant/30" />
                  <div className="space-y-2">
                    <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20">
                      <p className="text-body-md text-on-surface">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-technical-xs text-on-surface-variant">{msg.time}</span>
                      {msg.translation && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-surface-variant/30 rounded border border-outline-variant/20">
                          <span className="material-symbols-outlined text-[12px] text-primary">language</span>
                          <span className="text-technical-xs text-on-surface-variant uppercase">Translated from Spanish</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end gap-4">
                  <div className="max-w-xl space-y-1">
                    <div className="bg-primary-container/20 text-on-surface p-4 rounded-xl border border-primary/30">
                      <p className="text-body-md">{msg.text}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-technical-xs text-on-surface-variant">{msg.time}</span>
                      {msg.delivered && (
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* AI Suggested Reply */}
            <div className="flex flex-col items-end gap-3">
              <div className="max-w-2xl w-full bg-secondary-container/10 border-2 border-secondary/50 rounded-xl p-5 relative overflow-hidden" style={{ boxShadow: '0 0 15px rgba(202,190,255,0.25)', borderColor: '#cabeff' }}>
                <div className="absolute top-0 right-0 px-3 py-1 bg-secondary text-on-secondary font-bold text-[10px] uppercase tracking-tighter rounded-bl-lg">
                  AI Proposed Draft
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-technical-xs text-secondary uppercase tracking-widest">Sentinel Intelligence Draft</span>
                </div>
                <p className="text-body-lg text-on-surface leading-relaxed">
                  Hello Alex, thank you for the report. Our monitoring agent detected a 40ms latency spike in the Node-04 synchronization. We are currently recalibrating the uplink protocols. Expected resolution within 15 minutes. Would you like a detailed log once complete?
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-secondary text-on-secondary rounded text-label-md font-bold hover:bg-secondary/90 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">send</span> Send Proposed
                  </button>
                  <button className="px-4 py-2 border border-secondary/40 text-secondary rounded text-label-md font-bold hover:bg-secondary/10 transition-all">
                    Edit Draft
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-outline-variant/20 glass-panel">
            <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
              {['Issue Resolved', 'ETA Update', 'Escalate Incident', '+ Template'].map((t) => (
                <button key={t} className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 rounded-full text-technical-xs text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all whitespace-nowrap">
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 bg-surface-dim border border-outline-variant/30 rounded-lg p-3 focus-within:border-primary transition-all">
                <textarea className="w-full bg-transparent border-none focus:ring-0 text-body-md p-0 resize-none min-h-[40px] max-h-32 text-technical-sm" placeholder="Type a message or use / for commands..." rows={1} />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">attach_file</span></button>
                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">mood</span></button>
                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">image</span></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Enter to send</span>
                    <button className="w-10 h-10 bg-primary text-on-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Rail (Desktop) */}
        <div className="hidden xl:flex w-72 border-l border-outline-variant/20 bg-surface-container-lowest flex-col p-6 space-y-8 overflow-y-auto">
          <div>
            <h4 className="text-technical-xs text-primary uppercase tracking-widest mb-4">Contact Intelligence</h4>
            <div className="space-y-4">
              <div className="bg-surface-container p-4 rounded border border-outline-variant/20">
                <p className="text-technical-xs text-on-surface-variant uppercase mb-1">Sentiment Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-surface-container-highest rounded"><div className="w-4/5 h-full bg-green-500 rounded" /></div>
                  <span className="text-technical-sm text-green-400">82% Positive</span>
                </div>
              </div>
              <div className="bg-surface-container p-4 rounded border border-outline-variant/20">
                <p className="text-technical-xs text-on-surface-variant uppercase mb-1">Response Priority</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-sm">priority_high</span>
                  <span className="text-body-md text-on-surface">Medium-High</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-technical-xs text-primary uppercase tracking-widest mb-4">Agent Automation</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface">Auto-Translate</span>
                <div className="w-8 h-4 bg-primary rounded-full relative flex items-center px-0.5 cursor-pointer">
                  <div className="w-3 h-3 bg-on-primary rounded-full translate-x-4" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface">Draft Generation</span>
                <div className="w-8 h-4 bg-primary rounded-full relative flex items-center px-0.5 cursor-pointer">
                  <div className="w-3 h-3 bg-on-primary rounded-full translate-x-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
