import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PriceData } from '@/types'

interface PriceChartProps {
  priceData: PriceData | undefined
}

export function PricePerformanceChart({ priceData }: PriceChartProps) {
  if (!priceData) return null

  const quote = priceData.data.quote.USD

  const performanceData = [
    { period: '1h', change: quote.percent_change_1h },
    { period: '24h', change: quote.percent_change_24h },
    { period: '7d', change: quote.percent_change_7d },
    { period: '30d', change: quote.percent_change_30d },
    { period: '60d', change: quote.percent_change_60d },
    { period: '90d', change: quote.percent_change_90d },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="period"
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
        />
        <Bar dataKey="change" radius={[6, 6, 0, 0]}>
          {performanceData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.change >= 0 ? '#22c55e' : '#ef4444'}
              style={{
                filter: entry.change >= 0
                  ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))'
                  : 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))'
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SupplyChart({ priceData }: PriceChartProps) {
  if (!priceData) return null

  const { circulating_supply, max_supply, total_supply } = priceData.data

  const supplyData = [
    {
      name: 'Circulating',
      value: circulating_supply,
      fill: 'hsl(12 76% 61%)',
    },
    {
      name: 'Remaining',
      value: max_supply - circulating_supply,
      fill: 'hsl(217.2 32.6% 25%)',
    },
  ]

  const formatSupply = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toFixed(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Supply Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={supplyData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {supplyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatSupply(value), 'MARS']}
            />
            <Legend
              formatter={(value, entry) => (
                <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-muted-foreground">Circulating</div>
            <div className="font-medium">{formatSupply(circulating_supply)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total</div>
            <div className="font-medium">{formatSupply(total_supply)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Max</div>
            <div className="font-medium">{formatSupply(max_supply)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketStatsCard({ priceData }: PriceChartProps) {
  if (!priceData) return null

  const { data } = priceData
  const quote = data.quote.USD

  const stats = [
    { label: 'CMC Rank', value: `#${data.cmc_rank}` },
    { label: 'Market Pairs', value: data.num_market_pairs.toString() },
    { label: 'Market Cap', value: `$${(quote.market_cap / 1e6).toFixed(2)}M` },
    { label: 'FDV', value: `$${(quote.fully_diluted_market_cap / 1e6).toFixed(2)}M` },
    { label: '24h Volume', value: `$${(quote.volume_24h / 1e3).toFixed(2)}K` },
    { label: 'Vol Change', value: `${quote.volume_change_24h.toFixed(2)}%` },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="font-medium">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
