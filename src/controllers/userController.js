const User = require('../models/User')

/**
 * @desc Returns the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route GET /api/v1/user
 */
const getUser = async (req, res) => {
  const { id } = req.user
  console.log('tou dentro de get user')
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
  res.send('all users')
}

/**
 * @desc Updates the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route PUT /api/v1/user
 */
const updateUser = async (req, res) => {
  res.send(req.user)
}

/**
 * @desc Deletes the authenticated user.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route DELETE /api/v1/user
 */
const deleteUser = async (req, res) => {
  res.send('Delete user')
}

module.exports = { getUser, updateUser, getAllUsers, deleteUser }