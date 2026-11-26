const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email: normalizedEmail })

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

    const token = createToken(user._id)

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }
    throw error
  }
}

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

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    })
  }

  const token = createToken(user._id)

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

module.exports = { register, login }
