const express = require('express')
const colors = require('colors')
const assets = require('./routes/assetsRoutes')
const auth = require('./routes/authRoutes')
const connectDB = require('./database/connection')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()
const app = express()

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())

// app.use(errorHandler)
app.use('/api/v1/auth', auth)
app.use('/api/v1/assets', assets)
app.get('/', (req, res) => {
  res.send('Dev Assets API -> Home page')
})

const server = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`.yellow.bold)
    })
  } catch (err) {
    console.log(err.red)
  }
}

server()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})