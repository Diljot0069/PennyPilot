import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import TrendChart from '../charts/TrendChart'
import CategoryDonutChart from '../charts/CategoryDonutChart'
import TransactionTable from '../components/TransactionTable'

const Dashboard = ({ transactions = [], budgets = [], categories = [] }) => {
  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const spend = Math.abs(
      transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    )

    const balance = income - spend
    const savingsRate = income ? ((income - spend) / income) * 100 : 0

    return { income, spend, balance, savingsRate }
  }, [transactions])

  const recentTransactions = transactions.slice(0, 4)
  const chartData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1350 },
    { month: 'Mar', amount: 1400 },
    { month: 'Apr', amount: 1600 },
    { month: 'May', amount: 1780 },
    { month: 'Jun', amount: summary.balance },
  ]

  const trendData = [
    { month: 'Jan', value: 1800 },
    { month: 'Feb', value: 2100 },
    { month: 'Mar', value: 2400 },
    { month: 'Apr', value: 2600 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: summary.balance },
  ]

  const donutData = categories.map((category) => ({
    name: category.name,
    value: category.amount,
  }))

  const stats = [
    { label: 'Net balance', value: `$${summary.balance.toFixed(2)}`, trend: '+8.4%', tone: 'positive' },
    { label: 'Monthly income', value: `$${summary.income.toFixed(2)}`, trend: '+3.1%', tone: 'positive' },
    { label: 'Monthly spend', value: `$${summary.spend.toFixed(2)}`, trend: '-2.6%', tone: 'negative' },
    { label: 'Savings rate', value: `${Math.round(summary.savingsRate)}%`, trend: '+5.2%', tone: 'positive' },
  ]

  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Dashboard</h1>
        </div>
        <button className="primary-button">Export report</button>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="chart-grid two-col">
        <div className="panel">
          <div className="panel-header">
            <h3>Cash flow</h3>
          </div>
          <MonthlyBarChart data={chartData} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Spending by category</h3>
          </div>
          <CategoryDonutChart data={donutData} />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Trend</h3>
        </div>
        <TrendChart data={trendData} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Recent transactions</h3>
        </div>
        <TransactionTable transactions={recentTransactions} compact />
      </section>
    </div>
  )
}

export default Dashboard
