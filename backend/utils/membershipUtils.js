const mongoose = require("mongoose");
const Student = require("../models/Student");
const MembershipPlan = require("../models/MembershipPlan");

/**
 * Atomically consumes an entitlement usage for a feature.
 * @param {String} userId - The ID of the student.
 * @param {String} featureId - The feature to consume (e.g. 'consultation')
 * @param {Object} [externalSession] - Optional Mongoose session for multi-collection transactions
 * @returns {Boolean} true if successful, false if unlimited or unable to consume
 */
const consumeEntitlement = async (userId, featureId, externalSession = null) => {
  const session = externalSession || await mongoose.startSession();
  if (!externalSession) session.startTransaction();
  
  try {
    const student = await Student.findById(userId).session(session);
    if (!student || student.membership.status !== 'active') {
      throw new Error("Invalid or inactive membership.");
    }
    
    const plan = await MembershipPlan.findOne({ planId: student.membership.planId }).session(session);
    if (!plan) throw new Error("Plan not found.");
    
    if (plan.allAccess) {
      await session.commitTransaction();
      session.endSession();
      return true; // Elite users don't need decrementing
    }
    
    let targetEntitlement = null;
    for (const category of ['ai', 'human', 'access']) {
      if (plan.entitlements[category] && plan.entitlements[category].has(featureId)) {
        targetEntitlement = plan.entitlements[category].get(featureId);
        break;
      }
    }
    
    if (!targetEntitlement || !targetEntitlement.enabled) {
      throw new Error("Feature not enabled.");
    }
    
    if (targetEntitlement.limit == null) {
      // Unlimited usage
      await session.commitTransaction();
      session.endSession();
      return true; 
    }
    
    // Metered usage
    let currentUsage = student.membership.usage.get(featureId);
    if (!currentUsage) {
      currentUsage = { used: 0, lastUsedAt: new Date() };
    }
    
    if (currentUsage.used >= targetEntitlement.limit) {
      throw new Error("Usage limit reached.");
    }
    
    currentUsage.used += 1;
    currentUsage.lastUsedAt = new Date();
    student.membership.usage.set(featureId, currentUsage);
    
    await student.save({ session });
    
    if (!externalSession) {
      await session.commitTransaction();
      session.endSession();
    }
    return true;
  } catch (error) {
    if (!externalSession) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(`Error consuming entitlement for ${featureId}:`, error);
    throw error;
  }
};

module.exports = { consumeEntitlement };
