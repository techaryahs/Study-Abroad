const mongoose = require("mongoose");

const MembershipEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, enum: ['Student', 'User'], required: true },
  eventType: { 
    type: String, 
    enum: [
      'Membership Purchased', 'Membership Restored', 'Membership Renewed', 
      'Membership Expired', 'Membership Cancelled', 'Membership Upgraded', 
      'Membership Downgraded', 'Feature Used', 'Purchase Started', 'Purchase Cancelled',
      'Membership Page Viewed', 'Locked Feature Tapped', 'Upgrade Prompt Shown'
    ],
    required: true
  },
  planId: { type: String },
  featureId: { type: String }, // e.g., "consultation" for feature use events
  metadata: { type: mongoose.Schema.Types.Mixed } // Flexible payload for transaction ids, remaining counts, etc.
}, { timestamps: true });

module.exports = mongoose.models.MembershipEvent || mongoose.model("MembershipEvent", MembershipEventSchema);
