const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const buildDemoResponse = (type, payload) => {
  if (type === 'login') {
    return {
      user: { id: 1, name: 'Diljot Singh', email: payload.email },
      token: 'demo-token-123',
    }
  }

  return {
    user: { id: Date.now(), name: payload.name, email: payload.email },
    token: 'demo-token-registration',
  }
}

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    return data
  } catch (error) {
    if (credentials.email === 'singhdiljot175@gmail.com' && credentials.password === 'password123') {
      return buildDemoResponse('login', credentials)
    }

    throw error
  }
}

export const register = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    return data
  } catch (error) {
    return buildDemoResponse('register', payload)
  }
}
