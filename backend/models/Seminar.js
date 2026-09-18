const mongoose = require("mongoose");

const SeminarSchema = new mongoose.Schema(
  {
    seminarId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
    collegeName: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    collegeCoordinator: { type: String },
    expectedStudentStrength: { type: Number },
    eduLeaderRep: { type: String },
    eduMitraCounsellor: { type: String },
    course: { type: String },
    venue: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED"
    },
    registrationUrl: { type: String },
    qrCodeUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Seminar || mongoose.model("Seminar", SeminarSchema);
