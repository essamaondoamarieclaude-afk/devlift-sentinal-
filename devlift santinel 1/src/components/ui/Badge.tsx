interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md'
  pulse?: boolean
}

const variants = {
  default: 'bg-sentinel-border text-sentinel-text-secondary',
  success: 'bg-sentinel-green/10 text-sentinel-green',
  warning: 'bg-sentinel-orange/10 text-sentinel-orange',
  error: 'bg-red-500/10 text-red-400',
  info: 'bg-sentinel-cyan/10 text-sentinel-cyan',
  purple: 'bg-sentinel-purple/10 text-sentinel-purple',
}

export default function Badge({ variant = 'default', children, className = '', size = 'sm', pulse }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${variants[variant]} ${className}`}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'error' ? 'bg-red-400 status-active' : variant === 'warning' ? 'bg-sentinel-orange status-active' : variant === 'success' ? 'bg-sentinel-green status-active' : 'bg-sentinel-cyan'}`} />
      )}
      {children}
    </span>
  )
}
