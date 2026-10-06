const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const studentId = "6ac357ea8bf2edd5858a6fd7";
  const student = await Student.findById(studentId).lean();
  console.log("Work Exp:", JSON.stringify(student.profile?.workExperience, null, 2));
  console.log("Documents:", JSON.stringify(student.profile?.documents, null, 2));
  process.exit();
}
run();
