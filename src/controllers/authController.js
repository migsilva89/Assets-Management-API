const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middlewares/asyncHandler')

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for managing authentication.
 */

/**
 * @desc Generate token
 * @param params (user.id)
 * @returns User Token
 * PUBLIC
 */
function generateToken(params){
  return jwt.sign({ id: params }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '1h'
  })
}


/**
 * @swagger
 *
 * /api/v1/auth/register:
 *   post:
 *     summary: Registers a new user and returns the created user object and a token.
 *     description: Registers a new user and returns the created user object and a token for authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User information to be registered.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               nickName:
 *                 type: string
 *                 description: The nickname of the user.
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: OK. Returns the created user object and a token for authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: An authentication token for the user.
 *       '400':
 *         $ref: '#/components/responses/BadRequestError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, nickName } = req.body
  //Add _id to seed
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  
  if (!nickName) {
    return res.status(400).json({ error: 'Nickname is required' })
  }
  
  // Check if the email already exists in the database
  const emailRegex = /\S+@\S+\.\S+/
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' })
  } else {
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' })
    }
  }
  
  // Check if the nickName already exists in the database
  const existingNickNameUser = await User.findOne({ nickName })
  if (existingNickNameUser) {
    return res.status(400).json({ error: 'Nickname is already in use' })
  }
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  } else if (password.length < 8) {
    return res.status(400).json({ error: 'Password should be at least 8 characters long' })
  }
  
  const user = await User.create({ name, email, password, nickName })
  return res.send({
    user,
    token: generateToken(user.id)
  })
})


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate a user with email and password and return a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: A user object and a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   name: object
 *                 token:
 *                   type: string
 *                   description: A JWT token.
 *       400:
 *         description: The provided email or password is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
const loginUser = asyncHandler(async (req, res) => {
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
})


const getAuthenticatedUser = asyncHandler(async (req, res) => {
  const { id } = req.user
  const user = await User.findById(id)
  res.send(user)
})

module.exports = {
  registerUser,
  loginUser,
  getAuthenticatedUser
}
