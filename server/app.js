
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./config/database')

let dbConnectionPromise

const app = express()


const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean)


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
}))


app.use(express.json())


app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PennyPilot API is running',
  })
})


app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!dbConnectionPromise) {
        dbConnectionPromise = connectDB().catch((error) => {
          dbConnectionPromise = null
          throw error
        })
      }

      await dbConnectionPromise
    }

    next()
  } catch (error) {
    next(error)
  }
})


app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/transactions', require('./routes/transactionRoutes'))
app.use('/api/budgets', require('./routes/budgetRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))


app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found.',
  })
})


app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    message: 'Internal server error.',
  })
})

module.exports = app

