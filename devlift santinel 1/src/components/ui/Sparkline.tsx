import { Line, ResponsiveContainer, LineChart } from 'recharts'

interface SparklineProps {
  data: { value: number }[]
  color?: string
  height?: number
}

export default function Sparkline({ data, color = '#00D4FF', height = 40 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
