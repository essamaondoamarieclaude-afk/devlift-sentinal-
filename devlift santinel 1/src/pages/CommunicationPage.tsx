import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCommunications } from '../hooks/useDashboardData'
import GlassCard from '../components/ui/GlassCard'
import MessageThread from '../components/ui/MessageThread'
import { Bot, Send } from 'lucide-react'

const channels = ['All', 'WhatsApp', 'Email', 'SMS', 'Dashboard']

const conversations = [
  { id: 'conv_1', contact: 'Joseph Nkwi (Supplier A)', channel: 'whatsapp' as const, preview: 'Emergency PO confirmation', unread: false, time: '2m ago' },
  { id: 'conv_2', contact: 'Marie Epessa (CFO)', channel: 'email' as const, preview: 'Daily Revenue Report', unread: true, time: '5m ago' },
  { id: 'conv_3', contact: 'Security Dispatch', channel: 'sms' as const, preview: 'Location 3 alert', unread: false, time: '15m ago' },
  { id: 'conv_4', contact: 'System Notification', channel: 'dashboard' as const, preview: '3 active alerts', unread: false, time: '30m ago' },
]

export default function CommunicationPage() {
  const { data: messages } = useCommunications()
  const [activeChannel, setActiveChannel] = useState('All')
  const [activeConv, setActiveConv] = useState(conversations[0].id)

  const channelColors: Record<string, string> = {
    whatsapp: 'text-sentinel-green',
    email: 'text-sentinel-blue',
    sms: 'text-sentinel-orange',
    dashboard: 'text-sentinel-purple',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-sentinel-text-primary">Communication Center</h1>
        <p className="text-sm text-sentinel-text-muted mt-1">Unified inbox — AI-generated and human communications</p>
      </div>

      <div className="flex gap-2 border-b border-sentinel-border pb-2">
        {channels.map((ch) => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeChannel === ch
                ? 'bg-sentinel-cyan/10 text-sentinel-cyan border border-sentinel-cyan/20'
                : 'text-sentinel-text-muted hover:text-sentinel-text-primary'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 280px)' }}>
        <GlassCard className="p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-sentinel-text-primary mb-3">Conversations</h3>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeConv === conv.id
                    ? 'bg-sentinel-cyan/10 border border-sentinel-cyan/20'
                    : 'hover:bg-sentinel-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-sentinel-text-primary">{conv.contact}</span>
                  <span className="text-[10px] text-sentinel-text-muted">{conv.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium ${channelColors[conv.channel]}`}>
                    {conv.channel}
                  </span>
                  <span className="text-[10px] text-sentinel-text-muted truncate">{conv.preview}</span>
                  {conv.unread && <span className="w-2 h-2 rounded-full bg-sentinel-cyan shrink-0" />}
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <div className="lg:col-span-2 flex flex-col">
          <MessageThread messages={messages || []} />

          <GlassCard className="p-3 mt-3">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-sentinel-purple shrink-0" />
              <span className="text-[10px] text-sentinel-text-muted">AI Draft</span>
              <div className="flex-1 px-3 py-2 text-xs text-sentinel-text-muted bg-sentinel-bg rounded-lg border border-sentinel-border">
                Generate AI response based on incident context...
              </div>
              <button className="p-2 rounded-lg bg-sentinel-cyan/10 text-sentinel-cyan hover:bg-sentinel-cyan/20 transition-colors">
                <Send size={14} />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
