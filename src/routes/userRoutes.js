const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { getUser, updateUser, getAllUsers, deleteUser } = require('../controllers/userController')
const { deleteAvatar } = require('../controllers/imageController')
const upload = require('../middlewares/multerConfig')

router.use(auth) // Protege todas as rotas abaixo deste middleware
router.get('/:id', getUser)
router.put('/', upload.single('avatar'), updateUser)
router.delete('/', deleteUser)
router.get('/', getAllUsers)
router.delete('/avatar', deleteAvatar)


module.exports = router