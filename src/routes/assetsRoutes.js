const express = require('express')
const router = express.Router()
const {
  getAllAssets,
  addAsset,
  deleteAsset,
  getAsset,
  updateAsset,
  addComment,
  removeComment,
  addLike,
  removeLike,
  getAllTags,
  getAssetsByTag
} = require('../controllers/assetsController')
const auth = require('../middlewares/auth')

router.use(auth) // Protege todas as rotas abaixo deste middleware

router.get('/tags', getAllTags)
router.get('/tags/:tag', getAssetsByTag)

router.get('/', getAllAssets)
router.get('/:id', getAsset)
router.post('/', addAsset)
router.put('/:id', updateAsset)
router.delete('/:id', deleteAsset)

router.post('/:id/comments', addComment)
router.delete('/:id/comments/:commentId', removeComment)

router.post('/:id/likes', addLike)
router.delete('/:id/likes', removeLike)

module.exports = router