/**
 * P3 — Lifecycle Service
 *
 * Manages membership transitions: Upgrades, Downgrades, Expirations, Renewals.
 */

const User = require("../../models/User");
const Student = require("../../models/Student");
const MembershipPlan = require("../../models/MembershipPlan");
const MembershipHistory = require("../../models/MembershipHistory");
const { resolveHistoryTransitionType } = require("../../utils/membershipLifecycle");

// Note: Configurable grace period as requested.
const MEMBERSHIP_GRACE_DAYS = process.env.MEMBERSHIP_GRACE_DAYS 
  ? parseInt(process.env.MEMBERSHIP_GRACE_DAYS, 10) 
  : 3;

function getModel(userModelName) {
  return userModelName === "Student" ? Student : User;
}

/**
 * Sweeps the database for expirations and grace period timeouts.
 * Meant to be called daily by a scheduled job.
 */
async function processDailyExpirations() {
  const now = new Date();
  
  // 1. Expire Active Memberships -> Grace Period
  // Match both dual-written field names (expiresAt / expiryDate)
  const expiryQuery = {
    "membership.status": "active",
    $or: [
      { "membership.expiresAt": { $lt: now } },
      { "membership.expiryDate": { $lt: now } },
    ],
  };
  const expiringActiveUsers = await User.find(expiryQuery);
  const expiringActiveStudents = await Student.find(expiryQuery);

  const allExpiring = [
    ...expiringActiveUsers.map(u => ({ doc: u, modelName: "User" })),
    ...expiringActiveStudents.map(s => ({ doc: s, modelName: "Student" }))
  ];

  for (const { doc, modelName } of allExpiring) {
    // If it's a 'cancelled' auto-renew plan, maybe it skips grace period and goes straight to expired.
    // For simplicity, we'll put everything in grace_period unless configured otherwise.
    const previousPlanId = doc.membership.planId;
    doc.membership.status = "grace_period";
    
    // Log history — canonical enum via resolveHistoryTransitionType
    const history = await MembershipHistory.create({
      userId: doc._id,
      userModel: modelName,
      fromPlanId: previousPlanId,
      toPlanId: previousPlanId,
      transitionType: resolveHistoryTransitionType("period_ended"),
    });
    
    doc.membership.history.push(history._id);
    await doc.save();
  }

  // 2. Expire Grace Period -> Hard Expired
  const graceCutoff = new Date(now.getTime() - (MEMBERSHIP_GRACE_DAYS * 24 * 60 * 60 * 1000));
  
  const hardExpiryQuery = {
    "membership.status": "grace_period",
    $or: [
      { "membership.expiresAt": { $lt: graceCutoff } },
      { "membership.expiryDate": { $lt: graceCutoff } },
    ],
  };
  const hardExpiringUsers = await User.find(hardExpiryQuery);
  const hardExpiringStudents = await Student.find(hardExpiryQuery);

  const allHardExpiring = [
    ...hardExpiringUsers.map(u => ({ doc: u, modelName: "User" })),
    ...hardExpiringStudents.map(s => ({ doc: s, modelName: "Student" }))
  ];

  for (const { doc, modelName } of allHardExpiring) {
    const previousPlanId = doc.membership.planId;
    doc.membership.status = "expired";
    doc.membership.planId = "free";
    
    const history = await MembershipHistory.create({
      userId: doc._id,
      userModel: modelName,
      fromPlanId: previousPlanId === "free" ? null : previousPlanId,
      toPlanId: "free",
      transitionType: resolveHistoryTransitionType("access_revoked"),
    });

    doc.membership.history.push(history._id);
    await doc.save();
  }

  return {
    graced: allExpiring.length,
    expired: allHardExpiring.length
  };
}

module.exports = {
  processDailyExpirations,
  MEMBERSHIP_GRACE_DAYS
};
