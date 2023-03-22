const User = require('../models/User')
const fs = require('fs')

//TODO url para aceder a imagem no FE: http://localhost:5000/images/my-image.jpg"

/**
 * @swagger
 * tags:
 *   name: Avatar
 *   description: API endpoints for managing user avatars.
 */

/**
 * @swagger
 * /api/v1/user/avatar:
 *   put:
 *     summary: Update the avatar of the authenticated user.
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               msg: Usuário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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

/**
 * @swagger
 * /api/v1/user/avatar:
 *   delete:
 *     summary: Delete the avatar of the authenticated user.
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The success message.
 *         content:
 *           application/json:
 *             example:
 *               msg: Avatar excluído com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               msg: Usuário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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