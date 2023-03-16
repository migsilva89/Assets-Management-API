const Asset = require('../models/Asset')

/**
 * @desc Get all assets
 * @route GET /api/v1/assets
 * @access Private
 */
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find({})
    res.status(400).json(assets)
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Get single asset
 * @route Get /api/v1/assets/:id
 * @access Private
 */
const getAsset = async (req, res) => {
  res.send('get one')
}

/**
 * @desc Add one asset
 * @route POST /api/v1/assets
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

/**
 * @desc Update asset
 * @route POST /api/v1/assets:id
 * @access Private
 */
const updateAsset = async (req, res) => {
  res.send('update')
}

/**
 *
 * @desc Delete one asset
 * @route POST /api/v1/assets/:id
 * @access Private
 */
const deleteAsset = async (req, res) => {
  console.log(req.params)
  res.send(req.params)
}


module.exports = {
  getAllAssets,
  addAsset,
  deleteAsset,
  getAsset,
  updateAsset
}
