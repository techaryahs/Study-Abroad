const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true }, // e.g. "StudentLead", "Application"
    entityId: { type: String, required: true },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    reason: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Audit || mongoose.model("Audit", AuditSchema);
