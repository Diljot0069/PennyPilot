import { useEffect } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import { setTransactions, addTransaction, removeTransaction, setBudgets, setCategories, setFinanceLoading, setFinanceError } from './store/financeSlice'
import { getTransactions, createTransaction, deleteTransaction } from './services/transactionService'
import {
  getBudgets,
  createBudget,
  deleteBudget,
} from './services/budgetService'
import { getCategories } from './services/categoryService'
import './App.css'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const { transactions, budgets, categories, loading, error } = useSelector((state) => state.finance)
  const authRoute = ['/login', '/register'].includes(location.pathname)

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    dispatch(setFinanceLoading(true))
    Promise.all([getTransactions(), getBudgets(), getCategories()])
      .then(([tx, budgetData, categoryData]) => {
        if (!active) return
        dispatch(setTransactions(tx))
        dispatch(setBudgets(budgetData))
        dispatch(setCategories(categoryData))
        dispatch(setFinanceError(null))
      })
      .catch((err) => { if (active) dispatch(setFinanceError(err.message || 'Unable to load your finance data.')) })
      .finally(() => { if (active) dispatch(setFinanceLoading(false)) })
    return () => { active = false }
  }, [isAuthenticated, dispatch])

  const handleAddTransaction = async (payload) => {
    const saved = await createTransaction(payload)
    dispatch(addTransaction(saved))
  }

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id)
    dispatch(removeTransaction(id))
  }

  if (authRoute) return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
  </Routes>

  return <div className="app-shell">
    <Sidebar />
    <div className="main-panel">
      <Navbar />
      <main className="content">
        {error && <div className="form-error" role="alert">{error}</div>}
        {loading && <p className="loading-note">Loading your financial data…</p>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard transactions={transactions} budgets={budgets} categories={categories} /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Transactions transactions={transactions} categories={categories} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Budgets budgets={budgets} /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Reports transactions={transactions} /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Categories categories={categories} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </div>
}
export default App
