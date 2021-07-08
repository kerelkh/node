const express = require('express');
const router = express.Router();
const { cekLogin } = require('../config/util');
const Page = require('../config/pageCount');

router.get('/', cekLogin, async (req, res) => {
  //DATA
  const pages = await Page.find((err, result) => {
    return result;
  });
  res.render('dashboard', { pages: pages, useremail: req.session.user_email});
});

module.exports = router;