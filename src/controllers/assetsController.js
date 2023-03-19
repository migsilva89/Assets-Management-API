const Asset = require('../models/Asset')

/**
 * @desc Get all assets
 * @route GET /api/v1/assets
 * @access Private
 */
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find({})
    res.status(200).json(assets)
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
  try {
    const asset = await Asset.findById(req.params.id)
    res.status(201).json({ success: true, asset })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Add one asset
 * @route POST /api/v1/assets
 * @access Private
 */
const addAsset = async (req, res, next) => {
  try {
    const owner = req.user._id
    if (!owner) {
      return res.status(400).json({ success: false, error: 'no user found' })
    }
    
    const { name, description, tags } = req.body
    const asset = await Asset.create({ name, description, owner, tags })
    res.status(201).json(asset)
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
    // next(error)
  }
}

/**
 * @desc Update asset
 * @route POST /api/v1/assets:id
 * @access Private
 */
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({ success: true, data: asset })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 *
 * @desc Delete one asset
 * @route POST /api/v1/assets/:id
 * @access Private
 */
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id)
    res.status(201).json({ success: true, asset })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Add comment to asset
 * @route POST /api/v1/assets/:id/comments
 * @access Private
 */
const addComment = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' })
    }
    
    const { text } = req.body
    const author = req.user._id
    const assetId = { text, author }
    const newComment = {
      text: req.body.text,
      author: req.user._id,
      asset: req.params.id
    }
    
    asset.comments.unshift(newComment)
    await asset.save()
    res.status(201).json({ success: true, data: asset })
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Remove comment from an asset
 * @route DELETE /api/v1/assets/:id/comments/:commentId
 * @access Private
 */
const removeComment = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' })
    }
    
    const commentId = req.params.commentId
    const comment = asset.comments.find(comment => comment._id.toString() === commentId.toString())
    
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' })
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this comment' })
    }
    
    const removeIndex = asset.comments.findIndex(comment => comment._id.toString() === commentId.toString())
    asset.comments.splice(removeIndex, 1)
    await asset.save()
    
    res.status(200).json({ success: true, data: asset })
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Add like to asset
 * @route POST /api/v1/assets/:id/likes
 * @access Private
 */
const addLike = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' })
    }
    
    const userId = req.user._id
    if (asset.likes.includes(userId)) {
      return res.status(400).json({ success: false, error: 'User has already liked this asset' })
    }
    
    asset.likes.push(userId)
    await asset.save()
    res.status(200).json({ success: true, data: asset })
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

/**
 * @desc Remove like from asset
 * @route DELETE /api/v1/assets/:id/likes
 * @access Private
 */
const removeLike = async (req, res) => {
  try {
    const assetId = req.params.id
    const asset = await Asset.findById(assetId)
    
    if (!asset) {
      return res.status(404).send('Asset not found')
    }
    
    const likeIndex = asset.likes.indexOf(req.user.id)
    if (likeIndex === -1) {
      return res.status(400).send('You have not liked this asset')
    }
    
    asset.likes.splice(likeIndex, 1)
    await asset.save()
    
    res.status(200).send('Like removed successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}


module.exports = {
  getAllAssets,
  addAsset,
  deleteAsset,
  getAsset,
  updateAsset,
  addComment,
  removeComment,
  addLike,
  removeLike
}
