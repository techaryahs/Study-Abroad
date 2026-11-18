const assert = require("assert");
const express = require("express");
const {
  toE164,
  getClientIp,
  otpRateLimiter,
  verifyOtpRateLimiter,
  rateLimiter
} = require("./middleware/rateLimiter");
const RateLimit = require("./models/RateLimit");

// Create an in-memory mock for RateLimit model to test without needing live external DB
const mockStore = new Map();

RateLimit.findOne = async (query) => {
  const record = mockStore.get(query.key);
  if (!record) return null;
  return { ...record };
};

RateLimit.findOneAndUpdate = async (query, update, options) => {
  const existing = mockStore.get(query.key);
  const now = new Date();

  if (!existing && options && options.upsert) {
    const doc = {
      key: query.key,
      count: update.$set?.count ?? 1,
      resetAt: update.$set?.resetAt ?? new Date(now.getTime() + 60000)
    };
    mockStore.set(query.key, doc);
    return { ...doc };
  }

  if (existing) {
    if (query.resetAt && existing.resetAt.getTime() !== query.resetAt.getTime()) {
      return null;
    }
    if (query.count && query.count.$lt !== undefined && existing.count >= query.count.$lt) {
      return null;
    }
    if (update.$inc && update.$inc.count) {
      existing.count += update.$inc.count;
    }
    if (update.$set) {
      if (update.$set.count !== undefined) existing.count = update.$set.count;
      if (update.$set.resetAt !== undefined) existing.resetAt = update.$set.resetAt;
    }
    mockStore.set(query.key, existing);
    return { ...existing };
  }

  return null;
};

RateLimit.updateOne = async (query, update) => {
  return RateLimit.findOneAndUpdate(query, update, {});
};

function createMockReqRes({ ip, headers = {}, body = {} }) {
  const req = {
    ip,
    headers: { ...headers },
    body: { ...body },
    connection: { remoteAddress: "127.0.0.1" },
    socket: { remoteAddress: "127.0.0.1" }
  };

  const resHeaders = {};
  const res = {
    statusCode: 200,
    headers: resHeaders,
    set(name, value) {
      resHeaders[name.toLowerCase()] = String(value);
      return res;
    },
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.jsonData = data;
      return res;
    }
  };

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  return { req, res, next, wasNextCalled: () => nextCalled };
}

