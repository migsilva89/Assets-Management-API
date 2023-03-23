const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAuthenticatedUser } = require('../controllers/authController')
const auth = require('../middlewares/auth')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.use(auth) // Protege todas as rotas abaixo deste middleware
router.get('/user', getAuthenticatedUser)

module.exports = router
