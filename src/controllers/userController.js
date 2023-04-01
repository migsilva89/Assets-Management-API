const User = require('../models/User')
const blacklist = require('../utils/blacklist')
const fs = require('fs')
const Asset = require('../models/Asset')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing users.
 */


/**
 * @swagger
 *
 * /api/v1/user/{id}:
 *   get:
 *     summary: Returns the user with the specified ID.
 *     description: Returns the user object of the user with the specified ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK. Returns the user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  
  if (!user) {
    return res.status(404).send('User not found')
  }
  res.send(user)
})


/**
 * @swagger
 *
 * /api/v1/users:
 *   get:
 *     summary: Returns a list of all users.
 *     description: Returns an array of user objects for all users.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK. Returns an array of user objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.send(users)
})


/**
 * @swagger
 *
 * /api/v1/user:
 *   put:
 *     summary: Updates the authenticated user.
 *     description: Updates the authenticated user using the data provided in the request body.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: User
 *         description: The user object to update.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: OK. Returns the updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user
  
  const user = await User.findById(id)
  
  if (!user) {
    return res.status(404).json({ msg: 'User not found' })
  }
  
  // Check if the current avatar is different from "no-photo.jpg"
  if (user.avatar !== 'no-photo.jpg') {
    const filePath = `images/usersAvatar/${user.avatar}`
    
    // Check if the file exists before deleting it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
  
  // Update user avatar if image is sent
  if (req.file) {
    const { filename } = req.file
    user.avatar = filename
  }
  
  // Basic validations for email, password, name, and nickname
  const { name, email, password, nickName } = req.body
  
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
    if (existingUser && existingUser.id !== id) {
      return res.status(400).json({ error: 'Email is already in use' })
    }
  }
  
  // Check if the nickName already exists in the database
  const existingNickNameUser = await User.findOne({ nickName })
  if (existingNickNameUser && existingNickNameUser.id !== id) {
    return next(new ErrorResponse('Nickname is already in use'), 400)
  }
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  } else if (password.length < 8) {
    return next(new ErrorResponse('Password should be at least 8 characters long batatas'), 400)
    // return res.status(400).json({ error: 'Password should be at least 8 characters long' })
  }
  
  // Update user data
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      name,
      nickName,
      email,
      password,
      avatar: req.file ? req.file.filename : user.avatar
    },
    { new: true }
  )
  
  res.json(updatedUser)
})


/**
 * @swagger
 *
 * /api/v1/user:
 *   delete:
 *     summary: Deletes the authenticated user.
 *     description: Deletes the authenticated user and invalidates their access token.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK. Returns a message indicating that the user has been deleted and instructing them to log out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the user has been deleted and instructing them to log out.
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = req.user
  
  // Find the default owner
  const defaultOwner = await User.findOne({ email: 'deleteduser@example.com' })
  
  // Update the owner ID of all assets posted by the deleted user to the ID of the default owner
  await Asset.updateMany({ owner: user._id }, { owner: defaultOwner._id })
  
  // Remove the user from the database
  await User.findByIdAndDelete(user._id)
  
  // Invalidate the user's access token by adding it to the blacklist
  const token = req.token
  blacklist.addToken(token)
  
  // Send a response indicating that the user has been deleted and instructing them to log out
  res.status(200).json({ message: 'User deleted. Please log out.' })
})


module.exports = { getUser, updateUser, getAllUsers, deleteUser }