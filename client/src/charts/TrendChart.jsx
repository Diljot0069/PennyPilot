
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="premium-chart-tooltip">
      <span>{label}</span>
      <strong>{currency(payload[0].value)}</strong>
    </div>
  )
}

const TrendChart = ({ data = [] }) => {
  return (
    <div className="chart-box premium-chart">
      {data.length === 0 ? (
        <div className="chart-empty">
          <span className="chart-empty-icon">⌁</span>
          <strong>Not enough activity yet</strong>
          <p>Your cash-flow trend will appear as you add transactions.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 15, right: 12, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id="pennyPilotTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#477D60" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#477D60" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E9EDE7"
              strokeDasharray="3 5"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#879188', fontSize: 12 }}
              dy={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#879188', fontSize: 11 }}
              tickFormatter={(value) =>
                value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
              }
              width={55}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              name="Balance"
              stroke="#285C47"
              strokeWidth={3}
              fill="url(#pennyPilotTrend)"
              activeDot={{
                r: 5,
                fill: '#285C47',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default TrendChart

