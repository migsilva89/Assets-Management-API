const express = require('express')

const assets = require('./routes/assetsRoutes')
const auth = require('./routes/authRoutes')
const connectDB = require('./database/connection')
const morgan = require('morgan')
require('dotenv').config()
const app = express()

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/v1/auth', auth)
app.use('/api/v1/assets', assets)
app.get('/', (req, res) => {
  res.send('Dev Assets API -> Home page')
})

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()
