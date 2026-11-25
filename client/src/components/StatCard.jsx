const StatCard = ({ label, value, trend, tone = 'positive' }) => {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className={`stat-trend ${tone}`}>{trend}</span>
    </div>
  )
}

export default StatCard
