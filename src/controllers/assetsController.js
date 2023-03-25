const Asset = require('../models/Asset')

/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     summary: Returns a list of all assets.
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of assets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
 * @swagger
 * /api/v1/assets/{id}:
 *   get:
 *     summary: Get an asset by ID.
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the asset to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: The requested asset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 asset:
 *                   $ref: '#/components/schemas/Asset'
 *       400:
 *         description: The provided asset ID is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 error:
 *                   type: string
 *                   description: An error message.
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
 * @swagger
 * /api/v1/assets:
 *   post:
 *     summary: Add a new asset.
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the asset.
 *               description:
 *                 type: string
 *                 description: A description of the asset.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of tags to categorize the asset.
 *     responses:
 *       201:
 *         description: The newly created asset.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: An error occurred while creating the asset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Bad Request"
 */
const addAsset = async (req, res, next) => {
  try {
    const owner = req.user._id
    if (!owner) {
      return res.status(400).json({ success: false, error: 'no user found' })
    }
    
    const { name, description } = req.body
    const asset = await Asset.create({ name, description, owner })
    res.status(201).json(asset)
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
    // next(error)
  }
}

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   put:
 *     summary: Update an existing asset by ID.
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the asset.
 *               description:
 *                 type: string
 *                 description: The updated description of the asset.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The updated tags of the asset.
 *     responses:
 *       200:
 *         description: The updated asset object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful or not.
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *       400:
 *         description: The provided asset ID is invalid or the request body is missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful or not.
 *                 error:
 *                   type: string
 *                   description: An error message.
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
 * @swagger
 * /api/v1/assets/{id}:
 *   delete:
 *     summary: Delete an asset by ID.
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the asset to delete.
 *     responses:
 *       201:
 *         description: The deleted asset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 asset:
 *                   $ref: '#/components/schemas/Asset'
 *       400:
 *         description: An error occurred while trying to delete the asset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: An error message.
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

const getAllTags = async (req, res) => {
  try {
    const tags = await Asset.distinct('tags')
    res.json(tags)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao obter as tags.' })
  }
}

const getAssetsByTag = async (req, res) => {
  const tag = req.params.tag
  try {
    const assets = await Asset.find({ tags: tag })
    res.json(assets)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao obter os assets por tag.' })
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
  removeLike,
  getAllTags,
  getAssetsByTag
}
