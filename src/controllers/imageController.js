const User = require('../models/User')

/**
 * @desc Atualiza o avatar do usuário autenticado.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route GET /api/v1/user/avatar
 */
const updateAvatar = async (req, res) => {
  // res.send(req.file.filename)
  // console.log(req.user.id)
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }
    
    if (req.file) {
      user.avatar = req.file.filename
    }
    
    await User.findByIdAndUpdate(req.user.id, user)
    
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro do servidor')
  }
}

// Exclui o avatar do usuário autenticado
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }
    
    // Define o avatar como "no-photo.jpg"
    user.avatar = 'no-photo.jpg'
    
    // Atualiza o documento do usuário na coleção
    await User.findByIdAndUpdate(req.user.id, { $set: { avatar: user.avatar } })
    
    res.json({ msg: 'Avatar excluído com sucesso' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro do servidor')
  }
}

module.exports = { updateAvatar, deleteAvatar }