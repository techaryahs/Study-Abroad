const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema(
  {
    collegeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      trim: true
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    coordinatorName: { type: String, trim: true },
    coordinatorEmail: { type: String, trim: true, lowercase: true },
    coordinatorPhone: { type: String, trim: true },
    departments: { type: [String], default: [] },
    expectedStudentStrength: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.College || mongoose.model("College", CollegeSchema);
