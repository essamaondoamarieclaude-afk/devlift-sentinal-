import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'cyan' | 'purple' | 'none'
  onClick?: () => void
}

export default function GlassCard({ children, className = '', hover = false, glow = 'none', onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${glow === 'cyan' ? 'glow-cyan' : glow === 'purple' ? 'glow-purple' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
