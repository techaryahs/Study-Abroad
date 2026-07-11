const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyReceipts,
} = require("../controllers/payment.controller");
const auth = require("../middleware/auth");
const requireSelfEmailOrAdmin = auth.requireSelfEmailOrAdmin;

// Create order: authenticated (identity bound on verify)
router.post("/create-order", auth, createOrder);
// Verify: JWT user is sole identity — never trust body.userId
router.post("/verify", auth, verifyPayment);
router.get("/user/:email", auth, requireSelfEmailOrAdmin, getMyReceipts);

module.exports = router;
