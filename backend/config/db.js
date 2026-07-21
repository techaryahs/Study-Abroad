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
    console.error(
      "Failed to ensure booking uniqueness indexes:",
      err.message
    );
  }

  // ── Apple Subscription indexes (P2 Apple IAP rewrite) ──────────────────

  try {
    const AppleSubscription = require("../models/AppleSubscription");
    await AppleSubscription.collection.createIndex(
      { platform: 1, originalTransactionId: 1 },
      { unique: true, name: "unique_platform_original_transaction", background: true }
    );
    console.log("AppleSubscription index ensured: unique_platform_original_transaction");

    await AppleSubscription.collection.createIndex(
      { userId: 1, platform: 1 },
      { name: "apple_subscription_user_lookup", background: true }
    );
    console.log("AppleSubscription index ensured: apple_subscription_user_lookup");

    await AppleSubscription.collection.createIndex(
      { appAccountToken: 1 },
      { name: "apple_subscription_account_token", background: true }
    );
    console.log("AppleSubscription index ensured: apple_subscription_account_token");

    await AppleSubscription.collection.createIndex(
      { planId: 1, status: 1 },
      { name: "apple_subscription_plan_status", background: true }
    );
    console.log("AppleSubscription index ensured: apple_subscription_plan_status");
  } catch (err) {
    console.error(
      "Failed to ensure Apple Subscription indexes:",
      err.message
    );
  }

  // ── Apple Subscription Event indexes ────────────────────────────────────

  try {
    const AppleSubscriptionEvent = require("../models/AppleSubscriptionEvent");
    await AppleSubscriptionEvent.collection.createIndex(
      { originalTransactionId: 1, eventType: 1, createdAt: -1 },
      { name: "apple_event_transaction_lookup", background: true }
    );
    console.log("AppleSubscriptionEvent index ensured: apple_event_transaction_lookup");

    await AppleSubscriptionEvent.collection.createIndex(
      { notificationUUID: 1 },
      { unique: true, sparse: true, name: "unique_apple_notification_uuid", background: true }
    );
    console.log("AppleSubscriptionEvent index ensured: unique_apple_notification_uuid");

    await AppleSubscriptionEvent.collection.createIndex(
      { idempotencyKey: 1 },
      { unique: true, sparse: true, name: "unique_apple_event_idempotency", background: true }
    );
    console.log("AppleSubscriptionEvent index ensured: unique_apple_event_idempotency");
  } catch (err) {
    console.error(
      "Failed to ensure Apple Subscription Event indexes:",
      err.message
    );
  }

  // ── PaymentTransaction subscriptionId index ─────────────────────────────

  try {
    const PaymentTransaction = require("../models/PaymentTransaction");
    await PaymentTransaction.collection.createIndex(
      { subscriptionId: 1, createdAt: -1 },
      { name: "payment_txn_subscription_lookup", background: true }
    );
    console.log("PaymentTransaction index ensured: payment_txn_subscription_lookup");
  } catch (err) {
    console.error(
      "Failed to ensure PaymentTransaction subscription index:",
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
