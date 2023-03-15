const express = require('express')
const router = express.Router()
const { getAllAssets, addAsset } = require('../controllers/assetsController')

router.get('/', getAllAssets)
router.post('/', addAsset)

module.exports = router