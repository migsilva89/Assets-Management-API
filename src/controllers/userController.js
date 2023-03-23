const User = require('../models/User')
const blacklist = require('../utils/blacklist')

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing users.
 */

/**
 * @swagger
 *
 * /api/v1/user:
 *   get:
 *     summary: Returns the authenticated user.
 *     description: Returns the user object of the authenticated user.
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: An authorization token for the user.
 *         schema:
 *           type: string
 *           format: bearerToken
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
const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

/**
 * @swagger
 *
 * /api/v1/users:
 *   get:
 *     summary: Returns a list of all users.
 *     description: Returns an array of user objects for all users.
 *     tags:
 *       - User
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
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

/**
 * @swagger
 *
 * /api/v1/user:
 *   put:
 *     summary: Updates the authenticated user.
 *     description: Updates the authenticated user using the data provided in the request body.
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: An authorization token for the user.
 *         schema:
 *           type: string
 *           format: bearerToken
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
const updateUser = async (req, res) => {
  const { id } = req.user
  try {
    const user = await User.findByIdAndUpdate(id, req.body)
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

/**
 * @swagger
 *
 * /api/v1/user:
 *   delete:
 *     summary: Deletes the authenticated user.
 *     description: Deletes the authenticated user and invalidates their access token.
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: An authorization token for the user.
 *         schema:
 *           type: string
 *           format: bearerToken
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
const deleteUser = async (req, res) => {
  try {
    const user = req.user
    
    // Remove the user from the database
    await User.findByIdAndDelete(user._id)
    
    // Invalidate the user's access token by adding it to the blacklist
    const token = req.token
    blacklist.addToken(token)
    
    // Send a response indicating that the user has been deleted and instructing them to log out
    res.status(200).json({ message: 'User deleted. Please log out.' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}


module.exports = { getUser, updateUser, getAllUsers, deleteUser }