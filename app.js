const prod = true;

if(!prod){
  require('dotenv').config();
}
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

//express config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//routes
const indexRoute = require('./routes/index');


//use routes
app.use('/', indexRoute);


//error 404
app.use((req, res) => {
  res.render('error/error404');
})


app.listen(PORT, () => {
  console.log(`Server Listening to port ${PORT}`);
});