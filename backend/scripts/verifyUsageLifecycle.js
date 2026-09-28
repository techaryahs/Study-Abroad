const assert = require("assert");
const UsageReservation = require("../models/UsageReservation");
const {
  buildUsageMapFromPlan,
} = require("../utils/membershipLifecycle");

function hasUniqueIndex(model, fields) {
  return model.schema.indexes().some(([indexFields, options]) => {
    return (
      options?.unique === true &&
      Object.keys(fields).every((field) => indexFields[field] === fields[field])
    );
  });
}

const starter = {
  planId: "starter",
  type: "one_time",
  entitlements: {
    ai: {
      ai_sop: { enabled: true, limit: 5, renewal: "never" },
      mock_interview: { enabled: true, limit: 2, renewal: "never" },
    },
    human: {
      consultation: { enabled: true, limit: 1, renewal: "never" },
    },
    access: {},
  },
};

const premium = {
  planId: "premium",
  type: "yearly",
  entitlements: {
    ai: {},
    access: {},
    human: {
      resume_drafting: { enabled: true, limit: 1, renewal: "yearly" },
      lor_drafting: { enabled: true, limit: 3, renewal: "yearly" },
    },
  },
};

const lowerPremium = {
  planId: "premium",
  type: "yearly",
  entitlements: {
    ai: {},
    access: {},
    human: {
      lor_drafting: { enabled: true, limit: 2, renewal: "yearly" },
    },
  },
};

const firstStarterUsage = buildUsageMapFromPlan(starter);
assert.deepStrictEqual(firstStarterUsage.ai_sop, {
  used: 0,
  remaining: 5,
  lastUsedAt: null,
});

const starterReProvision = buildUsageMapFromPlan(
  starter,
  {
    usage: {
      ai_sop: { used: 3, remaining: 2, lastUsedAt: new Date("2026-01-01") },
      mock_interview: { used: 2, remaining: 0 },
    },
  },
  "renewal"
);
assert.strictEqual(starterReProvision.ai_sop.used, 3, "renewal: never should preserve used count");
assert.strictEqual(starterReProvision.ai_sop.remaining, 2, "renewal: never should preserve remaining capacity");
assert.strictEqual(starterReProvision.mock_interview.remaining, 0, "exhausted one-time usage stays exhausted");

const premiumRenewal = buildUsageMapFromPlan(
  premium,
  {
    usage: {
      resume_drafting: { used: 1, remaining: 0 },
      lor_drafting: { used: 2, remaining: 1 },
    },
  },
  "renewal"
);
assert.strictEqual(premiumRenewal.resume_drafting.used, 0, "yearly renewal resets used count");
assert.strictEqual(premiumRenewal.resume_drafting.remaining, 1, "yearly renewal restores remaining");
assert.strictEqual(premiumRenewal.lor_drafting.remaining, 3, "yearly renewal restores full LOR allowance");

const downgradePreserve = buildUsageMapFromPlan(
  lowerPremium,
  {
    usage: {
      lor_drafting: { used: 3, remaining: 0 },
    },
  },
  "downgrade"
);
assert.strictEqual(downgradePreserve.lor_drafting.used, 2, "plan changes cap used to new lower limit");
assert.strictEqual(downgradePreserve.lor_drafting.remaining, 0, "plan changes cannot create negative remaining");

const upgradePreserve = buildUsageMapFromPlan(
  premium,
  {
    usage: {
      lor_drafting: { used: 1, remaining: 1 },
    },
  },
  "upgrade"
);
assert.strictEqual(upgradePreserve.lor_drafting.used, 1, "upgrade preserves overlapping usage");
assert.strictEqual(upgradePreserve.lor_drafting.remaining, 2, "upgrade expands remaining within new limit");

assert(
  hasUniqueIndex(UsageReservation, { reservationKey: 1 }),
  "UsageReservation must enforce unique reservation keys"
);

console.log("Usage lifecycle checks passed.");
