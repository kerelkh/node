const express = require('express');
const router = express.Router();
const { updateCount } = require('../config/util');
const Blog = require('../config/blog');

router.get('/', updateCount('Blog'), async (req, res) => {

  //get data newest post
  const newestData = await Blog.find({ status: 'publish'}, null, { skip: 0, limit: 12, sort: {date: 1}}, (err, result) => {
    return result;
  })

  res.render('blog', { login: false, newestData: newestData});
})

module.exports = router;