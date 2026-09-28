/**
 * P0-OPS-1 — Runtime Catalog Synchronization
 *
 * Source of truth: backend/catalog/membershipCatalog.js
 * Target: MongoDB MembershipPlan + Service collections
 *
 * - Updates existing plans by planId (no duplicate planIds)
 * - Upserts only; never invents new planIds outside catalog
 * - Preserves planId strings and isActive=true
 * - Writes catalog version from source (CATALOG_VERSION)
 * - Fails process if Mongo ≠ source after sync
 *
 * Usage: node scripts/syncMembershipCatalog.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const {
  PLANS,
  SERVICES,
  CONSULTATION_LIMITS,
  CATALOG_VERSION,
} = require("../catalog/membershipCatalog");
const MembershipPlan = require("../models/MembershipPlan");
const Service = require("../models/Service");

function getConsultation(planDoc) {
  const human = planDoc?.entitlements?.human;
  if (!human) return null;
  if (typeof human.get === "function") return human.get("consultation") || null;
  if (typeof human.toObject === "function") {
    return human.toObject().consultation || null;
  }
  return human.consultation || null;
}

function expectedConsultation(planId) {
  const plan = PLANS.find((p) => p.planId === planId);
  return plan?.entitlements?.human?.consultation || null;
}

async function syncCatalog() {
  const results = [];

  for (const plan of PLANS) {
    await MembershipPlan.findOneAndUpdate(
      { planId: plan.planId },
      {
        $set: {
          ...plan,
          isActive: true,
          version: plan.version || CATALOG_VERSION,
        },
      },
      { upsert: true, new: true }
    );
    results.push({ planId: plan.planId, action: "upserted", version: plan.version });
  }

  for (const service of SERVICES) {
    await Service.findOneAndUpdate(
      { serviceId: service.serviceId },
      { $set: { ...service, isActive: true } },
      { upsert: true, new: true }
    );
  }

  return results;
}

async function verifyCatalog() {
  const rows = [];
  let allPass = true;

  for (const planId of Object.keys(CONSULTATION_LIMITS)) {
    const expectedLimit = CONSULTATION_LIMITS[planId];
    const expected = expectedConsultation(planId);
    const mongo = await MembershipPlan.findOne({ planId, isActive: true }).lean();
    const actual = mongo ? getConsultation(mongo) : null;

    const expectedStr = expected
      ? `limit=${expected.limit}, renewal=${expected.renewal}, enabled=${expected.enabled}, version=${CATALOG_VERSION}`
      : "missing";
    const mongoStr = actual
      ? `limit=${actual.limit ?? "∞"}, renewal=${actual.renewal ?? "-"}, enabled=${actual.enabled}, version=${mongo?.version}`
      : "missing";

    const pass =
      !!mongo &&
      !!actual &&
      actual.enabled === true &&
      Number(actual.limit) === Number(expectedLimit) &&
      Number(mongo.version) === Number(CATALOG_VERSION) &&
      actual.renewal === expected.renewal;

    if (!pass) allPass = false;
    rows.push({
      plan: planId,
      expected: expectedStr,
      mongo: mongoStr,
      status: pass ? "PASS" : "FAIL",
    });
  }

  // Plan count
  const planCount = await MembershipPlan.countDocuments({ isActive: true });
  const serviceCount = await Service.countDocuments({ isActive: true });
  const catalogPlanIds = new Set(PLANS.map((p) => p.planId));
  const mongoPlans = await MembershipPlan.find({ isActive: true }).lean();
  const extraPlans = mongoPlans.filter((p) => !catalogPlanIds.has(p.planId));

  return {
    rows,
    allPass,
    planCount,
    serviceCount,
    expectedPlanCount: PLANS.length,
    expectedServiceCount: SERVICES.length,
    extraPlans: extraPlans.map((p) => p.planId),
  };
}

function printTable(rows) {
  console.log("\n| Plan | Expected | Mongo | PASS/FAIL |");
  console.log("| --- | --- | --- | --- |");
  for (const r of rows) {
    console.log(`| ${r.plan} | ${r.expected} | ${r.mongo} | ${r.status} |`);
  }
  console.log("");
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("FATAL: MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("=== Catalog Sync (source: membershipCatalog.js v" + CATALOG_VERSION + ") ===");

  const syncResults = await syncCatalog();
  console.log(
    "Synced plans:",
    syncResults.map((r) => r.planId).join(", ")
  );
  console.log("Synced services:", SERVICES.length);

  const verification = await verifyCatalog();
  printTable(verification.rows);

  console.log(
    `Plans: mongo=${verification.planCount} expected=${verification.expectedPlanCount}`
  );
  console.log(
    `Services: mongo=${verification.serviceCount} expected=${verification.expectedServiceCount}`
  );
  if (verification.extraPlans.length) {
    console.log(
      "Note: extra active planIds in Mongo (not in catalog):",
      verification.extraPlans.join(", ")
    );
  }

  await mongoose.disconnect();

  if (!verification.allPass) {
    console.error(
      "\nRELEASE FAIL: Runtime Mongo catalog does not match source membershipCatalog.js"
    );
    process.exit(1);
  }

  if (verification.planCount < verification.expectedPlanCount) {
    console.error("\nRELEASE FAIL: Missing active plans in Mongo");
    process.exit(1);
  }

  if (verification.serviceCount < verification.expectedServiceCount) {
    console.error("\nRELEASE FAIL: Missing services in Mongo");
    process.exit(1);
  }

  console.log("\nCATALOG SYNC PASS — Mongo matches source catalog v" + CATALOG_VERSION);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { syncCatalog, verifyCatalog, getConsultation, printTable };
