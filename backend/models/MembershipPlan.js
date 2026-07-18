const mongoose = require("mongoose");

const EntitlementSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  limit: { type: Number }, // If undefined/null, unlimited
  renewal: { type: String, enum: ['never', 'monthly', 'yearly'] },
  accessDays: { type: Number } // Time limit behavior, e.g., 30 days
}, { _id: false });

const MembershipPlanSchema = new mongoose.Schema({
  planId: { type: String, required: true, unique: true }, // e.g., "starter", "essential"
  version: { type: Number, required: true, default: 1 },
  name: { type: String, required: true },
  type: { type: String, enum: ['one_time', 'monthly', 'yearly', 'lifetime'], required: true },
  
  appleProductId: { type: String },
  razorpayPlanId: { type: String }, 

  // P1: Extensible payment gateway mappings for future providers.
  // Existing appleProductId / razorpayPlanId kept for backward compatibility.
  paymentMappings: {
    apple: { type: String },
    google: { type: String },
    razorpay: { type: String },
    stripe: { type: String },
    paypal: { type: String },
  },
  
  description: { type: String },
  benefits: [{ type: String }],
  
  price: { type: Number },
  currency: { type: String, default: 'INR' },
  recommended: { type: Boolean, default: false },
  badge: { type: String },
  sortOrder: { type: Number, default: 0 },
  
  allAccess: { type: Boolean, default: false },

  // Flattened entitlements by category
  entitlements: {
    ai: { type: Map, of: EntitlementSchema, default: {} },
    human: { type: Map, of: EntitlementSchema, default: {} },
    access: { type: Map, of: EntitlementSchema, default: {} }
  },
  
  isActive: { type: Boolean, default: true } // Admin flag to soft-delete or hide plans
}, { timestamps: true });

module.exports = mongoose.models.MembershipPlan || mongoose.model("MembershipPlan", MembershipPlanSchema);
