import type { Alert, AgentAction, KPI, Workflow, MCPConnection, CommunicationMessage } from '../types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const now = () => new Date().toISOString()

function sparkline(base: number, variance: number, points: number) {
  return Array.from({ length: points }, (_, i) => ({
    value: base + Math.sin(i * 0.5) * variance + (Math.random() - 0.5) * variance * 0.5,
    timestamp: new Date(Date.now() - (points - i) * 3600000).toISOString(),
  }))
}

export const api = {
  getDashboardHealth: async (): Promise<{
    score: number
    trend: 'up' | 'down' | 'stable'
    kpis: KPI[]
  }> => {
    await delay(800)
    return {
      score: 87,
      trend: 'up',
      kpis: [
        { label: 'Revenue Today', value: 'XAF 2.4M', delta: 12.5, deltaLabel: 'vs yesterday', sparklineData: sparkline(2.4, 0.3, 24), status: 'healthy' },
        { label: 'Transactions/hr', value: '47', delta: 8.3, deltaLabel: 'vs yesterday', sparklineData: sparkline(47, 8, 24), status: 'healthy' },
        { label: 'Active Inventory', value: '1,284', delta: -3.1, deltaLabel: 'vs yesterday', sparklineData: sparkline(1300, 20, 24), status: 'warning' },
        { label: 'Open Alerts', value: '3', delta: -40, deltaLabel: 'vs yesterday', sparklineData: sparkline(5, 2, 24).map(v => ({ ...v, value: Math.abs(v.value - 2) })), status: 'critical' },
        { label: 'Stock Health', value: '92%', delta: 2.1, deltaLabel: 'vs yesterday', sparklineData: sparkline(90, 3, 24), status: 'healthy' },
        { label: 'Customer Sentiment', value: '4.2/5.0', delta: 0.3, deltaLabel: 'vs yesterday', sparklineData: sparkline(4.2, 0.2, 24), status: 'healthy' },
        { label: 'Supplier Response', value: '94%', delta: 5.0, deltaLabel: 'vs yesterday', sparklineData: sparkline(90, 4, 24), status: 'healthy' },
        { label: 'System Uptime', value: '99.97%', delta: 0, deltaLabel: '30d avg', sparklineData: sparkline(99.97, 0.02, 24), status: 'healthy' },
      ],
    }
  },

  getAgents: async () => {
    await delay(500)
    return [
      { id: 'agent_1', name: 'Monitoring Agent', type: 'LoopAgent', status: 'active' as const, currentTask: 'Analyzing inventory velocity for SKU-2847', cpuUsage: 34, memoryUsage: 28, decisionsPerMinute: 142, avgReasoningTime: 0.3, toolCallSuccessRate: 99.8, escalationRate: 2.1, lastActive: now() },
      { id: 'agent_2', name: 'Intelligence Agent', type: 'LlmAgent', status: 'processing' as const, currentTask: 'Root cause analysis: revenue anomaly Location 3', cpuUsage: 72, memoryUsage: 65, decisionsPerMinute: 28, avgReasoningTime: 4.2, toolCallSuccessRate: 99.5, escalationRate: 8.4, lastActive: now() },
      { id: 'agent_3', name: 'Execution Agent', type: 'SequentialAgent', status: 'idle' as const, currentTask: 'Awaiting orchestration instructions', cpuUsage: 12, memoryUsage: 22, decisionsPerMinute: 0, avgReasoningTime: 0, toolCallSuccessRate: 100, escalationRate: 0, lastActive: new Date(Date.now() - 180000).toISOString() },
      { id: 'agent_4', name: 'Communication Agent', type: 'LlmAgent', status: 'active' as const, currentTask: 'Drafting WhatsApp alert to pharmacy owner', cpuUsage: 45, memoryUsage: 38, decisionsPerMinute: 18, avgReasoningTime: 1.8, toolCallSuccessRate: 99.2, escalationRate: 3.5, lastActive: now() },
    ]
  },

  getAgentActions: async (): Promise<AgentAction[]> => {
    await delay(400)
    return [
      { id: 'act_1', agentType: 'Monitoring Agent', actionType: 'threshold_check', input: 'SKU-2847 velocity check', output: '340% above baseline', reasoning: 'Inventory depletion velocity exceeds 7-day rolling average by 3.4x', confidenceScore: 0.97, mcpToolsCalled: ['MCP-01: PostgreSQL'], executionMs: 234, status: 'success', createdAt: new Date(Date.now() - 5000).toISOString() },
      { id: 'act_2', agentType: 'Intelligence Agent', actionType: 'root_cause_analysis', input: 'Anomaly: SKU-2847', output: 'Risk score 0.91 — seasonal fever spike pattern', reasoning: 'Cross-referenced 3 prior incidents. Pattern matches end-of-month fever seasonality. 18h depletion window.', confidenceScore: 0.94, mcpToolsCalled: ['MCP-01: PostgreSQL', 'MCP-12: Web Search'], executionMs: 4120, status: 'success', createdAt: new Date(Date.now() - 3000).toISOString() },
      { id: 'act_3', agentType: 'Execution Agent', actionType: 'create_po', input: 'Emergency PO: Paracetamol 500mg x 500 units', output: 'PO-2026-05-25-001 created to Supplier A', reasoning: 'Auto-execute triggered (risk > 0.85). Preferred supplier selected based on delivery time (4h). Backup PO created.', confidenceScore: 0.96, mcpToolsCalled: ['MCP-10: ERP Connector', 'MCP-06: WhatsApp'], executionMs: 1850, status: 'success', createdAt: new Date(Date.now() - 1000).toISOString() },
    ]
  },

  getAlerts: async (): Promise<Alert[]> => {
    await delay(600)
    return [
      { id: 'alt_1', alertType: 'inventory', priority: 'critical', title: 'Paracetamol stock depletion imminent', description: 'SKU-2847 velocity 340% above baseline. Estimated 18h until stockout. Emergency PO placed.', data: {}, status: 'open', aiResolution: 'Emergency PO created to Supplier A (500 units, 4h delivery). Backup PO to Supplier B.', createdAt: now(), slaDeadline: new Date(Date.now() + 32400000).toISOString() },
      { id: 'alt_2', alertType: 'revenue', priority: 'high', title: 'Unusual transaction pattern — Location 3', description: 'Transaction volume 4.2x normal at 23:45. No scheduled events or staff overtime logged.', data: {}, status: 'open', aiResolution: 'Pending human review — risk score 0.78. Recommend investigation before action.', createdAt: new Date(Date.now() - 600000).toISOString(), slaDeadline: new Date(Date.now() + 5400000).toISOString() },
      { id: 'alt_3', alertType: 'supplier', priority: 'medium', title: 'Supplier B delivery delay', description: 'Expected delivery at 14:00, now 45 minutes overdue. No status update received.', data: {}, status: 'acknowledged', aiResolution: 'Auto-reminder sent via WhatsApp to Supplier B contact.', createdAt: new Date(Date.now() - 2700000).toISOString(), slaDeadline: new Date(Date.now() + 5400000).toISOString() },
      { id: 'alt_4', alertType: 'system', priority: 'low', title: 'IoT sensor offline — Freezer 3', description: 'Temperature sensor at Location 2 has not reported in 2 hours. Manual check recommended.', data: {}, status: 'resolved', aiResolution: 'Sensor battery replacement confirmed. Data stream restored.', createdAt: new Date(Date.now() - 7200000).toISOString(), resolvedAt: new Date(Date.now() - 1800000).toISOString(), slaDeadline: new Date(Date.now() - 3600000).toISOString() },
    ]
  },

  getWorkflows: async (): Promise<Workflow[]> => {
    await delay(400)
    return [
      { id: 'wf_1', name: 'Auto Inventory Reorder', description: 'Monitors stock levels and auto-creates POs when thresholds breached', flowDefinition: {}, isActive: true, executionCount: 147, lastTriggered: new Date(Date.now() - 120000).toISOString(), createdBy: 'usr_001', createdAt: '2026-02-01T00:00:00Z' },
      { id: 'wf_2', name: 'Revenue Anomaly Alert', description: 'Flags unusual transaction patterns and routes to human approval queue', flowDefinition: {}, isActive: true, executionCount: 89, lastTriggered: new Date(Date.now() - 600000).toISOString(), createdBy: 'usr_001', createdAt: '2026-02-15T00:00:00Z' },
      { id: 'wf_3', name: 'Daily Sales Report', description: 'Generates and emails daily sales summary to all managers at 18:00', flowDefinition: {}, isActive: true, executionCount: 104, lastTriggered: new Date(Date.now() - 86400000).toISOString(), createdBy: 'usr_001', createdAt: '2026-03-01T00:00:00Z' },
    ]
  },

  getMCPConnections: async (): Promise<MCPConnection[]> => {
    await delay(300)
    return [
      { id: 'mcp_01', name: 'PostgreSQL Server', category: 'Database', status: 'connected', capabilities: ['Read', 'Write', 'Stream'], lastHealthCheck: now() },
      { id: 'mcp_02', name: 'Firebase Server', category: 'Realtime Sync', status: 'connected', capabilities: ['Pub/Sub', 'State Sync'], lastHealthCheck: now() },
      { id: 'mcp_03', name: 'Gmail Server', category: 'Email Actions', status: 'connected', capabilities: ['Send', 'Read', 'Draft'], lastHealthCheck: now() },
      { id: 'mcp_04', name: 'WhatsApp Business API', category: 'Messaging', status: 'connected', capabilities: ['Send Template', 'Read', 'Webhook'], lastHealthCheck: now() },
      { id: 'mcp_05', name: 'Stripe Server', category: 'Payments', status: 'connected', capabilities: ['Monitor', 'Refund', 'Invoice'], lastHealthCheck: now() },
      { id: 'mcp_06', name: 'ERP Connector', category: 'Supplier Integration', status: 'connected', capabilities: ['Create PO', 'Query Stock', 'ETAs'], lastHealthCheck: now() },
      { id: 'mcp_07', name: 'IoT Gateway', category: 'Sensor Data', status: 'error', capabilities: ['Temperature', 'Weight', 'RFID'], lastHealthCheck: new Date(Date.now() - 7200000).toISOString() },
    ]
  },

  getCommunications: async (): Promise<CommunicationMessage[]> => {
    await delay(400)
    return [
      { id: 'msg_1', channel: 'whatsapp', contactName: 'Joseph Nkwi (Supplier A)', contactId: 'sup_a', preview: 'Urgent: Emergency PO-2026-05-25-001 for Paracetamol 500mg — please confirm delivery by 16:00', isAIGenerated: true, status: 'delivered', timestamp: new Date(Date.now() - 60000).toISOString(), unread: false },
      { id: 'msg_2', channel: 'email', contactName: 'Marie Epessa (CFO)', contactId: 'cfo_1', preview: 'Daily Revenue Report — May 25, 2026: Total XAF 2.4M, +12.5% vs yesterday', isAIGenerated: true, status: 'sent', timestamp: new Date(Date.now() - 300000).toISOString(), unread: true },
      { id: 'msg_3', channel: 'sms', contactName: 'Security Dispatch', contactId: 'sec_1', preview: '[ALERT] Unauthorized access detected at Location 3 — immediate investigation required', isAIGenerated: true, status: 'delivered', timestamp: new Date(Date.now() - 900000).toISOString(), unread: false },
      { id: 'msg_4', channel: 'dashboard', contactName: 'System Notification', contactId: 'sys_1', preview: '3 active alerts require your attention. Critical: Paracetamol stock depletion.', isAIGenerated: true, status: 'read', timestamp: new Date(Date.now() - 1800000).toISOString(), unread: false },
    ]
  },
}
