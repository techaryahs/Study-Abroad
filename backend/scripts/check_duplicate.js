require('dotenv').config();
const mongoose = require('mongoose');
const PaymentAttempt = require('../models/PaymentAttempt');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  console.log("Database Name:", mongoose.connection.name);
  console.log("Masked URI:", process.env.MONGO_URI.replace(/:([^:@]+)@/, ':***@'));

  const result = await PaymentAttempt.findOne({
    gateway: "apple",
    externalTransactionId: "2000001208560621"
  });

  console.log("Result:", result);
  process.exit(0);
}

main().catch(console.error);
