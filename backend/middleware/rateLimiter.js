const RateLimit = require("../models/RateLimit");

/**
 * Standardizes a phone number to E.164 format.
 * Examples:
 *   "+919876543210"   -> "+919876543210"
 *   "9876543210"      -> "+919876543210"
 *   "+1 415 555 2671" -> "+14155552671"
 */
const toE164 = (phone) => {
  if (!phone) return "";
  const cleaned = String(phone).trim().replace(/[^\d+]/g, "");
  if (!cleaned || cleaned === "+") return "";
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return `+${cleaned}`;
};

/**
 * Safely extracts client IP address from request.
 * Takes into account Express trust proxy, X-Forwarded-For, and X-Real-IP headers.
 * Strips IPv6-mapped IPv4 prefix (::ffff:).
 */
const getClientIp = (req) => {
  let ip = req.ip;

  // If Express trust proxy resolved a public/non-loopback IP, use it
  if (ip && ip !== "127.0.0.1" && ip !== "::1" && ip !== "::ffff:127.0.0.1") {
    return ip.replace(/^::ffff:/, "").trim();
  }

  // Fallback if trust proxy is not configured or resolved to localhost
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded && typeof forwarded === "string") {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) {
      return firstIp.replace(/^::ffff:/, "").trim();
    }
  }

  const realIp = req.headers && req.headers["x-real-ip"];
  if (realIp && typeof realIp === "string") {
    return realIp.replace(/^::ffff:/, "").trim();
  }

  return (ip || req.socket?.remoteAddress || req.connection?.remoteAddress || "127.0.0.1")
    .replace(/^::ffff:/, "")
    .trim();
};

/**
 * Consumes a rate limit token atomically against the RateLimit collection.
 * 
 * @param {Object} options
 * @param {string} options.key - Unique rate limit key
 * @param {number} options.limit - Max requests allowed in the window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {Promise<{ allowed: boolean, remaining: number, retryAfter: number, resetAt: Date }>}
 */
const consumeRateLimit = async ({ key, limit, windowMs }) => {
  const now = new Date();

  // Find active record
  const existing = await RateLimit.findOne({ key });

  // If not found or window expired, start a new window
  if (!existing || existing.resetAt <= now) {
    const resetAt = new Date(now.getTime() + windowMs);
    try {
      await RateLimit.findOneAndUpdate(
        { key },
        { $set: { count: 1, resetAt } },
        { upsert: true, new: true }
      );
      return { allowed: true, remaining: limit - 1, retryAfter: 0, resetAt };
    } catch (err) {
      // Handle race condition on initial upsert
      const retryRecord = await RateLimit.findOne({ key });
      if (retryRecord && retryRecord.resetAt > now) {
        if (retryRecord.count >= limit) {
          const retryAfter = Math.max(1, Math.ceil((retryRecord.resetAt.getTime() - now.getTime()) / 1000));
          return { allowed: false, remaining: 0, retryAfter, resetAt: retryRecord.resetAt };
        }
        await RateLimit.updateOne({ key }, { $inc: { count: 1 } });
        return { allowed: true, remaining: limit - retryRecord.count - 1, retryAfter: 0, resetAt: retryRecord.resetAt };
      }
      return { allowed: true, remaining: limit - 1, retryAfter: 0, resetAt };
    }
  }

  // Active window exists and limit reached
  if (existing.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000));
    return { allowed: false, remaining: 0, retryAfter, resetAt: existing.resetAt };
  }

  // Atomically increment active record if count < limit
  const updated = await RateLimit.findOneAndUpdate(
    { key, count: { $lt: limit } },
    { $inc: { count: 1 } },
    { new: true }
  );

  if (!updated) {
    // Another concurrent request reached limit
    const recheck = await RateLimit.findOne({ key });
    if (recheck && recheck.count >= limit && recheck.resetAt > now) {
      const retryAfter = Math.max(1, Math.ceil((recheck.resetAt.getTime() - now.getTime()) / 1000));
      return { allowed: false, remaining: 0, retryAfter, resetAt: recheck.resetAt };
    }
  }

  const remaining = updated ? Math.max(0, limit - updated.count) : 0;
  return { allowed: true, remaining, retryAfter: 0, resetAt: existing.resetAt };
};

