const AppleSubscription = require("../../../models/AppleSubscription");

/**
 * Apple IAP Subscription Ownership Resolver
 */
async function resolve(subscriptionId, session = null) {
  if (!subscriptionId) return null;
  const sub = await AppleSubscription.findById(subscriptionId).session(session);
  if (!sub) return null;

  return {
    userId: sub.userId,
    userModel: sub.userModel || "Student",
    subscriptionId: sub._id,
  };
}

module.exports = {
  resolve,
};
