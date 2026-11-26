const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const app = require('./app')
const connectDB = require('./config/database')
const PORT = process.env.PORT || 5001
;(async () => {
  try {
    await connectDB()
    app.listen(PORT, () => console.log(`PennyPilot server running on http://localhost:${PORT}`))
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
})()
