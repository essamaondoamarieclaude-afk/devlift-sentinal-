import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import type { SignupData } from '../stores/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  organization: z.string().min(2, 'Organization name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginData = z.infer<typeof loginSchema>

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [mfaVisible, setMfaVisible] = useState(false)
  const { login, signup, isLoading, error, clearError } = useAuthStore()

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const onLogin = async (data: LoginData) => {
    if (!mfaVisible) {
      setMfaVisible(true)
      return
    }
    await login(data.email, data.password)
  }

  const onSignup = async (data: SignupData) => {
    await signup(data)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden min-w-0">
      <div className="fixed inset-0 animated-grid pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-primary/5 pointer-events-none z-0" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-center min-w-0">
        {/* Left: Auth Card */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start min-w-0">
          <div className="glass-panel glow-border rounded-xl w-full p-8 md:p-10 relative overflow-hidden min-w-0">
            <div className="scanline" />

            <div className="mb-8 flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-headline-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight min-w-0 break-words">Sentinel Command</h1>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="min-w-0"
                >
                  <div className="mb-8 min-w-0">
                    <h2 className="text-headline-md text-on-surface min-w-0 break-words">Node Authorization</h2>
                    <p className="text-body-md text-on-surface-variant mt-2 min-w-0 break-words">Initialize secure session for Agent Cluster Node-01.</p>
                  </div>

                  <form className="space-y-5 min-w-0" onSubmit={loginForm.handleSubmit(onLogin)}>
                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase tracking-widest min-w-0">Identity Identifier</label>
                      <div className="relative group min-w-0">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm group-focus-within:text-primary transition-colors">person</span>
                        <input
                          {...loginForm.register('email')}
                          type="email"
                          placeholder="admin@sentinel.dev"
                          className="w-full min-w-0 bg-surface-container-lowest border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 text-on-surface text-technical-sm focus:outline-none transition-all placeholder:text-outline/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase tracking-widest min-w-0">Access Key</label>
                      <div className="relative group min-w-0">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm group-focus-within:text-primary transition-colors">key</span>
                        <input
                          {...loginForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={'\u2022'.repeat(12)}
                          className="w-full min-w-0 bg-surface-container-lowest border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 text-on-surface text-technical-sm focus:outline-none transition-all placeholder:text-outline/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    <div className={`pt-4 border-t border-outline-variant/20 transition-all duration-500 min-w-0 ${mfaVisible ? 'opacity-100' : 'opacity-0 hidden'}`}>
                      <div className="space-y-3 min-w-0">
                        <label className="text-label-md text-primary block ml-1 uppercase tracking-widest flex items-center gap-2 flex-wrap min-w-0">
                          <span className="material-symbols-outlined text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                          MFA Verification
                        </label>
                        <div className="flex gap-2 flex-wrap min-w-0">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <input
                              key={i}
                              maxLength={1}
                              className="w-12 h-12 text-center bg-surface-container-lowest border border-primary/30 rounded-lg text-primary text-technical-sm focus:outline-none"
                              type="text"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-error text-technical-xs min-w-0 break-words">{error}</p>}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-container text-on-primary-fixed text-label-md py-4 rounded-lg uppercase tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer min-w-0"
                    >
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-body-lg">refresh</span>
                      ) : (
                        <>
                          {mfaVisible ? 'Verify & Initialize' : 'Initialize Session'}
                          <span className="material-symbols-outlined text-body-lg shrink-0">bolt</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative my-8 min-w-0">
                    <div className="absolute inset-0 flex items-center min-w-0"><div className="w-full border-t border-outline-variant/30" /></div>
                    <div className="relative flex justify-center min-w-0">
                      <span className="bg-surface px-4 text-outline text-technical-xs uppercase tracking-tighter min-w-0">Federated SSO Protocols</span>
                    </div>
                  </div>

                  <button className="w-full bg-surface-container-high border border-outline-variant/30 hover:bg-surface-variant/50 transition-colors py-3 rounded-lg flex items-center justify-center gap-3 group cursor-pointer min-w-0">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors min-w-0">Authorize via Workspace SSO</span>
                  </button>

                  <div className="mt-8 flex justify-between items-center text-technical-xs text-outline uppercase tracking-widest flex-wrap min-w-0">
                    <button type="button" className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none min-w-0">
                      <span className="material-symbols-outlined text-[14px] shrink-0">lock_reset</span> Reset Access
                    </button>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-primary network-node shrink-0" />
                      SYSTEM READY
                    </div>
                  </div>

                  <p className="mt-6 text-center text-body-md text-on-surface-variant min-w-0">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setMfaVisible(false); clearError() }} className="text-primary-container font-semibold hover:underline cursor-pointer bg-transparent border-none">
                      Register here
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-w-0"
                >
                  <div className="text-center mb-6 min-w-0">
                    <h2 className="text-headline-lg text-on-surface min-w-0 break-words">Initialize Node Authorization</h2>
                    <p className="text-body-md text-on-surface-variant max-w-[320px] mx-auto min-w-0 break-words">Create your enterprise credentials to begin autonomous agent orchestration.</p>
                  </div>

                  <form className="space-y-4 min-w-0" onSubmit={signupForm.handleSubmit(onSignup)}>
                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase min-w-0">Full Name</label>
                      <div className="relative group min-w-0">
                        <input
                          {...signupForm.register('fullName')}
                          placeholder="Commander Name"
                          className="w-full min-w-0 bg-[#0A0E1A] border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface text-technical-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                          type="text"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">person</span>
                      </div>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase min-w-0">Work Email</label>
                      <div className="relative group min-w-0">
                        <input
                          {...signupForm.register('email')}
                          placeholder="name@organization.com"
                          className="w-full min-w-0 bg-[#0A0E1A] border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface text-technical-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                          type="email"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">alternate_email</span>
                      </div>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase min-w-0">Organization Name</label>
                      <div className="relative group min-w-0">
                        <input
                          {...signupForm.register('organization')}
                          placeholder="Global Enterprise"
                          className="w-full min-w-0 bg-[#0A0E1A] border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface text-technical-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                          type="text"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">corporate_fare</span>
                      </div>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-label-md text-on-surface-variant block ml-1 uppercase min-w-0">Access Key</label>
                      <div className="relative group min-w-0">
                        <input
                          {...signupForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={'\u2022'.repeat(8)}
                          className="w-full min-w-0 bg-[#0A0E1A] border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface text-technical-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-error text-technical-xs min-w-0 break-words">{error}</p>}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-container hover:bg-primary text-on-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 glow-cyan transition-all active:scale-95 group mt-2 disabled:opacity-50 cursor-pointer min-w-0"
                    >
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined group-hover:animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                          Continue
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 flex items-center gap-4 min-w-0">
                    <div className="h-[1px] flex-grow bg-outline-variant/30" />
                    <span className="text-technical-xs text-outline min-w-0 whitespace-nowrap">SECURE AUTHENTICATION</span>
                    <div className="h-[1px] flex-grow bg-outline-variant/30" />
                  </div>

                  <button className="w-full mt-4 bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-surface-bright transition-colors active:opacity-80 cursor-pointer min-w-0">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Authorize via Google Workspace
                  </button>

                  <div className="mt-6 text-center min-w-0">
                    <p className="text-body-md text-on-surface-variant min-w-0">
                      Already have an account?{' '}
                      <button type="button" onClick={() => { setMode('login'); clearError() }} className="text-primary-container font-semibold hover:underline cursor-pointer bg-transparent border-none">
                        Log in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-technical-xs text-outline/40 uppercase tracking-[0.2em] min-w-0">
            &copy; 2024 DEVLIFT TECHNOLOGIES | PROTOCOL 7.4.1
          </p>
        </div>

        {/* Right: Animated Network Graphic (Desktop only) */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-center items-center relative min-h-[600px] min-w-0">
          <div className="absolute inset-0 flex items-center justify-center min-w-0">
            <div className="relative w-full h-full flex items-center justify-center min-w-0">
              <svg className="w-full h-full opacity-60 min-w-0" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="cyanGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#3cd7ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4816cb" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle className="animate-[spin_40s_linear_infinite]" cx="400" cy="400" fill="none" r="150" stroke="url(#cyanGradient)" strokeDasharray="10 5" strokeWidth="0.5" />
                <circle className="animate-[spin_60s_linear_infinite_reverse]" cx="400" cy="400" fill="none" r="250" stroke="url(#cyanGradient)" strokeDasharray="20 10" strokeWidth="0.2" />
                <circle cx="400" cy="400" fill="none" r="320" stroke="url(#cyanGradient)" strokeOpacity="0.1" strokeWidth="1" />
                <g className="stroke-primary/20" strokeWidth="0.5">
                  <line className="animate-pulse" x1="250" x2="400" y1="250" y2="400" />
                  <line x1="550" x2="400" y1="250" y2="400" />
                  <line x1="250" x2="400" y1="550" y2="400" />
                  <line x1="550" x2="400" y1="550" y2="400" />
                  <line x1="150" x2="250" y1="400" y2="250" />
                  <line x1="650" x2="550" y1="400" y2="550" />
                </g>
                <g fill="white">
                  <circle className="fill-primary" cx="400" cy="400" r="8" />
                  <circle className="fill-secondary network-node" cx="250" cy="250" r="4" />
                  <circle className="fill-secondary network-node" cx="550" cy="250" r="4" />
                  <circle className="fill-secondary network-node" cx="250" cy="550" r="4" />
                  <circle className="fill-secondary network-node" cx="550" cy="550" r="4" />
                </g>
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between p-10 text-technical-xs text-primary/40 pointer-events-none min-w-0">
                <div className="flex justify-between w-full flex-wrap min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="min-w-0">$ SESSION_INIT --NODE_ID: 0x82A1</span>
                    <span className="min-w-0">$ ENCRYPTION_LEVEL: AES-512-PQC</span>
                  </div>
                  <div className="text-right min-w-0">
                    <span className="min-w-0">LATENCY: 14ms</span>
                    <span className="min-w-0">UPTIME: 99.999%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end opacity-20 text-[10px] min-w-0">
                  <span className="min-w-0">SYSLOG: CLUSTER_AUTOSCALE_SUCCESS</span>
                  <span className="min-w-0">SYSLOG: AGENT_7_PROMOTED_TO_LEADER</span>
                  <span className="min-w-0">SYSLOG: THREAT_DETECTION_PASSIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto text-center space-y-2 relative min-w-0">
            <div className="text-headline-md text-on-surface min-w-0 break-words">Neural Multi-Agent Governance</div>
            <div className="text-body-md text-on-surface-variant max-w-sm mx-auto min-w-0 break-words">
              Advanced orchestrator for autonomous AI workflows with secure-edge processing and zero-trust verification.
            </div>
            <div className="pt-6 flex justify-center gap-8 flex-wrap min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <span className="text-primary text-technical-sm min-w-0">1.2k</span>
                <span className="text-outline text-technical-xs uppercase min-w-0">Agents</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/30 shrink-0" />
              <div className="flex flex-col items-center min-w-0">
                <span className="text-primary text-technical-sm min-w-0">0.0ms</span>
                <span className="text-outline text-technical-xs uppercase min-w-0">Jitter</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/30 shrink-0" />
              <div className="flex flex-col items-center min-w-0">
                <span className="text-primary text-technical-sm min-w-0">TLS 1.3</span>
                <span className="text-outline text-technical-xs uppercase min-w-0">Cipher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}