import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#4f46e5', '#22c55e', '#8b5cf6', '#f59e0b', '#f97316']

const CategoryDonutChart = ({ data = [] }) => {
  const chartData = data.length ? data : [
    { name: 'Housing', value: 1450 },
    { name: 'Food', value: 620 },
    { name: 'Transport', value: 240 },
    { name: 'Savings', value: 890 },
    { name: 'Other', value: 350 },
  ]

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={chartData} innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" paddingAngle={4}>
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryDonutChart
