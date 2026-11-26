
import { useState } from 'react'

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const Budgets = ({
  budgets = [],
  categories = [],
  onAddBudget,
  onDeleteBudget,
  onLoadBudgets,
  loading = false,
}) => {
  const currentMonth = new Date().toISOString().slice(0, 7)

  const [month, setMonth] = useState(currentMonth)
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const expenseCategories = categories.filter(
    (c) => c.type === 'expense'
  )

  const totalLimit = budgets.reduce(
    (sum, b) => sum + Number(b.limit || 0), 0
  )

  const totalSpent = budgets.reduce(
    (sum, b) => sum + Number(b.used || 0), 0
  )

  const remaining = totalLimit - totalSpent

  const usage = totalLimit > 0
    ? Math.round((totalSpent / totalLimit) * 100)
    : 0

  const handleMonthChange = async (value) => {
    setMonth(value)
    setError('')

    try {
      await onLoadBudgets(value)
    } catch (err) {
      setError(err.message || 'Unable to load budgets.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (
      !category ||
      !Number.isFinite(Number(limit)) ||
      Number(limit) <= 0
    ) {
      setError('Choose a category and enter a budget greater than zero.')
      return
    }

    try {
      setSaving(true)

      await onAddBudget({
        category,
        limit: Number(limit),
        month,
        color:
          expenseCategories.find((c) => c.name === category)?.color ||
          '#78966A',
      })

      setCategory('')
      setLimit('')
      setShowForm(false)
    } catch (err) {
      setError(err.message || 'Unable to save this budget.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this budget?')) return

    setError('')

    try {
      await onDeleteBudget(id, month)
    } catch (err) {
      setError(err.message || 'Unable to delete this budget.')
    }
  }

  return (
    <div className="page-section budgets-page">

      <header className="budget-hero">
        <div>
          <span className="eyebrow">FINANCIAL PLANNING</span>
          <h1>Budgets</h1>
          <p>
            Take control of your spending, one category at a time.
          </p>
        </div>

        <button
          className="primary-button budget-create-button"
          type="button"
          onClick={() => {
            setError('')
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Close form' : '+ Create budget'}
        </button>
      </header>

      <section className="budget-period-panel">
        <div>
          <span className="budget-section-label">REPORTING PERIOD</span>
          <h3>Monthly overview</h3>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          aria-label="Select budget month"
        />
      </section>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <section className="budget-overview-grid">

        <article className="budget-overview-card budget-total-card">
          <span className="budget-card-label">TOTAL ALLOCATED</span>
          <strong>{currency(totalLimit)}</strong>
          <span className="budget-card-caption">
            Your monthly spending allowance
          </span>
          <span className="budget-card-symbol">₹</span>
        </article>

        <article className="budget-overview-card">
          <span className="budget-card-label">TOTAL SPENT</span>
          <strong>{currency(totalSpent)}</strong>
          <span className="budget-card-caption">
            Money spent this month
          </span>
          <span className="budget-card-symbol">↗</span>
        </article>

        <article className="budget-overview-card">
          <span className="budget-card-label">REMAINING BALANCE</span>
          <strong className={remaining < 0 ? 'budget-over' : ''}>
            {currency(remaining)}
          </strong>
          <span className="budget-card-caption">
            {remaining < 0
              ? 'You have exceeded your budget'
              : 'Available spending allowance'}
          </span>
          <span className="budget-card-symbol">◷</span>
        </article>

      </section>

      <section className="budget-utilization-panel">
        <div className="budget-utilization-heading">
          <div>
            <span className="budget-section-label">
              SPENDING PERFORMANCE
            </span>
            <h3>Monthly utilization</h3>
          </div>

          <strong>{usage}%</strong>
        </div>

        <div className="budget-utilization-track">
          <div
            className={`budget-utilization-fill ${
              usage > 100 ? 'is-over' : ''
            }`}
            style={{ width: `${Math.min(usage, 100)}%` }}
          />
        </div>

        <div className="budget-utilization-footer">
          <span>{currency(totalSpent)} spent</span>
          <span>{currency(totalLimit)} allocated</span>
        </div>
      </section>

      {showForm && (
        <section className="budget-create-panel">
          <div className="budget-create-heading">
            <div>
              <span className="budget-section-label">NEW ALLOCATION</span>
              <h2>Create a budget</h2>
              <p>Set a monthly spending limit for a category.</p>
            </div>
            <span className="budget-form-icon">＋</span>
          </div>

          <form className="budget-form" onSubmit={handleSubmit}>
            <label>
              Expense category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {expenseCategories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Monthly limit (₹)
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving budget...' : 'Save budget'}
            </button>
          </form>
        </section>
      )}

      <section className="budget-list-section">
        <div className="budget-list-heading">
          <div>
            <span className="budget-section-label">YOUR ALLOCATIONS</span>
            <h2>Category budgets</h2>
            <p>Monitor how much you spend in each category.</p>
          </div>

          <span className="budget-count">
            {budgets.length} active
          </span>
        </div>

        {loading ? (
          <div className="budget-empty-state">
            <p>Loading your budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="budget-empty-state">
            <span className="budget-empty-icon">₹</span>
            <h3>No budgets yet</h3>
            <p>
              Create your first category budget to start managing
              your monthly expenses.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => setShowForm(true)}
            >
              Create your first budget
            </button>
          </div>
        ) : (
          <div className="budget-grid">
            {budgets.map((budget) => {
              const used = Number(budget.used || 0)
              const cap = Number(budget.limit || 0)
              const percentage = cap > 0
                ? Math.round((used / cap) * 100)
                : 0
              const overBudget = used > cap
              const progress = Math.min(percentage, 100)

              return (
                <article
                  className="budget-item-card"
                  key={budget._id || budget.category}
                >
                  <div className="budget-item-top">
                    <div className="budget-category-name">
                      <span
                        className="budget-category-icon"
                        style={{
                          backgroundColor: `${budget.color || '#78966A'}20`,
                          color: budget.color || '#78966A',
                        }}
                      >
                        ₹
                      </span>

                      <div>
                        <h3>{budget.category}</h3>
                        <span>Monthly allocation</span>
                      </div>
                    </div>

                    <button
                      className="budget-delete-button"
                      type="button"
                      onClick={() => handleDelete(budget._id)}
                      disabled={!budget._id}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="budget-item-amounts">
                    <strong>{currency(used)}</strong>
                    <span>of {currency(cap)}</span>
                  </div>

                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${
                        overBudget ? 'is-over' : ''
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="budget-item-footer">
                    <span className={overBudget ? 'budget-over' : ''}>
                      {percentage}% used
                    </span>

                    <strong className={overBudget ? 'budget-over' : ''}>
                      {overBudget
                        ? `${currency(used - cap)} over limit`
                        : `${currency(cap - used)} remaining`}
                    </strong>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}

export default Budgets
