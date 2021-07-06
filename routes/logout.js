const express = require('express');
const router = express.Router();
const { cekLogin } = require('../config/util');

router.get('/', (req, res) => {
  req.session.destroy()

  res.redirect('/login')
})

module.exports = router;