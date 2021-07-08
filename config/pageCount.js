const mongoose = require('mongoose');

const Page = mongoose.model('page', {
  page: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    require: true,
  }
});

module.exports = Page;