import { useState, useRef } from 'react';
import { Contact, Message } from '../types';
import { useAuditStore } from '../stores/auditStore';

export default function CommunicationScreen() {
  const { addLog } = useAuditStore();

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'alex',
      name: 'Alex Rivera',
      email: 'arivera@nexus-tech.ai',
      lastMessage: 'Inquiry regarding the Node-04 sync failure...',
      timeAgo: '2m ago',
      hasDraft: true,
      channel: 'email',
      statusIcon: 'mail',
      unreadCount: 1,
    },
    {
      id: 'whatsapp-node',
      name: '+1 (555) 092-11',
      lastMessage: 'The system optimization is complete. Ready for Phase 2.',
      timeAgo: '15m ago',
      hasDraft: false,
      channel: 'whatsapp',
      statusIcon: 'chat',
    },
    {
      id: 'op-b',
      name: 'Operational Unit B',
      lastMessage: 'Awaiting final authorization for local uplink...',
      timeAgo: '1h ago',
      hasDraft: false,
      channel: 'sms',
      statusIcon: 'sms',
    },
  ]);

  const [activeContact, setActiveContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'Alex Rivera',
      role: 'Project Lead',
      text: 'Estimados compañeros, he notado un retraso en la sincronización del nodo 4. ¿Podrían revisar los protocolos de enlace?',
      translatedFrom: 'Spanish',
      originalText: 'Estimados compañeros, he notado un retraso en la sincronización del nodo 4. ¿Podrían revisar los protocolos de enlace?',
      time: '10:42 AM',
    },
  ]);

  const [composeText, setComposeText] = useState('');
  const [draftApproved, setDraftApproved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendPrompt = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: 'Node-01 Admin',
      role: 'Root Commander',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'done_all'
    };

    setMessages(prev => [...prev, newMsg]);
    setComposeText('');

    addLog('AUTH_EVENT', `Admin dispatched secure message via channel: ${activeContact.channel}`, '#00d4ff');

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleSendAiDraft = () => {
    setDraftApproved(true);
    handleSendPrompt(
      "Hello Alex, thank you for the report. Our monitoring agent detected a 40ms latency spike in the Node-04 synchronization. We are currently recalibrating the uplink protocols. Expected resolution within 15 minutes."
    );
    
    setContacts(prev => prev.map(c => c.id === 'alex' ? { ...c, hasDraft: false, lastMessage: 'Recalibration sequence in progress.' } : c));
  };

  const useMessageTemplate = (tpl: string) => {
    if (tpl === 'resolved') {
      setComposeText('Node performance baseline stabilized. Issue declared resolved in system logs.');
    } else if (tpl === 'eta') {
      setComposeText('Awaiting telemetry audit results. Estimated Time of Arrival: 15 minutes.');
    } else {
      setComposeText('Escalating critical anomaly report to Level 2 technical safety engineers.');
    }
  };

  return (
    <div className="flex flex-col h-[78vh] bg-slate-950/20 rounded-2xl border border-slate-900 overflow-hidden min-w-0">
      
      <section className="flex-1 flex overflow-hidden min-w-0">
        
        <div className="w-full md:w-80 border-r border-[#1e2d40]/40 flex flex-col bg-[#050811]/60 min-w-0">
          <div className="p-4 space-y-3 shrink-0 min-w-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-500 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search transmissions..."
                className="w-full bg-[#0a0e1a] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0 min-w-0">
              {['All', 'WhatsApp', 'Email', 'SMS'].map((ch) => (
                <button
                  key={ch}
                  className={`px-3 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap border cursor-pointer ${
                    ch === 'All' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20' 
                      : 'bg-slate-900 border-slate-850 text-slate-400'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-900/60 no-scrollbar min-w-0">
            {contacts.map((contact) => {
              const active = activeContact.id === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveContact(contact);
                    if (contact.id === 'whatsapp-node') {
                      setMessages([
                        {
                          id: 'wm1',
                          sender: 'Operational Field Sensor',
                          role: 'WhatsApp uplink',
                          text: 'The system optimization is complete. Ready for Phase 2.',
                          time: '11:15 AM'
                        }
                      ]);
                    } else if (contact.id === 'op-b') {
                      setMessages([
                        {
                          id: 'sm1',
                          sender: 'Operational Unit B',
                          role: 'SMS proxy',
                          text: 'Awaiting final authorization for local uplink to Bastos node.',
                          time: '09:30 AM'
                        }
                      ]);
                    } else {
                      setMessages([
                        {
                          id: 'm1',
                          sender: 'Alex Rivera',
                          role: 'Project Lead',
                          text: 'Estimados compañeros, he notado un retraso en la sincronización del nodo 4. ¿Podrían revisar los protocolos de enlace?',
                          translatedFrom: 'Spanish',
                          originalText: 'Estimados compañeros, he notado un retraso en la sincronización del nodo 4. ¿Podrían revisar los protocolos de enlace?',
                          time: '10:42 AM',
                        }
                      ]);
                    }
                  }}
                  className={`p-4 cursor-pointer transition-all border-l-2 ${
                    active ? 'bg-indigo-500/5 border-l-cyan-400' : 'border-l-transparent hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 text-xs min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`material-symbols-outlined text-sm font-fill shrink-0 ${
                        contact.channel === 'whatsapp' ? 'text-emerald-400' :
                        contact.channel === 'email' ? 'text-[#cabeff]' :
                        'text-amber-400'
                      }`}>{contact.statusIcon}</span>
                      <h4 className="font-bold text-slate-200 truncate">{contact.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{contact.timeAgo}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 leading-normal font-sans break-words">
                    {contact.lastMessage}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {contact.hasDraft && !draftApproved && (
                      <span className="px-1.5 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded text-[9px] font-bold uppercase tracking-wider font-mono">
                        AI Drafted
                      </span>
                    )}
                    {contact.unreadCount ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex items-center justify-center text-[8px] font-bold text-slate-950 ml-auto"></span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#070b14]/50 relative min-w-0 overflow-hidden">
          
          <div className="px-6 py-4 border-b border-[#1e2d40]/40 flex items-center justify-between bg-[#161b27]/30 backdrop-blur z-10 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded bg-[#7c5cff]/20 flex items-center justify-center text-[#cabeff] font-bold border border-[#7c5cff]/30 text-sm font-sans shrink-0">
                {activeContact.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-200 truncate">{activeContact.name}</h3>
                <p className="text-[10px] font-mono text-slate-500 truncate">{activeContact.email || 'Authorized SMS/WhatsApp Handshake Line'}</p>
              </div>
            </div>
            
            <div className="flex gap-2 text-slate-400 shrink-0">
              <button className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><span className="material-symbols-outlined text-sm">videocam</span></button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><span className="material-symbols-outlined text-sm">call</span></button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"><span className="material-symbols-outlined text-sm">more_vert</span></button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 progress-scrollbar min-w-0"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-2xl min-w-0 ${msg.sender === 'Node-01 Admin' ? 'ml-auto justify-end' : ''}`}>
                {msg.sender !== 'Node-01 Admin' && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 shrink-0 mt-0.5"></div>
                )}
                
                <div className="space-y-1.5 min-w-0 max-w-[80%]">
                  <div className={`p-4 rounded-xl text-xs leading-relaxed font-sans break-words ${
                    msg.sender === 'Node-01 Admin' 
                      ? 'bg-cyan-500/10 text-slate-100 border border-cyan-400/20 rounded-tr-none' 
                      : 'bg-[#161b27] text-slate-200 border border-slate-800/80 rounded-tl-none'
                  }`}>
                    <p className="break-words">{msg.text}</p>
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-500 flex-wrap ${msg.sender === 'Node-01 Admin' ? 'justify-end' : ''}`}>
                    <span>{msg.time}</span>
                    {msg.translatedFrom && (
                      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-800 text-[8px] tracking-wide flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-cyan-400 font-fill">language</span>
                        Translated ES → EN
                      </span>
                    )}
                    {msg.status && (
                      <span className="material-symbols-outlined text-cyan-400 text-sm font-fill">{msg.status}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {activeContact.id === 'alex' && !draftApproved && (
              <div className="flex flex-col items-end gap-2.5 min-w-0">
                <div className="max-w-2xl w-full bg-purple-950/20 border-2 border-purple-500/40 rounded-xl p-5 relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#7c5cff] text-[#050811] font-mono font-extrabold text-[9px] uppercase tracking-tighter rounded-bl-lg">
                    AI PROPOSED REPLY
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#cabeff] text-lg font-fill animate-pulse">auto_awesome</span>
                    <span className="text-[10px] font-mono text-[#cabeff] uppercase tracking-widest font-bold">Sentinel Intelligence Draft</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans break-words">
                    "Hello Alex, thank you for the report. Our monitoring agent detected a 40ms latency spike in the Node-04 synchronization. We are currently recalibrating the uplink protocols. Expected resolution within 15 minutes."
                  </p>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button 
                      onClick={handleSendAiDraft}
                      className="px-4 py-2 bg-[#7c5cff] text-[#050811] font-bold text-xs uppercase rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm font-fill">send</span>
                      Send Proposed reply
                    </button>
                    <button 
                      onClick={() => {
                        setComposeText("Hello Alex, thank you for the report. We are currently recalibrating Node-04 protocols. ETA is 10 minutes.");
                        setContacts(prev => prev.map(c => c.id === 'alex' ? { ...c, hasDraft: false } : c));
                      }}
                      className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Edit draft
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#1e2d40]/40 bg-[#161b27]/30 backdrop-blur shrink-0 min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar min-w-0">
              <button 
                onClick={() => useMessageTemplate('resolved')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-[10px] font-mono text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-xs">bolt</span>
                Template: Resolved
              </button>
              <button 
                onClick={() => useMessageTemplate('eta')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-[10px] font-mono text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-xs">schedule</span>
                Template: ETA Update
              </button>
              <button 
                onClick={() => useMessageTemplate('escalate')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-[10px] font-mono text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-xs">priority_high</span>
                Template: Escalate
              </button>
            </div>

            <div className="flex gap-3 items-end min-w-0">
              <div className="flex-1 bg-[#0a0e1a] border border-slate-800 rounded-lg p-2.5 focus-within:border-cyan-400/50 transition-all flex flex-col gap-1.5 min-w-0">
                <textarea
                  className="w-full bg-transparent border-none text-xs text-slate-200 focus:ring-0 p-0 resize-none min-h-[36px] max-h-24 font-sans focus:outline-none"
                  placeholder="Type a message or use / command template..."
                  rows={2}
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt(composeText);
                    }
                  }}
                />
                
                <div className="flex items-center justify-between border-t border-slate-900 pt-1.5 min-w-0">
                  <div className="flex gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[16px] hover:text-cyan-400 cursor-pointer">attach_file</span>
                    <span className="material-symbols-outlined text-[16px] hover:text-cyan-400 cursor-pointer">mood</span>
                    <span className="material-symbols-outlined text-[16px] hover:text-cyan-400 cursor-pointer">image</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-tighter">Enter key sends</span>
                    <button 
                      onClick={() => handleSendPrompt(composeText)}
                      className="w-8 h-8 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm font-fill">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex w-64 border-l border-[#1e2d40]/40 bg-[#050811]/60 flex-col p-5 space-y-6 overflow-y-auto no-scrollbar shrink-0 min-w-0">
          <div className="min-w-0">
            <h4 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">Contact Metrics</h4>
            <div className="space-y-3 min-w-0">
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 min-w-0">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Sentiment analysis</span>
                <div className="flex items-center justify-between gap-1.5 mt-1.5">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">82% POS</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 min-w-0">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Priority Rating</span>
                <p className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-sm">priority_high</span>
                  Medium-High
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-[10px] font-mono font-bold text-[#cabeff] uppercase tracking-widest mb-3">Shared Blueprints</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-slate-900 rounded border border-slate-800 overflow-hidden relative group cursor-pointer">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBADCIEo1xRa3Y9IM1suCgIZ1UwTDSN-7io7Orwxqk3Bg2bmUl5TU4FdRhu4x3cm_O9RuQLdFIcGN6dsnWOdvUiNHq13gpaSIFUTCS82oSWu_ZGh4CjWkJIKIDvSWXVyXtL9w1XSY05x1jeyN4_N6v06EJ84zelrb_a-aKy_c7Vf8DR8Yo-853XHN0nRCjwNb8dxUZeuInX4PbgEkTUBjSIfk3kIf7OJz5mYvKGTH0adEhzurSaU-moCq0NQ8Lwm_YDrHH1Ma660YR2" 
                  alt="Uplink blueprint" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-square bg-slate-900 rounded border border-slate-800 overflow-hidden relative group cursor-pointer">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5BiDVjmfLTguPyQosfQyTaHO5GE75zJwI1J9_8k3360Gc-8dLRm-SdbRVrg9Czxy4IGW37Curzc3XACoPyxP19yvLFgqN3i_HHsru0k3PsJw1VaOXjuQBOuaeNS56Y-13m12hMQGtqJ2aUqGvE2idpGXIgh_O0Zzn9AP8o7xz8Zv6focJlR-CFsn6Jm7CvDFYyJO4om3mMyLG7ZNgQ0SGrIQDdnuo0DT9jFPADjA3HqrBK2QAjt4B2qNYWu0vIxq5H8_sVj8slxTr" 
                  alt="Node performance metrics dashboard screenshot" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">AI Agent Preferences</h4>
            <div className="space-y-3 font-mono text-[10px] text-slate-400 min-w-0">
              <div className="flex items-center justify-between">
                <span>AUTO-TRANSLATE (ES/AR)</span>
                <span className="text-cyan-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DRAFT GENERATION</span>
                <span className="text-cyan-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
