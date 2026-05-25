import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import type { SignupData } from '../stores/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  industry: z.string().min(1, 'Industry is required'),
  country: z.string().min(1, 'Country is required'),
})

type LoginData = z.infer<typeof loginSchema>

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const { login, signup, isLoading, error, clearError } = useAuthStore()

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const onLogin = async (data: LoginData) => {
    await login(data.email, data.password)
  }

  const onSignup = async (data: SignupData) => {
    await signup(data)
  }

  return (
    <div className="min-h-screen bg-sentinel-bg flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sentinel-cyan to-sentinel-purple flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sentinel-text-primary">Devlift Sentinel</h1>
              <p className="text-xs text-sentinel-text-muted">Autonomous AI Operations Platform</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={loginForm.handleSubmit(onLogin)}
                >
                  <h2 className="text-xl font-bold text-sentinel-text-primary mb-1">Welcome back</h2>
                  <p className="text-sm text-sentinel-text-muted mb-6">Sign in to your operations dashboard</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Email</label>
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        placeholder="you@company.com"
                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          {...loginForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-text-muted hover:text-sentinel-text-primary"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-sentinel-cyan to-sentinel-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <p className="text-xs text-center text-sentinel-text-muted mt-4">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); clearError() }} className="text-sentinel-cyan hover:underline">
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={signupForm.handleSubmit(onSignup)}
                >
                  <h2 className="text-xl font-bold text-sentinel-text-primary mb-1">Create your account</h2>
                  <p className="text-sm text-sentinel-text-muted mb-6">Start monitoring your business operations</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Full Name</label>
                        <input
                          {...signupForm.register('fullName')}
                          placeholder="John Doe"
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Business</label>
                        <input
                          {...signupForm.register('businessName')}
                          placeholder="My Company"
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Email</label>
                      <input
                        {...signupForm.register('email')}
                        type="email"
                        placeholder="you@company.com"
                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          {...signupForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-cyan/50 transition-colors pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sentinel-text-muted hover:text-sentinel-text-primary"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Industry</label>
                        <select
                          {...signupForm.register('industry')}
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                        >
                          <option value="">Select</option>
                          <option value="retail">Retail</option>
                          <option value="pharmacy">Pharmacy</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="logistics">Logistics</option>
                          <option value="technology">Technology</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-sentinel-text-secondary mb-1.5">Country</label>
                        <select
                          {...signupForm.register('country')}
                          className="w-full px-3 py-2.5 text-sm rounded-lg bg-sentinel-bg border border-sentinel-border text-sentinel-text-primary focus:outline-none focus:border-sentinel-cyan/50 transition-colors"
                        >
                          <option value="">Select</option>
                          <option value="CM">Cameroon</option>
                          <option value="NG">Nigeria</option>
                          <option value="KE">Kenya</option>
                          <option value="ZA">South Africa</option>
                          <option value="GH">Ghana</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-sentinel-cyan to-sentinel-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>

                  <p className="text-xs text-center text-sentinel-text-muted mt-4">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('login'); clearError() }} className="text-sentinel-cyan hover:underline">
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-center text-sentinel-text-muted mt-6">
            Protected by enterprise-grade security • MFA • SSO • Encryption
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-sentinel-surface items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid opacity-30" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sentinel-cyan to-sentinel-purple flex items-center justify-center"
          >
            <Shield size={48} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-sentinel-text-primary mb-3">Autonomous AI Operations</h2>
          <p className="text-sm text-sentinel-text-secondary leading-relaxed">
            Continuous monitoring, predictive intelligence, and autonomous execution for your business — powered by Gemini AI and Google ADK.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            {['Monitoring', 'Intelligence', 'Execution', 'Communication'].map((label) => (
              <div key={label} className="text-center">
                <div className="w-2 h-2 rounded-full bg-sentinel-cyan mx-auto mb-2 status-active" />
                <p className="text-[10px] text-sentinel-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
