const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/kerelka', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => {
  console.log('Connection to database error');
});

mongoose.connection.once('open', () => {
  console.log('Database Connected');
})