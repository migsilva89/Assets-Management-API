const User = require('../models/User')
const jwt = require('jsonwebtoken')

/**
 * @desc Registers a new user and returns the created user object.
 * @param {object} req - The HTTP request object.
 * @param res
 * @returns {Promise<object>} The created user object.
 */
const registerUser = async (req, res) => {
  const { name, email, password, nickName } = req.body
  
  try {
    const user = await User.create({ name, email, password, nickName })
    return res.send({ user })
    
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed!' })
    
  }
}

/**
 * @desc Authenticates a user with email and password and returns a JWT token.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The authenticated user object and JWT token.
 */
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
