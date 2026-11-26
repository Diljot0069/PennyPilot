
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const COLORS = [
  '#285C47',
  '#78966A',
  '#B4C59B',
  '#D6A66B',
  '#A7B7AC',
  '#657C72',
  '#C58B7B',
]

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="premium-chart-tooltip">
      <span>{payload[0].name}</span>
      <strong>{currency(payload[0].value)}</strong>
    </div>
  )
}

const CategoryDonutChart = ({ data = [] }) => {
  const chartData = data.filter(
    (item) => Number(item.value) > 0
  )

  return (
    <div className="category-chart-layout">
      <div className="category-donut">
        {chartData.length === 0 ? (
          <div className="chart-empty">
            <span className="chart-empty-icon">◉</span>
            <strong>No spending data</strong>
            <p>Categories will appear after you record expenses.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={103}
                paddingAngle={3}
                stroke="none"
                cornerRadius={5}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="category-chart-legend">
          {chartData.map((item, index) => (
            <div className="category-legend-item" key={item.name}>
              <span
                className="category-legend-dot"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
              <span className="category-legend-name">{item.name}</span>
              <strong>{currency(item.value)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryDonutChart
