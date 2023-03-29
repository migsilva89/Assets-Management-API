const User = require('../models/User')
const blacklist = require('../utils/blacklist')
const fs = require('fs')
const Asset = require('../models/Asset')

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
const getUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user)
      return res.status(404).send('Usuario nao encontrado')
    res.send(user)
  } catch (error) {
    next(error.message)
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
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    next(error.message)
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
const updateUser = async (req, res, next) => {
  const { id } = req.user
  try {
    const user = await User.findById(id)
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }
    
    // Verifica se o avatar atual é diferente de "no-photo.jpg"
    if (user.avatar !== 'no-photo.jpg') {
      const filePath = `images/usersAvatar/${user.avatar}`
      
      // Verifica se o arquivo existe antes de excluí-lo
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
    
    // Atualiza o avatar do usuário se a imagem foi enviada
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
    
    const emailRegex = /\S+@\S+\.\S+/
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email is not valid' })
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    } else if (password.length < 8) {
      return res.status(400).json({ error: 'Password should be at least 8 characters long' })
    }
    
    // Atualiza os dados do usuário
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
  } catch (error) {
    next(error.message)
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
const deleteUser = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error.message)
  }
}


module.exports = { getUser, updateUser, getAllUsers, deleteUser }