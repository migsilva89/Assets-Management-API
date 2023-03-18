const User = require('../models/User')

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

module.exports = { getUser }