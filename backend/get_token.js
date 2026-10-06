const jwt = require('jsonwebtoken');
require('dotenv').config();
const token = jwt.sign({ id: "60a2b...", role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);
