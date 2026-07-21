const mongoose = require("mongoose");

/**
 * AppleSubscriptionEvent — audit trail for S2S notifications.
 *
 * Every Apple server-to-server notification is recorded here before
 * the subscription state machine acts on it. Enables:
 *   - Idempotent webhook processing
 *   - Audit/reconciliation
 *   - Debugging subscription lifecycle issues
 */

const AppleSubscriptionEventSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppleSubscription",
      index: true,
    },
    originalTransactionId: { type: String, required: true, index: true },

    // Apple S2S V2 notification type
    eventType: {
      type: String,
      enum: [
        "SUBSCRIBED",
        "DID_RENEW",
        "DID_FAIL_TO_RENEW",
        "EXPIRED",
        "GRACE_PERIOD",
        "REFUND",
        "REVOKE",
        "PRICE_INCREASE",
        "DID_CHANGE_RENEWAL_STATUS",
        "DID_CHANGE_RENEWAL_PREF",
        "CONSUMPTION_REQUEST",
        "OFFER_REDEEMED",
        "TEST",
      ],
      required: true,
    },

    // Notification metadata
    notificationUUID: { type: String },
    signedDate: { type: Date },

    // Transaction this event relates to
    transactionId: { type: String, index: true },

    // Raw notification data for audit (subject to retention)
    notificationData: { type: mongoose.Schema.Types.Mixed },

    // Decoded JWS payload
    decodedPayload: { type: mongoose.Schema.Types.Mixed },

    // Processing
    status: {
      type: String,
      enum: ["received", "processed", "ignored", "failed"],
      default: "received",
    },
    processedAt: { type: Date },
    error: { type: String },

    // Idempotency
    idempotencyKey: { type: String },
  },
  { timestamps: true }
);

AppleSubscriptionEventSchema.index({ originalTransactionId: 1, eventType: 1, createdAt: -1 });
AppleSubscriptionEventSchema.index({ notificationUUID: 1 }, { unique: true, sparse: true });
AppleSubscriptionEventSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

module.exports =
  mongoose.models.AppleSubscriptionEvent ||
  mongoose.model("AppleSubscriptionEvent", AppleSubscriptionEventSchema);
