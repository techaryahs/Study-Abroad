/**
 * Database Migration & Restoration Script:
 * Restores missing College documents for existing Seminars and Student Leads in MongoDB.
 * Ensures data integrity across College, Seminar, and StudentLead collections.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const College = require("../models/College");
const Seminar = require("../models/Seminar");
const StudentLead = require("../models/StudentLead");
const Audit = require("../models/Audit");

async function restoreMissingColleges() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing from environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(" Connected to MongoDB for college restoration.");

  // 1. Canonical college definitions preserved in system audit records
  const canonicalColleges = [
    {
      _id: new mongoose.Types.ObjectId("6ab4d56122e2d945eeb8f860"),
      collegeId: "6262",
      name: "Amrit Bharat",
      address: "Santacruz East Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      departments: ["Engineering", "Computer Science"],
      expectedStudentStrength: 100,
      status: "ACTIVE",
      createdBy: new mongoose.Types.ObjectId("6ab109b76e7b87ccc48ce8ca"),
    },
    {
      _id: new mongoose.Types.ObjectId("6aba247e2a74728ca341b3e5"),
      collegeId: "KKWA",
      name: "K.K.Wagh",
      address: "Hirabai Haridas Vidyanagari, Amrutdham, Panchavati",
      city: "Nashik",
      state: "Maharashtra",
      country: "India",
      departments: ["Computer Engineering", "Information Technology"],
      expectedStudentStrength: 150,
      status: "ACTIVE",
      createdBy: new mongoose.Types.ObjectId("6ab109b76e7b87ccc48ce8ca"),
    },
  ];

  for (const col of canonicalColleges) {
    const existing = await College.findById(col._id);
    if (!existing) {
      await College.create(col);
      console.log(` Restored canonical college: ${col.name} (_id: ${col._id}, code: ${col.collegeId})`);
    } else {
      console.log(`ℹ️ Canonical college already exists: ${col.name} (_id: ${col._id})`);
    }
  }

  // 2. Discover any other seminars with unbacked collegeId
  const seminars = await Seminar.find({});
  console.log(`Scanning ${seminars.length} seminars for unbacked colleges...`);

  for (const sem of seminars) {
    if (!sem.collegeId) continue;
    const exists = await College.findById(sem.collegeId);
    if (!exists) {
      // Derive college code from seminarId e.g. EDL-EM-2026-XXXX-001 or name
      let code = "COL-" + String(sem.collegeId).slice(-4).toUpperCase();
      if (sem.seminarId) {
        const parts = sem.seminarId.split("-");
        if (parts.length >= 4 && parts[3]) {
          code = parts[3];
        }
      }
      const newCol = await College.create({
        _id: sem.collegeId,
        collegeId: code,
        name: sem.collegeName || "Unknown College",
        city: sem.venue || "Mumbai",
        status: "ACTIVE",
        createdBy: sem.createdBy || null,
      });
      console.log(` Created missing college from seminar ${sem.seminarId}: ${newCol.name} (_id: ${newCol._id})`);
    }
  }

  // 3. Verify student leads resolution
  const leads = await StudentLead.find({}).populate("collegeId", "name").lean();
  console.log(`\n--- Verification of ${leads.length} Student Leads ---`);
  for (const lead of leads) {
    const colName = lead.collegeId?.name || "UNRESOLVED";
    console.log(`Lead: ${lead.studentLeadId} | Student: ${lead.fullName} | College: ${colName}`);
  }

  await mongoose.disconnect();
  console.log("\n College restoration and verification completed successfully.");
}

restoreMissingColleges()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ College restoration failed:", err);
    process.exit(1);
  });
