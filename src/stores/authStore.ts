import { create } from 'zustand'
import type { User, Business } from '../types'

export interface SignupData {
  fullName: string
  organization: string
  email: string
  password: string
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  business: Business | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  clearError: () => void
}

const mockUser: User = {
  id: 'usr_001',
  businessId: 'biz_001',
  email: 'admin@devlift.com',
  name: 'Admin User',
  role: 'owner',
  mfaEnabled: false,
  preferences: { theme: 'dark', language: 'en' },
  lastLogin: new Date().toISOString(),
  createdAt: '2026-01-15T00:00:00Z',
}

const mockBusiness: Business = {
  id: 'biz_001',
  name: 'Devlift Startup',
  industry: 'technology',
  country: 'CM',
  timezone: 'Africa/Douala',
  planType: 'professional',
  settings: {},
  createdAt: '2026-01-15T00:00:00Z',
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  business: null,
  isLoading: false,
  error: null,

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null })
    await new Promise((r) => setTimeout(r, 1200))
    set({
      isAuthenticated: true,
      user: { ...mockUser, email },
      business: mockBusiness,
      isLoading: false,
    })
  },

  signup: async (_data: SignupData) => {
    set({ isLoading: true, error: null })
    await new Promise((r) => setTimeout(r, 1500))
    set({
      isAuthenticated: true,
      user: mockUser,
      business: mockBusiness,
      isLoading: false,
    })
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      business: null,
    })
  },

  clearError: () => set({ error: null }),
}))
