require('dotenv').config();
const mongoose = require('mongoose');
const { findUserById } = require('./utils/userHelper');

async function testMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const result = await findUserById('69cfba38e6b421ee2c73c81e');
  console.log("User role/model:", result.role);
  
  const user = result.user;
  console.log("Cart before:", user.cart);
  
  if (!user.cart) user.cart = [];
  
  user.cart.push({ test: 123, addedAt: new Date() });
  user.markModified('cart');
  await user.save();
  
  console.log("Saved.");
  
  const result2 = await findUserById('69cfba38e6b421ee2c73c81e');
  console.log("Cart after query:", result2.user.cart);
  
  process.exit(0);
}
testMongo();
