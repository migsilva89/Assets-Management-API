const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide a comment.'],
    minlength: [5, 'Your comment should have at least 5 characters.'],
    maxlength: [200, 'Your comment should not exceed 200 characters.']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset', required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = commentSchema
