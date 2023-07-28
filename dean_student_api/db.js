const mongoose = require('mongoose');

// Replace 'mongodb://localhost:27017/dean_student_db' with your MongoDB connection string
const mongoUrl = 'mongodb://127.0.0.1:27017/';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;
