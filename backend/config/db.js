var mongoose = require("mongoose");

/**
 * Ensure production-critical indexes exist even when schema autoIndex is false.
 */
async function ensureCriticalIndexes() {
  try {
    const Booking = require("../models/Booking");
    await Booking.collection.createIndex(
      { date: 1, time: 1, bookingType: 1 },
      {
        unique: true,
        name: "unique_active_counselling_slot",
        partialFilterExpression: {
          bookingType: "counselling",
          status: "booked",
        },
        background: true,
      }
    );
    console.log("Booking index ensured: unique_active_counselling_slot");

    await Booking.collection.createIndex(
      { paymentId: 1 },
      {
        unique: true,
        name: "unique_paymentId_booking",
        partialFilterExpression: {
          paymentId: { $type: "string", $gt: "" },
        },
        background: true,
      }
    );
    console.log("Booking index ensured: unique_paymentId_booking");
  } catch (err) {
    // Duplicate key on existing bad data — log loudly; do not crash boot.
    console.error(
      "Failed to ensure booking uniqueness indexes:",
      err.message
    );
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await ensureCriticalIndexes();
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;