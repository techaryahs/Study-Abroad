/**
 * Backward-compatible export of requireEntitlement.
 * Prefer: const { requireMembership, requireEntitlement, requireUsage } = require('./membershipAuth.middleware')
 */
const {
  requireMembership,
  requireEntitlement,
  requireUsage,
  requirePaidFeature,
} = require("./membershipAuth.middleware");

// Historical default: routes used `const requireEntitlement = require('...entitlement.middleware')`
module.exports = requireEntitlement;
module.exports.requireMembership = requireMembership;
module.exports.requireEntitlement = requireEntitlement;
module.exports.requireUsage = requireUsage;
module.exports.requirePaidFeature = requirePaidFeature;
