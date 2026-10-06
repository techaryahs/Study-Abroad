const mongoose = require('mongoose');
const Student = require('./backend/models/Student');
const StudentLead = require('./backend/models/StudentLead');
require('dotenv').config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/study-abroad");
  const students = await Student.find({}).limit(5).lean();
  console.log("Students:", students.map(s => ({ _id: s._id, email: s.email, name: s.name })));
  
  const leads = await StudentLead.find({}).limit(2).lean();
  console.log("Leads:", leads.map(l => ({ email: l.email, studentLeadId: l.studentLeadId })));
  process.exit();
}
run();
