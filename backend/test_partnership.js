const assert = require("assert");
const mongoose = require("mongoose");
const studentLeadService = require("./services/partnership/studentLeadService");
const seminarService = require("./services/partnership/seminarService");
const College = require("./models/College");

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eduleader_test");
  
  await College.deleteMany({});
  const college = new College({
    collegeId: "RAIT01",
    name: "Ramrao Adik Institute",
    coordinatorEmail: "test@rait.com"
  });
  await college.save();

  console.log("Testing seminar ID generation...");
  const seminarId = await seminarService.generateSeminarId(college._id, 2026);
  assert.strictEqual(seminarId, "EDL-EM-2026-RAIT-001");

  console.log("Testing student lead ID generation...");
  const leadId = await studentLeadService.generateStudentLeadId(college._id, 2026);
  assert.strictEqual(leadId, "EL-RAIT-2026-00001");
  
  console.log("Testing duplicate detection...");
  const normPhone = studentLeadService.normalizePhone("+91 98765 43210");
  assert.strictEqual(normPhone, "9876543210");

  console.log("Tests passed!");
  mongoose.connection.close();
}

runTests().catch(err => {
  console.error("Test failed:", err);
  mongoose.connection.close();
  process.exit(1);
});
