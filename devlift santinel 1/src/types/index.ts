export interface Business {
  id: string
  name: string
  industry: string
  country: string
  timezone: string
  planType: 'starter' | 'professional' | 'enterprise'
  settings: Record<string, unknown>
  createdAt: string
}

export interface User {
  id: string
  businessId: string
  email: string
  name: string
  role: 'owner' | 'manager' | 'viewer' | 'admin'
  mfaEnabled: boolean
  preferences: Record<string, unknown>
  lastLogin: string
  createdAt: string
}

export interface KPI {
  label: string
  value: string
  delta: number
  deltaLabel: string
  sparklineData: { value: number; timestamp: string }[]
  status: 'healthy' | 'warning' | 'critical'
}

export interface Agent {
  id: string
  name: string
  type: string
  status: 'active' | 'idle' | 'processing' | 'error'
  currentTask: string
  cpuUsage: number
  memoryUsage: number
  decisionsPerMinute: number
  avgReasoningTime: number
  toolCallSuccessRate: number
  escalationRate: number
  lastActive: string
}

export interface AgentAction {
  id: string
  agentType: string
  actionType: string
  input: string
  output: string
  reasoning: string
  confidenceScore: number
  mcpToolsCalled: string[]
  executionMs: number
  status: 'success' | 'failed' | 'pending'
  alertId?: string
  createdAt: string
}

export interface Alert {
  id: string
  alertType: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  data: Record<string, unknown>
  status: 'open' | 'acknowledged' | 'resolved' | 'suppressed'
  aiResolution: string
  resolvedAt?: string
  createdAt: string
  slaDeadline: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  flowDefinition: Record<string, unknown>
  isActive: boolean
  executionCount: number
  lastTriggered?: string
  createdBy: string
  createdAt: string
}

export interface MCPConnection {
  id: string
  name: string
  category: string
  status: 'connected' | 'disconnected' | 'error'
  capabilities: string[]
  lastHealthCheck: string
}

export interface BusinessHealth {
  score: number
  trend: 'up' | 'down' | 'stable'
  revenueToday: KPI
  transactionsPerHour: KPI
  activeInventory: KPI
  openAlerts: KPI
  stockHealth: KPI
  customerSentiment: KPI
  supplierResponseRate: KPI
  systemUptime: KPI
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  business: Business | null
  isLoading: boolean
  error: string | null
}

export interface CommunicationMessage {
  id: string
  channel: 'whatsapp' | 'email' | 'sms' | 'dashboard'
  contactName: string
  contactId: string
  preview: string
  isAIGenerated: boolean
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  unread: boolean
}
