const express = require('express')
const router = express.Router()

//importar os nosso controllers
const { getAllAssets } = require('../controllers/assetsController')

router.route('/').get(getAllAssets)

module.exports = router