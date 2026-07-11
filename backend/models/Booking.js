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
    
    // Payment info
    paymentId: { type: String },
    isPaid: { type: Boolean, default: false },
    isFreeBooking: { type: Boolean, default: false },
    amountPaid: { type: Number },

    /**
     * Membership consultation credit tracking (Phase 5).
     * When a metered consultation credit was consumed at book time,
     * cancel-before-session restores it exactly once via usageReservationId.
     */
    bookingPath: {
      type: String,
      enum: ["free", "membership", "paid", "consultant"],
    },
    membershipCreditConsumed: { type: Boolean, default: false },
    usageReservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsageReservation",
    },
    /**
     * Credit restore state machine (prevents double restore under concurrency):
     *   none → claimed → restored
     *   none → skipped (session already occurred / no credit)
     * Only one actor can win the none → claimed transition.
     */
    creditRestoreStatus: {
      type: String,
      enum: ["none", "claimed", "restored", "skipped"],
      default: "none",
    },
    creditRestoredAt: { type: Date },
    cancelledAt: { type: Date },
    /** admin | student — who cancelled */
    cancelledByRole: {
      type: String,
      enum: ["admin", "student", "system"],
    },
    cancelledByUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

/**
 * P0-4: At most one active counselling booking per date+time.
 * Partial filter so cancelled/completed history does not block re-use.
 * Created explicitly on boot (autoIndex is false on this schema).
 */
bookingSchema.index(
  { date: 1, time: 1, bookingType: 1 },
  {
    unique: true,
    name: "unique_active_counselling_slot",
    partialFilterExpression: {
      bookingType: "counselling",
      status: "booked",
    },
  }
);

// One booking per non-empty Razorpay paymentId (null/missing allowed many times)
bookingSchema.index(
  { paymentId: 1 },
  {
    unique: true,
    name: "unique_paymentId_booking",
    partialFilterExpression: {
      paymentId: { $type: "string", $gt: "" },
    },
  }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
