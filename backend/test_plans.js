require('dotenv').config();
const mongoose = require('mongoose');
const MembershipPlan = require('./models/MembershipPlan');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const plans = await MembershipPlan.find({ isActive: true }).lean();
  console.log(JSON.stringify(plans, null, 2));
  process.exit(0);
}
test();
