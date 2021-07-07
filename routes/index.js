const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if(req.session.username){
    return res.render('welcome', { login: true});
  }
  res.render('welcome', { login: false});
});

module.exports = router;