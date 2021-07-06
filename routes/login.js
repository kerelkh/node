const express = require('express');
const bcrypt = require('bcryptjs');
const { cekNotLogin } = require('../config/util');
const router = express.Router();
const User = require('../config/user');

router.get('/', cekNotLogin, (req, res) => {
  res.render('login');
})

router.post('/', cekNotLogin, async (req, res) => {
  //cek username
  await User.find({ username: req.body.username}, (err, result) => {
    if(err) {
      req.session.flash = {
        type: 'danger',
        intro: 'System Error-',
        info: 'Please contact administrator'
      };

      return res.redirect('/login');
    }
    if(result.length > 0){
      //cek password
      result.forEach((user) => {
        if(bcrypt.compareSync(req.body.password, user.password)){

          // session
          req.session.username = user.username;
          req.session.user_role = user.role;
          req.session.user_email = user.email;
          req.session.flash = {
            type: 'success',
            intro: `Selamat datang kembali ${user.role}`,
            info: ''
          };
    
          return res.redirect('/dashboard');
        }
        req.session.flash = {
          type: 'danger',
          intro: 'Wrong Password-',
          info: 'input correct password'
        };
  
        return res.redirect('/login');
      })
    }else{
      req.session.flash = {
        type: 'danger',
        intro: 'User Not Found-',
        info: 'Input correct user'
      };
  
      res.redirect('/login');
    }
  })
})

module.exports = router;