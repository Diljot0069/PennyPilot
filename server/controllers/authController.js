
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required.',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters.',
    })
  }

  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = await User.findOne({
    email: normalizedEmail,
  })

  if (existingUser) {
    return res.status(409).json({
      message: 'An account with this email already exists.',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  })

  const token = generateToken(user._id)

  return res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body || {}

  if (!email?.trim() || !password) {
    return res.status(400).json({
      message: 'Email and password are required.',
    })
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select('+password')

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    })
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  )

  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    })
  }

  const token = generateToken(user._id)

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

module.exports = { register, login }
