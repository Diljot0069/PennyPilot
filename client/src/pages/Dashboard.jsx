import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import TrendChart from '../charts/TrendChart'
import CategoryDonutChart from '../charts/CategoryDonutChart'
import TransactionTable from '../components/TransactionTable'

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const getDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const Dashboard = ({ transactions = [], budgets = [] }) => {
  const data = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const balance = income - expenses
    const savingsRate = income > 0 ? (balance / income) * 100 : 0

    const categoryTotals = {}

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const name = t.category || 'Other'
        categoryTotals[name] = (categoryTotals[name] || 0) + Number(t.amount || 0)
      })

    const categories = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const now = new Date()
    const monthlyTrend = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth()

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = getDate(t.date)
        return transactionDate &&
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() === month
      })

      const monthIncome = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)

      const monthExpenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)

      monthlyTrend.push({
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        value: monthIncome - monthExpenses,
        income: monthIncome,
        expenses: monthExpenses,
      })
    }

    return {
      income,
      expenses,
      balance,
      savingsRate,
      categories,
      monthlyTrend,
    }
  }, [transactions])

  const stats = [
    {
      label: 'Net balance',
      value: currency(data.balance),
      tone: data.balance >= 0 ? 'positive' : 'negative',
      description: 'Income minus expenses',
    },
    {
      label: 'Total income',
      value: currency(data.income),
      tone: 'positive',
      description: 'Money received',
    },
    {
      label: 'Total expenses',
      value: currency(data.expenses),
      tone: 'negative',
      description: 'Money spent',
    },
    {
      label: 'Savings rate',
      value: `${Math.round(data.savingsRate)}%`,
      tone: data.savingsRate >= 0 ? 'positive' : 'negative',
      description: 'Of your total income',
    },
  ]

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      return (getDate(b.date)?.getTime() || 0) -
        (getDate(a.date)?.getTime() || 0)
    })
    .slice(0, 5)

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.limit || 0), 0
  )

  const totalBudgetUsed = budgets.reduce(
    (sum, budget) => sum + Number(budget.used || 0), 0
  )

  return (
    <div className="page-section dashboard-page">

      <header className="page-header dashboard-heading">
        <div>
          <span className="eyebrow">YOUR FINANCIAL OVERVIEW</span>
          <h1>Good to see you.</h1>
          <p>Here's what's happening with your money.</p>
        </div>

        <div className="dashboard-date">
          <span>REPORTING PERIOD</span>
          <strong>
            {new Date().toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })}
          </strong>
        </div>
      </header>

      <section className="dashboard-balance-panel">
        <div className="balance-copy">
          <span className="balance-eyebrow">YOUR NET BALANCE</span>
          <h2>{currency(data.balance)}</h2>
          <p>Your overall income after recorded expenses.</p>
        </div>

        <div className="balance-decoration" aria-hidden="true">
          <span>₹</span>
        </div>

        <div className="balance-bottom">
          <span>INCOME <strong>{currency(data.income)}</strong></span>
          <span>EXPENSES <strong>{currency(data.expenses)}</strong></span>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        {stats.slice(1).map((stat) => (
          <article className="dashboard-mini-stat" key={stat.label}>
            <span className="mini-stat-label">{stat.label}</span>
            <strong className={stat.tone}>{stat.value}</strong>
            <span className="mini-stat-description">{stat.description}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-chart-grid">
        <article className="panel dashboard-chart-panel">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-kicker">PERFORMANCE</span>
              <h3>Income vs expenses</h3>
            </div>
            <span className="chart-period">All transactions</span>
          </div>

          <MonthlyBarChart
            data={[
              { month: 'Income', amount: data.income },
              { month: 'Expenses', amount: data.expenses },
            ]}
          />
        </article>

        <article className="panel dashboard-chart-panel">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-kicker">WHERE IT GOES</span>
              <h3>Spending by category</h3>
            </div>
          </div>

          {data.categories.length > 0 ? (
            <>
              <CategoryDonutChart data={data.categories} />
              <div className="dashboard-category-legend">
                {data.categories.slice(0, 5).map((category) => (
                  <div className="dashboard-category-row" key={category.name}>
                    <span>{category.name}</span>
                    <strong>{currency(category.value)}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dashboard-empty-chart">
              <span>₹</span>
              <p>No expense categories to display yet.</p>
            </div>
          )}
        </article>
      </section>

      <section className="panel dashboard-trend-panel">
        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">OVER THE LAST SIX MONTHS</span>
            <h3>Cash flow trend</h3>
          </div>
          <span className="chart-period">Monthly net cash flow</span>
        </div>

        <TrendChart data={data.monthlyTrend} />
      </section>

      <section className="panel dashboard-transactions-panel">
        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">YOUR MONEY MOVEMENT</span>
            <h3>Recent transactions</h3>
          </div>
          <span className="chart-period">
            {transactions.length} total records
          </span>
        </div>

        {recentTransactions.length > 0 ? (
          <TransactionTable transactions={recentTransactions} />
        ) : (
          <div className="dashboard-empty-chart">
            <span>＋</span>
            <p>Your transactions will appear here once you add them.</p>
          </div>
        )}
      </section>

      <section className="panel dashboard-budget-panel">
        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">SPENDING CONTROL</span>
            <h3>Monthly budgets</h3>
          </div>
          <span className="chart-period">{budgets.length} active</span>
        </div>

        {budgets.length > 0 ? (
          <>
            <div className="budget-overview-line">
              <span>{currency(totalBudgetUsed)} spent</span>
              <strong>{currency(totalBudget)} allocated</strong>
            </div>

            <div className="dashboard-budget-track">
              <span
                style={{
                  width: `${totalBudget > 0
                    ? Math.min((totalBudgetUsed / totalBudget) * 100, 100)
                    : 0}%`,
                }}
              />
            </div>

            <div className="dashboard-budget-list">
              {budgets.slice(0, 4).map((budget) => {
                const limit = Number(budget.limit || 0)
                const used = Number(budget.used || 0)
                const percentage = limit > 0 ? (used / limit) * 100 : 0

                return (
                  <div className="dashboard-budget-row" key={budget._id || budget.category}>
                    <div>
                      <strong>{budget.category}</strong>
                      <span>{currency(used)} of {currency(limit)}</span>
                    </div>
                    <div className="dashboard-budget-row-right">
                      <strong>{Math.round(percentage)}%</strong>
                      <div className="dashboard-budget-track small">
                        <span style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-chart">
            <span>＋</span>
            <p>No budgets created yet. Your budget overview will appear here.</p>
          </div>
        )}
      </section>

    </div>
  )
}

export default Dashboard
