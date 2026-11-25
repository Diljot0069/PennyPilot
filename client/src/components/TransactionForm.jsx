import { useState } from 'react'

const defaultForm = {
  title: 'Groceries',
  type: 'expense',
  amount: '145.89',
  category: 'Food',
  date: '2026-10-20',
}

const TransactionForm = ({ categories = [], onAddTransaction }) => {
  const [form, setForm] = useState(defaultForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title || !form.amount) return

    const amount = Number(form.amount)
    const signedAmount = form.type === 'income' ? Math.abs(amount) : -Math.abs(amount)

    onAddTransaction({
      title: form.title,
      category: form.category,
      amount: signedAmount,
      type: form.type,
      date: form.date,
    })

    setForm({ ...defaultForm, category: categories[0]?.name || 'Food' })
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input name="title" type="text" value={form.title} onChange={handleChange} />
      </label>

      <div className="form-row two-up">
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>
        </label>
        <label>
          Amount
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row two-up">
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.length ? (
              categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <>
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Income">Income</option>
              </>
            )}
          </select>
        </label>
        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </label>
      </div>

      <button type="submit" className="primary-button full-width">
        Save transaction
      </button>
    </form>
  )
}

export default TransactionForm
