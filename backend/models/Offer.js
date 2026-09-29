const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    studentLeadId: { type: String, required: true, ref: "StudentLead" },
    applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Application" },
    universityId: { type: String },
    universityName: { type: String, required: true },
    course: { type: String, required: true },
    country: { type: String },
    intake: { type: String },
    offerType: { type: String, default: "CONDITIONAL" },
    offerStatus: {
      type: String,
      enum: ["OFFER_RECEIVED", "CONDITIONAL_OFFER", "UNCONDITIONAL_OFFER", "OFFER_ACCEPTED", "OFFER_DECLINED", "OFFER_EXPIRED"],
      default: "OFFER_RECEIVED"
    },
    offerDate: { type: Date },
    offerReference: { type: String },
    offerProof: { type: String },
    acceptanceStatus: { type: String, enum: ["PENDING", "ACCEPTED", "DECLINED"], default: "PENDING" },
    acceptanceDate: { type: Date },
    acceptanceProof: { type: String },
    depositAmount: { type: Number },
    currency: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
