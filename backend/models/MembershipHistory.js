const mongoose = require("mongoose");

const MembershipHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, enum: ['Student', 'User'], required: true },
  fromPlanId: { type: String }, // Can be null if it's the first purchase
  toPlanId: { type: String, required: true },
  transitionType: { type: String, enum: ['upgrade', 'downgrade', 'renewal', 'cancellation', 'initial_purchase', 'restoration'], required: true },
  platform: { type: String, enum: ['apple_iap', 'razorpay', 'admin'] },
  transactionId: { type: String },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

MembershipHistorySchema.index(
  { platform: 1, transactionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      platform: { $exists: true },
      transactionId: { $exists: true, $type: "string" },
    },
  }
);

module.exports = mongoose.models.MembershipHistory || mongoose.model("MembershipHistory", MembershipHistorySchema);
