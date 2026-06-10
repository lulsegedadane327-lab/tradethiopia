const express = require('express');
console.log('Express loaded successfully! - test-simple.js:2');
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(5000, () => console.log('Server running on 5000 - test-simple.js:5'));