const Page = require('./pageCount');
const Blog = require('./blog');

const cekLogin = (req, res, next) => {
  if(!req.session.username) return res.redirect('/login')

  next();
}

const cekNotLogin = (req, res, next) => {
  if(req.session.username) return res.redirect('/dashboard');

  next();
}

const updateCount = (page) => {
  return async (req, res, next) => {
    await Page.find({page: page}, async (err, result) => {
      if(result.length == 0){
        const newPage = new Page({
          page: page,
          views: 1
        });

        newPage.save();
      }else{
        await Page.updateOne({ page: page}, { 
          $inc: {
            views: 1
          }
        })
      }
    });

    next();
  }
}

module.exports = {
  cekLogin,
  cekNotLogin,
  updateCount,
}