const dotenv = require('dotenv')
const app = require('./app')
const connectDB = require('./config/database')

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
  console.log(`PennyPilot server running on http://localhost:${PORT}`)
})
