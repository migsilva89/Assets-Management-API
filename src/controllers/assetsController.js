const Asset = require('../models/Asset')
const asyncHandler = require('../middlewares/asyncHandler')

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
const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({})
  res.status(200).json(assets)
})


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
const getAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id)
  res.status(201).json({ success: true, asset })
})


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
const addAsset = asyncHandler(async (req, res) => {
  const { name, description, tags } = req.body
  const owner = req.user._id
  
  // Remove empty tags
  const tagsArray = tags.filter(tag => tag.trim())
  
  const asset = new Asset({
    name,
    description,
    tags: tagsArray,
    owner
  })
  
  const createdAsset = await asset.save()
  
  res.status(201).json(createdAsset)
})


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
const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    owner: req.body.owner,
    tags: req.body.tags
  }, {
    new: true,
    runValidators: true
  })
  
  res.status(200).json({ success: true, data: asset })
})


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
const deleteAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findByIdAndDelete(req.params.id)
  res.status(201).json({ success: true, asset })
})


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
const addComment = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)
  
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' })
  }
  
  // Extract the comment text and author ID from the request body
  const { text } = req.body
  const author = req.user._id
  
  // Create a new comment object with text, author, and asset ID
  const newComment = {
    text: req.body.text,
    author: req.user._id,
    asset: req.params.id
  }
  
  // Add the new comment to the beginning of the asset's comments array
  asset.comments.unshift(newComment)
  
  await asset.save()
  res.status(201).json({ success: true, data: asset })
})


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
const removeComment = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id)
  
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' })
  }
  
  const commentId = req.params.commentId
  const comment = asset.comments.find(comment => comment._id.toString() === commentId.toString())
  
  if (!comment) {
    return res.status(404).json({ success: false, error: 'Comment not found' })
  }
  
  // Check if the current user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(401).json({ success: false, error: 'Not authorized to delete this comment' })
  }
  
  // Remove the comment from the asset's comments array
  const removeIndex = asset.comments.findIndex(comment => comment._id.toString() === commentId.toString())
  asset.comments.splice(removeIndex, 1)
  
  await asset.save()
  res.status(200).json({ success: true, data: asset })
})


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
const addLike = asyncHandler(async (req, res, next) => {
  const assetId = req.params.id
  const asset = await Asset.findById(assetId)
  
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' })
  }
  
  // Check if the user has already liked the asset
  const userId = req.user._id
  if (asset.likes.includes(userId)) {
    return res.status(400).json({ success: false, error: 'User has already liked this asset' })
  }
  
  // Add user's ID to the likes array
  asset.likes.push(userId)
  await asset.save()
  
  res.status(200).json({ success: true, data: asset })
})


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
const removeLike = asyncHandler(async (req, res, next) => {
  const assetId = req.params.id
  const asset = await Asset.findById(assetId)
  
  if (!asset) {
    return res.status(404).send('Asset not found')
  }
  
  // Check if the user has liked this asset
  const likeIndex = asset.likes.indexOf(req.user.id)
  if (likeIndex === -1) {
    return res.status(400).send('You have not liked this asset')
  }
  
  // Remove the like and save the asset
  asset.likes.splice(likeIndex, 1)
  await asset.save()
  
  res.status(200).send('Like removed successfully')
})


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
const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Asset.distinct('tags')
  res.json(tags)
})


/**
 * @swagger
 * /api/v1/assets/tags/{tag}:
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
const getAssetsByTag = asyncHandler(async (req, res, next) => {
  const tag = req.params.tag
  const assets = await Asset.find({ tags: tag })
  res.json(assets)
})


/**
 * @swagger
 * /api/v1/users/{id}/assets:
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
const getAssetsByUser = asyncHandler(async (req, res, next) => {
  // Get all assets owned by a user
  const assets = await Asset.find({ owner: req.params.id })
  res.send(assets)
})


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
