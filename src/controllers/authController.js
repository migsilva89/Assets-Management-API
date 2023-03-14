const User = require('../models/User')

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
  
  
  res.send({ user })
}

module.exports = {
  registerUser,
  loginUser
}
