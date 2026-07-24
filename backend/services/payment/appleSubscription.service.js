/**
 * Apple Subscription Service — Billing Source of Truth
 *
 * Manages the complete lifecycle of Apple subscriptions independent of
 * the membership/entitlement layer. All operations are driven by verified
 * Apple receipt data — never client-supplied values.
 *
 * Responsibilities:
 *   - Create subscription records (first purchase)
 *   - Handle renewals (same originalTransactionId, new transactionId)
 *   - Handle restores (re-link to existing subscription)
 *   - Ownership enforcement (one subscription = one IEC account)
 *   - Subscription state machine (active, expired, revoked, etc.)
 *
 * Boundaries:
 *   - PaymentTransaction (ledger) ← immutable financial events
 *   - AppleSubscription (this) ← billing state
 *   - Membership (embedded) ← entitlement state, managed by entitlement.service
 */

const AppleSubscription = require("../../models/AppleSubscription");
const AppleSubscriptionEvent = require("../../models/AppleSubscriptionEvent");
const logger = require("../../utils/logger");

/** Valid subscription status transitions */
const VALID_TRANSITIONS = {
  pending: ["active"],
  active: ["expired", "grace_period", "cancelled", "revoked"],
  grace_period: ["active", "expired", "cancelled", "revoked"],
  expired: ["active"], // Re-purchase after expiry
  cancelled: ["active"], // Re-purchase after cancellation
  revoked: [], // Terminal — no recovery without admin intervention
};

/**
 * Transition subscription status with validation.
 */
