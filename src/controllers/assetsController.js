const Asset = require('../models/Asset')

/**
 * @desc Get all assets
 * @route GET /api/v1/login
 * @access Private
 */
const getAllAssets = (req, res) => {
  console.log('oi')
  res.send('all assets')
}

/**
 * @desc Add one asset
 * @route POST /api/v1/login
 * @access Private
 */
const addAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body)
    res.status(201).json(asset)
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

module.exports = {
  getAllAssets,
  addAsset
}
