
import {
  BarChart,
  Bar,
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

const MonthlyBarChart = ({ data = [] }) => {
  return (
    <div className="chart-box premium-chart">
      {data.length === 0 ? (
        <div className="chart-empty">
          <span className="chart-empty-icon">↗</span>
          <strong>No monthly data yet</strong>
          <p>Your income and expense activity will appear here.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 15, right: 12, left: 4, bottom: 4 }}
            barCategoryGap="35%"
          >
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#F1F5EF' }}
            />
            <Bar
              dataKey="amount"
              name="Amount"
              fill="#285C47"
              maxBarSize={46}
              radius={[7, 7, 2, 2]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default MonthlyBarChart
