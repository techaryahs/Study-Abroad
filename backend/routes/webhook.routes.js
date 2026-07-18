/**
 * P2 — Webhook Routes
 */

const express = require("express");
const router = express.Router();
const orchestrator = require("../services/payment/purchaseOrchestrator.service");

/**
 * POST /api/webhooks/apple
 */
router.post("/apple", express.json(), async (req, res) => {
  try {
    const payload = req.body;
    // Apple sends signedPayload. A real implementation extracts webhookId from the JWS header.
    const webhookId = payload.notification_id || `apple_evt_${Date.now()}`;
    const eventType = payload.notification_type || "UNKNOWN";

    const result = await orchestrator.processWebhookEvent("apple", webhookId, eventType, payload);
    
    // Apple expects 200 OK regardless of processing outcome to stop retries, 
    // unless it's a 500 error we want them to retry.
    res.status(200).send("OK");
  } catch (error) {
    console.error("[Webhook] Apple processing error:", error);
    res.status(500).send("Error");
  }
});

/**
 * POST /api/webhooks/razorpay
 */
router.post("/razorpay", express.json(), async (req, res) => {
  try {
    const payload = req.body;
    // Razorpay sends x-razorpay-signature in headers which must be passed down if needed,
    // but typically it's verified in middleware or the service layer.
    const webhookId = req.headers['x-razorpay-event-id'] || `rzp_evt_${Date.now()}`;
    const eventType = payload.event || "UNKNOWN";

    // Pass headers along with body to allow signature verification in the service layer
    const fullPayload = {
      body: payload,
      signature: req.headers['x-razorpay-signature']
    };

    const result = await orchestrator.processWebhookEvent("razorpay", webhookId, eventType, fullPayload);
    
    res.status(200).send("OK");
  } catch (error) {
    console.error("[Webhook] Razorpay processing error:", error);
    res.status(500).send("Error");
  }
});

module.exports = router;
