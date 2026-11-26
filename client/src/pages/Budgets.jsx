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

  const expenseCategories = categories.filter(c => c.type === 'expense')

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.used || 0), 0)
  const remaining = totalLimit - totalSpent

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

    if (!category || !Number.isFinite(Number(limit)) || Number(limit) <= 0) {
      setError('Choose a category and enter a budget greater than zero.')
      return
    }

    try {
      setSaving(true)
      await onAddBudget({
        category,
        limit: Number(limit),
        month,
        color: expenseCategories.find(c => c.name === category)?.color || '#78965A',
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
    if (!window.confirm('Delete this budget?')) return

    setError('')
    try {
      await onDeleteBudget(id, month)
    } catch (err) {
      setError(err.message || 'Unable to delete this budget.')
    }
  }

  return (
    <div className="page-section">
      <header className="page-header budget-page-header">
        <div>
          <span className="eyebrow">Planning</span>
          <h1>Budgets</h1>
          <p>Set spending limits and keep your finances on track.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setError('')
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : '+ New budget'}
        </button>
      </header>

      <div className="budget-toolbar">
        <label htmlFor="budget-month">Budget month</label>
        <input
          id="budget-month"
          type="month"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
        />
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="budget-summary-grid">
        <div className="budget-summary-card">
          <span>Total allocated</span>
          <strong>{currency(totalLimit)}</strong>
        </div>
        <div className="budget-summary-card">
          <span>Total spent</span>
          <strong>{currency(totalSpent)}</strong>
        </div>
        <div className="budget-summary-card">
          <span>Remaining</span>
          <strong className={remaining < 0 ? 'budget-over' : ''}>
            {currency(remaining)}
          </strong>
        </div>
      </div>

      {showForm && (
        <section className="panel budget-form-panel">
          <h3>Create a budget</h3>
          <form className="budget-form" onSubmit={handleSubmit}>
            <label>
              Expense category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose category</option>
                {expenseCategories.map(c => (
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
                placeholder="e.g. 5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
            </label>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save budget'}
            </button>
          </form>
        </section>
      )}

      {loading ? (
        <p className="loading-note">Loading your budgets…</p>
      ) : budgets.length === 0 ? (
        <section className="panel budget-empty">
          <h3>No budgets for this month</h3>
          <p>Create a category budget to start tracking your spending.</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => setShowForm(true)}
          >
            Create your first budget
          </button>
        </section>
      ) : (
        <section className="budget-list-section">
          <div className="budget-list-heading">
            <h2>Category budgets</h2>
            <span>{budgets.length} active</span>
          </div>

          <div className="budget-grid">
            {budgets.map((budget) => {
              const used = Number(budget.used || 0)
              const cap = Number(budget.limit || 0)
              const percentage = cap > 0 ? (used / cap) * 100 : 0
              const progress = Math.min(percentage, 100)
              const overBudget = used > cap

              return (
                <article className="panel budget-item" key={budget._id || budget.category}>
                  <div className="budget-item-top">
                    <div className="budget-category-name">
                      <span
                        className="category-dot"
                        style={{ backgroundColor: budget.color || '#78965A' }}
                      />
                      <h3>{budget.category}</h3>
                    </div>
                    <button
                      className="budget-delete-button"
                      type="button"
                      onClick={() => handleDelete(budget._id)}
                      disabled={!budget._id}
                      aria-label={`Delete ${budget.category} budget`}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="budget-amount-line">
                    <strong>{currency(used)}</strong>
                    <span>of {currency(cap)}</span>
                  </div>

                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${overBudget ? 'is-over' : ''}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="budget-item-footer">
                    <span className={overBudget ? 'budget-over' : ''}>
                      {overBudget
                        ? `${currency(used - cap)} over budget`
                        : `${Math.round(percentage)}% used`}
                    </span>
                    <span>
                      {overBudget
                        ? 'Limit exceeded'
                        : `${currency(cap - used)} left`}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default Budgets
