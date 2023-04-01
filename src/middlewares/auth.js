const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('./asyncHandler')

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' })
  
  // Split the header into its parts
  const parts = authHeader.split(' ')
  const [_, token] = parts
  
  // Verify the token and extract the user ID from it
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
  const { id } = decoded
  
  // Find the user in the database
  const user = await User.findById(id)
  
  if (!user) {
    return res.status(401).send({ error: 'Token invalid' })
  }
  
  req.token = token
  req.user = user
  next()
})

module.exports = auth
