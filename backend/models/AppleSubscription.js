const mongoose = require("mongoose");

/**
 * AppleSubscription — billing source of truth.
 *
 * Separation of concerns:
 *   PaymentTransaction = immutable financial ledger (each verification event)
 *   AppleSubscription  = live billing state (renewals, upgrades, expiry)
 *   Membership          = embedded entitlement state (User/Student.membership)
 *
 * Identified by (platform + originalTransactionId) — permanent across renewals,
 * upgrades, downgrades, restores, reinstalls.
 *
 * The platform field enables future extensibility to Google/Stripe without
 * collision risk on transaction IDs.
 */

const AppleSubscriptionSchema = new mongoose.Schema(
  {
    // Platform discriminator — "apple" always (extensibility for Google/Stripe)
    platform: { type: String, default: "apple", index: true },

    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    userModel: { type: String, enum: ["Student", "User"], required: true },

    // Permanent Apple identifier — never changes, unique within platform
    originalTransactionId: { type: String, required: true },

    // Current transaction (changes on renewal)
    latestTransactionId: { type: String, required: true },

    // StoreKit 2 appAccountToken — UUID supplied by backend at purchase time
    // Allows instant user identification during restore without receipt lookup
    appAccountToken: { type: String },

    // Product & plan
    productId: { type: String, required: true },
    planId: { type: String, required: true, index: true },

    // Dates from Apple
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date },
    originalPurchaseDateMs: { type: String },

    // Status (billing perspective)
    status: {
      type: String,
      enum: ["active", "expired", "grace_period", "cancelled", "revoked", "pending"],
      default: "pending",
    },

    // Apple environment
    environment: {
      type: String,
      enum: ["Production", "Sandbox"],
      default: "Production",
    },

    // Auto-renewal
    autoRenewStatus: { type: String, enum: ["on", "off", "unknown"], default: "unknown" },
    expirationIntent: { type: String },

    // Ownership policy: one subscription = one IEC account
    ownershipStatus: {
      type: String,
      enum: ["active", "transferred", "revoked"],
      default: "active",
    },

    // For admin-initiated ownership transfers
    previousOwnerId: { type: mongoose.Schema.Types.ObjectId },
    transferReason: { type: String },
    transferredAt: { type: Date },

    // Full Apple receipt data for reprocessing (subject to retention policy)
    latestReceiptInfo: { type: mongoose.Schema.Types.Mixed },
    pendingRenewalInfo: { type: mongoose.Schema.Types.Mixed },

    // Trial & intro offer tracking
    isTrialPeriod: { type: Boolean, default: false },
    isInIntroOfferPeriod: { type: Boolean, default: false },
    offerIdentifier: { type: String },

    // Management
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    revokedAt: { type: Date },

    // Verification path used (for auditing)
    verificationPath: { type: String, enum: ["storekit2", "verifyReceipt", "migration"] },
  },
  { timestamps: true }
);

// Composite uniqueness: platform + originalTransactionId
AppleSubscriptionSchema.index(
  { platform: 1, originalTransactionId: 1 },
  { unique: true, name: "unique_platform_original_transaction" }
);

// Lookup by user + platform
AppleSubscriptionSchema.index({ userId: 1, platform: 1 });

// Lookup by appAccountToken for instant restore identification
AppleSubscriptionSchema.index({ appAccountToken: 1 });

// Active subscriptions by plan
AppleSubscriptionSchema.index({ planId: 1, status: 1 });

module.exports =
  mongoose.models.AppleSubscription ||
  mongoose.model("AppleSubscription", AppleSubscriptionSchema);
