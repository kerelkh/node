const express = require('express');
const multer = require('multer');
const router = express.Router();
const { cekLogin } = require('../config/util');
const Page = require('../config/pageCount');
const { thumbnailUpload } = require('../config/fileUpload');
const { body } = require('express-validator');
const Blog = require('../config/blog');
const fs = require('fs');


router.use(cekLogin);

router.get('/', async (req, res) => {
  //DATA
  const pages = await Page.find((err, result) => {
    return result;
  });
  res.render('dashboard', { hal: 'Dashboard', pages: pages, useremail: req.session.user_email});
});

router.get('/listpost', (req, res) => {
  res.render('dashboard', { hal: 'Listpost', useremail: req.session.user_email});
})

router.get('/newpost', async (req, res) => {
  let prevData;
  if(req.session.prevData){
    prevData  = req.session.prevData;
    delete req.session.prevData;
  }
  res.render('dashboard', { hal: 'Newpost', useremail: req.session.user_email, prevData: prevData});
})

router.post('/newpost',
  body('title').not().isEmpty().trim().escape(),
  body('author').not().isEmpty().trim().escape(),
  body('simple_desc').not().isEmpty().trim().escape(),
  body('category').not().isEmpty().trim().escape(),
  async(req, res) => {
  await thumbnailUpload(req, res, (err) => {

    //get previous data
    const prevData = {
      title: req.body.title,
      author: req.body.author,
      desc: req.body.simple_desc,
      body: req.body.body,
      category: req.body.category,
    }

    if(err) {
      req.session.flash = {
        type: 'danger',
        intro: 'Error!',
        info: err.message
      };
      req.session.prevData = prevData;
      return res.redirect('/dashboard/newpost');
    }
    if(!req.file){
      req.session.flash ={
        type: 'danger',
        intro: 'File Error!',
        info: 'Only Image File Extension'
      }
      req.session.prevData = prevData;
      return res.redirect('/dashboard/newpost');
    }

    //edit input form
    const title = req.body.title.toLowerCase();
    const titleArray = title.split(" ");
    const slug = titleArray.join("-");
    const description = req.body.simple_desc.toLowerCase();
    const author = req.body.author.toLowerCase();
    const category = req.body.category.split(" ");
    const newBlog = new Blog({
      title,
      slug,
      author,
      description,
      thumbnail: req.file.filename,
      body: req.body.body,
      category
    });

    newBlog.save().then((blogData) => {
      req.session.flash = {
        type: 'success',
        intro: 'Success -',
        info: 'Post added '
      }
      return res.redirect('/dashboard/newpost');
    }).catch((err) => {
      fs.unlink(`../uploads/${req.file.filename}`);
      req.session.flash = {
        type: 'danger',
        intro: 'Failed -',
        info: 'Adding post fail '
      }
      req.session.prevData = prevData;
      return res.redirect('/dashboard/newpost');
    })
  })
})
module.exports = router;