const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kerelka:kmzwa88saa@cluster0.mjre1.mongodb.net/kerelka?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => {
  console.log('Connection to database error');
});

mongoose.connection.once('open', () => {
  console.log('Database Connected');
})