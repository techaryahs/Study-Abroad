const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentLeadId: { type: String, required: true, ref: "StudentLead" },
    university: { type: String, required: true },
    course: { type: String, required: true },
    country: { type: String, required: true },
    intake: { type: String, required: true },
    applicationId: { type: String },
    submissionDate: { type: Date },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED", "DECISION_RECEIVED", "WITHDRAWN"],
      default: "DRAFT"
    },
    proof: { type: String },
    
    // Offers (Phase 11)
    offerDate: { type: Date },
    offerType: { type: String },
    offerProof: { type: String },
    acceptanceDate: { type: Date },
    depositAmount: { type: Number },
    acceptanceProof: { type: String },
    
    // Visa (Phase 12)
    visaStatus: { type: String, enum: ["PENDING", "FILED", "APPROVED", "REJECTED"], default: "PENDING" },
    visaFilingDate: { type: Date },
    visaReference: { type: String },
    visaDecisionDate: { type: Date },
    visaProof: { type: String },
    
    // Fee (Phase 13)
    feePaymentDate: { type: Date },
    feeAmount: { type: Number },
    feeCurrency: { type: String },
    feeReference: { type: String },
    feeProof: { type: String },
    
    // Enrolment (Phase 14)
    isEnrolled: { type: Boolean, default: false },
    enrolmentDate: { type: Date },
    enrolmentProof: { type: String },
    enrolmentVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enrolmentVerifiedAt: { type: Date },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
