/**
 * Shared UserMembership Schema
 *
 * Embedded in both User and Student models.
 * Purchase metadata (dates, amount, transaction) comes from the user's
 * purchased membership record — never from the plan catalog.
 */

const mongoose = require("mongoose");

const UserMembershipSchema = new mongoose.Schema(
  {
    planId: { type: String, default: "free" },
    catalogVersion: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["none", "active", "grace_period", "expired", "cancelled", "revoked", "pending"],
      default: "none",
    },
    platform: { type: String, default: "none" },
    productId: { type: String },
    transactionId: { type: String },

    // Canonical purchase lifecycle dates (written by applyPlanToMembership)
    purchaseDate: { type: Date },
    expiryDate: { type: Date },
    // Aliases kept for older P3 writers / sweepers
    activatedAt: { type: Date },
    expiresAt: { type: Date },

    // Amount actually charged for this purchase (not catalog list price)
    amountPaid: { type: Number },
    currency: { type: String },
    paymentStatus: { type: String },
    paymentDate: { type: Date },

    autoRenew: { type: Boolean, default: false },

    // Usage Map: e.g. { "consultation": { used: 1, limit: 5, lastUsedAt: Date } }
    // limit = -1 means unlimited
    usage: {
      type: Map,
      of: new mongoose.Schema(
        {
          used: { type: Number, default: 0 },
          remaining: { type: Number, default: 0 },
          limit: { type: Number, default: 0 },
          lastUsedAt: { type: Date },
        },
        { _id: false }
      ),
      default: {},
    },

    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "MembershipHistory" }],
  },
  { _id: false }
);

module.exports = UserMembershipSchema;
