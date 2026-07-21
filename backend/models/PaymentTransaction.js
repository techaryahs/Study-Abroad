const mongoose = require("mongoose");

const PaymentTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true }, // The internal UUID or generated ID
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userModel: { type: String, enum: ["Student", "User"], required: true },
    
    // Gateway Info
    gateway: { type: String, enum: ["apple", "razorpay", "google", "stripe", "paypal"], required: true },
    externalTransactionId: { type: String, required: true }, // The ID from Apple or Razorpay
    
    // Purchase Details
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    
    // Expanded State Machine
    status: {
      type: String,
      enum: [
        "CREATED", 
        "PENDING_VERIFICATION", 
        "VERIFIED", 
        "ENTITLEMENT_PENDING", 
        "ENTITLED", 
        "FAILED", 
        "REFUNDED", 
        "REVOKED", 
        "EXPIRED"
      ],
      default: "CREATED",
      required: true,
    },
    
    // Verification Data (Normalized, not the raw receipt forever)
    verificationData: { type: mongoose.Schema.Types.Mixed },
    error: { type: String },
    
    // Audit / Links
    receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
    
    processedAt: { type: Date },
    idempotencyKey: { type: String },
  },
  { timestamps: true }
);

// Idempotency / Duplicate protection
PaymentTransactionSchema.index({ gateway: 1, externalTransactionId: 1 }, { unique: true });
PaymentTransactionSchema.index({ userId: 1, planId: 1, createdAt: -1 });
PaymentTransactionSchema.index({ status: 1 });
PaymentTransactionSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

module.exports =
  mongoose.models.PaymentTransaction ||
  mongoose.model("PaymentTransaction", PaymentTransactionSchema);

