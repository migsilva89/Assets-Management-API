const User = require('../models/User')
const fs = require('fs')

//TODO url para aceder a imagem no FE: http://localhost:5000/images/my-image.jpg"

/**
 * @desc Atualiza o avatar do usuário autenticado.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Promise<object>} The created user object.
 * @route GET /api/v1/user/avatar
 */
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
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
    
    // Atualiza o avatar do usuário
    const { filename } = req.file
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { avatar: filename },
      { new: true }
    )
    
    res.json(updatedUser)
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
    
    // apaga o avatar anterior, se existir
    if (user.avatar) {
      fs.unlinkSync(`images/usersAvatar/${user.avatar}`)
    }
    
    user.avatar = 'no-photo.jpg'
    
    await User.findByIdAndUpdate(req.user.id, user)
    
    res.json({ msg: 'Avatar excluído com sucesso' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro do servidor')
  }
}


module.exports = { updateAvatar, deleteAvatar }