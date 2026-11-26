import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import TrendChart from '../charts/TrendChart'
import CategoryDonutChart from '../charts/CategoryDonutChart'
import TransactionTable from '../components/TransactionTable'
const currency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const Dashboard = ({ transactions = [], budgets = [] }) => {
  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const spend = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { income, spend, balance: income - spend, savingsRate: income ? ((income - spend) / income) * 100 : 0 }
  }, [transactions])
  const grouped = Object.values(transactions.filter((t) => t.type === 'expense').reduce((acc, t) => { acc[t.category] = acc[t.category] || { name: t.category, value: 0 }; acc[t.category].value += Number(t.amount); return acc }, {}))
  const monthly = [{ month: 'Income', amount: summary.income }, { month: 'Expenses', amount: summary.spend }]
  const stats = [
    { label: 'Net balance', value: currency(summary.balance), tone: summary.balance >= 0 ? 'positive' : 'negative' },
    { label: 'Total income', value: currency(summary.income), tone: 'positive' },
    { label: 'Total expenses', value: currency(summary.spend), tone: 'negative' },
    { label: 'Savings rate', value: `${Math.round(summary.savingsRate)}%`, tone: 'positive' },
  ]
  return <div className="page-section"><header className="page-header"><div><span className="eyebrow">Overview</span><h1>Dashboard</h1><p>Your finances, synced with your account.</p></div></header>
    <section className="stats-grid">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
    <section className="chart-grid two-col"><div className="panel"><div className="panel-header"><h3>Income vs expenses</h3></div><MonthlyBarChart data={monthly} /></div><div className="panel"><div className="panel-header"><h3>Spending by category</h3></div><CategoryDonutChart data={grouped} /></div></section>
    <section className="panel"><div className="panel-header"><h3>Cash flow trend</h3></div><TrendChart data={monthly.map((x) => ({ month: x.month, value: x.amount }))} /></section>
    <section className="panel"><div className="panel-header"><h3>Recent transactions</h3></div><TransactionTable transactions={transactions.slice(0, 5)} /></section>
    {budgets.length > 0 && <section className="panel"><div className="panel-header"><h3>Monthly budgets</h3></div><p>{budgets.length} active budget(s)</p></section>}
  </div>
}
export default Dashboard
