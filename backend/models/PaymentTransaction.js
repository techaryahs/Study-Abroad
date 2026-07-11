const mongoose = require("mongoose");

const PaymentTransactionSchema = new mongoose.Schema(
  {
    idempotencyKey: { type: String, required: true, unique: true },
    platform: {
      type: String,
      enum: ["razorpay", "apple_iap"],
      required: true,
    },
    transactionId: { type: String, required: true },
    orderId: { type: String },
    paymentId: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
      required: true,
    },
    userModel: { type: String, enum: ["Student", "User"], required: true },
    userEmail: { type: String, required: true },
    planId: { type: String, required: true },
    amount: { type: Number },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["processing", "succeeded", "failed"],
      default: "processing",
      required: true,
    },
    receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
    historyId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipHistory" },
    transitionType: { type: String },
    responseSnapshot: { type: mongoose.Schema.Types.Mixed },
    error: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ platform: 1, transactionId: 1 }, { unique: true });
PaymentTransactionSchema.index({ userId: 1, planId: 1, createdAt: -1 });

module.exports =
  mongoose.models.PaymentTransaction ||
  mongoose.model("PaymentTransaction", PaymentTransactionSchema);
