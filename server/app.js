const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PennyPilot API is running',
  })
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/transactions', require('./routes/transactionRoutes'))
app.use('/api/budgets', require('./routes/budgetRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error.' })
})

module.exports = app
