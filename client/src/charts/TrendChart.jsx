import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const TrendChart = ({ data = [] }) => {
  const chartData = data.length ? data : [
    { month: 'Jan', value: 1800 },
    { month: 'Feb', value: 2100 },
    { month: 'Mar', value: 2400 },
    { month: 'Apr', value: 2600 },
    { month: 'May', value: 2850 },
    { month: 'Jun', value: 3200 },
  ]

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Balance']} />
          <Area type="monotone" dataKey="value" stroke="#22c55e" fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendChart
