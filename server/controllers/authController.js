const register = async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  return res.status(201).json({
    message: 'Registration successful',
    token: 'demo-token-for-registration',
    user: {
      id: Date.now(),
      name,
      email,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const validEmail = email === 'singhdiljot175@gmail.com'
  const validPassword = password === 'password123'

  if (!validEmail || !validPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  return res.status(200).json({
    message: 'Login successful',
    token: 'demo-token-123',
    user: {
      id: 1,
      name: 'Bhavika',
      email: 'singhdiljot175@gmail.com',
    },
  })
}

module.exports = { register, login }
