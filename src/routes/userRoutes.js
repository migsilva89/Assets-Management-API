const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const { getUser, updateUser, getAllUsers, deleteUser } = require('../controllers/userController')

router.use(auth) // Protege todas as rotas abaixo deste middleware
router.get('/', getUser)
router.put('/', updateUser)
router.delete('/', deleteUser)
router.get('/all', getAllUsers)


module.exports = router