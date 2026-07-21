/**
 * Migration 001 — Backfill Apple Subscriptions from PaymentTransaction Records
 *
 * Phase: Pre-deploy | P1 Migration Engine
 * Purpose: Create AppleSubscription records from existing PaymentTransaction
 *          entries that were created via Apple IAP (gateway === "apple").
 *          Links PaymentTransaction.subscriptionId to the new records.
 *
 * Strategy:
 *  1. Find all PaymentTransaction records with gateway === "apple"
 *  2. Group by verificationData.originalTransactionId (or externalTransactionId as fallback)
 *  3. Create one AppleSubscription per group (deduplicates)
 *  4. Update each PaymentTransaction.subscriptionId
 *
 * Status mapping:
 *   - active if expiryDate is in the future AND user's membership shows active/paid
 *   - expired if expiryDate is in the past
 *   - revoked if PaymentTransaction has status REFUNDED or REVOKED
 *   - cancelled if user.membership.status === "cancelled"
 *
 * Zero data loss: PaymentTransaction (immutable ledger) is never deleted.
 *
 * Idempotent: Skips transactions already linked to an AppleSubscription.
 */
async function up() {
  const PaymentTransaction = require("../../models/PaymentTransaction");
  const AppleSubscription = require("../../models/AppleSubscription");
  const MembershipPlan = require("../../models/MembershipPlan");
  const Student = require("../../models/Student");
  const User = require("../../models/User");

  console.log("[001] Starting Apple Subscription backfill migration...");

  const appleTxns = await PaymentTransaction.find({ gateway: "apple" }).lean();
  console.log(`[001] Found ${appleTxns.length} Apple payment transactions.`);

  const groups = new Map();

  for (const txn of appleTxns) {
    if (txn.subscriptionId) {
      console.log(`[001] Skipping already-linked txn ${txn.transactionId}`);
      continue;
    }

    const originalTransactionId =
      txn.verificationData?.originalTransactionId ||
      txn.verificationData?.normalizedVerificationData?.originalTransactionId ||
      txn.externalTransactionId;

    if (!groups.has(originalTransactionId)) {
      groups.set(originalTransactionId, {
        originalTransactionId,
        transactions: [],
      });
    }

    groups.get(originalTransactionId).transactions.push(txn);
  }

  console.log(`[001] Grouped into ${groups.size} unique subscriptions.`);

  let created = 0;
  let linked = 0;
  let skipped = 0;

  for (const [originalTransactionId, group] of groups) {
    const sorted = group.transactions.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const firstTxn = sorted[0];
    const latestTxn = sorted[sorted.length - 1];

    const vData = firstTxn.verificationData || {};
    const planId = firstTxn.planId;

    // Resolve user — prefer Student, fallback User
    const user = await Student.findById(firstTxn.userId) || await User.findById(firstTxn.userId);
    if (!user) {
      console.log(`[001] Skipping orphaned subscription for user ${firstTxn.userId}`);
      skipped++;
      continue;
    }

    // Determine environment
    const environment = vData.environment || "Production";

    // Determine status:
    //   - Check if any transaction in the group is REFUNDED/REVOKED
    //   - Check expiry date for expired
    //   - Check user's current membership status
    const hasRefund = group.transactions.some(
      (t) => t.status === "REFUNDED" || t.status === "REVOKED"
    );
    const hasCancelled = group.transactions.some(
      (t) => t.status === "EXPIRED"
    );

    let status = "active";
    if (hasRefund) {
      status = "revoked";
    } else if (user.membership?.status === "cancelled") {
      status = "cancelled";
    } else {
      const expiresDateMs = vData.expiresDateMs
        ? Number(vData.expiresDateMs)
        : null;
      if (expiresDateMs && expiresDateMs <= Date.now()) {
        status = "expired";
      }
    }

    // Build subscription
    const subscriptionData = {
      platform: "apple",
      userId: firstTxn.userId,
      userModel: firstTxn.userModel || "Student",
      originalTransactionId,
      latestTransactionId:
        vData.transactionId || latestTxn.externalTransactionId,
      productId: vData.productId || "unknown",
      planId: planId || "unknown",
      purchaseDate: vData.purchaseDateMs
        ? new Date(Number(vData.purchaseDateMs))
        : firstTxn.createdAt,
      expiryDate: vData.expiresDateMs && Number(vData.expiresDateMs) > 0
        ? new Date(Number(vData.expiresDateMs))
        : null,
      originalPurchaseDateMs: vData.originalPurchaseDateMs || null,
      appAccountToken: vData.appAccountToken || null,
      environment,
      autoRenewStatus: vData.autoRenewStatus || "unknown",
      status,
      ownershipStatus: "active",
      isTrialPeriod: vData.isTrialPeriod || false,
      isInIntroOfferPeriod: vData.isInIntroOfferPeriod || false,
      offerIdentifier: vData.offerIdentifier || null,
      latestReceiptInfo: vData.allTransactions || [],
      pendingRenewalInfo: vData.pendingRenewalInfo || null,
      verificationPath: "migration",
    };

    try {
      const subscription = await AppleSubscription.create(subscriptionData);
      created++;
      console.log(`[001] Created subscription for ${originalTransactionId} (status=${status})`);

      for (const txn of group.transactions) {
        await PaymentTransaction.findByIdAndUpdate(txn._id, {
          subscriptionId: subscription._id,
        });
        linked++;
      }
    } catch (createErr) {
      if (createErr.code === 11000) {
        console.log(`[001] Subscription for ${originalTransactionId} already exists — linking transactions.`);
        const existing = await AppleSubscription.findOne({
          platform: "apple",
          originalTransactionId,
        });
        if (existing) {
          for (const txn of group.transactions) {
            await PaymentTransaction.findByIdAndUpdate(txn._id, {
              subscriptionId: existing._id,
            });
            linked++;
          }
        }
        skipped++;
      } else {
        console.error(`[001] Error creating subscription for ${originalTransactionId}:`, createErr.message);
        skipped++;
      }
    }
  }

  console.log(`[001] Migration complete: created=${created}, linked=${linked}, skipped=${skipped}`);
}

module.exports = { up };
