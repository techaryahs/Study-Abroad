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
const assert = require("assert");

const User = require("../models/User");
const AppleSubscription = require("../models/AppleSubscription");
const PaymentTransaction = require("../models/PaymentTransaction");
const PaymentAttempt = require("../models/PaymentAttempt");
const MembershipHistory = require("../models/MembershipHistory");

const purchaseOrchestrator = require("../services/payment/purchaseOrchestrator.service");
const appleVerification = require("../services/payment/appleVerification.service");
const userController = require("../controllers/user.controller");

async function runModelAVerification() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI missing");

  await mongoose.connect(mongoUri);
  console.log("=== CONNECTED TO MONGODB ATLAS FOR MODEL A SPECIFICATION VERIFICATION ===");

  const originalVerify = appleVerification.verifyPurchase;

  // Cleanup helper
  const cleanTestEnv = async (txnTag) => {
    await User.deleteMany({ email: { $regex: `@modela-${txnTag}.com` } });
    await AppleSubscription.deleteMany({ originalTransactionId: `orig_${txnTag}` });
    await PaymentTransaction.deleteMany({ externalTransactionId: `ext_${txnTag}` });
    await PaymentAttempt.deleteMany({ externalTransactionId: `ext_${txnTag}` });
  };

  try {
    // ========================================================
    // SCENARIO 1: Purchase → Logout → Same account → Restore
    // ========================================================
    console.log("\n--------------------------------------------------------");
    console.log("TEST 1: Purchase -> Logout -> Same Account -> Restore");
    console.log("--------------------------------------------------------");
    await cleanTestEnv("scen1");

    const user1 = await User.create({
      email: "user1@modela-scen1.com",
      password: "Password123!",
      name: "Model A User One",
    });

    appleVerification.verifyPurchase = async () => ({
      success: true,
      amount: 999,
      currency: "INR",
      planId: "premium",
      normalizedVerificationData: {
        originalTransactionId: "orig_scen1",
        transactionId: "ext_scen1",
        productId: "com.app.premium.yearly",
        planId: "premium",
        purchaseDateMs: Date.now(),
        expiresDateMs: Date.now() + 365 * 24 * 3600 * 1000,
        environment: "Sandbox",
        autoRenewStatus: "on",
      },
    });

    const p1 = await purchaseOrchestrator.processPurchase(user1, "User", "apple", {}, 999, "INR", "premium");
    assert.strictEqual(p1.success, true, "Scenario 1 purchase failed");
    console.log("✓ Initial Purchase succeeded for User 1.");

    // User 1 calls restore (Same account)
    const r1 = await purchaseOrchestrator.processRestore(user1, "User", "apple", {});
    assert.strictEqual(r1.success, true, "Scenario 1 restore failed for same account");
    assert.strictEqual(r1.restored, true, "Scenario 1 restored flag missing");
    console.log("✓ SCENARIO 1 PASS: Restore succeeded for same account.");

    // ========================================================
    // SCENARIO 2: Purchase → Logout → Different account → Restore (Conflict)
    // ========================================================
    console.log("\n--------------------------------------------------------");
    console.log("TEST 2: Purchase -> Logout -> Different Account -> Restore");
    console.log("--------------------------------------------------------");
    const user2 = await User.create({
      email: "user2@modela-scen1.com",
      password: "Password123!",
      name: "Model A User Two",
    });

    const r2 = await purchaseOrchestrator.processRestore(user2, "User", "apple", {});
    assert.strictEqual(r2.success, false, "Scenario 2 restore should fail for different account");
    assert.strictEqual(r2.code, "SUBSCRIPTION_OWNERSHIP_CONFLICT", "Scenario 2 should return SUBSCRIPTION_OWNERSHIP_CONFLICT");
    assert.strictEqual(r2.status, 403, "Scenario 2 should return 403 status");
    console.log(`✓ SCENARIO 2 PASS: Returned SUBSCRIPTION_OWNERSHIP_CONFLICT (403) - "${r2.error}".`);

    // ========================================================
    // SCENARIO 3: Purchase → Delete account → Verify AppleSubscription removed
    // ========================================================
    console.log("\n--------------------------------------------------------");
    console.log("TEST 3: Purchase -> Delete Account -> Verify AppleSubscription Removed");
    console.log("--------------------------------------------------------");
    const subBeforeDelete = await AppleSubscription.findOne({ originalTransactionId: "orig_scen1" });
    assert.ok(subBeforeDelete, "AppleSubscription should exist before deletion");

    const mockRes = { status() { return this; }, json() { return this; } };
    await userController.deleteAccount({ user: { id: user1._id } }, mockRes);

    const subAfterDelete = await AppleSubscription.findOne({ originalTransactionId: "orig_scen1" });
    assert.strictEqual(subAfterDelete, null, "AppleSubscription MUST be deleted after deleteAccount()");

    const txAfterDelete = await PaymentTransaction.findOne({ externalTransactionId: "ext_scen1" });
    assert.ok(txAfterDelete, "PaymentTransaction MUST be preserved for audit/financial history");
    console.log("✓ SCENARIO 3 PASS: deleteAccount() permanently removed AppleSubscription and preserved PaymentTransaction.");

    // ========================================================
    // SCENARIO 4: Purchase → Delete account → New account → Restore rejected
    // ========================================================
    console.log("\n--------------------------------------------------------");
    console.log("TEST 4: Purchase -> Delete Account -> New Account -> Restore Rejected");
    console.log("--------------------------------------------------------");
    const user3 = await User.create({
      email: "user3@modela-scen1.com",
      password: "Password123!",
      name: "Model A User Three (New Account)",
    });

    const r4 = await purchaseOrchestrator.processRestore(user3, "User", "apple", {});
    assert.strictEqual(r4.success, false, "Scenario 4 restore must be rejected for deleted account");
    assert.strictEqual(r4.code, "ACCOUNT_DELETED_REPURCHASE_REQUIRED", "Scenario 4 must return ACCOUNT_DELETED_REPURCHASE_REQUIRED");
    assert.strictEqual(r4.status, 403, "Scenario 4 status must be 403");
    console.log(`✓ SCENARIO 4 PASS: Restore rejected with ACCOUNT_DELETED_REPURCHASE_REQUIRED (403) - "${r4.error}".`);

    // ========================================================
    // SCENARIO 5: Purchase → Delete account → New account → New purchase succeeds
    // ========================================================
    console.log("\n--------------------------------------------------------");
    console.log("TEST 5: Purchase -> Delete Account -> New Account -> New Purchase Succeeds");
    console.log("--------------------------------------------------------");
    appleVerification.verifyPurchase = async () => ({
      success: true,
      amount: 999,
      currency: "INR",
      planId: "premium",
      normalizedVerificationData: {
        originalTransactionId: "orig_scen1",
        transactionId: "ext_scen1_repurchase",
        productId: "com.app.premium.yearly",
        planId: "premium",
        purchaseDateMs: Date.now(),
        expiresDateMs: Date.now() + 365 * 24 * 3600 * 1000,
        environment: "Sandbox",
        autoRenewStatus: "on",
      },
    });

    const p5 = await purchaseOrchestrator.processPurchase(user3, "User", "apple", {}, 999, "INR", "premium");
    assert.strictEqual(p5.success, true, "Scenario 5 new purchase failed");
    
    const newSub = await AppleSubscription.findOne({ userId: user3._id });
    assert.ok(newSub, "New AppleSubscription document must be created for User 3");
    assert.strictEqual(String(newSub.userId), String(user3._id), "New AppleSubscription must belong to User 3");
    console.log(`✓ SCENARIO 5 PASS: Brand-new purchase succeeded for User 3 and created new AppleSubscription _id=${newSub._id}.`);

    // Cleanup
    await cleanTestEnv("scen1");

    console.log("\n========================================================");
    console.log("ALL 5 MODEL A VERIFICATION SCENARIOS PASSED 100%");
    console.log("========================================================");

  } finally {
    appleVerification.verifyPurchase = originalVerify;
    await mongoose.disconnect();
  }
}

runModelAVerification().catch((err) => {
  console.error("Model A Verification Failed:", err);
  process.exit(1);
});