function transitionStatus(subscription, newStatus, metadata = {}) {
  const current = subscription.status;
  const allowed = VALID_TRANSITIONS[current];

  if (!allowed) {
    throw new Error(`Unknown subscription status: ${current}`);
  }

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${current} → ${newStatus}. Allowed: [${allowed.join(", ")}]`
    );
  }

  subscription.status = newStatus;

  if (newStatus === "cancelled") subscription.cancelledAt = new Date();
  if (newStatus === "revoked") subscription.revokedAt = new Date();

  return subscription;
}

/**
 * Build subscription document from verified Apple data.
 */
function buildSubscriptionFromVerification(verificationResult, userId, userModel) {
  const v = verificationResult.normalizedVerificationData;
  const raw = verificationResult.rawReceiptData;

  return {
    platform: "apple",
    userId,
    userModel,
    originalTransactionId: v.originalTransactionId,
    latestTransactionId: v.transactionId,
    productId: v.productId,
    planId: v.planId,
    appAccountToken: v.appAccountToken || null,
    purchaseDate: new Date(Number(v.purchaseDateMs)),
    expiryDate: v.expiresDateMs && Number(v.expiresDateMs) > 0 ? new Date(Number(v.expiresDateMs)) : null,
    originalPurchaseDateMs: v.originalPurchaseDateMs,
    environment: v.environment || "Production",
    autoRenewStatus: v.autoRenewStatus || "unknown",
    expirationIntent: v.expirationIntent || null,
    isTrialPeriod: v.isTrialPeriod || false,
    isInIntroOfferPeriod: v.isInIntroOfferPeriod || false,
    offerIdentifier: v.offerIdentifier || null,
    latestReceiptInfo: raw?.allTransactions || [],
    pendingRenewalInfo: raw?.pendingRenewalInfo || null,
    verificationPath: v.verificationPath || "verifyReceipt",
    status: determineInitialStatus(v),
  };
}

/**
 * Determine initial status based on receipt data.
 */
function determineInitialStatus(verificationData) {
  const now = Date.now();
  const expiresMs = verificationData.expiresDateMs
    ? Number(verificationData.expiresDateMs)
    : null;

  // No expiry = lifetime or one-time + no auto-renew
  if (!expiresMs) return "active";

  // Expired
  if (expiresMs <= now) return "expired";

  return "active";
}

/**
 * Find subscription by originalTransactionId (within Apple platform).
 */
async function findByOriginalTransactionId(originalTransactionId, session = null) {
  return AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);
}

/**
 * Find subscription by appAccountToken (StoreKit 2 instant identification).
 */
async function findByAppAccountToken(token) {
  if (!token) return null;
  return AppleSubscription.findOne({ platform: "apple", appAccountToken: token });
}
async function findActiveForUser(userId, userModel = "Student") {
  return AppleSubscription.findOne({
    platform: "apple",
    userId,
    userModel,
    status: { $in: ["active", "grace_period"] },
  });
}

/**
 * Find all subscriptions for a user.
 */
async function findAllForUser(userId, userModel = "Student") {
  return AppleSubscription.find({ platform: "apple", userId, userModel }).sort({ createdAt: -1 });
}

/**
 * Create a brand new subscription from verified purchase.
 *
 * Called on first-ever purchase of a given originalTransactionId.
 *
 * @param {Object} verificationResult - Verified result from appleVerification.service
 * @param {Object} user - Mongoose User/Student document
 * @param {string} userModel - "Student" or "User"
 * @returns {Object} { subscription, isNew }
 */
async function createSubscription(verificationResult, user, userModel, session = null) {
  const originalTransactionId = verificationResult.normalizedVerificationData.originalTransactionId;
  logger.debug(`[AppleSubscription] ENTER createSubscription — originalTxnId=${originalTransactionId}, userId=${user._id}`);

  // Check if subscription already exists (idempotency)
  const existing = await AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);
  if (existing) {
    // Reject if owned by another user — ownership policy
    if (String(existing.userId) !== String(user._id)) {
      const error = new Error("This Apple subscription is already linked to another account.");
      error.code = "SUBSCRIPTION_OWNERSHIP_CONFLICT";
      error.status = 403;
      error.existingOwnerId = existing.userId;
      throw error;
    }
    // Same user — this is a duplicate verification, return existing
    return { subscription: existing, isNew: false };
  }

  const subscriptionData = buildSubscriptionFromVerification(verificationResult, user._id, userModel);

  let subscription;
  try {
    subscription = await AppleSubscription.create([subscriptionData], { session }).then(docs => docs[0]);
  } catch (createErr) {
    // Race condition — another request created it between our check and create
    if (createErr.code === 11000) {
      const raced = await AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);
      if (raced) {
        if (String(raced.userId) !== String(user._id)) {
          const error = new Error("This Apple subscription is already linked to another account.");
          error.code = "SUBSCRIPTION_OWNERSHIP_CONFLICT";
          error.status = 403;
          throw error;
        }
        return { subscription: raced, isNew: false };
      }
    }
    throw createErr;
  }

  logger.info(`[AppleSubscription] EXIT createSubscription — _id=${subscription._id}, isNew=true`);
  return { subscription, isNew: true };
}

/**
 * Handle a renewal or upgrade/downgrade.
 *
 * Same originalTransactionId, new transactionId.
 * Updates latestTransactionId, productId/planId (if changed), expiryDate.
 *
 * Creates a new ledger entry downstream — this service only manages state.
 *
 * @param {Object} verificationResult - Verified result from Apple
 * @param {Object} user - Authenticated user document
 * @returns {Object} { subscription, wasRenewal, planChanged }
 */
async function handleRenewalOrChange(verificationResult, user, session = null) {
  const v = verificationResult.normalizedVerificationData;
  const originalTransactionId = v.originalTransactionId;
  logger.debug(`[AppleSubscription] ENTER handleRenewalOrChange — originalTxnId=${originalTransactionId}`);

  const subscription = await AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);
  if (!subscription) {
    // Should not happen for renewals, but handle gracefully — treat as new
    return createSubscription(verificationResult, user, "Student", session);
  }

  // Ownership guard
  if (String(subscription.userId) !== String(user._id)) {
    const error = new Error("This Apple subscription is already linked to another account.");
    error.code = "SUBSCRIPTION_OWNERSHIP_CONFLICT";
    error.status = 403;
    throw error;
  }

  const planChanged = subscription.productId !== v.productId;
  const isSameTransaction = subscription.latestTransactionId === v.transactionId;

  if (isSameTransaction) {
    // Idempotent — no update needed
    return { subscription, wasRenewal: false, planChanged: false, updated: false };
  }

  // Apply renewal/change
  subscription.latestTransactionId = v.transactionId;
  subscription.productId = v.productId;
  subscription.planId = v.planId;
  subscription.purchaseDate = new Date(Number(v.purchaseDateMs));
  subscription.expiryDate = v.expiresDateMs ? new Date(Number(v.expiresDateMs)) : subscription.expiryDate;
  subscription.autoRenewStatus = v.autoRenewStatus || subscription.autoRenewStatus;
  subscription.expirationIntent = v.expirationIntent || null;
  subscription.isTrialPeriod = v.isTrialPeriod || false;
  subscription.isInIntroOfferPeriod = v.isInIntroOfferPeriod || false;
  subscription.offerIdentifier = v.offerIdentifier || subscription.offerIdentifier;

  // Update status (renewal reactivates expired subscriptions)
  const effectiveStatus = determineInitialStatus(v);
  if (subscription.status !== effectiveStatus) {
    try {
      transitionStatus(subscription, effectiveStatus, {
        reason: planChanged ? "upgrade_downgrade" : "renewal",
      });
    } catch (transitionErr) {
      // Graceful: store the intended status
      subscription.status = effectiveStatus;
    }
  }

  // Store latest receipt data for audit
  if (verificationResult.rawReceiptData) {
    subscription.latestReceiptInfo = verificationResult.rawReceiptData.allTransactions || [];
    subscription.pendingRenewalInfo = verificationResult.rawReceiptData.pendingRenewalInfo || null;
  }

  subscription.isCancelled = false;
  subscription.cancelledAt = null;

  await subscription.save({ session });

  logger.info(`[AppleSubscription] EXIT handleRenewalOrChange — wasRenewal=${true}, planChanged=${planChanged}`);
  return {
    subscription,
    wasRenewal: true,
    planChanged,
    updated: true,
  };
}

/**
 * Restore purchases.
 *
 * Client calls this (typically via "Restore Purchases" button in Flutter).
 * Verifies receipt with Apple, then finds subscription by originalTransactionId.
 *
 * - Same user: refresh subscription state, return success
 * - Different user: return 403 ownership conflict
 *
 * @param {Object} verificationResult - Verified result from Apple
 * @param {Object} user - Authenticated user
 * @returns {Object} { subscription, restored, wasSameUser }
 */
async function restoreSubscription(verificationResult, user, session = null) {
  const originalTransactionId = verificationResult.normalizedVerificationData.originalTransactionId;
  const subscription = await AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);

  if (!subscription) {
    // No subscription found — this receipt represents a purchase from another
    // Apple ID or the subscription was never recorded. Create it for this user.
    return createSubscription(verificationResult, user, "Student", session);
  }

  const isSameUser = String(subscription.userId) === String(user._id);

  if (!isSameUser) {
    const error = new Error("This Apple subscription is already linked to another account.");
    error.code = "SUBSCRIPTION_OWNERSHIP_CONFLICT";
    error.status = 403;
    throw error;
  }

  // Same user — refresh subscription state from latest receipt
  const v = verificationResult.normalizedVerificationData;

  subscription.latestTransactionId = v.transactionId;
  subscription.productId = v.productId;
  subscription.planId = v.planId;
  subscription.expiryDate = v.expiresDateMs ? new Date(Number(v.expiresDateMs)) : subscription.expiryDate;
  subscription.autoRenewStatus = v.autoRenewStatus || subscription.autoRenewStatus;
  subscription.environment = v.environment || subscription.environment;
  subscription.latestReceiptInfo = verificationResult.rawReceiptData?.allTransactions || subscription.latestReceiptInfo;
  subscription.pendingRenewalInfo = verificationResult.rawReceiptData?.pendingRenewalInfo || subscription.pendingRenewalInfo;

  const effectiveStatus = determineInitialStatus(v);
  if (subscription.status !== effectiveStatus && effectiveStatus === "active") {
    subscription.status = "active";
    subscription.isCancelled = false;
    subscription.cancelledAt = null;
  }

  await subscription.save({ session });

  return { subscription, restored: true, wasSameUser: true };
}

/**
 * Process an Apple S2S notification event on a subscription.
 *
 * Maps Apple notification types to subscription state transitions.
 * Creates an AppleSubscriptionEvent record for audit.
 *
 * @param {Object} subscription - AppleSubscription document
 * @param {Object} notification - Decoded notification payload
 * @returns {Object} { subscription, applied }
 */
async function applyNotification(subscription, notification, session = null) {
  const { notificationType, notificationUUID, signedDate, transactionInfo } = notification;

  const eventIdempotencyKey = notificationUUID || `${notificationType}:${transactionInfo?.transactionId}:${Date.now()}`;

  // Atomic upsert — if the document already exists, $setOnInsert is a no-op
  const upsertResult = await AppleSubscriptionEvent.findOneAndUpdate(
    { idempotencyKey: eventIdempotencyKey },
    {
      $setOnInsert: {
        subscriptionId: subscription._id,
        originalTransactionId: subscription.originalTransactionId,
        eventType: notificationType,
        notificationUUID,
        signedDate: signedDate ? new Date(signedDate) : null,
        transactionId: transactionInfo?.transactionId || null,
        notificationData: notification,
        decodedPayload: notification,
        status: "received",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    { upsert: true, new: true, rawResult: true, session }
  );

  // If the document already existed, this is a duplicate notification
  if (upsertResult.lastErrorObject && upsertResult.lastErrorObject.updatedExisting) {
    return { subscription, applied: false, reason: "duplicate" };
  }

  // Apply state transition based on notification type
  const transitionMap = {
    SUBSCRIBED: "active",
    DID_RENEW: "active",
    DID_FAIL_TO_RENEW: null, // Don't change status, just record
    EXPIRED: "expired",
    GRACE_PERIOD: "grace_period",
    REFUND: "revoked",
    REVOKE: "revoked",
    PRICE_INCREASE: null, // Informational only
    DID_CHANGE_RENEWAL_STATUS: null, // Informational
    DID_CHANGE_RENEWAL_PREF: null,
    OFFER_REDEEMED: null,
  };

  const newStatus = transitionMap[notificationType];
  let applied = false;

  if (newStatus && subscription.status !== newStatus) {
    try {
      transitionStatus(subscription, newStatus, { reason: notificationType });
      applied = true;
    } catch (err) {
      logger.warn(`[AppleSubscription] Notification ${notificationType}: ${err.message}`);
    }
  }

  // Update auto-renew status from notification
  if (notificationType === "DID_CHANGE_RENEWAL_STATUS" && transactionInfo) {
    const newRenewStatus = transactionInfo.auto_renew_status === "1" ? "on" : "off";
    if (subscription.autoRenewStatus !== newRenewStatus) {
      subscription.autoRenewStatus = newRenewStatus;
      applied = true;
    }
  }

  // Update latest transaction info if provided
  if (notificationType === "DID_RENEW" && transactionInfo) {
    subscription.latestTransactionId = transactionInfo.transaction_id || subscription.latestTransactionId;
    if (transactionInfo.expires_date_ms) {
      subscription.expiryDate = new Date(Number(transactionInfo.expires_date_ms));
    }
    applied = true;
  }

  // Mark cancelled/revoked timestamps
  if (notificationType === "EXPIRED") {
    subscription.isCancelled = true;
    subscription.cancelledAt = new Date();
  }
  if (notificationType === "REVOKE" || notificationType === "REFUND") {
    subscription.isCancelled = true;
    subscription.revokedAt = new Date();
  }

  if (applied) {
    await subscription.save({ session });
  }

  // Mark event as processed
  await AppleSubscriptionEvent.findOneAndUpdate(
    { idempotencyKey: eventIdempotencyKey },
    {
      $set: {
        status: "processed",
        processedAt: new Date(),
      },
    },
    { session }
  );

  return { subscription, applied, reason: applied ? "applied" : "no_change" };
}

/**
 * Check if a user owns the subscription identified by originalTransactionId.
 */
async function validateOwnership(originalTransactionId, userId) {
  const subscription = await findByOriginalTransactionId(originalTransactionId);
  if (!subscription) return { owned: false, reason: "not_found" };

  if (String(subscription.userId) !== String(userId)) {
    return { owned: false, reason: "ownership_conflict", subscription };
  }

  return { owned: true, subscription };
}

/**
 * Get all subscriptions in a specific status (for sweeper jobs).
 */
async function findExpiringSubscriptions(beforeDate) {
  return AppleSubscription.find({
    status: { $in: ["active", "grace_period"] },
    expiryDate: { $lte: beforeDate, $ne: null },
  });
}

/**
 * Admin-initiated ownership transfer.
 *
 * Used when Account A was deleted/forgotten and the user creates Account B
 * and needs to reclaim their subscription via support.
 *
 * Only callable by admin — requires audit trail.
 *
 * @param {string} originalTransactionId
 * @param {string} newUserId
 * @param {string} newUserModel
 * @param {Object} adminContext - { adminId, reason }
 */
async function transferOwnership(originalTransactionId, newUserId, newUserModel, adminContext) {
  const subscription = await AppleSubscription.findOne({
    platform: "apple",
    originalTransactionId,
  });

  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  if (String(subscription.userId) === String(newUserId)) {
    return { subscription, transferred: false, reason: "already_owned" };
  }

  // Record transfer audit
  subscription.previousOwnerId = subscription.userId;
  subscription.transferReason = adminContext.reason || "Admin-initiated transfer";
  subscription.transferredAt = new Date();
  subscription.ownershipStatus = "transferred";

  // Assign new owner
  subscription.userId = newUserId;
  subscription.userModel = newUserModel;

  await subscription.save();

  return { subscription, transferred: true };
}

module.exports = {
  findByOriginalTransactionId,
  findByAppAccountToken,
  findActiveForUser,
  findAllForUser,
  createSubscription,
  handleRenewalOrChange,
  restoreSubscription,
  applyNotification,
  validateOwnership,
  findExpiringSubscriptions,
  transferOwnership,
  transitionStatus,
};