/**
 * Checks cooldown for a key (e.g. per-phone cooldown).
 * If active cooldown exists, returns { allowed: false, retryAfter }.
 * If not, returns { allowed: true, retryAfter: 0 }.
 */
const checkCooldown = async ({ key }) => {
  const now = new Date();
  const existing = await RateLimit.findOne({ key });

  if (existing && existing.resetAt > now) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000));
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
};

/**
 * Sets cooldown for a key.
 */
const setCooldown = async ({ key, cooldownMs }) => {
  const now = new Date();
  const resetAt = new Date(now.getTime() + cooldownMs);
  await RateLimit.findOneAndUpdate(
    { key },
    { $set: { count: 1, resetAt } },
    { upsert: true, new: true }
  );
};

/**
 * Dedicated OTP Rate Limiter for /api/auth/send-login-otp.
 * Enforces:
 * 1. Per-phone cooldown (default 60s)
 * 2. Per-phone request limit (default 5 requests / 10 min)
 * 3. Per-IP request limit (default 15 requests / 10 min)
 */
const otpRateLimiter = async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const phoneInput = req.body?.mobile || req.body?.phone;
    const normalizedPhone = phoneInput ? toE164(phoneInput) : null;

    const cooldownMs = Number(process.env.OTP_COOLDOWN_MS) || 60 * 1000; // 60s cooldown
    const phoneLimit = Number(process.env.OTP_PHONE_LIMIT) || 5; // 5 OTPs per phone
    const phoneWindowMs = Number(process.env.OTP_PHONE_WINDOW_MS) || 10 * 60 * 1000; // 10 min
    const ipLimit = Number(process.env.OTP_IP_LIMIT) || 15; // 15 OTPs per IP
    const ipWindowMs = Number(process.env.OTP_IP_WINDOW_MS) || 10 * 60 * 1000; // 10 min

    // 1. Check Phone Cooldown (short-term spam prevention)
    if (normalizedPhone) {
      const cooldownKey = `ratelimit:cooldown:${normalizedPhone}`;
      const cooldownCheck = await checkCooldown({ key: cooldownKey });
      if (!cooldownCheck.allowed) {
        res.set("Retry-After", String(cooldownCheck.retryAfter));
        return res.status(429).json({
          error: `Please wait ${cooldownCheck.retryAfter} second${cooldownCheck.retryAfter === 1 ? "" : "s"} before requesting another OTP.`,
          retryAfter: cooldownCheck.retryAfter
        });
      }
    }

    // 2. Check Phone Rate Limit (medium-term quota)
    if (normalizedPhone) {
      const phoneKey = `ratelimit:phone:${normalizedPhone}`;
      const phoneResult = await consumeRateLimit({ key: phoneKey, limit: phoneLimit, windowMs: phoneWindowMs });
      if (!phoneResult.allowed) {
        const minutes = Math.ceil(phoneResult.retryAfter / 60);
        res.set("Retry-After", String(phoneResult.retryAfter));
        return res.status(429).json({
          error: `Too many OTP requests for this phone number. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          retryAfter: phoneResult.retryAfter
        });
      }
    }

    // 3. Check IP Rate Limit (shared network protection)
    const ipKey = `ratelimit:ip:${ip}`;
    const ipResult = await consumeRateLimit({ key: ipKey, limit: ipLimit, windowMs: ipWindowMs });
    if (!ipResult.allowed) {
      const minutes = Math.ceil(ipResult.retryAfter / 60);
      res.set("Retry-After", String(ipResult.retryAfter));
      return res.status(429).json({
        error: `Too many requests from this IP. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        retryAfter: ipResult.retryAfter
      });
    }

    // 4. Set Phone Cooldown (since both phone and IP limits passed)
    if (normalizedPhone) {
      const cooldownKey = `ratelimit:cooldown:${normalizedPhone}`;
      await setCooldown({ key: cooldownKey, cooldownMs });
    }

    next();
  } catch (err) {
    console.error("❌ OTP Rate Limiter error:", err);
    // Fail-open: don't lock out users if rate limit store has transient errors
    next();
  }
};

