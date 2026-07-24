/**
 * Reusable backend logger utility with configurable log levels.
 * Log levels: debug (0), info (1), warn (2), error (3), none (4)
 */

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

function getconfiguredLevel() {
  const envLevel = String(process.env.LOG_LEVEL || "").toLowerCase().trim();
  if (envLevel in LEVELS) {
    return LEVELS[envLevel];
  }
  return process.env.NODE_ENV === "production" ? LEVELS.warn : LEVELS.debug;
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return "";
  const parts = email.split("@");
  if (parts.length !== 2) return "[masked email]";
  const [name, domain] = parts;
  if (name.length <= 4) {
    return `${name.substring(0, 1)}***@${domain}`;
  }
  return `${name.substring(0, 2)}***${name.substring(name.length - 2)}@${domain}`;
}

function maskToken(token) {
  if (!token) return "";
  return "JWT=[hidden]";
}

function maskOtp(otp) {
  if (!otp) return "";
  return "OTP=[hidden]";
}

const logger = {
  debug(...args) {
    if (getconfiguredLevel() <= LEVELS.debug) {
      console.log("[DEBUG]", ...args);
    }
  },
  info(...args) {
    if (getconfiguredLevel() <= LEVELS.info) {
      console.log("[INFO]", ...args);
    }
  },
  warn(...args) {
    if (getconfiguredLevel() <= LEVELS.warn) {
      console.warn("[WARN]", ...args);
    }
  },
  error(...args) {
    if (getconfiguredLevel() <= LEVELS.error) {
      console.error("[ERROR]", ...args);
    }
  },
  maskEmail,
  maskToken,
  maskOtp,
};

module.exports = logger;
