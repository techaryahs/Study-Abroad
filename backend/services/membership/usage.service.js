/**
 * P3 — Usage Service
 *
 * Handles atomic consumption and previews of membership limits.
 * Supports unlimited limits (-1).
 */

const User = require("../../models/User");
const Student = require("../../models/Student");

function getModel(userModelName) {
  return userModelName === "Student" ? Student : User;
}

/**
 * Returns a read-only preview of a specific feature's usage without consuming it.
 *
 * @param {Object} user - The mongoose user document
 * @param {String} feature - The feature key (e.g., 'ai_credits')
 * @returns {Object} { limit, used, remaining }
 */
function preview(user, feature) {
  if (!user.membership || !user.membership.usage || !user.membership.usage.has(feature)) {
    return { limit: 0, used: 0, remaining: 0 };
  }

  const usageData = user.membership.usage.get(feature);
  const limit = usageData.limit || 0;
  const used = usageData.used || 0;

  if (limit === -1) {
    return { limit: -1, used, remaining: -1 };
  }

  return { limit, used, remaining: Math.max(0, limit - used) };
}

/**
 * Atomically consumes usage for a feature.
 *
 * @param {ObjectId} userId - The user's ID
 * @param {String} userModelName - 'Student' or 'User'
 * @param {String} feature - The feature key (e.g., 'ai_credits')
 * @param {Number} amount - Amount to consume (default 1)
 * @returns {Boolean} True if successful, False if limit reached or feature not found
 */
async function consume(userId, userModelName, feature, amount = 1) {
  const Model = getModel(userModelName);
  const featureUsedKey = `membership.usage.${feature}.used`;
  const featureLimitKey = `membership.usage.${feature}.limit`;

  // We use $expr to evaluate the condition:
  // IF limit == -1 OR (used + amount <= limit) THEN update
  
  const result = await Model.updateOne(
    { 
      _id: userId,
      $expr: {
        $or: [
          { $eq: [`$${featureLimitKey}`, -1] },
          { $lte: [{ $add: [`$${featureUsedKey}`, amount] }, `$${featureLimitKey}`] }
        ]
      }
    },
    { 
      $inc: { [featureUsedKey]: amount },
      $set: { [`membership.usage.${feature}.lastUsedAt`]: new Date() }
    }
  );

  // If modifiedCount is 1, the atomic update succeeded.
  // If 0, either the user doesn't exist, the feature isn't set, or the limit was reached.
  return result.modifiedCount === 1;
}

/**
 * Resets the used amount to 0 for all tracked features.
 * Typically called during a renewal event.
 */
async function resetUsage(userId, userModelName) {
  const Model = getModel(userModelName);
  const user = await Model.findById(userId);
  if (!user || !user.membership || !user.membership.usage) return;

  const updateFields = {};
  for (const [feature] of user.membership.usage) {
    updateFields[`membership.usage.${feature}.used`] = 0;
  }

  if (Object.keys(updateFields).length > 0) {
    await Model.updateOne({ _id: userId }, { $set: updateFields });
  }
}

module.exports = {
  preview,
  consume,
  resetUsage
};
