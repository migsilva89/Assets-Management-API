const express = require('express')
const router = express.Router()
const { getAllAssets, addAsset, deleteAsset, getAsset, updateAsset } = require('../controllers/assetsController')

router.get('/', getAllAssets)
router.get('/:id', getAsset)
router.post('/', addAsset)
router.put('/:id', updateAsset)
router.delete('/:id', deleteAsset)

module.exports = router