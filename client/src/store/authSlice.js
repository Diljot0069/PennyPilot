import { createSlice } from '@reduxjs/toolkit'

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('pennypilot-token') : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedToken
      ? {
          id: 1,
          name: 'Diljot Singh',
          email: 'singhdiljot175@gmail.com',
        }
      : null,
    isAuthenticated: Boolean(storedToken),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
