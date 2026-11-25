import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../store/authSlice'
import { register as registerRequest } from '../services/authService'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: 'Diljot Singh', email: 'singhdiljot175@gmail.com', password: 'password123' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await registerRequest(form)
      dispatch(loginAction(result.user))
      localStorage.setItem('pennypilot-token', result.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Create account</span>
          <h1>Start tracking smarter</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="name" type="text" placeholder="Diljot Singh" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
