const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const { getUser, updateUser, getAllUsers, deleteUser } = require('../controllers/userController')
const { updateAvatar, deleteAvatar } = require('../controllers/imageController')
const upload = require('../middlewares/multerConfig')

router.use(auth) // Protege todas as rotas abaixo deste middleware

router.get('/', getUser)
router.put('/', updateUser)
router.delete('/', deleteUser)
router.get('/all', getAllUsers)
router.put('/avatar', upload.single('avatar'), updateAvatar)
router.delete('/avatar', deleteAvatar)


module.exports = router