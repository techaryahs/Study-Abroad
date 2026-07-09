const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true }, // e.g., "visa_guidance", "consultation"
  name: { type: String, required: true },
  category: { type: String, enum: ['human', 'ai', 'access'], required: true },
  requiresConsultant: { type: Boolean, default: false },
  requiredPlanTier: { type: String, required: true }, // e.g., "premium", "essential"
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
