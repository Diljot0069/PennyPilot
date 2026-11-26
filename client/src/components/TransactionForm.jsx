import { useMemo, useState } from 'react'

const today = new Date().toISOString().slice(0, 10)
const TransactionForm = ({ categories = [], onAddTransaction }) => {
  const [form, setForm] = useState({ title: '', type: 'expense', amount: '', category: '', date: today })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const availableCategories = useMemo(() => categories.filter((c) => c.type === form.type), [categories, form.type])
  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value, ...(name === 'type' ? { category: '' } : {}) }))
  }
  const submit = async (event) => {
    event.preventDefault(); setError('')
    if (!form.title.trim() || !form.category || !Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      setError('Enter a title, choose a category and provide an amount greater than zero.')
      return
    }
    setSaving(true)
    try {
      await onAddTransaction({ ...form, title: form.title.trim(), amount: Number(form.amount) })
      setForm({ title: '', type: 'expense', amount: '', category: '', date: today })
    } catch (err) { setError(err.message || 'Could not save transaction.') }
    finally { setSaving(false) }
  }
  return <form className="transaction-form" onSubmit={submit}>
    <label>Title<input name="title" type="text" value={form.title} onChange={change} placeholder="e.g. Grocery shopping" required /></label>
    <div className="form-row two-up">
      <label>Type<select name="type" value={form.type} onChange={change}><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></select></label>
      <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="0.00" required /></label>
    </div>
    <div className="form-row two-up">
      <label>Category<select name="category" value={form.category} onChange={change} required><option value="">Choose category</option>{availableCategories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}</select></label>
      <label>Date<input name="date" type="date" value={form.date} onChange={change} required /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit" className="primary-button full-width" disabled={saving}>{saving ? 'Saving…' : 'Save transaction'}</button>
  </form>
}
export default TransactionForm
