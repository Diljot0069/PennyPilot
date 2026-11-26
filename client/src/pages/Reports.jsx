
import { useMemo } from 'react'

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

const Reports = ({ transactions = [] }) => {
  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    return {
      income,
      expenses,
      net: income - expenses,
      savings: income - expenses,
    }
  }, [transactions])


  const categoryBreakdown = useMemo(() => {
    const totals = {}

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const category = transaction.category || 'Uncategorized'

        totals[category] =
          (totals[category] || 0) + Number(transaction.amount || 0)
      })

    return Object.entries(totals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const reportSummary = [
    { label: 'Income', value: currency(summary.income), tone: 'positive' },
    { label: 'Expenses', value: currency(summary.expenses), tone: 'negative' },
    { label: 'Net cashflow', value: currency(summary.net), tone: summary.net >= 0 ? 'positive' : 'negative' },
    { label: 'Savings', value: currency(summary.savings), tone: summary.savings >= 0 ? 'positive' : 'negative' },
  ]

  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1>Reports</h1>
          <p>Your income, spending and savings at a glance.</p>
        </div>
      </header>

      <div className="stats-grid compact-grid">
        {reportSummary.map((item) => (
          <div key={item.label} className="stat-card">
            <span className="stat-label">{item.label}</span>
            <strong className={`stat-value ${item.tone}`}>
              {item.value}
            </strong>
          </div>
        ))}
      </div>

      <div className="panel report-panel">
        <div className="panel-header">
          <h3>Monthly snapshot</h3>
          <span>{categoryBreakdown.length} categories</span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <p className="empty-state">
            No expense transactions available yet.
          </p>
        ) : (
          <ul className="report-list">
            {categoryBreakdown.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <strong>{currency(item.amount)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Reports

