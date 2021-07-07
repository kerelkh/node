const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => {
  console.log('Connection to database error');
});

mongoose.connection.once('open', () => {
  console.log('Database Connected');
})