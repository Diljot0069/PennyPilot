import { useMemo } from 'react'

const Reports = ({ transactions = [] }) => {
  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const expenses = Math.abs(
      transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    )

    return {
      income,
      expenses,
      net: income - expenses,
      savings: income - expenses,
    }
  }, [transactions])

  const reportSummary = [
    { label: 'Income', value: `$${summary.income.toFixed(2)}`, tone: 'positive' },
    { label: 'Expenses', value: `$${summary.expenses.toFixed(2)}`, tone: 'negative' },
    { label: 'Net cashflow', value: `$${summary.net.toFixed(2)}`, tone: 'positive' },
    { label: 'Savings', value: `$${summary.savings.toFixed(2)}`, tone: 'positive' },
  ]

  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1>Reports</h1>
        </div>
      </header>

      <div className="stats-grid compact-grid">
        {reportSummary.map((item) => (
          <div key={item.label} className="stat-card">
            <span className="stat-label">{item.label}</span>
            <strong className={`stat-value ${item.tone}`}>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel report-panel">
        <div className="panel-header">
          <h3>Monthly snapshot</h3>
        </div>
        <ul className="report-list">
          <li><span>Housing</span><strong>$1,450</strong></li>
          <li><span>Food & Dining</span><strong>$620</strong></li>
          <li><span>Transportation</span><strong>$240</strong></li>
          <li><span>Investing</span><strong>$890</strong></li>
        </ul>
      </div>
    </div>
  )
}

export default Reports
