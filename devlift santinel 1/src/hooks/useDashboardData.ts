import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboardHealth,
    refetchInterval: 30000,
  })
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: api.getAgents,
    refetchInterval: 15000,
  })
}

export function useAgentActions() {
  return useQuery({
    queryKey: ['agentActions'],
    queryFn: api.getAgentActions,
    refetchInterval: 10000,
  })
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: api.getAlerts,
    refetchInterval: 15000,
  })
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: api.getWorkflows,
  })
}

export function useMCPConnections() {
  return useQuery({
    queryKey: ['mcpConnections'],
    queryFn: api.getMCPConnections,
    refetchInterval: 30000,
  })
}

export function useCommunications() {
  return useQuery({
    queryKey: ['communications'],
    queryFn: api.getCommunications,
    refetchInterval: 10000,
  })
}
