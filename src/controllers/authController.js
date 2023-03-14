const User = require('../models/User')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const { name, email, password, nickName } = req.body
  try {
    const user = await User.create({ name, email, password, nickName })
    return res.send({ user })
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed!' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  
  // Check for user
  const user = await User.findOne({ email }).select('+password')
  
  if (!user)
    return res.status(400).send({ error: 'User not found!' })
  
  // Check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch)
    return res.status(400).send({ error: 'Invalid Password' })
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.EXPIRES_IN
  })
  
  res.send({ user, token })
}

module.exports = {
  registerUser,
  loginUser
}
