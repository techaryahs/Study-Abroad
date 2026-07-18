/**
 * P2 — Unified Payment Layer v2 Routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orchestrator = require("../services/payment/purchaseOrchestrator.service");
const { findUserById } = require("../utils/userHelper");

/**
 * POST /api/payments/v2/verify
 * Unified verification endpoint for all gateways.
 * Body: { gateway: 'apple' | 'razorpay', payload: {...}, amount: 499, currency: 'INR', planId: 'starter' }
 */
router.post("/verify", auth, async (req, res) => {
  try {
    const { gateway, payload, amount, currency, planId } = req.body;
    
    if (!gateway || !payload) {
      return res.status(400).json({ success: false, error: "Gateway and payload are required" });
    }

    // Resolve user from auth context
    const foundUser = await findUserById(req.user.id || req.user._id);
    if (!foundUser || !foundUser.user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const result = await orchestrator.processPurchase(
      foundUser.user,
      foundUser.model,
      gateway,
      payload,
      amount,
      currency,
      planId
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("[Payment v2 API] Verify error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
