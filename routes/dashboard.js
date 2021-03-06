const express = require('express');
const multer = require('multer');
const router = express.Router();
const { cekLogin } = require('../config/util');
const Page = require('../config/pageCount');
const { thumbnailUpload } = require('../config/fileUpload');
const { body } = require('express-validator');
const Blog = require('../config/blog');
const fs = require('fs');
const path = require('path');


router.use(cekLogin);

router.get('/', async (req, res) => {
  //DATA
  const homeView = await Page.findOne({ page: 'Homepage'}, (err, result) => {
   return result;
  });

  const blogView = await Page.findOne({ page: 'Blog'}, (err, result) => {
    return result;
  })

  const postRequest = await Blog.find({ status: 'request'}, (err, result) => {
    return result;
  })

  const postPublish = await Blog.find({ status: 'publish'}, (err, result) => {
    return result;
  })

  const postDeleted = await Blog.find({ status: 'deleted'}, (err, result) => {
    return result;
  })

  const viewData = {
    homeView: homeView.views,
    blogView: blogView.views,
    postRequest: postRequest.length,
    postPublish: postPublish.length,
    postDeleted: postDeleted.length
  }

  const lastPost =  await Blog.find({}, null, {skip: 0, limit: 5, sort : { date: -1}}, (err, result) => {
    return result;
  });
  res.render('dashboard', { 
    hal: 'Dashboard',
    viewData: viewData,
    lastPost,
    useremail: req.session.user_email});
});

router.post('/changestatus', async (req, res) => {
  if(req.body.status === 'deleted'){
    req.session.id_confirm = req.body.id;
    return res.redirect("/confirmation");
  }
  await Blog.findByIdAndUpdate(req.body.id, { $set : { status: req.body.status}}, null, (err, result) => {
    if(err) return res.redirect('/dashboard');
    
    res.redirect('/dashboard/listpost');
  })
})
router.get('/listpost', async (req, res) => {
  //get all data
  let data;
  if(req.query.search){
    const re = new RegExp(req.query.search, 'i');
    data = await Blog.find({$or :[{ title: { $regex: re} }, {description: { $regex: re}}] }, null, { sort: {date: -1} },(err, result) => {
        if(err) return res.render('dashboard', { hal: 'Listpost', useremail: req.session.user_email, data: false});
        return result;
      })
    
  }else{
    data = await Blog.find({}, null, { sort: {date: -1}},(err, result) => {
      if(err) return res.render('dashboard', { hal: 'Listpost', useremail: req.session.user_email, data: false});
      return result;
    })
  }

  res.render('dashboard', { hal: 'Listpost', useremail: req.session.user_email, data: data});
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
    const titleLower = req.body.title.toLowerCase();
    const titleArray = titleLower.split(" ");
    const slug = titleArray.join("-");
    const description = req.body.simple_desc.toLowerCase();
    const author = req.body.author.toLowerCase();
    const category = req.body.category.split(" ");
    const newBlog = new Blog({
      title: req.body.title,
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
      fs.unlink(path.join(__dirname, '../uploads', `${req.file.filename}`), (err) => {
        if(err) console.log(err);
      });
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

router.get('/editpost/:slug', async (req, res) => {
  //get data based on slug
  await Blog.find({ slug: req.params.slug}, async function(err, result) {
    if(err){
      return res.redirect('/dashboard/listpost');
    }
    if(result == 0 ){
      return res.redirect('/dashboard');
    }
    await result.forEach((item) => {
      let category = "";
      item.category.forEach((cate) => {
        category += `${cate} `;
      })
      let data = {
        id: item._id,
        slug: req.params.slug,
        prevThumbnail: item.thumbnail,
        title: item.title,
        author: item.author,
        description: item.description,
        body: item.body,
        category: category
      }
      return res.render('dashboard', { hal: 'Editpost', useremail: req.session.user_email, data: data});
    })
  })
})

router.post('/editpost',
  body('title').not().isEmpty().trim().escape(),
  body('author').not().isEmpty().trim().escape(),
  body('simple_desc').not().isEmpty().trim().escape(),
  body('category').not().isEmpty().trim().escape(),
  async(req, res) => {
  await thumbnailUpload(req, res, async (err) => {
    
    if(err) {
      req.session.flash = {
        type: 'danger',
        intro: 'Error!',
        info: err.message
      };
      req.session.prevData = prevData;
      return res.redirect('/dashboard/editpost');
    }

    if(!req.file){
      const inputForm = await JSON.parse(JSON.stringify(req.body));
      const titleLower = inputForm.title.toLowerCase();
      const titleArray = titleLower.split(" ");
      const slug = titleArray.join("-");
      const description = inputForm.simple_desc.toLowerCase();
      const author = inputForm.author.toLowerCase();
      const category = inputForm.category.split(" ");
      const updateData = {
        title: inputForm.title,
        slug,
        author,
        description,
        body: inputForm.body,
        category,
        edited: Date.now(),
      }
      await Blog.findByIdAndUpdate(inputForm.id, { $set : updateData}, null, (err, result) => {
        if(err){
          req.session.flash = {
            type: 'danger',
            intro: 'Failed -',
            info: err,
          }
          return res.redirect(`/dashboard/editpost/${inputForm.slug}`)
        } 
        req.session.flash = {
          type: 'success',
          intro: 'New Data Saved -',
          info: 'Success saving new data in database',
        }
        return res.redirect(`/dashboard/editpost/${slug}`);
      })
    }else{
      //success saving file

      const inputForm = await JSON.parse(JSON.stringify(req.body));

      //unlink previous thumbnail
      if(inputForm){
        fs.unlink(path.join(__dirname, '../uploads', `${inputForm.prevThumbnail}`), (err) => {
          if(err) console.log(err);
        });
      }

      const titleLower = inputForm.title.toLowerCase();
      const titleArray = titleLower.split(" ");
      const slug = titleArray.join("-");
      const description = inputForm.simple_desc.toLowerCase();
      const author = inputForm.author.toLowerCase();
      const category = inputForm.category.split(" ");
      const updateData = {
        title: inputForm.title,
        slug,
        author,
        description,
        thumbnail: req.file.filename,
        body: inputForm.body,
        category,
        edited: Date.now(),
      }
      await Blog.findByIdAndUpdate(inputForm.id, { $set : updateData}, null, (err, result) => {
        if(err){
          req.session.flash = {
            type: 'danger',
            intro: 'Failed -',
            info: err,
          }
          return res.redirect(`/dashboard/editpost/${inputForm.slug}`)
        } 
        req.session.flash = {
          type: 'success',
          intro: 'New Data Saved -',
          info: 'Success saving new data in database',
        }
        res.redirect(`/dashboard/editpost/${slug}`);
      })
    }
  })
  
})

module.exports = router;