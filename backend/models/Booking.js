// backend/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // For Consultants / Counsellors
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    consultantEmail: { type: String },
    consultantName: { type: String },

    bookingType: {
      type: String,
      enum: ["consultant", "counselling"],
      default: "consultant"
    },
    classMode: {
      type: String,
      enum: ["online", "offline"]
    },

    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: "HH:mm" (24-hour)
    endTime: { type: String },              // Format: "HH:mm" (end of 1-hour slot)
    duration: { type: Number, default: 60 }, // in minutes

    userEmail: { type: String, required: true },
    userPhone: { type: String, default: "" },
    userName: { type: String },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "booked", "completed", "cancelled"],
      default: "pending"
    },

    // Meeting / WebRTC
    sessionId: { type: String, unique: true, sparse: true }, // Unique per counselling session
    meetingId: { type: String }, // Short hash used by WebRTC room
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
