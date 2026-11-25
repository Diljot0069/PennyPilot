const BudgetCard = ({ category, used, limit, color = '#4f46e5' }) => {
  const percentage = Math.min((used / limit) * 100, 100)

  return (
    <div className="budget-card">
      <div className="budget-row">
        <h4>{category}</h4>
        <span>${used.toLocaleString()} / ${limit.toLocaleString()}</span>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${percentage}%`, background: color }} />
      </div>

      <div className="budget-footer">
        <span>{Math.round(percentage)}% used</span>
        <span>{limit - used > 0 ? `$${(limit - used).toLocaleString()} left` : 'Limit reached'}</span>
      </div>
    </div>
  )
}

export default BudgetCard
