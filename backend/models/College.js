const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    collegeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    coordinatorName: { type: String, default: "", trim: true },
    status: { type: String, default: "ACTIVE", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

module.exports = mongoose.models.College || mongoose.model("College", collegeSchema);