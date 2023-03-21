const express = require('express')
const http = require('http')
const colors = require('colors')
const assets = require('./routes/assetsRoutes')
const auth = require('./routes/authRoutes')
const user = require('./routes/userRoutes')
const connectDB = require('./database/connection')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()
const { Server } = require('socket.io')


const app = express()
const server = http.createServer(app)

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/images', express.static('images'))
app.use(express.json())
app.use(cors())

// app.use(errorHandler)
app.use('/api/v1/user', user)
app.use('/api/v1/auth', auth) // Private routes below:
app.use('/api/v1/assets', assets)

app.get('/', (req, res) => {
  res.send('Dev Assets API -> Home page')
})

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})

//python3 -m http.server
io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id)
  
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data)
  })
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
})

server.listen(process.env.PORT, async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log(`server is running on port ${process.env.PORT}`.yellow.bold)
  } catch (err) {
    console.log(err.red)
  }
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})
