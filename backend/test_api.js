const axios = require('axios');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const student = await Student.findOne({ email: "sahiln852004@gmail.com" });
  if (!student) {
    console.log("No student found in DB.");
    process.exit();
  }
  
  // Create a fake admin token
  const token = jwt.sign({ id: student._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  // Require the controller and inject a mock req, res
  const partnershipController = require('./controllers/partnershipController');
  
  const req = {
    params: { studentId: student._id.toString() },
    user: { id: student._id.toString(), role: "admin" }
  };
  
  const res = {
    status: function(s) { this.statusCode = s; return this; },
    json: function(data) { console.log("STATUS:", this.statusCode || 200, "RESPONSE:", JSON.stringify(data, null, 2)); return this; }
  };
  
  await partnershipController.getStudentLeadProfile(req, res);
  process.exit();
}
run();
