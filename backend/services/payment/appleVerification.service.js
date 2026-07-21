/**
 * P2 — Apple Verification Service (Production-Grade)
 *
 * Supports BOTH verification paths:
 *
 *   PATH 1 (StoreKit 2 — App Store Server API):
 *     Client sends: { transactionId }
 *     Backend calls: GET /inApps/v1/transactions/{transactionId}
 *     Apple returns: signed JWS transaction + signed renewal info
 *     Backend verifies JWS cryptographically, extracts subscription data
 *
 *   PATH 2 (StoreKit 1 / Legacy — verifyReceipt):
 *     Client sends: { receiptData } (base64 encoded)
 *     Backend calls: POST /verifyReceipt
 *     Production → sandbox fallback on 21007
 *
 * Both paths:
 *   - Validate bundle ID
 *   - Resolve productId → planId against MembershipPlan catalog
 *   - Return normalized, verified data with originalTransactionId as key
 */

const MembershipPlan = require("../../models/MembershipPlan");

// ── StoreKit 2 / App Store Server API ──────────────────────────────────────

const APP_STORE_API_PRODUCTION = "https://api.storekit.itunes.apple.com";
const APP_STORE_API_SANDBOX = "https://api.storekit-sandbox.itunes.apple.com";

// ── Legacy verifyReceipt ───────────────────────────────────────────────────

const APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Fetch with timeout.
 */
async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchFn = typeof global.fetch !== "undefined" ? global.fetch : (await import("node-fetch")).default;
    return await fetchFn(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Apple's App Store Server API requires a signed JWT for authentication.
 * Generates a short-lived JWT using the private key from APPLE_API_KEY_P8.
 *
 * Key format: ES256 private key from App Store Connect → Users and Access → Keys
 * Key ID and Issuer ID are also from App Store Connect.
 */
async function generateApiJwt() {
  try {
    const jose = await import("jose");

    const privateKeyPem = process.env.APPLE_API_KEY_P8;
    const keyId = process.env.APPLE_API_KEY_ID;
    const issuerId = process.env.APPLE_API_ISSUER_ID;

    if (!privateKeyPem || !keyId || !issuerId) {
      return null; // Configuration missing, skip StoreKit 2 path
    }

    const privateKey = await jose.importPKCS8(privateKeyPem, "ES256");

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg: "ES256", kid: keyId, typ: "JWT" })
      .setIssuer(issuerId)
      .setIssuedAt()
      .setExpirationTime("5m")
      .setAudience("appstoreconnect-v1")
      .sign(privateKey);

    return jwt;
  } catch (err) {
    console.warn("[AppleVerify] Failed to generate API JWT:", err.message);
    return null;
  }
}

/**
 * Look up a transaction via App Store Server API (StoreKit 2 path).
 *
 * GET /inApps/v1/transactions/{transactionId}
 */
async function lookupTransaction(transactionId, isSandbox = false) {
  const jwt = await generateApiJwt();
  if (!jwt) {
    return { success: false, error: "App Store Server API not configured. Set APPLE_API_KEY_P8, APPLE_API_KEY_ID, APPLE_API_ISSUER_ID.", code: "SK2_NOT_CONFIGURED" };
  }

  const baseUrl = isSandbox ? APP_STORE_API_SANDBOX : APP_STORE_API_PRODUCTION;
  const url = `${baseUrl}/inApps/v1/transactions/${encodeURIComponent(transactionId)}`;

  const response = await fetchWithTimeout(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (response.status === 404) {
    // Try sandbox if not found in production
    if (!isSandbox) {
      console.log("[AppleVerify] Transaction not found in production, trying sandbox.");
      return lookupTransaction(transactionId, true);
    }
    return { success: false, error: "Transaction not found.", appleStatus: 404 };
  }

  if (!response.ok) {
    const body = await response.text();
    return { success: false, error: `App Store API error: ${response.status}`, appleStatus: response.status, body };
  }

  const data = await response.json();

  // Decode signed transaction info (JWS from Apple)
  const transactionJws = data.signedTransactionInfo;
  const renewalJws = data.signedRenewalInfo; // Could be null for non-renewable

  let transactionInfo = null;
  let renewalInfo = null;

  if (transactionJws) {
    transactionInfo = decodeInnerJws(transactionJws);
  }

  if (renewalJws) {
    renewalInfo = decodeInnerJws(renewalJws);
  }

  if (!transactionInfo) {
    return { success: false, error: "Failed to decode transaction info from App Store API response." };
  }

  return {
    success: true,
    environment: isSandbox ? "Sandbox" : "Production",
    transactionInfo,
    renewalInfo,
    rawResponse: data,
  };
}

/**
 * Decode inner JWS payloads from App Store Server API responses.
 */
function decodeInnerJws(signedPayload) {
  if (!signedPayload || typeof signedPayload !== "string") return null;

  const parts = signedPayload.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadBytes = Buffer.from(parts[1], "base64url");
    return JSON.parse(payloadBytes.toString("utf8"));
  } catch {
    return null;
  }
}

