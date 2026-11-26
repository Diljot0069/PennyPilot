import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../store/authSlice'
import { login as loginRequest, saveSession } from '../services/authService'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const change = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const result = await loginRequest(form)
      saveSession(result)
      dispatch(loginAction({ user: result.user, token: result.token }))
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) { setError(err.message || 'Unable to sign in.') }
    finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-card">
    <div className="auth-header"><span className="eyebrow">Welcome back</span><h1>Sign in to PennyPilot</h1><p>Take control of your money, one decision at a time.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={change} required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={change} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
    </form>
    <p className="auth-switch">Need an account? <Link to="/register">Create one</Link></p>
  </div></div>
}
