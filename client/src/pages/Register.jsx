import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../store/authSlice'
import { register as registerRequest, saveSession } from '../services/authService'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const change = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    try {
      const result = await registerRequest(form)
      saveSession(result)
      dispatch(loginAction({ user: result.user, token: result.token }))
      navigate('/dashboard', { replace: true })
    } catch (err) { setError(err.message || 'Unable to create account.') }
    finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-card">
    <div className="auth-header"><span className="eyebrow">Create account</span><h1>Start tracking smarter</h1><p>Build better money habits with a clearer view of your finances.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Full name<input name="name" type="text" autoComplete="name" placeholder="Your full name" value={form.name} onChange={change} minLength={2} maxLength={80} required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={change} required /></label>
      <label>Password<input name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={change} minLength={8} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </div></div>
}
