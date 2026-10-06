const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });
const token = jwt.sign({ id: "60a2b...", role: "partner" }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);
