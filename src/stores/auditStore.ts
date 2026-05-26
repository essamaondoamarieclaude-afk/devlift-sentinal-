import { create } from 'zustand'
import type { AuditLog } from '../types'

interface AuditState {
  logs: AuditLog[]
  addLog: (category: string, message: string, color: string) => void
  deployAgent: (name: string, focus: string) => void
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [
    { timestamp: '2026-05-26 14:22:11', category: 'AUTH_EVENT', message: 'User AlexVanguard modified Autonomy Protocol: LEVEL_3 -> LEVEL_4', color: '#cabeff' },
    { timestamp: '2026-05-26 14:15:02', category: 'SYS_DEPLOY', message: 'Model Context connection "PostgreSQL" successfully re-synced', color: '#00ff88' },
    { timestamp: '2026-05-26 13:45:59', category: 'CRIT_WARN', message: 'Rate limit threshold breached on API_CLUSTER_G2 (92% usage)', color: '#ff5555' },
    { timestamp: '2026-05-26 12:01:44', category: 'AUTH_EVENT', message: 'Cryptographic API access token generated for SERVICE_ACCOUNT_BETA', color: '#cabeff' },
  ],
  addLog: (category, message, color) => {
    const now = new Date()
    const formatted = `${now.toISOString().slice(0, 10)} ${now.toTimeString().split(' ')[0]}`
    set((state) => ({
      logs: [{ timestamp: formatted, category, message, color }, ...state.logs],
    }))
  },
  deployAgent: (name, focus) => {
    const now = new Date()
    const formatted = `${now.toISOString().slice(0, 10)} ${now.toTimeString().split(' ')[0]}`
    set((state) => ({
      logs: [
        { timestamp: formatted, category: 'SYS_DEPLOY', message: `Micro-container successfully active: ${name.toUpperCase()} (Domain: ${focus})`, color: '#00d4ff' },
        ...state.logs,
      ],
    }))
  },
}))
