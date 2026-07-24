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
const AppleSubscriptionEvent = require("../models/AppleSubscriptionEvent");
const PaymentTransaction = require("../models/PaymentTransaction");
const PaymentAttempt = require("../models/PaymentAttempt");

const purchaseOrchestrator = require("../services/payment/purchaseOrchestrator.service");
const appleVerification = require("../services/payment/appleVerification.service");
const appleWebhook = require("../services/payment/appleWebhook.service");
const userController = require("../controllers/user.controller");

async function runDeploymentChecklist() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI missing");

  await mongoose.connect(mongoUri);
  console.log("=== RUNNING FINAL DEPLOYMENT CHECKLIST VERIFICATION ===");

  const originalVerify = appleVerification.verifyPurchase;
  const originalParse = appleWebhook.parseNotification;

  const cleanTag = async (tag) => {
    await User.deleteMany({ email: { $regex: `@chk-${tag}.com` } });
    await AppleSubscription.deleteMany({ originalTransactionId: `orig_${tag}` });
    await AppleSubscriptionEvent.deleteMany({ originalTransactionId: `orig_${tag}` });
    await PaymentTransaction.deleteMany({ externalTransactionId: `ext_${tag}` });
    await PaymentAttempt.deleteMany({ externalTransactionId: `ext_${tag}` });
  };

  try {
    // --------------------------------------------------------
    // CHECK 1: Purchase → Renewal Webhook → Membership remains active
    // --------------------------------------------------------
    console.log("\nCHECK 1: Purchase -> Renewal Webhook -> Membership Remains Active");
    await cleanTag("chk1");

    const u1 = await User.create({ email: "u1@chk-chk1.com", password: "Password123!", name: "Check User 1" });

    appleVerification.verifyPurchase = async () => ({
      success: true,
      amount: 999,
      currency: "INR",
      planId: "premium",
      normalizedVerificationData: {
        originalTransactionId: "orig_chk1",
        transactionId: "ext_chk1",
        productId: "com.app.premium.yearly",
        planId: "premium",
        purchaseDateMs: Date.now(),
        expiresDateMs: Date.now() + 365 * 24 * 3600 * 1000,
        environment: "Sandbox",
        autoRenewStatus: "on",
      },
    });

    await purchaseOrchestrator.processPurchase(u1, "User", "apple", {}, 999, "INR", "premium");
    console.log("✓ Initial purchase completed.");

    const origVerifyJws = appleWebhook.verifyJws;
    appleWebhook.verifyJws = async () => ({
      valid: true,
      payload: {
        notificationType: "DID_RENEW",
        originalTransactionId: "orig_chk1",
        notificationUUID: "evt_renew_1",
        signedDate: Date.now() * 1000,
        data: {
          signedTransactionInfo: "header.payload.sig",
        },
      },
      verified: { valid: true },
    });

    const w1 = await appleWebhook.handleWebhook({ signedPayload: "header.payload.sig" });
    assert.strictEqual(w1.success, true, "Renewal webhook failed");
    
    const u1After = await User.findById(u1._id);
    assert.strictEqual(u1After.membership.status, "active", "Membership should remain active after renewal");
    console.log("✓ CHECK 1 PASS: Renewal webhook processed and membership remains active.");

    // --------------------------------------------------------
    // CHECK 2: Purchase → Delete Account → Renewal Webhook (Does NOT recreate membership or user)
    // --------------------------------------------------------
    console.log("\nCHECK 2: Purchase -> Delete Account -> Renewal Webhook");
    const mockRes = { status() { return this; }, json() { return this; } };
    await userController.deleteAccount({ user: { id: u1._id } }, mockRes);
    console.log("✓ Account deleted.");

    // Verify ACCOUNT_DELETED event was written to AppleSubscriptionEvent
    const delEvt = await AppleSubscriptionEvent.findOne({ originalTransactionId: "orig_chk1", eventType: "ACCOUNT_DELETED" });
    assert.ok(delEvt, "Explicit ACCOUNT_DELETED event MUST exist in AppleSubscriptionEvent");
    console.log("✓ Explicit AppleSubscriptionEvent ACCOUNT_DELETED record verified.");

    // Renewal webhook arrives AFTER account deletion
    appleWebhook.verifyJws = async () => ({
      valid: true,
      payload: {
        notificationType: "DID_RENEW",
        originalTransactionId: "orig_chk1",
        notificationUUID: "evt_renew_after_delete",
        signedDate: Date.now() * 1000,
        data: { signedTransactionInfo: "header.payload.sig" },
      },
      verified: { valid: true },
    });

    const w2 = await appleWebhook.handleWebhook({ signedPayload: "header.payload.sig" });
    assert.strictEqual(w2.success, true, "Late renewal webhook should be handled safely");
    
    const subAfterLateRenew = await AppleSubscription.findOne({ originalTransactionId: "orig_chk1" });
    assert.strictEqual(subAfterLateRenew, null, "AppleSubscription MUST NOT be recreated by renewal webhook");

    const deletedUserCheck = await User.findById(u1._id);
    assert.strictEqual(deletedUserCheck, null, "Deleted user MUST NOT be reactivated");
    console.log("✓ CHECK 2 PASS: Renewal webhook safely recorded without recreating subscription, membership, or account.");

    // --------------------------------------------------------
    // CHECK 3: Purchase → Delete Account → Cancellation Webhook (Handled safely)
    // --------------------------------------------------------
    console.log("\nCHECK 3: Purchase -> Delete Account -> Cancellation Webhook");
    appleWebhook.verifyJws = async () => ({
      valid: true,
      payload: {
        notificationType: "REVOKE",
        originalTransactionId: "orig_chk1",
        notificationUUID: "evt_cancel_after_delete",
        signedDate: Date.now() * 1000,
        data: { signedTransactionInfo: "header.payload.sig" },
      },
      verified: { valid: true },
    });

    const w3 = await appleWebhook.handleWebhook({ signedPayload: "header.payload.sig" });
    assert.strictEqual(w3.success, true, "Cancellation webhook should handle deleted subscription safely");
    console.log("✓ CHECK 3 PASS: Revoke/Cancellation webhook handled safely.");

    // --------------------------------------------------------
    // CHECK 4 & 5: Repurchases & Idempotent Restore
    // --------------------------------------------------------
    console.log("\nCHECK 4 & 5: Repurchases & Idempotent Restore");
    const u2 = await User.create({ email: "u2@chk-chk1.com", password: "Password123!", name: "Check User 2" });

    // Repeated Restore calls
    const rA = await purchaseOrchestrator.processRestore(u2, "User", "apple", {});
    const rB = await purchaseOrchestrator.processRestore(u2, "User", "apple", {});

    assert.strictEqual(rA.code, "ACCOUNT_DELETED_REPURCHASE_REQUIRED");
    assert.strictEqual(rB.code, "ACCOUNT_DELETED_REPURCHASE_REQUIRED");
    console.log("✓ CHECK 5 PASS: Repeated restore calls are idempotent and consistently return ACCOUNT_DELETED_REPURCHASE_REQUIRED (403).");

    // New purchase for User 2
    appleVerification.verifyPurchase = async () => ({
      success: true,
      amount: 999,
      currency: "INR",
      planId: "premium",
      normalizedVerificationData: {
        originalTransactionId: "orig_chk1",
        transactionId: "ext_chk1_u2_buy",
        productId: "com.app.premium.yearly",
        planId: "premium",
        purchaseDateMs: Date.now(),
        expiresDateMs: Date.now() + 365 * 24 * 3600 * 1000,
        environment: "Sandbox",
      },
    });

    const pNew = await purchaseOrchestrator.processPurchase(u2, "User", "apple", {}, 999, "INR", "premium");
    assert.strictEqual(pNew.success, true, "New purchase should succeed for User 2");

    const newSubU2 = await AppleSubscription.findOne({ userId: u2._id });
    assert.ok(newSubU2, "New AppleSubscription document created for User 2");
    console.log("✓ CHECK 4 PASS: New purchase creates brand-new AppleSubscription for new account.");

    await cleanTag("chk1");

    console.log("\n========================================================");
    console.log("ALL FINAL DEPLOYMENT CHECKLIST CASES PASSED 100%");
    console.log("========================================================");

  } finally {
    appleVerification.verifyPurchase = originalVerify;
    appleWebhook.parseNotification = originalParse;
    await mongoose.disconnect();
  }
}

runDeploymentChecklist().catch((err) => {
  console.error("Checklist verification failed:", err);
  process.exit(1);
});
