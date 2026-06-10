const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection... - test-mongo.js:4');
console.log('URI: - test-mongo.js:5', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas! - test-mongo.js:9');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED: - test-mongo.js:13', err.message);
    process.exit(1);
  });