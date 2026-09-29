/**
 * Centralized OTP store management for partnership.
 */

const partnershipOtpStore = new Map();

exports.getPartnershipOtpStore = () => {
  return partnershipOtpStore;
};

exports.cleanupExpiredOtps = () => {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, value] of partnershipOtpStore.entries()) {
    if (value.expiresAt < now) {
      partnershipOtpStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} expired partnership OTPs`);
  }
};
