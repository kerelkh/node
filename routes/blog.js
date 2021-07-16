const express = require('express');
const router = express.Router();
const { updateCount } = require('../config/util');
const Blog = require('../config/blog');

router.get('/', updateCount('Blog'), async (req, res) => {
  //cek login
  let login = false;
  if(req.session.username){
    login = true;
  }

  //cek query
  let datas;
  if(req.query.search){
    const re = new RegExp(req.query.search, 'i');
    datas = await Blog.find({$or :[{ title: { $regex: re} }, {description: { $regex: re}}] }, null, { sort: {date: -1} },(err, result) => {
        if(err) return res.render('blog', { search: true, datas: false});
        return result;
      })
    
    return res.render('blog', {login, search: true, keyword: req.query.search, datas})
    
  }else if(req.query.category){
    const re = new RegExp(req.query.category, 'i');
    datas = await Blog.find({ category: { $regex: re} }, null, { sort: {date: -1} },(err, result) => {
        if(err) return res.render('blog', { category: true, datas: false});
        return result;
      })
    
    return res.render('blog', {login, category: true, keyword: req.query.category, datas})
  }else{
    //get data newest post
    const newestData = await Blog.find({ status: 'publish'}, null, { skip: 0, limit: 12, sort: {date: -1}}, (err, result) => {
      return result;
    })

    const popularData = await Blog.find({ status: 'publish'}, null, { limit: 3, sort: {views: -1}}, (err, result) => {
      return result;
    })

    return res.render('blog', {newestData: newestData, popularData: popularData, login});
  }
})

router.get('/:slug', async (req, res) => {
  //cek login
  let login = false;
  if(req.session.username){
    login = true;
  }

  //get data based on slug
  const data = await Blog.findOneAndUpdate({ slug: req.params.slug, status: 'publish'}, { $inc: { views: 1}}, {new: true});
  if(data){
    return res.render('post', {login, data});
  }else{
    return res.render('post', {login, data: false});
  }
})


module.exports = router;