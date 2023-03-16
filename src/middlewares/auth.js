const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader)
      return res.status(401).send({ error: 'No token provided' })
    
    const parts = authHeader.split(' ')
    const [schema, token] = parts
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    const { id } = decoded
    const user = await User.findById(id)
    
    if (!user) {
      return res.status(401).send({ error: 'Token invalid' })
    }
    
    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = auth