/**
 * Verification Rate Limiter for /api/auth/verify-login-otp.
 * Limits brute-force verification attempts per IP and per phone number.
 */
const verifyOtpRateLimiter = async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const phoneInput = req.body?.mobile || req.body?.phone;
    const normalizedPhone = phoneInput ? toE164(phoneInput) : null;

    const ipLimit = Number(process.env.OTP_VERIFY_IP_LIMIT) || 20; // 20 verify attempts per IP
    const ipWindowMs = Number(process.env.OTP_VERIFY_WINDOW_MS) || 10 * 60 * 1000;
    const phoneLimit = Number(process.env.OTP_VERIFY_PHONE_LIMIT) || 10; // 10 verify attempts per phone
    const phoneWindowMs = Number(process.env.OTP_VERIFY_WINDOW_MS) || 10 * 60 * 1000;

    // Check IP verification rate limit
    const ipKey = `ratelimit:verify:ip:${ip}`;
    const ipResult = await consumeRateLimit({ key: ipKey, limit: ipLimit, windowMs: ipWindowMs });
    if (!ipResult.allowed) {
      const minutes = Math.ceil(ipResult.retryAfter / 60);
      res.set("Retry-After", String(ipResult.retryAfter));
      return res.status(429).json({
        error: `Too many verification attempts from this IP. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        retryAfter: ipResult.retryAfter
      });
    }

    // Check Phone verification rate limit
    if (normalizedPhone) {
      const phoneKey = `ratelimit:verify:phone:${normalizedPhone}`;
      const phoneResult = await consumeRateLimit({ key: phoneKey, limit: phoneLimit, windowMs: phoneWindowMs });
      if (!phoneResult.allowed) {
        const minutes = Math.ceil(phoneResult.retryAfter / 60);
        res.set("Retry-After", String(phoneResult.retryAfter));
        return res.status(429).json({
          error: `Too many verification attempts for this phone number. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          retryAfter: phoneResult.retryAfter
        });
      }
    }

    next();
  } catch (err) {
    console.error("❌ Verify OTP Rate Limiter error:", err);
    next();
  }
};

/**
 * Generic Mongoose-backed rate limiter (kept for backward compatibility).
 * 
 * @param {number} limit - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimiter = (limit = 10, windowMs = 10 * 60 * 1000) => {
  return async (req, res, next) => {
    try {
      const ip = getClientIp(req);
      const ipKey = `ratelimit:ip:${ip}`;

      const phoneInput = req.body?.mobile || req.body?.phone;
      const normalizedPhone = phoneInput ? toE164(phoneInput) : null;
      const phoneKey = normalizedPhone ? `ratelimit:phone:${normalizedPhone}` : null;

      // 1. Validate IP Rate Limit
      const ipResult = await consumeRateLimit({ key: ipKey, limit, windowMs });
      if (!ipResult.allowed) {
        const minutes = Math.ceil(ipResult.retryAfter / 60);
        res.set("Retry-After", String(ipResult.retryAfter));
        return res.status(429).json({
          error: `Too many requests from this IP. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          retryAfter: ipResult.retryAfter
        });
      }

      // 2. Validate Phone Rate Limit (if phone was provided)
      if (phoneKey) {
        const phoneResult = await consumeRateLimit({ key: phoneKey, limit, windowMs });
        if (!phoneResult.allowed) {
          const minutes = Math.ceil(phoneResult.retryAfter / 60);
          res.set("Retry-After", String(phoneResult.retryAfter));
          return res.status(429).json({
            error: `Too many OTP requests for this phone number. Please try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            retryAfter: phoneResult.retryAfter
          });
        }
      }

      next();
    } catch (err) {
      console.error("❌ Rate limiter middleware error:", err);
      // Fallback: don't block users if DB rate limit lookup crashes
      next();
    }
  };
};

module.exports = {
  rateLimiter,
  otpRateLimiter,
  verifyOtpRateLimiter,
  toE164,
  getClientIp,
  consumeRateLimit,
  checkCooldown,
  setCooldown
};
