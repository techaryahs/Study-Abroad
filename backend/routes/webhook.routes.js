/**
 * P2 — Webhook Routes
 *
 * POST /api/webhooks/apple  — Apple S2S V2 notifications
 * POST /api/webhooks/razorpay — Razorpay webhooks
 */

const express = require("express");
const router = express.Router();
const orchestrator = require("../services/payment/purchaseOrchestrator.service");
const appleWebhookService = require("../services/payment/appleWebhook.service");

/**
 * POST /api/webhooks/apple
 *
 * Receives Apple App Store Server Notifications V2.
 * Apple sends a JWS signedPayload which we decode and process.
 *
 * Always returns 200 OK to prevent Apple from retrying.
 * Apple's retry policy expects non-5xx responses to stop retries.
 */
router.post("/apple", express.json(), async (req, res) => {
  try {
    const rawBody = req.body;

    // Detect TEST notifications (sent when configuring the endpoint in App Store Connect)
    if (rawBody.notificationType === "TEST" || rawBody.signedPayload) {
      const signedPayload = rawBody.signedPayload;
      if (signedPayload) {
        // Quick parse to check if TEST
        try {
          const parts = signedPayload.split(".");
          if (parts.length === 3) {
            const payloadBytes = Buffer.from(parts[1], "base64");
            const payload = JSON.parse(payloadBytes.toString("utf8"));
            if (payload.notificationType === "TEST") {
              console.log("[Webhook] Apple TEST notification received.");
              return res.status(200).send("OK");
            }
          }
        } catch {
          // Not valid JWS, continue to main handler
        }
      }
    }

    // Process through dedicated Apple webhook service
    const result = await appleWebhookService.handleWebhook(rawBody);

    if (!result.success) {
      console.error("[Webhook] Apple processing error:", result.error);
      // Still return 200 — Apple doesn't retry non-5xx
    } else {
      console.log(`[Webhook] Apple ${result.processed ? "processed" : "ignored"}: ${result.reason || "ok"}`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("[Webhook] Apple processing exception:", error.message);
    // Return 200 anyway — Apple's retry on 500 could flood us
    res.status(200).send("OK");
  }
});

/**
 * POST /api/webhooks/razorpay
 */
router.post("/razorpay", express.json(), async (req, res) => {
  try {
    const payload = req.body;
    const webhookId = req.headers["x-razorpay-event-id"] || `rzp_evt_${Date.now()}`;
    const eventType = payload.event || "UNKNOWN";

    const fullPayload = {
      body: payload,
      signature: req.headers["x-razorpay-signature"],
    };

    const result = await orchestrator.processWebhookEvent("razorpay", webhookId, eventType, fullPayload);

    res.status(200).send("OK");
  } catch (error) {
    console.error("[Webhook] Razorpay processing error:", error);
    res.status(500).send("Error");
  }
});

module.exports = router;
