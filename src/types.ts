export type Screen =
  | 'auth'
  | 'dashboard'
  | 'agents'
  | 'analytics'
  | 'alerts'
  | 'workflows'
  | 'inbox'
  | 'settings';

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
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  icon: string;
  sparkline: number[];
  statusText?: string;
}

export interface AgentActivity {
  id: string;
  agentName: string;
  timeAgo: string;
  avatarBg: string;
  iconName: string;
  description: string;
  confidence: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeAgo: string;
  assignedAgents: string[];
  status: 'open' | 'acknowledged' | 'resolved' | 'suppressed';
  latencyPeak?: string;
  affectedUsers?: string;
  replicationLag?: string;
  resolutionStrategy?: string[];
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'trigger' | 'condition' | 'action';
  code: string;
  description: string;
  icon: string;
  themeColor: string;
}

export interface Message {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  translatedFrom?: string;
  originalText?: string;
  isAIDraft?: boolean;
  status?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  lastMessage: string;
  timeAgo: string;
  hasDraft: boolean;
  channel: 'whatsapp' | 'email' | 'sms' | 'sys';
  statusIcon: string;
  unreadCount?: number;
}

export interface AuditLog {
  timestamp: string;
  category: string;
  message: string;
  color: string;
}

export interface TelemetryLog {
  timestamp: string;
  level: 'info' | 'warn' | 'critical' | 'system';
  source: string;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  business: Business | null
  isLoading: boolean
  error: string | null
}
