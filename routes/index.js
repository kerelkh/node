const express = require('express');
const router = express.Router();
const { updateCount } = require('../config/util');

router.get('/', updateCount('Homepage'), (req, res) => {
  if(req.session.username){
    return res.render('welcome', { login: true});
  }
  res.render('welcome', { login: false});
});

module.exports = router;