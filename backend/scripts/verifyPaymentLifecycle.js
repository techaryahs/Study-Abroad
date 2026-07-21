const assert = require("assert");
const PaymentTransaction = require("../models/PaymentTransaction");
const MembershipHistory = require("../models/MembershipHistory");
const Receipt = require("../models/Receipt");
const {
  applyPlanToMembership,
  buildUsageMapFromPlan,
} = require("../utils/membershipLifecycle");

function makeUser(membership) {
  return {
    membership: { ...membership },
    markModified() {},
  };
}

function yearlyPlan(planId, entitlements = {}) {
  return {
    planId,
    version: 1,
    type: "yearly",
    entitlements,
  };
}

function oneTimePlan(planId, entitlements = {}) {
  return {
    planId,
    version: 1,
    type: "one_time",
    entitlements,
  };
}

function hasUniqueIndex(model, fields) {
  return model.schema.indexes().some(([indexFields, options]) => {
    return (
      options?.unique === true &&
      Object.keys(fields).every((field) => indexFields[field] === fields[field])
    );
  });
}

const now = new Date();
const future = new Date(now);
future.setMonth(future.getMonth() + 3);
const past = new Date(now);
past.setDate(past.getDate() - 10);

const premium = yearlyPlan("premium", {
  human: { resume_drafting: { enabled: true, limit: 1 } },
  ai: {},
  access: {},
});
const elite = yearlyPlan("elite", {
  human: { resume_drafting: { enabled: true }, express_entry: { enabled: true } },
  ai: {},
  access: {},
});
const essential = yearlyPlan("essential", {
  human: { research_groups: { enabled: true } },
  ai: {},
  access: {},
});
const starter = oneTimePlan("starter", {
  ai: { ai_sop: { enabled: true, limit: 5, accessDays: 30 } },
  human: { consultation: { enabled: true, limit: 1 } },
  access: {},
});

const activeRenewalUser = makeUser({
  planId: "premium",
  status: "active",
  expiryDate: future,
});
applyPlanToMembership(activeRenewalUser, premium, {
  platform: "razorpay",
  transactionId: "renew-active",
});
assert(
  activeRenewalUser.membership.expiryDate > future,
  "active yearly renewal should extend from existing future expiry"
);

const expiredRenewalUser = makeUser({
  planId: "premium",
  status: "expired",
  expiryDate: past,
});
applyPlanToMembership(expiredRenewalUser, premium, {
  platform: "razorpay",
  transactionId: "renew-expired",
});
assert(
  expiredRenewalUser.membership.expiryDate > now &&
    expiredRenewalUser.membership.expiryDate < new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()),
  "expired yearly renewal should start from now"
);

const starterUser = makeUser({ planId: "free", status: "none" });
applyPlanToMembership(starterUser, starter, {
  platform: "razorpay",
  transactionId: "starter",
});
assert.strictEqual(starterUser.membership.expiryDate, null, "starter one-time should not set membership expiry");
assert.strictEqual(
  starterUser.membership.usage.ai_sop.remaining,
  5,
  "starter usage should initialize from entitlements"
);

const upgradeUser = makeUser({ planId: "essential", status: "active", expiryDate: future });
const upgrade = applyPlanToMembership(upgradeUser, premium, {
  platform: "razorpay",
  transactionId: "upgrade",
});
assert.strictEqual(upgrade.transitionType, "upgrade", "essential to premium should classify as upgrade");

const downgradeUser = makeUser({ planId: "elite", status: "active", expiryDate: future });
const downgrade = applyPlanToMembership(downgradeUser, essential, {
  platform: "razorpay",
  transactionId: "downgrade",
});
assert.strictEqual(downgrade.transitionType, "downgrade", "elite to essential should classify as downgrade");

assert.deepStrictEqual(
  buildUsageMapFromPlan(elite),
  {},
  "unlimited entitlements should not create usage counters"
);

assert(
  hasUniqueIndex(PaymentTransaction, { idempotencyKey: 1 }),
  "PaymentTransaction must have unique idempotencyKey"
);
assert(
  hasUniqueIndex(PaymentTransaction, { gateway: 1, externalTransactionId: 1 }),
  "PaymentTransaction must have unique gateway+externalTransactionId"
);
assert(
  hasUniqueIndex(MembershipHistory, { platform: 1, transactionId: 1 }),
  "MembershipHistory must have unique platform+transactionId"
);
assert(
  hasUniqueIndex(Receipt, { paymentId: 1, orderId: 1 }),
  "Receipt must have unique paymentId+orderId"
);

console.log("Payment lifecycle checks passed.");
