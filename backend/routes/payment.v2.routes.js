/**
 * P2 — Unified Payment Layer v2 Routes
 *
 * POST /api/payments/v2/verify — Purchase/renewal verification (all gateways)
 * POST /api/payments/v2/restore — Restore purchases (Apple only)
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orchestrator = require("../services/payment/purchaseOrchestrator.service");
const { findUserById } = require("../utils/userHelper");

/**
 * POST /api/payments/v2/verify
 * Unified verification endpoint for all gateways.
 *
 * Apple body: { gateway: "apple", payload: { receiptData } }
 * Razorpay body: { gateway: "razorpay", payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature }, amount, currency, planId }
 */
router.post("/verify", auth, async (req, res) => {
  try {
    const { gateway, payload, amount, currency, planId } = req.body;

    if (!gateway || !payload) {
      return res.status(400).json({ success: false, error: "Gateway and payload are required." });
    }

    const foundUser = await findUserById(req.user.id || req.user._id);
    if (!foundUser || !foundUser.user) {
      return res.status(404).json({ success: false, error: "User not found." });
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
      const statusCode = result.status || result.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT" ? 403 : 400;
      return res.status(statusCode).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("[Payment v2 API] Verify error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

/**
 * POST /api/payments/v2/restore
 * Restore purchases endpoint (Apple IAP only).
 *
 * Apple body: { gateway: "apple", payload: { receiptData } }
 *
 * Used by the "Restore Purchases" button in the Flutter app.
 * Returns:
 *   200: { success: true, restored: bool, subscription, membership }
 *   403: { success: false, code: "SUBSCRIPTION_OWNERSHIP_CONFLICT" }
 */
router.post("/restore", auth, async (req, res) => {
  try {
    const { gateway, payload } = req.body;

    if (!gateway || !payload) {
      return res.status(400).json({ success: false, error: "Gateway and payload are required." });
    }

    if (gateway !== "apple") {
      return res.status(400).json({
        success: false,
        error: `Restore is not supported for gateway: ${gateway}. Only Apple subscriptions can be restored.`,
      });
    }

    const foundUser = await findUserById(req.user.id || req.user._id);
    if (!foundUser || !foundUser.user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const result = await orchestrator.processRestore(
      foundUser.user,
      foundUser.model,
      gateway,
      payload
    );

    if (!result.success) {
      const statusCode = result.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT" ? 403 : 400;
      return res.status(statusCode).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error("[Payment v2 API] Restore error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

module.exports = router;
