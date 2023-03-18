const express = require('express')
const router = express.Router()
const {
  getAllAssets,
  addAsset,
  deleteAsset,
  getAsset,
  updateAsset,
  addComment,
  addLike
} = require('../controllers/assetsController')
const auth = require('../middlewares/auth')

router.use(auth) // Protege todas as rotas abaixo deste middleware

router.get('/', getAllAssets)
router.get('/:id', getAsset)
router.post('/', addAsset)
router.put('/:id', updateAsset)
router.delete('/:id', deleteAsset)
router.post('/:id/comments', addComment)
router.post('/:id/likes', addLike)

module.exports = router