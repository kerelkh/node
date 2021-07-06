const express = require('express');
const router = express.Router();
const { cekLogin } = require('../config/util');

router.get('/', cekLogin, (req, res) => {
  res.render('dashboard');
});

module.exports = router;