const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Atlas connection... - test-db.js:4');
console.log('Using database: - test-db.js:5', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas! - test-db.js:9');
    console.log('Your data will be saved in the cloud! - test-db.js:10');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ CONNECTION FAILED! - test-db.js:14');
    console.error('Error: - test-db.js:15', err.message);
    process.exit(1);
  });