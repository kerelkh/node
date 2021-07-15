const express = require('express');
const router = express.Router();
const { updateCount } = require('../config/util');

router.get('/', updateCount('Blog'), (req, res) => {
  res.render('blog', { login: false});
})

module.exports = router;