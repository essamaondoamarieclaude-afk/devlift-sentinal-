import { motion } from 'framer-motion'
import { Check, CheckCheck, Bot } from 'lucide-react'
import GlassCard from './GlassCard'
import type { CommunicationMessage } from '../../types'

interface MessageThreadProps {
  messages: CommunicationMessage[]
}

const statusIcon = {
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: Check,
}

export default function MessageThread({ messages }: MessageThreadProps) {
  return (
    <GlassCard className="flex-1 p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-sentinel-text-primary mb-4">Messages</h3>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => {
          const StatusIcon = statusIcon[msg.status]
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-3 ${msg.isAIGenerated ? '' : 'flex-row-reverse'}`}
            >
              {msg.isAIGenerated && (
                <div className="w-7 h-7 rounded-full bg-sentinel-purple/20 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-sentinel-purple" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.isAIGenerated ? '' : 'text-right'}`}>
                <div
                  className={`p-3 rounded-lg text-xs ${
                    msg.isAIGenerated
                      ? 'bg-sentinel-bg border border-sentinel-border border-l-sentinel-purple border-l-2'
                      : 'bg-sentinel-cyan/10 border border-sentinel-cyan/20'
                  }`}
                >
                  <p className="text-sentinel-text-primary">{msg.preview}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-sentinel-text-muted">
                  {msg.isAIGenerated && <span className="text-sentinel-purple">AI</span>}
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <StatusIcon size={10} className={msg.status === 'read' ? 'text-sentinel-cyan' : 'text-sentinel-text-muted'} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
