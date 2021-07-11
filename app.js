const prod = false;

if(!prod){
  require('dotenv').config();
}
const express = require('express');
const session = require('express-session');

require('./config/database')

const app = express();
const PORT = process.env.PORT || 8080;

//express config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'solid',
  saveUninitialized: false,
  resave: true
}));

//routes
const indexRoute = require('./routes/index');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');
const logoutRoute = require('./routes/logout');


//secretRegister
const registerRoute = require('./routes/secretRegister');

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;

  next();
})
//use routes
app.use('/', indexRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logout', logoutRoute);


//use routes secretRegister
app.use('/secretregister', registerRoute);
//error 404
app.use((req, res) => {
  res.render('error/error404');
})


app.listen(PORT, () => {
  console.log(`Server Listening to port ${PORT}`);
});