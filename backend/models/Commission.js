const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema(
  {
    studentLeadId: { type: String, required: true, ref: "StudentLead" },
    applicationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Application" },
    university: { type: String, required: true },
    intake: { type: String, required: true },
    admissionStatus: { type: String },
    
    expectedCommission: { type: Number, default: 0 },
    invoiceAmount: { type: Number, default: 0 },
    invoiceDate: { type: Date },
    
    commissionReceivedAmount: { type: Number, default: 0 },
    commissionReceivedDate: { type: Date },
    paymentReference: { type: String },
    evidence: { type: String }, // Masked for Edu Leader
    
    eduLeaderShare: { type: Number, default: 0 }, // 50% of actually received
    shareDueDate: { type: Date }, // 7 working days from commissionReceivedDate
    sharePaidAmount: { type: Number, default: 0 },
    sharePaidDate: { type: Date },
    sharePaymentReference: { type: String },
    
    status: {
      type: String,
      enum: ["EXPECTED", "INVOICED", "RECEIVED", "SHARE_PENDING", "SHARE_PAID"],
      default: "EXPECTED"
    },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);
