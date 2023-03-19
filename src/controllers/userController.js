const User = require('../models/User')
const blacklist = require('../utils/blacklist')

/**
 * @desc Returns the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route GET /api/v1/user
 */
const getUser = async (req, res) => {
  const { id } = req.user
  try {
    const user = await User.findById(id)
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

/**
 * @desc Returns a list of all users.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route GET /api/v1/user
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
 * @desc Updates the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route PUT /api/v1/user
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
 * @desc Deletes the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route DELETE /api/v1/user
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