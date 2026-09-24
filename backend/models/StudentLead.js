const mongoose = require("mongoose");

const StudentLeadSchema = new mongoose.Schema(
  {
    studentLeadId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    seminarId: { type: String, required: true },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    normalizedMobile: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    normalizedEmail: { type: String, trim: true, lowercase: true },
    course: { type: String },
    graduationYear: { type: String },
    preferredCountry: { type: String },
    preferredProgram: { type: String },
    studyAbroadTimeline: { type: String },
    consentGiven: { type: Boolean, default: false },
    consentTimestamp: { type: Date },
    otpVerified: { type: Boolean, default: false },
    otpVerifiedAt: { type: Date },
    registrationSource: { type: String, default: "QR" },
    leadStatus: {
      type: String,
      enum: ["REGISTERED", "ATTENDED", "NO_SHOW", "INTERESTED", "NOT_INTERESTED", "CONTACT_PENDING"],
      default: "REGISTERED"
    },
    attributionStatus: { type: String, default: "ACTIVE" },
    sourceType: { type: String, default: "COLLEGE_SEMINAR" },
    sourceSeminarId: { type: String },
    sourceCollegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    sourceDate: { type: Date },
    attributionCreatedAt: { type: Date, default: Date.now },
    attributionStartDate: { type: Date },
    attributionExpiryDate: { type: Date },
    
    // Support multiple seminar interactions
    interactions: [{
      seminarId: String,
      interactionDate: Date,
      type: { type: String } // e.g. "REGISTRATION"
    }]
  },
  { timestamps: true }
);

StudentLeadSchema.index({ normalizedMobile: 1 });
StudentLeadSchema.index({ normalizedEmail: 1 });

module.exports = mongoose.models.StudentLead || mongoose.model("StudentLead", StudentLeadSchema);

