const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const AppleSubscription = require("../models/AppleSubscription");
const AppleSubscriptionEvent = require("../models/AppleSubscriptionEvent");
const PaymentTransaction = require("../models/PaymentTransaction");
const PaymentAttempt = require("../models/PaymentAttempt");
const MembershipHistory = require("../models/MembershipHistory");

async function resetSubscriptionState() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is missing from backend/.env");

  await mongoose.connect(mongoUri);
  console.log("=== MONGODB ATLAS CONNECTED FOR SUBSCRIPTION STATE RESET ===");

  // ========================================================
  // BEFORE COUNTS
  // ========================================================
  const countAppleSubBefore = await AppleSubscription.countDocuments();
  const countUserMemBefore = await User.countDocuments({ "membership.planId": { $exists: true, $ne: "free" } });
  const countStudentMemBefore = await Student.countDocuments({ "membership.planId": { $exists: true, $ne: "free" } });

  const countPayTxnBefore = await PaymentTransaction.countDocuments();
  const countPayAttemptBefore = await PaymentAttempt.countDocuments();
  const countAppleEventBefore = await AppleSubscriptionEvent.countDocuments();
  const countMemHistoryBefore = await MembershipHistory.countDocuments();

  console.log("\n========================================");
  console.log("BEFORE CLEANUP COUNTS");
  console.log("========================================");
  console.log(`- AppleSubscription count: ${countAppleSubBefore}`);
  console.log(`- Users with active/non-free membership: ${countUserMemBefore}`);
  console.log(`- Students with active/non-free membership: ${countStudentMemBefore}`);
  console.log(`- PaymentTransaction count: ${countPayTxnBefore}`);
  console.log(`- PaymentAttempt count: ${countPayAttemptBefore}`);
  console.log(`- AppleSubscriptionEvent count: ${countAppleEventBefore}`);
  console.log(`- MembershipHistory count: ${countMemHistoryBefore}`);

  // ========================================================
  // PERFORM CLEANUP
  // ========================================================
  console.log("\n========================================");
  console.log("PERFORMING CLEANUP...");
  console.log("========================================");

  // 1. Delete ALL AppleSubscription documents
  const deleteSubRes = await AppleSubscription.deleteMany({});
  console.log(`Deleted AppleSubscription documents: ${deleteSubRes.deletedCount}`);

  // 2. Reset membership object on all User documents
  const resetUserRes = await User.updateMany(
    { "membership.planId": { $exists: true, $ne: "free" } },
    {
      $set: {
        "membership.planId": "free",
        "membership.status": "none",
        "membership.paymentStatus": "none",
        "membership.autoRenew": false,
      },
      $unset: {
        "membership.transactionId": "",
        "membership.expiresAt": "",
        "membership.expiryDate": "",
        "membership.productId": "",
        "membership.activatedAt": "",
        "membership.paymentDate": "",
        "membership.purchaseDate": "",
        "membership.amountPaid": "",
        "membership.currency": "",
      },
    }
  );
  console.log(`Reset User membership documents: ${resetUserRes.modifiedCount}`);

  // 3. Reset membership object on all Student documents
  const resetStudentRes = await Student.updateMany(
    { "membership.planId": { $exists: true, $ne: "free" } },
    {
      $set: {
        "membership.planId": "free",
        "membership.status": "none",
        "membership.paymentStatus": "none",
        "membership.autoRenew": false,
      },
      $unset: {
        "membership.transactionId": "",
        "membership.expiresAt": "",
        "membership.expiryDate": "",
        "membership.productId": "",
        "membership.activatedAt": "",
        "membership.paymentDate": "",
        "membership.purchaseDate": "",
        "membership.amountPaid": "",
        "membership.currency": "",
      },
    }
  );
  console.log(`Reset Student membership documents: ${resetStudentRes.modifiedCount}`);

  // ========================================================
  // AFTER COUNTS & VERIFICATION
  // ========================================================
  const countAppleSubAfter = await AppleSubscription.countDocuments();
  const countUserMemAfter = await User.countDocuments({ "membership.planId": { $exists: true, $ne: "free" } });
  const countStudentMemAfter = await Student.countDocuments({ "membership.planId": { $exists: true, $ne: "free" } });

  const countPayTxnAfter = await PaymentTransaction.countDocuments();
  const countPayAttemptAfter = await PaymentAttempt.countDocuments();
  const countAppleEventAfter = await AppleSubscriptionEvent.countDocuments();
  const countMemHistoryAfter = await MembershipHistory.countDocuments();

  console.log("\n========================================");
  console.log("AFTER CLEANUP COUNTS & VERIFICATION");
  console.log("========================================");
  console.log(`- AppleSubscription count: ${countAppleSubAfter} (Expected: 0)`);
  console.log(`- Users with active/non-free membership: ${countUserMemAfter} (Expected: 0)`);
  console.log(`- Students with active/non-free membership: ${countStudentMemAfter} (Expected: 0)`);
  console.log(`\n--- Preserved Audit & Financial Records Verification ---`);
  console.log(`- PaymentTransaction count: ${countPayTxnAfter} (Unchanged: ${countPayTxnBefore === countPayTxnAfter})`);
  console.log(`- PaymentAttempt count: ${countPayAttemptAfter} (Unchanged: ${countPayAttemptBefore === countPayAttemptAfter})`);
  console.log(`- AppleSubscriptionEvent count: ${countAppleEventAfter} (Unchanged: ${countAppleEventBefore === countAppleEventAfter})`);
  console.log(`- MembershipHistory count: ${countMemHistoryAfter} (Unchanged: ${countMemHistoryBefore === countMemHistoryAfter})`);

  console.log("\n========================================");
  console.log("SUBSCRIPTION STATE RESET COMPLETE");
  console.log("========================================");

  await mongoose.disconnect();
}

resetSubscriptionState().catch((err) => {
  console.error("Reset script error:", err);
  process.exit(1);
});
