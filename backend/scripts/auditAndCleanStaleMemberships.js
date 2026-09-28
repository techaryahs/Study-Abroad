const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const AppleSubscription = require("../models/AppleSubscription");
const MembershipHistory = require("../models/MembershipHistory");

async function auditMemberships() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is missing");

  await mongoose.connect(mongoUri);
  console.log("=== AUDITING ALL USER AND STUDENT MEMBERSHIPS ===");

  const usersWithMembership = await User.find({ "membership.planId": { $exists: true, $ne: "free" } }).lean();
  const studentsWithMembership = await Student.find({ "membership.planId": { $exists: true, $ne: "free" } }).lean();

  console.log(`Found ${usersWithMembership.length} User(s) with non-free membership.`);
  console.log(`Found ${studentsWithMembership.length} Student(s) with non-free membership.`);

  const allActiveUsers = [...usersWithMembership.map(u => ({ ...u, model: "User" })), ...studentsWithMembership.map(s => ({ ...s, model: "Student" }))];

  for (const doc of allActiveUsers) {
    console.log({
      _id: doc._id,
      email: doc.email,
      model: doc.model,
      membership: doc.membership,
    });
  }

  // Check for orphan MembershipHistory records (where userId does not exist)
  const allHistories = await MembershipHistory.find().lean();
  console.log(`\nTotal MembershipHistory documents: ${allHistories.length}`);
  
  let staleHistoryCount = 0;
  for (const h of allHistories) {
    const userExists = h.userModel === "Student" ? await Student.findById(h.userId) : await User.findById(h.userId);
    if (!userExists) {
      staleHistoryCount++;
      console.log(`Preserved Audit MembershipHistory (deleted user _id=${h.userId}, plan=${h.toPlanId}, transition=${h.transitionType})`);
    }
  }

  console.log(`\nPreserved audit MembershipHistory records for deleted users: ${staleHistoryCount}`);

  await mongoose.disconnect();
}

auditMemberships().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
