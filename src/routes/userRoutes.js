const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { getUser, updateUser, getAllUsers, deleteUser } = require('../controllers/userController')
const { updateAvatar, deleteAvatar } = require('../controllers/imageController')
const upload = require('../middlewares/multerConfig')

router.use(auth) // Protege todas as rotas abaixo deste middleware

// /**
//  * @swagger
//  * /:
//  *   get:
//  *     summary: Get user information
//  *     description: Use this route to get information about the current user.
//  *     responses:
//  *       200:
//  *         description: User information retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  */
router.get('/', getUser)
router.put('/', updateUser)
router.delete('/', deleteUser)
router.get('/all', getAllUsers)
router.put('/avatar', upload.single('avatar'), updateAvatar)
router.delete('/avatar', deleteAvatar)


module.exports = router