const express = require('express');
const router = express.Router();
const { cekLogin } = require('../config/util');
const bcrypt = require('bcryptjs');
const User = require('../config/user');
const fs = require('fs');
const path = require('path');
const Blog = require('../config/blog');

router.use(cekLogin);

router.get('/', (req, res) => {
  const id = req.session.id_confirm;
  delete req.session.id_confirm;
  res.render('confirmation', { id_data: id, confirm: 'delete'});
})

router.post('/', async (req, res) => {
  const id_post = req.body.id;
  const username = req.session.username;
  const inputPassword = req.body.password;

  //cek if password matched the user
  await User.find({ username: req.session.username }, async (err, result) => {
    if(err){
      req.session.flash = {
        message: "Error"
      }
      req.session.id_confirm = id_post;
      return res.redirect('/confirmation');
    }

    if(result.length > 0 ){
      await result.forEach(async (user) => {
        if(bcrypt.compareSync(inputPassword, user.password)){
          //deleted post proccess
          await Blog.findById(id_post, null, async (err, result) => {
            if(err){
              req.session.flash = {
                message: "Error"
              }
              req.session.id_confirm = id_post;
              return res.redirect('/confirmation');
            }
            if(result){
              await Blog.findByIdAndDelete(id_post, async (err, result) => {
                if(err){
                  req.session.flash = {
                    message: "Failed to delete post"
                  }
                  req.session.id_confirm = id_post;
                  return res.redirect('/confirmation');
                }
                //delete thumbnail
                fs.unlink(path.join(__dirname, '../uploads', `${result.thumbnail}`), (err) => {
                  if(err) console.log(err);
                })
                req.session.flash = {
                  type: 'success',
                  intro: 'Deleted!',
                  info: 'delete post success'
                }
                return res.redirect('/dashboard/listpost');
              })
            }else{
              req.session.id_confirm = id_post;
              return res.redirect('/confirmation');
            }
          })
        }else{
          //wrong password
          req.session.flash = {
            message: "Wrong Password"
          }
          req.session.id_confirm = id_post;
          return res.redirect('/confirmation');
        }
      })
    }
  })
})

module.exports = router;