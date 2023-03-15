const mongoose = require('mongoose')
const commentSchema = require('./Comment')
const slugify = require('slugify')

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    default: true
  }
})

AssetSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true })
  next()
})

module.exports = mongoose.model('Asset', AssetSchema)
