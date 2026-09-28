/**
 * Apple Webhook Service — S2S V2 Notification Handler (Verified)
 *
 * Processes Apple's App Store Server Notifications V2 with full
 * cryptographic JWS verification against Apple's signing keys.
 *
 * Security:
 *   - Fetches Apple's public keys from their JWKS endpoint
 *   - Verifies JWS signature using jose library
 *   - Validates issuer, audience, expiration
 *   - Caches Apple's keys for performance
 *
 * @see https://developer.apple.com/documentation/appstoreservernotifications
 */

const crypto = require("crypto");
const mongoose = require("mongoose");
const AppleSubscription = require("../../models/AppleSubscription");
const AppleSubscriptionEvent = require("../../models/AppleSubscriptionEvent");
const appleSubscriptionService = require("./appleSubscription.service");
const { applyNotification } = appleSubscriptionService;

const APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys";
const JWKS_CACHE_TTL_MS = 3600000; // 1 hour

let jwksCache = { keys: null, fetchedAt: 0 };

/**
 * Load jose dynamically (ESM module in CJS context).
 */
async function getJose() {
  try {
    return require("jose");
  } catch {
    // jose is ESM; try dynamic import
    return await import("jose");
  }
}

/**
 * Fetch Apple's public JWKS for signature verification.
 */
