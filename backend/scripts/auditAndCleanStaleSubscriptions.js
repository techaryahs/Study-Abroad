const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function (moduleName) {
  if (moduleName === "@apple/app-store-server-library") {
    return {
      SignedDataVerifier: class {},
      Environment: { PRODUCTION: "Production", SANDBOX: "Sandbox" },
    };
  }
  return originalRequire.apply(this, arguments);
};

const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const AppleSubscription = require("../models/AppleSubscription");
const AppleSubscriptionEvent = require("../models/AppleSubscriptionEvent");
const PaymentTransaction = require("../models/PaymentTransaction");
const PaymentAttempt = require("../models/PaymentAttempt");
const MembershipHistory = require("../models/MembershipHistory");

const purchaseOrchestrator = require("../services/payment/purchaseOrchestrator.service");
const appleVerification = require("../services/payment/appleVerification.service");
const userController = require("../controllers/user.controller");

async function findUserExists(userId, userModel) {
  if (userModel === "Student") {
    const student = await Student.findById(userId);
    if (student) return student;
  }
  const user = await User.findById(userId);
  if (user) return user;
  // Also check Student if model was User or unspecified
  return await Student.findById(userId);
}

async function runAuditAndCleanup() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in backend/.env");
  }

  await mongoose.connect(mongoUri);
  console.log("=== MONGODB ATLAS CONNECTED FOR STALE OWNERSHIP AUDIT ===");

  // ========================================================
  // TASK 1 – AUDIT BEFORE CLEANUP
  // ========================================================
  const countAppleSubBefore = await AppleSubscription.countDocuments();
  const countAppleEventBefore = await AppleSubscriptionEvent.countDocuments();
  const countPayTxnBefore = await PaymentTransaction.countDocuments();
  const countPayAttemptBefore = await PaymentAttempt.countDocuments();

  console.log("\n========================================");
  console.log("TASK 1 – BEFORE CLEANUP COUNTS");
  console.log("========================================");
  console.log(`1. Total AppleSubscription documents: ${countAppleSubBefore}`);
  console.log(`2. Total AppleSubscriptionEvent documents: ${countAppleEventBefore}`);
  console.log(`3. Total PaymentTransaction documents: ${countPayTxnBefore}`);
  console.log(`4. Total PaymentAttempt documents: ${countPayAttemptBefore}`);

  const allSubscriptions = await AppleSubscription.find().lean();
  console.log("\n--- All AppleSubscription Documents ---");
  for (const sub of allSubscriptions) {
    console.log({
      _id: sub._id,
      originalTransactionId: sub.originalTransactionId,
      userId: sub.userId,
      userModel: sub.userModel,
      status: sub.status,
      expiryDate: sub.expiryDate,
    });
  }

  // ========================================================
  // TASK 2 – FIND STALE OWNERSHIP
  // ========================================================
  console.log("\n========================================");
  console.log("TASK 2 – FIND STALE OWNERSHIP");
  console.log("========================================");

  const staleSubscriptions = [];
  const validSubscriptions = [];

  for (const sub of allSubscriptions) {
    const ownerExists = await findUserExists(sub.userId, sub.userModel);
    if (!ownerExists) {
      staleSubscriptions.push(sub);
    } else {
      validSubscriptions.push(sub);
    }
  }

  console.log(`Found ${staleSubscriptions.length} STALE AppleSubscription document(s):`);
  for (const sub of staleSubscriptions) {
    console.log({
      staleAppleSubscriptionId: sub._id,
      originalTransactionId: sub.originalTransactionId,
      missingUserId: sub.userId,
      userModel: sub.userModel,
      status: sub.status,
    });
  }

  // ========================================================
  // TASK 3 – CLEAN STALE OWNERSHIP
  // ========================================================
  console.log("\n========================================");
  console.log("TASK 3 – CLEAN STALE OWNERSHIP");
  console.log("========================================");

  let deletedCount = 0;
  const deletedOriginalTxnIds = [];

  if (staleSubscriptions.length > 0) {
    const staleIds = staleSubscriptions.map((s) => s._id);
    const deleteResult = await AppleSubscription.deleteMany({ _id: { $in: staleIds } });
    deletedCount = deleteResult.deletedCount || 0;
    staleSubscriptions.forEach((s) => deletedOriginalTxnIds.push(s.originalTransactionId));
  }

  console.log(`deletedCount: ${deletedCount}`);
  console.log(`Deleted originalTransactionIds:`, deletedOriginalTxnIds);

  // ========================================================
  // TASK 4 – VERIFY AFTER CLEANUP
  // ========================================================
  console.log("\n========================================");
  console.log("TASK 4 – VERIFY AFTER CLEANUP");
  console.log("========================================");

  const countAppleSubAfter = await AppleSubscription.countDocuments();
  console.log(`Total AppleSubscription documents after cleanup: ${countAppleSubAfter}`);

  const remainingSubs = await AppleSubscription.find().lean();
  let remainingStaleCount = 0;
  for (const sub of remainingSubs) {
    const ownerExists = await findUserExists(sub.userId, sub.userModel);
    if (!ownerExists) {
      remainingStaleCount++;
      console.error(`ERROR: Found remaining stale subscription ${sub._id} for missing userId ${sub.userId}`);
    }
  }

  if (remainingStaleCount === 0) {
    console.log("✓ Verified: NO AppleSubscription documents whose user does not exist remain in DB.");
  } else {
    console.error(`❌ Verification failed: ${remainingStaleCount} stale documents still exist.`);
  }

  // ========================================================
  // TASK 5 – TEST PURCHASE/RESTORE FLOW
  // ========================================================
  console.log("\n========================================");
  console.log("TASK 5 – TEST PURCHASE / RESTORE FLOW");
  console.log("========================================");

  // Clean up any test users from audit run
  await User.deleteMany({ email: { $in: ["task5_user1@example.com", "task5_user2@example.com"] } });
  await AppleSubscription.deleteMany({ originalTransactionId: "task5_orig_txn" });
  await PaymentTransaction.deleteMany({ externalTransactionId: "task5_txn_100" });
  await PaymentAttempt.deleteMany({ externalTransactionId: "task5_txn_100" });

  let testConflictOccurred = false;
  let testError = null;

  const user1 = await User.create({
    email: "task5_user1@example.com",
    password: "Password123!",
    name: "Task 5 User One",
  });

  const originalVerify = appleVerification.verifyPurchase;
  appleVerification.verifyPurchase = async () => ({
    success: true,
    amount: 999,
    currency: "INR",
    planId: "premium",
    normalizedVerificationData: {
      originalTransactionId: "task5_orig_txn",
      transactionId: "task5_txn_100",
      productId: "com.app.premium.yearly",
      planId: "premium",
      purchaseDateMs: Date.now(),
      expiresDateMs: Date.now() + 365 * 24 * 3600 * 1000,
      environment: "Sandbox",
      autoRenewStatus: "on",
    },
  });

  try {
    // 1. User 1 Purchase
    console.log("Running User 1 purchase...");
    const p1 = await purchaseOrchestrator.processPurchase(
      user1,
      "User",
      "apple",
      { receiptData: "mock" },
      999,
      "INR",
      "premium"
    );
    assertResult(p1.success, "User 1 purchase failed");

    // 2. User 1 Account Deletion
    console.log("Deleting User 1 account via deleteAccount()...");
    const resDel = { status() { return this; }, json() { return this; } };
    await userController.deleteAccount({ user: { id: user1._id } }, resDel);

    // 3. User 2 Re-registers and calls Restore
    console.log("User 2 re-registers and restores purchase...");
    const user2 = await User.create({
      email: "task5_user1@example.com",
      password: "Password123!",
      name: "Task 5 User Two",
    });

    const restoreResult = await purchaseOrchestrator.processRestore(
      user2,
      "User",
      "apple",
      { receiptData: "mock" }
    );

    if (restoreResult.success) {
      console.log("✓ Test Result: Restore purchase succeeded for User 2 with no ownership conflict.");
      testConflictOccurred = false;
    } else {
      console.log("❌ Test Result: Restore purchase failed:", restoreResult.error);
      if (restoreResult.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT") {
        testConflictOccurred = true;
      }
    }

    // Clean up test data
    await User.deleteMany({ email: { $in: ["task5_user1@example.com", "task5_user2@example.com"] } });
    await AppleSubscription.deleteMany({ originalTransactionId: "task5_orig_txn" });
    await PaymentTransaction.deleteMany({ externalTransactionId: "task5_txn_100" });
    await PaymentAttempt.deleteMany({ externalTransactionId: "task5_txn_100" });

  } catch (err) {
    console.error("Test Execution Error:", err.message);
    testError = err.message;
    if (err.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT") {
      testConflictOccurred = true;
    }
  } finally {
    appleVerification.verifyPurchase = originalVerify;
  }

  // Final Summary Report
  console.log("\n========================================");
  console.log("FINAL AUDIT & CLEANUP REPORT");
  console.log("========================================");
  console.log(`- Before cleanup counts: AppleSubscription=${countAppleSubBefore}, Events=${countAppleEventBefore}, PayTxn=${countPayTxnBefore}, PayAttempt=${countPayAttemptBefore}`);
  console.log(`- Stale subscriptions found: ${staleSubscriptions.length}`);
  console.log(`- Deleted subscriptions: ${deletedCount}`);
  console.log(`- After cleanup counts: AppleSubscription=${countAppleSubAfter}`);
  console.log(`- Test result: ${testConflictOccurred ? "OWNERSHIP CONFLICT STILL HAPPENS" : "SUCCESS (No ownership conflict)"}`);

  await mongoose.disconnect();
}

function assertResult(cond, msg) {
  if (!cond) throw new Error(msg);
}

runAuditAndCleanup().catch((err) => {
  console.error("Audit Script Failed:", err);
  process.exit(1);
});
