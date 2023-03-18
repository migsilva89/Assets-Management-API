const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const { getUser } = require('../controllers/userController')

router.use(auth) // Protege todas as rotas abaixo deste middleware
router.get('/', getUser)

module.exports = router