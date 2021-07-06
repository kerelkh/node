const cekLogin = (req, res, next) => {
  if(!req.session.username) return res.redirect('/login')

  next();
}

const cekNotLogin = (req, res, next) => {
  if(req.session.username) return res.redirect('/dashboard');

  next();
}

module.exports = {
  cekLogin,
  cekNotLogin
}