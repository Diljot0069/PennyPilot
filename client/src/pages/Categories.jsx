import { useState } from 'react'

const Categories = ({ categories = [], onAddCategory, loading = false }) => {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('expense')
  const [color, setColor] = useState('#78965A')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a category name.')
      return
    }

    try {
      setSaving(true)
      await onAddCategory({
        name: name.trim(),
        type,
        color,
      })
      setName('')
      setType('expense')
      setShowForm(false)
    } catch (err) {
      setError(err.message || 'Unable to create category.')
    } finally {
      setSaving(false)
    }
  }

  const CategoryGroup = ({ title, items }) => (
    <section className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <span>{items.length} categories</span>
      </div>

      {items.length === 0 ? (
        <p className="category-empty">No categories yet.</p>
      ) : (
        <div className="category-list">
          {items.map((category) => (
            <div
              className="category-item"
              key={category._id || `${category.type}-${category.name}`}
            >
              <div className="category-meta">
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color || '#78965A' }}
                />
                <span>{category.name}</span>
              </div>
              <span className="category-type-label">
                {category.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Organisation</span>
          <h1>Categories</h1>
          <p>Organise your income and spending.</p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setError('')
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : '+ Add category'}
        </button>
      </header>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <section className="panel category-form-panel">
          <h3>New category</h3>

          <form onSubmit={handleSubmit} className="category-form">
            <label>
              Category name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shopping"
                maxLength={40}
                required
              />
            </label>

            <label>
              Category type
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label>
              Category colour
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save category'}
            </button>
          </form>
        </section>
      )}

      {loading ? (
        <p className="loading-note">Loading your categories…</p>
      ) : (
        <div className="categories-grid">
          <CategoryGroup title="Expenses" items={expenseCategories} />
          <CategoryGroup title="Income" items={incomeCategories} />
        </div>
      )}
    </div>
  )
}

export default Categories
