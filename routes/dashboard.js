const express = require('express');
const router = express.Router();
const { cekLogin } = require('../config/util');
const Page = require('../config/pageCount');

router.get('/', cekLogin, async (req, res) => {
  //DATA
  const pages = await Page.find((err, result) => {
    return result;
  });
  res.render('dashboard', { hal: 'Dashboard', pages: pages, useremail: req.session.user_email});
});

router.get('/newpost', cekLogin, async (req, res) => {
  res.render('dashboard', { hal: 'Newpost', useremail: req.session.user_email});
})
module.exports = router;