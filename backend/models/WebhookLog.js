const mongoose = require("mongoose");

const WebhookLogSchema = new mongoose.Schema(
  {
    gateway: { type: String, enum: ["apple", "razorpay", "google", "stripe", "paypal"], required: true },
    webhookId: { type: String, required: true }, // The unique event ID from the provider
    eventType: { type: String, required: true }, // e.g., INITIAL_BUY, CANCEL, REFUND
    
    // Normalized Data
    externalTransactionId: { type: String }, // Links back to the transaction
    planId: { type: String },
    
    // Processing status
    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "IGNORED", "FAILED"],
      default: "PENDING",
      required: true,
    },
    
    // Original payload (subject to retention/scrubbing later)
    payload: { type: mongoose.Schema.Types.Mixed },
    
    error: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

// Idempotency: Webhook IDs from a gateway should be processed once
WebhookLogSchema.index({ gateway: 1, webhookId: 1 }, { unique: true });
WebhookLogSchema.index({ externalTransactionId: 1, createdAt: -1 });

module.exports =
  mongoose.models.WebhookLog ||
  mongoose.model("WebhookLog", WebhookLogSchema);