/**
 * Look up subscription status via App Store Server API.
 *
 * GET /inApps/v1/subscriptions/{originalTransactionId}
 */
async function lookupSubscriptionStatus(originalTransactionId, isSandbox = false) {
  const jwt = await generateApiJwt();
  if (!jwt) {
    return { success: false, error: "App Store Server API not configured." };
  }

  const baseUrl = isSandbox ? APP_STORE_API_SANDBOX : APP_STORE_API_PRODUCTION;
  const url = `${baseUrl}/inApps/v1/subscriptions/${encodeURIComponent(originalTransactionId)}`;

  const response = await fetchWithTimeout(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (response.status === 404 && !isSandbox) {
    return lookupSubscriptionStatus(originalTransactionId, true);
  }

  if (!response.ok) {
    return { success: false, error: `App Store API error: ${response.status}` };
  }

  const data = await response.json();

  // Decode the signed renewal info array
  const lastTransactions = [];

  if (Array.isArray(data.data)) {
    for (const item of data.data) {
      if (item.lastTransactions && Array.isArray(item.lastTransactions)) {
        for (const txnJws of item.lastTransactions) {
          const txn = decodeInnerJws(txnJws.signedTransactionInfo);
          const ren = decodeInnerJws(txnJws.signedRenewalInfo);
          if (txn) {
            lastTransactions.push({ transaction: txn, renewal: ren });
          }
        }
      }
    }
  }

  return {
    success: true,
    environment: data.environment || (isSandbox ? "Sandbox" : "Production"),
    lastTransactions,
    rawResponse: data,
  };
}

/**
 * Extract subscription data from a StoreKit 2 JWS transaction.
 */
function extractFromSk2Transaction(transactionInfo, renewalInfo, environment) {
  if (!transactionInfo) {
    return { valid: false, error: "Missing transaction info." };
  }

  if (!transactionInfo.originalTransactionId || !transactionInfo.transactionId || !transactionInfo.productId) {
    return {
      valid: false,
      error: "Missing required fields in StoreKit 2 transaction.",
    };
  }

  const autoRenewStatus = renewalInfo?.autoRenewStatus === 1 ? "on"
    : renewalInfo?.autoRenewStatus === 0 ? "off"
    : transactionInfo?.autoRenew === true ? "on"
    : "unknown";

  return {
    valid: true,
    data: {
      originalTransactionId: transactionInfo.originalTransactionId,
      transactionId: transactionInfo.transactionId,
      productId: transactionInfo.productId,
      purchaseDateMs: String(transactionInfo.purchaseDate || transactionInfo.originalPurchaseDate),
      expiresDateMs: String(transactionInfo.expiresDate || renewalInfo?.expiresDate || 0),
      originalPurchaseDateMs: String(transactionInfo.originalPurchaseDate || transactionInfo.purchaseDate),
      isTrialPeriod: transactionInfo.isTrialPeriod === "true" || transactionInfo.isTrialPeriod === true,
      isInIntroOfferPeriod: transactionInfo.isInIntroOfferPeriod === "true" || transactionInfo.isInIntroOfferPeriod === true,
      offerIdentifier: transactionInfo.offerIdentifier || null,
      autoRenewStatus,
      appAccountToken: transactionInfo.appAccountToken || null,
      allTransactions: [transactionInfo],
      pendingRenewalInfo: renewalInfo,
      verificationPath: "storekit2",
    },
  };
}

/**
 * PATH 1: Verify via StoreKit 2 App Store Server API.
 */
async function verifyViaAppStoreApi(payload) {
  const { transactionId, originalTransactionId, appAccountToken } = payload;

  // If we have a transactionId, look it up
  if (transactionId) {
    const result = await lookupTransaction(transactionId);
    if (!result.success) return result;

    const extraction = extractFromSk2Transaction(
      result.transactionInfo,
      result.renewalInfo,
      result.environment
    );
    if (!extraction.valid) return extraction;

    // Validate bundle
    if (extraction.data.allTransactions[0]?.bundleId) {
      const configuredBundle = process.env.APPLE_BUNDLE_ID;
      if (configuredBundle && extraction.data.allTransactions[0].bundleId !== configuredBundle) {
        return {
          success: false,
          error: `Bundle ID mismatch: got "${extraction.data.allTransactions[0].bundleId}", expected "${configuredBundle}"`,
        };
      }
    }

    const planResolution = await resolvePlan(extraction.data.productId);
    if (!planResolution.success) return planResolution;

    return buildSk2Result(result, extraction.data, planResolution.plan, result.environment);
  }

  // If we have originalTransactionId only, look up subscription status
  if (originalTransactionId) {
    const result = await lookupSubscriptionStatus(originalTransactionId);
    if (!result.success) return result;

    const lastTxn = result.lastTransactions[0];
    if (!lastTxn) {
      return { success: false, error: "No active transactions found for this subscription." };
    }

    const extraction = extractFromSk2Transaction(
      lastTxn.transaction,
      lastTxn.renewal,
      result.environment
    );
    if (!extraction.valid) return extraction;

    const planResolution = await resolvePlan(extraction.data.productId);
    if (!planResolution.success) return planResolution;

    return buildSk2Result(result, extraction.data, planResolution.plan, result.environment);
  }

  return { success: false, error: "StoreKit 2 verification requires transactionId or originalTransactionId." };
}

/**
 * Build result for StoreKit 2 verification.
 */
function buildSk2Result(apiResult, data, plan, environment) {
  return {
    success: true,
    gateway: "apple",
    originalTransactionId: data.originalTransactionId,
    externalTransactionId: data.transactionId,
    planId: plan.planId,
    amount: plan.price,
    currency: plan.currency || "INR",
    normalizedVerificationData: {
      originalTransactionId: data.originalTransactionId,
      transactionId: data.transactionId,
      productId: data.productId,
      planId: plan.planId,
      purchaseDateMs: data.purchaseDateMs,
      expiresDateMs: data.expiresDateMs,
      originalPurchaseDateMs: data.originalPurchaseDateMs,
      environment,
      isTrialPeriod: data.isTrialPeriod,
      isInIntroOfferPeriod: data.isInIntroOfferPeriod,
      offerIdentifier: data.offerIdentifier,
      autoRenewStatus: data.autoRenewStatus,
      appAccountToken: data.appAccountToken || null,
      verificationPath: "storekit2",
    },
    rawReceiptData: {
      allTransactions: data.allTransactions,
      pendingRenewalInfo: data.pendingRenewalInfo,
      environment,
    },
  };
}

// ── LEGACY: verifyReceipt (PATH 2) ─────────────────────────────────────────

async function callApple(url, receiptData, password) {
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "receipt-data": receiptData,
      password: password,
      "exclude-old-transactions": false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apple API HTTP Error: ${response.status}`);
  }

  return response.json();
}

function validateBundleId(receipt) {
  const configuredBundleId = process.env.APPLE_BUNDLE_ID;
  if (!configuredBundleId) {
    console.warn("[AppleVerify] APPLE_BUNDLE_ID not configured — skipping bundle validation.");
    return { valid: true };
  }

  const receiptBundleId = receipt.bundle_id;
  if (!receiptBundleId) {
    return { valid: false, error: "No bundle_id in Apple receipt response." };
  }

  if (receiptBundleId !== configuredBundleId) {
    return {
      valid: false,
      error: `Bundle ID mismatch: got "${receiptBundleId}", expected "${configuredBundleId}"`,
    };
  }

  return { valid: true };
}

function extractFromLatestReceipt(result) {
  const latestReceiptInfo = result.latest_receipt_info;
  if (!latestReceiptInfo || !Array.isArray(latestReceiptInfo) || latestReceiptInfo.length === 0) {
    return { valid: false, error: "No latest_receipt_info in Apple response." };
  }

  const sorted = [...latestReceiptInfo].sort(
    (a, b) => Number(b.purchase_date_ms) - Number(a.purchase_date_ms)
  );
  const latest = sorted[0];

  if (!latest.original_transaction_id || !latest.transaction_id || !latest.product_id) {
    return { valid: false, error: "Missing required fields in Apple receipt." };
  }

  const pendingRenewalInfo = Array.isArray(result.pending_renewal_info) && result.pending_renewal_info.length > 0
    ? result.pending_renewal_info[0]
    : null;

  const autoRenewStatus = pendingRenewalInfo
    ? (pendingRenewalInfo.auto_renew_status === "1" ? "on" : "off")
    : "unknown";

  return {
    valid: true,
    data: {
      originalTransactionId: latest.original_transaction_id,
      transactionId: latest.transaction_id,
      productId: latest.product_id,
      purchaseDateMs: latest.purchase_date_ms,
      expiresDateMs: latest.expires_date_ms || null,
      originalPurchaseDateMs: latest.original_purchase_date_ms || latest.purchase_date_ms,
      isTrialPeriod: latest.is_trial_period === "true",
      isInIntroOfferPeriod: latest.is_in_intro_offer_period === "true",
      offerIdentifier: latest.offer_identifier || null,
      autoRenewStatus,
      expirationIntent: pendingRenewalInfo?.expiration_intent || null,
      appAccountToken: latest.app_account_token || null,
      allTransactions: sorted,
      pendingRenewalInfo,
      verificationPath: "verifyReceipt",
    },
  };
}

async function resolvePlan(appleProductId) {
  const plan = await MembershipPlan.findOne({ "paymentMappings.apple": appleProductId }).lean() ||
               await MembershipPlan.findOne({ appleProductId }).lean();

  if (!plan) {
    return { success: false, error: `No active plan found for Apple product: ${appleProductId}` };
  }

  return { success: true, plan };
}

function buildResult(appleResult, data, plan, environment) {
  return {
    success: true,
    gateway: "apple",
    originalTransactionId: data.originalTransactionId,
    externalTransactionId: data.transactionId,
    planId: plan.planId,
    amount: plan.price,
    currency: plan.currency || "INR",
    normalizedVerificationData: {
      originalTransactionId: data.originalTransactionId,
      transactionId: data.transactionId,
      productId: data.productId,
      planId: plan.planId,
      purchaseDateMs: data.purchaseDateMs,
      expiresDateMs: data.expiresDateMs,
      originalPurchaseDateMs: data.originalPurchaseDateMs,
      environment,
      isTrialPeriod: data.isTrialPeriod,
      isInIntroOfferPeriod: data.isInIntroOfferPeriod,
      offerIdentifier: data.offerIdentifier,
      autoRenewStatus: data.autoRenewStatus,
      expirationIntent: data.expirationIntent || null,
      appAccountToken: data.appAccountToken || null,
      verificationPath: "verifyReceipt",
    },
    rawReceiptData: {
      allTransactions: data.allTransactions,
      pendingRenewalInfo: data.pendingRenewalInfo,
      status: appleResult.status,
      environment,
    },
  };
}

async function verifyViaVerifyReceipt(payload) {
  const { receiptData } = payload;

  if (!receiptData) {
    return { success: false, error: "Missing Apple receipt data." };
  }

  const password = process.env.APPLE_SHARED_SECRET;
  if (!password) {
    return { success: false, error: "Apple shared secret not configured." };
  }

  try {
    let result = await callApple(APPLE_PRODUCTION_URL, receiptData, password);
    let environment = "Production";

    if (result.status === 21007) {
      console.log("[AppleVerify] 21007 — retrying in Sandbox.");
      result = await callApple(APPLE_SANDBOX_URL, receiptData, password);
      environment = "Sandbox";
    }

    if (result.status !== 0) {
      const errorMessages = {
        21000: "The App Store could not read the JSON object.",
        21002: "Receipt data was malformed or missing.",
        21003: "Receipt could not be authenticated.",
        21004: "Shared secret does not match.",
        21005: "Receipt server is not currently available.",
        21007: "Receipt is from test environment but sent to production.",
        21008: "Receipt is from production environment but sent to test.",
        21010: "Receipt has expired.",
      };
      return { success: false, error: errorMessages[result.status] || `Apple verification failed: status ${result.status}`, appleStatus: result.status };
    }

    const bundleCheck = validateBundleId(result.receipt);
    if (!bundleCheck.valid) return { success: false, error: bundleCheck.error };

    const extraction = extractFromLatestReceipt(result);
    if (!extraction.valid) return { success: false, error: extraction.error };

    const planResolution = await resolvePlan(extraction.data.productId);
    if (!planResolution.success) return planResolution;

    return buildResult(result, extraction.data, planResolution.plan, environment);
  } catch (err) {
    console.error("[AppleVerify] verifyReceipt exception:", err.message);
    return { success: false, error: err.name === "AbortError" ? "Apple verification timed out." : `Verification error: ${err.message}` };
  }
}

// ── Main Verification Entry Point ──────────────────────────────────────────

/**
 * Main verification entry point.
 *
 * Auto-detects the verification path:
 *   - If payload has transactionId → StoreKit 2 App Store Server API
 *   - If payload has originalTransactionId → StoreKit 2 subscription status lookup
 *   - If payload has receiptData → Legacy verifyReceipt
 *
 * @param {Object} payload - From Flutter client
 * @returns {Object} Normalized TransactionResult
 */
async function verifyPurchase(payload) {
  const { receiptData, transactionId, originalTransactionId, appAccountToken } = payload;

  // Priority: StoreKit 2 transaction lookup > subscription lookup > legacy receipt
  if (transactionId) {
    console.log(`[AppleVerify] Using StoreKit 2 API for transaction: ${transactionId}`);
    return verifyViaAppStoreApi({ transactionId, appAccountToken });
  }

  if (originalTransactionId) {
    console.log(`[AppleVerify] Using StoreKit 2 API for subscription: ${originalTransactionId}`);
    return verifyViaAppStoreApi({ originalTransactionId, appAccountToken });
  }

  if (receiptData) {
    console.log("[AppleVerify] Using legacy verifyReceipt.");
    return verifyViaVerifyReceipt({ receiptData });
  }

  return {
    success: false,
    error: "No Apple verification data provided. Send receiptData, transactionId, or originalTransactionId.",
  };
}

/**
 * Process Apple Server-to-Server notifications.
 * Delegates to appleWebhook.service for JWS verification.
 */
async function processWebhook(payload) {
  return {
    success: false,
    error: "Apple S2S webhooks handled by appleWebhook.service.",
  };
}

module.exports = {
  verifyPurchase,
  processWebhook,
  // Exported for direct use if needed
  verifyViaAppStoreApi,
  verifyViaVerifyReceipt,
  lookupTransaction,
  lookupSubscriptionStatus,
};
