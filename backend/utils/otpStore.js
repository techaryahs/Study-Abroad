/**
 * Centralized OTP store management.
 * Booking OTPs are intentionally separate from auth/signup OTPs.
 */

const bookingOtpStore = new Map();

exports.getBookingOtpStore = () => {
  return bookingOtpStore;
};

exports.cleanupExpiredOtps = () => {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, value] of bookingOtpStore.entries()) {
    if (value.expiresAt < now) {
      bookingOtpStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} expired booking OTPs`);
  }
};
