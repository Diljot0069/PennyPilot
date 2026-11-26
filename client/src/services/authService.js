import api from './api'

export const login = (credentials) => api.post('/auth/login', {
  email: credentials.email.trim().toLowerCase(),
  password: credentials.password,
})
export const register = (payload) => api.post('/auth/register', {
  name: payload.name.trim(),
  email: payload.email.trim().toLowerCase(),
  password: payload.password,
})
export const saveSession = ({ token, user }) => {
  if (!token || !user) throw new Error('Server returned an incomplete authentication response.')
  localStorage.setItem('pennypilot-token', token)
  localStorage.setItem('pennypilot-user', JSON.stringify(user))
}
export const clearSession = () => {
  localStorage.removeItem('pennypilot-token')
  localStorage.removeItem('pennypilot-user')
}