async function runTests() {
  console.log("==================================================");
  console.log("🧪 STARTING RATE LIMITER VERIFICATION TEST SUITE");
  console.log("==================================================");

  // 1. Test toE164
  console.log("\n[TEST 1] Standardizing phone numbers (toE164)...");
  assert.strictEqual(toE164("9876543210"), "+919876543210", "10-digit Indian number should get +91 prefix");
  assert.strictEqual(toE164("+91 98765 43210"), "+919876543210", "Should strip internal whitespace");
  assert.strictEqual(toE164("+1 415 555 2671"), "+14155552671", "International number should be preserved with +");
  assert.strictEqual(toE164(""), "", "Empty string should return empty string");
  assert.strictEqual(toE164(null), "", "Null should return empty string");
  assert.strictEqual(toE164("abc"), "", "Non-digits without numbers should return empty string");
  console.log("✅ [TEST 1 PASSED] toE164 formats all phone numbers correctly.");

  // 2. Test getClientIp
  console.log("\n[TEST 2] Testing Client IP detection (getClientIp)...");
  const req1 = { ip: "203.0.113.50", headers: {} };
  assert.strictEqual(getClientIp(req1), "203.0.113.50", "Should use req.ip when public IP");

  const req2 = { ip: "::ffff:203.0.113.50", headers: {} };
  assert.strictEqual(getClientIp(req2), "203.0.113.50", "Should strip ::ffff: prefix");

  const req3 = {
    ip: "127.0.0.1",
    headers: { "x-forwarded-for": "198.51.100.25, 10.0.0.1" }
  };
  assert.strictEqual(getClientIp(req3), "198.51.100.25", "Should extract client IP from X-Forwarded-For if req.ip is loopback");

  const req4 = {
    ip: "127.0.0.1",
    headers: { "x-real-ip": "198.51.100.99" }
  };
  assert.strictEqual(getClientIp(req4), "198.51.100.99", "Should fallback to X-Real-IP if X-Forwarded-For is absent");

  const req5 = {
    ip: "127.0.0.1",
    headers: {},
    connection: { remoteAddress: "127.0.0.1" }
  };
  assert.strictEqual(getClientIp(req5), "127.0.0.1", "Should return 127.0.0.1 for local dev direct connection");
  console.log("✅ [TEST 2 PASSED] Client IP detection correctly resolves proxy & direct IPs.");

  // 3. Test Express trust proxy setting
  console.log("\n[TEST 3] Testing Express app.set('trust proxy', 1)...");
  const testApp = express();
  testApp.set("trust proxy", 1);
  const expressReq = {
    app: testApp,
    headers: { "x-forwarded-for": "203.0.113.88" },
    connection: { remoteAddress: "127.0.0.1" },
    socket: { remoteAddress: "127.0.0.1" }
  };
  Object.setPrototypeOf(expressReq, express.request);
  assert.strictEqual(expressReq.ip, "203.0.113.88", "Express req.ip must resolve to forwarded client IP");
  console.log("✅ [TEST 3 PASSED] Express trust proxy correctly extracts client IP from Nginx hop.");

  // 4. Test OTP Rate Limiter (Cooldown)
  console.log("\n[TEST 4] Testing Per-Phone Cooldown...");
  mockStore.clear();

  // First request: should succeed
  const ctx1 = createMockReqRes({
    ip: "203.0.113.10",
    body: { mobile: "+919876543210" }
  });
  await otpRateLimiter(ctx1.req, ctx1.res, ctx1.next);
  assert.strictEqual(ctx1.wasNextCalled(), true, "First OTP request should pass to next()");
  assert.strictEqual(ctx1.res.statusCode, 200, "First OTP status should be 200");

  // Immediate second request with SAME phone number: should trigger cooldown
  const ctx2 = createMockReqRes({
    ip: "203.0.113.10",
    body: { mobile: "+919876543210" }
  });
  await otpRateLimiter(ctx2.req, ctx2.res, ctx2.next);
  assert.strictEqual(ctx2.wasNextCalled(), false, "Second immediate OTP request should be blocked by cooldown");
  assert.strictEqual(ctx2.res.statusCode, 429, "Immediate repeat should return HTTP 429");
  assert.ok(ctx2.res.headers["retry-after"], "Response must include Retry-After header");
  assert.ok(ctx2.res.jsonData.retryAfter > 0, "Response must include numeric retryAfter");
  assert.ok(ctx2.res.jsonData.error.includes("Please wait"), "Error message should inform user to wait");
  console.log(`✅ [TEST 4 PASSED] Per-phone cooldown correctly blocked immediate duplicate: "${ctx2.res.jsonData.error}"`);

  // 5. Test Different Phone on Same IP
  console.log("\n[TEST 5] Testing Different Phone Number on Same IP...");
  const ctx3 = createMockReqRes({
    ip: "203.0.113.10",
    body: { mobile: "+919999999999" }
  });
  await otpRateLimiter(ctx3.req, ctx3.res, ctx3.next);
  assert.strictEqual(ctx3.wasNextCalled(), true, "Different phone number should NOT be blocked by another phone's cooldown");
  assert.strictEqual(ctx3.res.statusCode, 200);
  console.log("✅ [TEST 5 PASSED] Different phone number on same IP passed successfully.");

  // 6. Test Per-Phone Rate Limit Window
  console.log("\n[TEST 6] Testing Per-Phone Rate Limit Window (5 requests max)...");
  mockStore.clear();
  const phone = "+919888888888";

  // Simulate 5 requests with cooldown expiring between requests
  for (let i = 1; i <= 5; i++) {
    mockStore.delete(`ratelimit:cooldown:${phone}`); // Cooldown elapsed
    const ctx = createMockReqRes({
      ip: `203.0.113.${i}`,
      body: { mobile: phone }
    });
    await otpRateLimiter(ctx.req, ctx.res, ctx.next);
    assert.strictEqual(ctx.wasNextCalled(), true, `Request ${i} of 5 should succeed`);
  }

  // 6th request: should trigger phone rate limit
  mockStore.delete(`ratelimit:cooldown:${phone}`); // Cooldown elapsed
  const ctxPhoneLimit = createMockReqRes({
    ip: "203.0.113.99",
    body: { mobile: phone }
  });
  await otpRateLimiter(ctxPhoneLimit.req, ctxPhoneLimit.res, ctxPhoneLimit.next);
  assert.strictEqual(ctxPhoneLimit.wasNextCalled(), false, "6th request should exceed phone limit");
  assert.strictEqual(ctxPhoneLimit.res.statusCode, 429, "Exceeded phone limit should return 429");
  assert.ok(ctxPhoneLimit.res.jsonData.error.includes("Too many OTP requests for this phone number"), "Should return phone limit error");
  assert.ok(ctxPhoneLimit.res.headers["retry-after"], "Must set Retry-After header");
  console.log(`✅ [TEST 6 PASSED] Phone rate limit triggered after 5 requests: "${ctxPhoneLimit.res.jsonData.error}"`);

  // 7. Test Per-IP Rate Limit Window
  console.log("\n[TEST 7] Testing Per-IP Rate Limit Window (15 requests max)...");
  mockStore.clear();
  const testIp = "192.0.2.100";

  for (let i = 1; i <= 15; i++) {
    const ctx = createMockReqRes({
      ip: testIp,
      body: { mobile: `+9198000000${String(i).padStart(2, "0")}` }
    });
    await otpRateLimiter(ctx.req, ctx.res, ctx.next);
    assert.strictEqual(ctx.wasNextCalled(), true, `IP Request ${i} of 15 should succeed`);
  }

  // 16th request from same IP: should trigger IP rate limit
  const ctxIpLimit = createMockReqRes({
    ip: testIp,
    body: { mobile: "+919800000099" }
  });
  await otpRateLimiter(ctxIpLimit.req, ctxIpLimit.res, ctxIpLimit.next);
  assert.strictEqual(ctxIpLimit.wasNextCalled(), false, "16th request from same IP should be blocked");
  assert.strictEqual(ctxIpLimit.res.statusCode, 429, "Exceeded IP limit should return 429");
  assert.ok(ctxIpLimit.res.jsonData.error.includes("Too many requests from this IP"), "Should return IP limit error");
  assert.ok(ctxIpLimit.res.headers["retry-after"], "Must set Retry-After header");
  console.log(`✅ [TEST 7 PASSED] IP rate limit triggered after 15 requests: "${ctxIpLimit.res.jsonData.error}"`);

  // 8. Test That Different IP is NOT Blocked by Previous IP
  console.log("\n[TEST 8] Testing IP Isolation (different IP is unaffected)...");
  const ctxOtherIp = createMockReqRes({
    ip: "192.0.2.200", // Different IP
    body: { mobile: "+919800000099" }
  });
  await otpRateLimiter(ctxOtherIp.req, ctxOtherIp.res, ctxOtherIp.next);
  assert.strictEqual(ctxOtherIp.wasNextCalled(), true, "Different IP should NOT be blocked by testIp's limit");
  assert.strictEqual(ctxOtherIp.res.statusCode, 200);
  console.log("✅ [TEST 8 PASSED] Different IP address operates in completely separate bucket.");

  // 9. Test Verification Rate Limiter (verifyOtpRateLimiter)
  console.log("\n[TEST 9] Testing Verify OTP Rate Limiter...");
  mockStore.clear();
  const verifyIp = "198.51.100.5";
  // Test IP limit with varying phone numbers
  for (let i = 1; i <= 20; i++) {
    const ctx = createMockReqRes({
      ip: verifyIp,
      body: { mobile: `+9191111111${String(i).padStart(2, "0")}`, otp: "123456" }
    });
    await verifyOtpRateLimiter(ctx.req, ctx.res, ctx.next);
    assert.strictEqual(ctx.wasNextCalled(), true, `Verify attempt ${i} should succeed`);
  }

  const ctxVerifyBlocked = createMockReqRes({
    ip: verifyIp,
    body: { mobile: "+919111111199", otp: "999999" }
  });
  await verifyOtpRateLimiter(ctxVerifyBlocked.req, ctxVerifyBlocked.res, ctxVerifyBlocked.next);
  assert.strictEqual(ctxVerifyBlocked.wasNextCalled(), false, "21st verify attempt from same IP should be blocked");
  assert.strictEqual(ctxVerifyBlocked.res.statusCode, 429);
  assert.ok(ctxVerifyBlocked.res.jsonData.error.includes("Too many verification attempts from this IP"), "Should return IP verification limit error");
  console.log(`✅ [TEST 9 PASSED] Verification rate limiter correctly triggered: "${ctxVerifyBlocked.res.jsonData.error}"`);

  // 10. Test Counter Expiration
  console.log("\n[TEST 10] Testing Counter Expiration...");
  const expiredKey = "ratelimit:ip:10.10.10.10";
  mockStore.set(expiredKey, {
    key: expiredKey,
    count: 100,
    resetAt: new Date(Date.now() - 5000) // Expired 5 seconds ago
  });

  const ctxExpired = createMockReqRes({
    ip: "10.10.10.10",
    body: { mobile: "+919222222222" }
  });
  await otpRateLimiter(ctxExpired.req, ctxExpired.res, ctxExpired.next);
  assert.strictEqual(ctxExpired.wasNextCalled(), true, "Request on expired window should reset count and succeed");
  const updatedDoc = mockStore.get(expiredKey);
  assert.strictEqual(updatedDoc.count, 1, "Count should be reset to 1");
  console.log("✅ [TEST 10 PASSED] Expired rate limit window successfully reset.");

  console.log("\n==================================================");
  console.log("🎉 ALL 10 RATE LIMITER TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
