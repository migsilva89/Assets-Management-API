const User = require('../models/User')
const jwt = require('jsonwebtoken')

/**
 * @desc Generate token
 * @param params (user.id)
 * @returns User Token
 */
function generateToken(params){
  return jwt.sign({ id: params }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: 60
  })
}

/**
 * @desc Registers a new user and returns the created user object and a token.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route POST /api/v1/register
 */
const registerUser = async (req, res) => {
  const { name, email, password, nickName } = req.body
  
  try {
    const user = await User.create({ name, email, password, nickName })
    return res.send({
      user,
      token: generateToken(user.id)
    })
    
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed!' })
  }
}

/**
 * @desc Authenticates a user with email and password and returns a JWT token.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The authenticated user object and JWT token.
 * @route POST /api/v1/login
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
  
  res.send({
    user,
    token: generateToken(user.id)
  })
}

module.exports = {
  registerUser,
  loginUser
}
