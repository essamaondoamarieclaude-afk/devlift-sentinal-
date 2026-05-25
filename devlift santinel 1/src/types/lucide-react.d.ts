declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react'
  export interface LucideProps extends Partial<SVGProps<SVGSVGElement>> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }
  export type Icon = FC<LucideProps>
  export const Activity: Icon
  export const AlertTriangle: Icon
  export const BarChart3: Icon
  export const Bell: Icon
  export const Bot: Icon
  export const Check: Icon
  export const CheckCheck: Icon
  export const CheckCircle: Icon
  export const ChevronLeft: Icon
  export const ChevronRight: Icon
  export const Clock: Icon
  export const Cpu: Icon
  export const CreditCard: Icon
  export const Download: Icon
  export const Eye: Icon
  export const EyeOff: Icon
  export const FileText: Icon
  export const Filter: Icon
  export const HelpCircle: Icon
  export const LayoutDashboard: Icon
  export const Loader2: Icon
  export const LogOut: Icon
  export const Memory: Icon
  export const MessageSquare: Icon
  export const Package: Icon
  export const Pause: Icon
  export const Play: Icon
  export const Plug: Icon
  export const Plus: Icon
  export const RefreshCw: Icon
  export const Search: Icon
  export const Send: Icon
  export const Settings: Icon
  export const Shield: Icon
  export const Sliders: Icon
  export const Sparkles: Icon
  export const TrendingDown: Icon
  export const TrendingUp: Icon
  export const Truck: Icon
  export const Users: Icon
  export const Wifi: Icon
  export const WifiOff: Icon
  export const Workflow: Icon
  export const XCircle: Icon
  export const X: Icon
  export const Zap: Icon
}
