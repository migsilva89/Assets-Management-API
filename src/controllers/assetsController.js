const Asset = require('../models/Asset')

/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: API endpoints for managing assets.
 */


/**
 * @swagger
 *
 * /api/v1/assets:
 *   get:
 *     summary: Returns a list of all assets.
 *     description: Returns a list of all assets. Requires a valid authorization token.
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK. Returns an array of asset objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 * @swagger
 * /api/v1/assets/{id}/comments:
 *   post:
 *     summary: Add comment to asset
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset to add a comment to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the comment.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: The asset object with the newly added comment.
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
 *       '400':
 *         description: The request body is missing required fields.
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
 *       '404':
 *         description: The provided asset ID is invalid.
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
 * @swagger
 * /api/v1/assets/{id}/comments/{commentId}:
 *   delete:
 *     summary: Remove a comment from an asset.
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset that contains the comment to remove.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to remove.
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
 *       401:
 *         description: The user is not authorized to delete this comment.
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
 *       404:
 *         description: The provided asset ID or comment ID is invalid, or the comment does not exist on the asset.
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
 * @swagger
 * /api/v1/assets/{id}/likes:
 *   post:
 *     summary: Add like to an asset.
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset to add a like to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user who liked the asset.
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
 *         description: The provided asset ID is invalid, the user has already liked the asset, or the request body is missing required fields.
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
 * @swagger
 * /api/v1/assets/{id}/likes:
 *   delete:
 *     summary: Remove like from asset
 *     description: Remove a user's like from an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the asset to remove like from
 *         schema:
 *           type: string
 *           format: ObjectId
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token with JWT
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Like removed successfully
 *       '400':
 *         description: User has not liked this asset
 *       '404':
 *         description: Asset not found
 *       '500':
 *         description: Server error
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


/**
 * @swagger
 * /api/v1/assets/tags:
 *   get:
 *     summary: Get all asset tags
 *     description: Retrieve a list of all unique tags used by assets
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of unique asset tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
const getAllTags = async (req, res) => {
  try {
    const tags = await Asset.distinct('tags')
    res.json(tags)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao obter as tags.' })
  }
}


/**
 * @swagger
 * /api/v1/assets/tag/{tag}:
 *   get:
 *     summary: Get assets by tag
 *     description: Retrieve a list of assets with a specified tag
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         description: Tag to search for assets by
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number of results (default = 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of results per page (default = 10)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       '200':
 *         description: A list of assets with the specified tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetList'
 *       '400':
 *         description: Invalid tag or page/limit value
 *       '404':
 *         description: No assets found with the specified tag
 *       '500':
 *         description: Server error
 */
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


/**
 * @swagger
 * /api/v1/assets/user/{id}:
 *   get:
 *     summary: Get assets by user ID
 *     description: Get all assets created by a specific user
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user whose assets to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       '200':
 *         description: List of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       '500':
 *         description: Server error
 */
const getAssetsByUser = async (req, res) => {
  try {
    const assets = await Asset.find({ owner: req.params.id })
    res.send(assets)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter os assets por user.' })
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
  getAssetsByTag,
  getAssetsByUser
}
