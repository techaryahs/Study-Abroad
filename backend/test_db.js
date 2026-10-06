const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const studentId = "6ac357ea8bf2edd5858a6fd7"; // From user's screenshot
    const isValid = mongoose.Types.ObjectId.isValid(studentId);
    console.log("Is Valid ObjectId:", isValid);

    const student = await Student.findById(studentId).lean();
    console.log("Student:", student);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
