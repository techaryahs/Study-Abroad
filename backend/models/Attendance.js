const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    studentLeadId: {
      type: String,
      required: true,
      ref: "StudentLead"
    },
    seminarId: {
      type: String,
      required: true,
      ref: "Seminar"
    },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    attendanceStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "PENDING", "VERIFIED"],
      default: "PRESENT"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verificationMethod: {
      type: String,
      enum: ["QR", "COLLEGE_CONFIRMED", "COUNSELLOR", "ADMIN", "MANUAL"],
      default: "MANUAL"
    }
  },
  { timestamps: true }
);

AttendanceSchema.index({ studentLeadId: 1, seminarId: 1 }, { unique: true });

module.exports = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
