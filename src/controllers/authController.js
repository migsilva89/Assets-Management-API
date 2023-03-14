const User = require('../models/User')

const registerUser = async (req, res) => {
  const { name, email, password, nickName } = req.body
  console.log(name, email, password, nickName)
  
  try {
    const user = await User.create({ name, email, password, nickName })
    return res.send({ user })
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed!' })
  }
}

const loginUser = async (req, res) => {
  res.send('ok')
}

module.exports = {
  registerUser,
  loginUser
}
