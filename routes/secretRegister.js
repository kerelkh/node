const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../config/user');

router.post('/', async (req, res) => {
  //cek if username already exist
  await User.find({ username: req.body.username},(err, result) => {
    if(err) return res.status(500).json({ msg: 'Error Checking User'});
    if(result.length != 0){
      return res.status(404).json({msg: 'Username Already Exist'});
    }

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role
    });

    newUser.save().then((user) => {
      res.status(202).json({ msg: `user ${user.username} has been added`})
    }).catch((err) => {
      res.status(500).json({ msg: `user ${user.username} failed to register`})
    })
  })
})

module.exports = router;