const mongoose = require("mongoose");

const UsageReservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    featureId: { type: String, required: true },
    planId: { type: String, required: true },
    reservationKey: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["reserved", "committed", "released"],
      default: "reserved",
      required: true,
    },
    metered: { type: Boolean, default: true },
    usedBefore: { type: Number },
    remainingBefore: { type: Number },
    limit: { type: Number },
    metadata: { type: mongoose.Schema.Types.Mixed },
    reservedAt: { type: Date, default: Date.now },
    committedAt: { type: Date },
    releasedAt: { type: Date },
  },
  { timestamps: true }
);

UsageReservationSchema.index({ userId: 1, featureId: 1, status: 1 });

module.exports =
  mongoose.models.UsageReservation ||
  mongoose.model("UsageReservation", UsageReservationSchema);
