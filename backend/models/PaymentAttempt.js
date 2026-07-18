const mongoose = require("mongoose");

const PaymentAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userModel: { type: String, enum: ["Student", "User"], required: true },
    
    // Gateway Info
    gateway: { type: String, enum: ["apple", "razorpay", "google", "stripe", "paypal"], required: true },
    
    // Purchase Details
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    
    status: {
      type: String,
      enum: ["STARTED", "CANCELLED", "FAILED", "SUCCESS"],
      default: "STARTED",
      required: true,
    },
    
    // Error tracking
    errorMessage: { type: String },
    
    // If it succeeds, link it to the core transaction
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentTransaction" }
  },
  { timestamps: true }
);

PaymentAttemptSchema.index({ userId: 1, createdAt: -1 });

module.exports =
  mongoose.models.PaymentAttempt ||
  mongoose.model("PaymentAttempt", PaymentAttemptSchema);
