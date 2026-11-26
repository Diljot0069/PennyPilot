import { createSlice } from '@reduxjs/toolkit'
const getSession = () => {
  try {
    const token = localStorage.getItem('pennypilot-token')
    const user = JSON.parse(localStorage.getItem('pennypilot-user') || 'null')
    return token && user ? { token, user } : { token: null, user: null }
  } catch {
    localStorage.removeItem('pennypilot-token')
    localStorage.removeItem('pennypilot-user')
    return { token: null, user: null }
  }
}
const session = typeof window !== 'undefined' ? getSession() : { token: null, user: null }
const authSlice = createSlice({
  name: 'auth',
  initialState: { ...session, isAuthenticated: Boolean(session.token && session.user) },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = Boolean(state.user && state.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload } },
  },
})
export const { login, logout, updateUser } = authSlice.actions
export default authSlice.reducer
