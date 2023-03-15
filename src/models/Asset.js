const mongoose = require('mongoose')
const commentSchema = require('./Comment')

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: { type: String, required: true },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: String,
  isPublic: {
    type: Boolean,
    default: false
  }
})

module.exports = assetSchema