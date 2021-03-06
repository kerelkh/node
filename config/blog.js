const mongoose = require('mongoose');

const Blog = mongoose.model('blog', { 
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  body:{ 
    type: String,
    required: true,
  },
  category: {
    type: Array,
    required: true
  },
  views: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'request'
  },
  edited: {
    type: Date,
  }
})

module.exports = Blog;