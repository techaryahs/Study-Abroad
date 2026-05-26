const RateLimit = require("../models/RateLimit");

/**
 * Standardizes a phone number to E.164 format.
 */
const toE164 = (phone) => {
  if (!phone) return "";
  const cleaned = String(phone).trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return `+${cleaned}`;
};

/**
 * Mongoose-backed rate limiter for distributed environments.
 * Limits by IP and by phone number (if present in request body).
 * 
 * @param {number} limit - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimiter = (limit, windowMs) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown-ip";
      const ipKey = `ratelimit:ip:${ip}`;
      
      const phoneInput = req.body.mobile || req.body.phone;
      const normalizedPhone = phoneInput ? toE164(phoneInput) : null;
      const phoneKey = normalizedPhone ? `ratelimit:phone:${normalizedPhone}` : null;
      
      const now = new Date();

      // 1. Validate IP Rate Limit
      let ipRecord = await RateLimit.findOne({ key: ipKey });
      if (ipRecord && ipRecord.resetAt > now) {
        if (ipRecord.count >= limit) {
          return res.status(429).json({
            error: "Too many requests from this IP. Please try again after 10 minutes."
          });
        }
        ipRecord.count += 1;
        await ipRecord.save();
      } else {
        await RateLimit.findOneAndUpdate(
          { key: ipKey },
          { count: 1, resetAt: new Date(now.getTime() + windowMs) },
          { upsert: true, new: true }
        );
      }

      // 2. Validate Phone Rate Limit (if phone was provided)
      if (phoneKey) {
        let phoneRecord = await RateLimit.findOne({ key: phoneKey });
        if (phoneRecord && phoneRecord.resetAt > now) {
          if (phoneRecord.count >= limit) {
            return res.status(429).json({
              error: "Too many OTP requests for this phone number. Please try again after 10 minutes."
            });
          }
          phoneRecord.count += 1;
          await phoneRecord.save();
        } else {
          await RateLimit.findOneAndUpdate(
            { key: phoneKey },
            { count: 1, resetAt: new Date(now.getTime() + windowMs) },
            { upsert: true, new: true }
          );
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

module.exports = { rateLimiter, toE164 };
