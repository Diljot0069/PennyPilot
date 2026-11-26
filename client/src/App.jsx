import { useEffect, useState } from 'react'
import {
  Navigate,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

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


import {
  setTransactions,
  addTransaction,
  removeTransaction,
  setBudgets,
  setCategories,
  setFinanceLoading,
  setFinanceError,
} from './store/financeSlice'


import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from './services/transactionService'


import {
  getBudgets,
  createBudget,
  deleteBudget,
} from './services/budgetService'


import {
  getCategories,
  createCategory,
} from './services/categoryService'


import './App.css'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isDarkMode, setIsDarkMode] = useState(
  () => localStorage.getItem('pennypilot-theme') === 'dark'
)

useEffect(() => {
  document.documentElement.classList.toggle('dark-theme', isDarkMode)

  localStorage.setItem(
    'pennypilot-theme',
    isDarkMode ? 'dark' : 'light'
  )
}, [isDarkMode])

  
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  )

 
  const {
    transactions,
    budgets,
    categories,
    loading,
    error,
  } = useSelector((state) => state.finance)

  const authRoute = ['/login', '/register'].includes(
    location.pathname
  )


  useEffect(() => {
    if (!isAuthenticated) return

    let active = true

    const loadFinanceData = async () => {
      dispatch(setFinanceLoading(true))
      dispatch(setFinanceError(null))

      try {
        const [
          transactionData,
          budgetData,
          categoryData,
        ] = await Promise.all([
          getTransactions(),
          getBudgets(),
          getCategories(),
        ])

        if (!active) return

        dispatch(setTransactions(transactionData))
        dispatch(setBudgets(budgetData))
        dispatch(setCategories(categoryData))
      } catch (err) {
        if (!active) return

        dispatch(
          setFinanceError(
            err.message || 'Unable to load your financial data.'
          )
        )
      } finally {
        if (active) {
          dispatch(setFinanceLoading(false))
        }
      }
    }

    loadFinanceData()

    return () => {
      active = false
    }
  }, [isAuthenticated, dispatch])

  

  const handleAddTransaction = async (payload) => {
    const savedTransaction = await createTransaction(payload)

    dispatch(addTransaction(savedTransaction))

    return savedTransaction
  }

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id)

    dispatch(removeTransaction(id))
  }


  const handleAddBudget = async (payload) => {
    await createBudget(payload)

    const updatedBudgets = await getBudgets(payload.month)

    dispatch(setBudgets(updatedBudgets))
  }

  const handleDeleteBudget = async (id, month) => {
    await deleteBudget(id)

    const updatedBudgets = await getBudgets(month)

    dispatch(setBudgets(updatedBudgets))
  }

  const handleLoadBudgets = async (month) => {
    const updatedBudgets = await getBudgets(month)

    dispatch(setBudgets(updatedBudgets))
  }



  const handleAddCategory = async (payload) => {
    const savedCategory = await createCategory(payload)

    const updatedCategories = await getCategories()

    dispatch(setCategories(updatedCategories))

    return savedCategory
  }



  if (authRoute) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
    )
  }



  return (
    <div className="app-shell">

      <Sidebar />

      <div className="main-panel">

        <Navbar />

        <main className="content">

          {/* Global error message */}
          {error && (
            <div
              className="form-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <p className="loading-note">
              Loading your financial data...
            </p>
          )}

          <Routes>

            {/* DEFAULT ROUTE */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                >
                  <Dashboard
                    transactions={transactions}
                    budgets={budgets}
                    categories={categories}
                  />
                </ProtectedRoute>
              }
            />

            {/* TRANSACTIONS */}
            <Route
              path="/transactions"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                >
                  <Transactions
                    transactions={transactions}
                    categories={categories}
                    onAddTransaction={handleAddTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </ProtectedRoute>
              }
            />

            {/* BUDGETS */}
            <Route
              path="/budgets"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                >
                  <Budgets
                    budgets={budgets}
                    categories={categories}
                    onAddBudget={handleAddBudget}
                    onDeleteBudget={handleDeleteBudget}
                    onLoadBudgets={handleLoadBudgets}
                    loading={loading}
                  />
                </ProtectedRoute>
              }
            />

            {/* REPORTS */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                >
                  <Reports
                    transactions={transactions}
                  />
                </ProtectedRoute>
              }
            />

            {/* CATEGORIES */}
            <Route
              path="/categories"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                >
                  <Categories
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    loading={loading}
                  />
                </ProtectedRoute>
              }
            />

            {/* SETTINGS */}
           <Route
  path="/settings"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Settings
        isDarkMode={isDarkMode}
        onThemeChange={setIsDarkMode}
      />
    </ProtectedRoute>
  }
/>

            {/* UNKNOWN ROUTES */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </main>

        <Footer />

      </div>
    </div>
  )
}

export default App