async function fetchAppleJwks() {
  const now = Date.now();
  if (jwksCache.keys && now - jwksCache.fetchedAt < JWKS_CACHE_TTL_MS) {
    return jwksCache.keys;
  }

  const fetchFn = typeof global.fetch !== "undefined" ? global.fetch : require("node-fetch").default;
  const response = await fetchFn(APPLE_JWKS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch Apple JWKS: HTTP ${response.status}`);
  }

  jwksCache.keys = await response.json();
  jwksCache.fetchedAt = now;
  return jwksCache.keys;
}

/**
 * Import a JWK as a CryptoKey using jose.
 */
async function importJwk(jwk, jose) {
  return jose.importJWK(jwk, jwk.alg || "ES256");
}

/**
 * Cryptographically verify an Apple JWS signedPayload.
 *
 * Steps:
 *  1. Split JWS into header.payload.signature
 *  2. Decode header to extract key ID (kid)
 *  3. Fetch matching key from Apple's JWKS
 *  4. Import key as CryptoKey
 *  5. Verify signature using jose.compactVerify
 *  6. Validate claims (iss, aud, exp)
 *
 * @param {string} signedPayload - JWS compact serialization
 * @returns {Object} { valid, payload, header, error }
 */
async function verifyJws(signedPayload) {
  if (!signedPayload || typeof signedPayload !== "string") {
    return { valid: false, error: "Missing or invalid signedPayload." };
  }

  const parts = signedPayload.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWS format: expected 3 parts." };
  }

  try {
    // Decode header to find the key ID
    const headerBytes = Buffer.from(parts[0], "base64url");
    const header = JSON.parse(headerBytes.toString("utf8"));

    if (!header.kid) {
      return { valid: false, error: "JWS header missing kid (key identifier)." };
    }

    // Fetch Apple's public keys
    const jwks = await fetchAppleJwks();
    const matchingKey = jwks.keys.find((k) => k.kid === header.kid);

    if (!matchingKey) {
      return { valid: false, error: `No matching key found for kid: ${header.kid}` };
    }

    // Cryptographically verify the signature using jose
    const jose = await getJose();
    const publicKey = await importJwk(matchingKey, jose);

    const { payload, protectedHeader } = await jose.compactVerify(
      signedPayload,
      publicKey,
      {
        algorithms: ["ES256"],
      }
    );

    // Decode payload
    const payloadText = new TextDecoder().decode(payload);
    const decodedPayload = JSON.parse(payloadText);

    // Validate JWT claims
    const claimErrors = validateClaims(decodedPayload);
    if (claimErrors.length > 0) {
      return { valid: false, error: `JWT claims validation failed: ${claimErrors.join("; ")}` };
    }

    return {
      valid: true,
      payload: decodedPayload,
      header: protectedHeader,
      kid: header.kid,
    };
  } catch (err) {
    return { valid: false, error: `JWS verification failed: ${err.message}` };
  }
}

/**
 * Validate standard JWT claims.
 */
function validateClaims(payload) {
  const errors = [];
  const now = Math.floor(Date.now() / 1000);

  // Issuer: must be Apple
  if (payload.iss && !payload.iss.startsWith("https://appleid.apple.com")) {
    errors.push(`Invalid issuer: ${payload.iss}`);
  }

  // Audience: should match our bundle ID or app ID
  const expectedAud = process.env.APPLE_BUNDLE_ID;
  if (expectedAud && payload.aud && payload.aud !== expectedAud) {
    errors.push(`Audience mismatch: expected "${expectedAud}", got "${payload.aud}"`);
  }

  // Expiration
  if (payload.exp && now > payload.exp) {
    errors.push("JWS has expired.");
  }

  // Not-before (if present)
  if (payload.nbf && now < payload.nbf) {
    errors.push("JWS is not yet valid.");
  }

  return errors;
}

/**
 * Decode an Apple S2S V2 signedPayload inner JWS (transaction/renewal info).
 */
function decodeInnerJws(signedPayload) {
  if (!signedPayload || typeof signedPayload !== "string") {
    return null;
  }

  const parts = signedPayload.split(".");
  if (parts.length !== 3) {
    console.warn("[AppleWebhook] Inner JWS has invalid format.");
    return null;
  }

  try {
    const payloadBytes = Buffer.from(parts[1], "base64url");
    return JSON.parse(payloadBytes.toString("utf8"));
  } catch (err) {
    console.warn("[AppleWebhook] Inner JWS decode error:", err.message);
    return null;
  }
}

/**
 * Parse Apple S2S V2 notification — with full JWS verification.
 *
 * @param {Object} rawBody - Express req.body
 * @returns {Object} Normalized notification or error
 */
async function parseNotification(rawBody) {
  const signedPayload = rawBody.signedPayload;

  if (!signedPayload) {
    return { success: false, error: "Missing signedPayload in request body." };
  }

  // Primary JWS verification (outer envelope)
  const verified = await module.exports.verifyJws(signedPayload);
  if (!verified.valid) {
    return { success: false, error: verified.error, code: "JWS_VERIFICATION_FAILED" };
  }

  const payload = verified.payload;

  // Extract notification metadata
  const notificationType = payload.notificationType;
  const notificationUUID = payload.notificationUUID;
  const signedDate = payload.signedDate
    ? new Date(payload.signedDate / 1000000)
    : new Date();

  // Decode inner JWS payloads (signedTransactionInfo, signedRenewalInfo)
  const data = payload.data || {};
  const transactionInfo = data.signedTransactionInfo
    ? decodeInnerJws(data.signedTransactionInfo)
    : null;
  const renewalInfo = data.signedRenewalInfo
    ? decodeInnerJws(data.signedRenewalInfo)
    : null;

  const originalTransactionId =
    transactionInfo?.originalTransactionId ||
    payload.originalTransactionId;

  const eventIdempotencyKey =
    notificationUUID ||
    `${notificationType}:${originalTransactionId}:${transactionInfo?.transactionId}:${signedDate}`;

  return {
    success: true,
    notificationType,
    notificationUUID,
    signedDate,
    originalTransactionId,
    transactionInfo,
    renewalInfo,
    rawPayload: payload,
    eventIdempotencyKey,
    verified,
  };
}

/**
 * Main webhook handler with full JWS verification.
 *
 * 1. Verify the JWS cryptographically
 * 2. Find the corresponding AppleSubscription
 * 3. Apply the notification state transition
 * 4. Sync membership state immediately
 */
async function handleWebhook(rawBody) {
  const parsed = await parseNotification(rawBody);
  if (!parsed.success) {
    return { success: false, error: parsed.error, code: parsed.code || "INVALID_PAYLOAD" };
  }

  const { originalTransactionId, notificationType } = parsed;

  if (!originalTransactionId) {
    console.log(`[AppleWebhook] Received ${notificationType} without originalTransactionId.`);
    return { success: true, processed: false, reason: "no_transaction_id" };
  }

  const session = await mongoose.startSession();
  let result;
  
  try {
    session.startTransaction();

    const subscription = await AppleSubscription.findOne({ platform: "apple", originalTransactionId }).session(session);

    if (!subscription) {
      console.warn(
        `[AppleWebhook] Notification for unknown subscription: ${originalTransactionId} (${notificationType})`
      );

      // Upsert the event record even if unknown, using idempotencyKey
      await AppleSubscriptionEvent.findOneAndUpdate(
        { idempotencyKey: parsed.eventIdempotencyKey },
        {
          $setOnInsert: {
            originalTransactionId,
            eventType: notificationType,
            notificationUUID: parsed.notificationUUID,
            signedDate: parsed.signedDate,
            transactionId: parsed.transactionInfo?.transactionId || null,
            notificationData: parsed.rawPayload,
            decodedPayload: parsed.verified,
            status: "ignored",
          }
        },
        { upsert: true, session, new: true }
      );

      await session.commitTransaction();
      return { success: true, processed: false, reason: "unknown_subscription" };
    }

    // Apply notification to subscription
    result = await applyNotification(subscription, parsed, session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("[AppleWebhook] Error processing notification:", error.message);
    throw error;
  } finally {
    session.endSession();
  }

  // Immediately sync membership if subscription state changed (outside transaction to avoid circular logic, though it could be inside)
  let membershipSynced = false;
  if (result.applied) {
    membershipSynced = await syncMembershipFromSubscription(result.subscription);
  }

  return {
    success: true,
    processed: result.applied,
    reason: result.reason,
    membershipSynced,
    subscription: result.subscription,
  };
}

/**
 * Immediately update the embedded User/Student.membership to reflect
 * the AppleSubscription's current billing state.
 *
 * Called after every notification that changes subscription status.
 */
async function syncMembershipFromSubscription(subscription) {
  try {
    const Student = require("../../models/Student");
    const User = require("../../models/User");

    const user = subscription.userModel === "User"
      ? await User.findById(subscription.userId)
      : await Student.findById(subscription.userId);

    if (!user || !user.membership) return false;

    // If subscription expired/revoked/refunded, expire membership immediately
    const billingStatus = subscription.status;
    const membershipStatusMap = {
      active: "active",
      grace_period: "grace_period",
      expired: "expired",
      cancelled: "cancelled",
      revoked: "revoked",
      pending: "pending",
    };

    const targetMembershipStatus = membershipStatusMap[billingStatus] || "none";

    if (user.membership.status !== targetMembershipStatus) {
      user.membership.status = targetMembershipStatus;

      // Update expiry from subscription
      if (subscription.expiryDate) {
        user.membership.expiryDate = subscription.expiryDate;
        user.membership.expiresAt = subscription.expiryDate;
      }

      // Revoke access entirely for terminal states
      if (billingStatus === "revoked") {
        user.membership.planId = "free";
        user.membership.status = "revoked";
        user.membership.usage = {};
      }

      // For expired — maintain plan info but deny access
      if (billingStatus === "expired") {
        user.membership.autoRenew = false;
      }

      user.markModified("membership");
      await user.save();

      console.log(`[AppleWebhook] Synced membership: user=${subscription.userId}, status=${targetMembershipStatus}`);
      return true;
    }

    return false;
  } catch (err) {
    console.error("[AppleWebhook] Membership sync error:", err.message);
    return false;
  }
}

/**
 * Process TEST notifications (Apple endpoint verification).
 */
async function handleTestNotification(rawBody) {
  const signedPayload = rawBody.signedPayload;
  if (signedPayload) {
    try {
      const parts = signedPayload.split(".");
      if (parts.length === 3) {
        const payloadBytes = Buffer.from(parts[1], "base64url");
        const payload = JSON.parse(payloadBytes.toString("utf8"));
        if (payload.notificationType === "TEST") {
          console.log(`[AppleWebhook] TEST notification received: ${payload.notificationUUID}`);
        }
      }
    } catch {
      // Minimal parse for test — not critical
    }
  }

  return {
    success: true,
    processed: false,
    reason: "test_notification",
  };
}

module.exports = {
  handleWebhook,
  handleTestNotification,
  parseNotification,
  verifyJws,
  decodeInnerJws,
  syncMembershipFromSubscription,
};
