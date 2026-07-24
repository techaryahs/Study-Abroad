const appleResolver = require('./appleResolver');
const googleResolver = require('./googleResolver');
const stripeResolver = require('./stripeResolver');
const razorpayResolver = require('./razorpayResolver');

/** Provider Resolver Registry */
const RESOLVERS = {
  apple: appleResolver,
  google: googleResolver,
  stripe: stripeResolver,
  razorpay: razorpayResolver,
};

/**
 * Resolves the true recipient user for entitlement granting.
 *
 * Recipient Resolution Priority Invariant:
 * 1. Active Subscription Owner (subscriptionId -> provider resolver)
 * 2. Transaction User (fallbackUserId)
 * 3. Fail ("User not found")
 *
 * Safeguard: Infrastructure/DB errors during resolution re-throw to avoid
 * accidental fallback to stale/deleted account IDs.
 *
 * @param {Object} context
 * @param {string} context.gateway
 * @param {string|ObjectId} [context.subscriptionId]
 * @param {string|ObjectId} context.fallbackUserId
 * @param {string} [context.fallbackUserModel]
 * @param {ClientSession|null} [session]
 * @returns {Promise<{ userId: ObjectId, userModel: string, subscriptionId: ObjectId|null }>}
 */
async function resolveRecipient(context, session = null) {
  const { gateway, subscriptionId, fallbackUserId, fallbackUserModel = "User" } = context;

  // 1. If subscriptionId is present and provider resolver exists, resolve ownership
  if (subscriptionId && RESOLVERS[gateway]) {
    try {
      const resolved = await RESOLVERS[gateway].resolve(subscriptionId, session);
      if (resolved) {
        return resolved;
      }
    } catch (err) {
      console.error(`[SubscriptionOwnership] Provider resolution error for gateway=${gateway}:`, err.message);
      throw new Error(`Subscription ownership resolution failed: ${err.message}`);
    }
  }

  // 2. Fallback to transaction owner (e.g. Razorpay one-time payment)
  return {
    userId: fallbackUserId,
    userModel: fallbackUserModel,
    subscriptionId: null,
  };
}

module.exports = {
  resolveRecipient,
  RESOLVERS,
};
