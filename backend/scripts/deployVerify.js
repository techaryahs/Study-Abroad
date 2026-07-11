/**
 * P1-2 — Deployment verification
 *
 * Fails hard if runtime Mongo is not production-ready for membership/consultation.
 *
 * Checks:
 * - Catalog version
 * - Consultation limits 1/3/5/10
 * - Entitlements present per plan
 * - Service + plan counts
 * - Missing services / missing entitlements
 * - Required Mongo indexes
 *
 * Usage: node scripts/deployVerify.js
 * Exit 1 on any critical mismatch.
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
const Booking = require("../models/Booking");
const { getConsultation } = require("./syncMembershipCatalog");

const REQUIRED_INDEX = "unique_active_counselling_slot";

function fail(msg) {
  console.error("FAIL:", msg);
  return false;
}

function pass(msg) {
  console.log("PASS:", msg);
  return true;
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("FATAL: MONGO_URI required");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("=== Deployment Verification ===\n");

  let ok = true;

  // ── Plans ──────────────────────────────────────────────────────────────
  const plans = await MembershipPlan.find({ isActive: true }).lean();
  const planById = Object.fromEntries(plans.map((p) => [p.planId, p]));

  if (plans.length < PLANS.length) {
    ok = fail(`Plan count ${plans.length} < expected ${PLANS.length}`) && ok;
  } else {
    ok = pass(`Plan count >= ${PLANS.length} (mongo=${plans.length})`) && ok;
  }

  // ── Services ───────────────────────────────────────────────────────────
  const services = await Service.find({ isActive: true }).lean();
  const serviceIds = new Set(services.map((s) => s.serviceId));
  if (services.length < SERVICES.length) {
    ok = fail(`Service count ${services.length} < expected ${SERVICES.length}`) && ok;
  } else {
    ok = pass(`Service count >= ${SERVICES.length} (mongo=${services.length})`) && ok;
  }

  const missingServices = SERVICES.filter((s) => !serviceIds.has(s.serviceId)).map(
    (s) => s.serviceId
  );
  if (missingServices.length) {
    ok = fail(`Missing services: ${missingServices.join(", ")}`) && ok;
  } else {
    ok = pass("All catalog services present") && ok;
  }

  // ── Consultation limits + version ──────────────────────────────────────
  console.log("\n| Plan | Expected | Mongo | PASS/FAIL |");
  console.log("| --- | --- | --- | --- |");

  for (const planId of Object.keys(CONSULTATION_LIMITS)) {
    const expectedLimit = CONSULTATION_LIMITS[planId];
    const src = PLANS.find((p) => p.planId === planId)?.entitlements?.human
      ?.consultation;
    const mongoPlan = planById[planId];
    const c = mongoPlan ? getConsultation(mongoPlan) : null;

    const expected = `v${CATALOG_VERSION} limit=${expectedLimit} renewal=${src?.renewal}`;
    const mongo = c
      ? `v${mongoPlan.version} limit=${c.limit ?? "∞"} renewal=${c.renewal ?? "-"}`
      : "missing";

    const rowPass =
      !!mongoPlan &&
      !!c &&
      Number(mongoPlan.version) === Number(CATALOG_VERSION) &&
      c.enabled === true &&
      Number(c.limit) === Number(expectedLimit) &&
      c.renewal === src?.renewal;

    if (!rowPass) ok = false;
    console.log(
      `| ${planId} | ${expected} | ${mongo} | ${rowPass ? "PASS" : "FAIL"} |`
    );
  }
  console.log("");

  // ── Missing entitlements (consultation required on all 4 plans) ────────
  for (const planId of Object.keys(CONSULTATION_LIMITS)) {
    const p = planById[planId];
    const c = p ? getConsultation(p) : null;
    if (!c || c.enabled !== true || c.limit == null) {
      ok = fail(`Missing/invalid consultation entitlement on ${planId}`) && ok;
    }
  }
  if (ok) pass("Consultation entitlements present on all metered plans");

  // ── Catalog version consistency ────────────────────────────────────────
  const versionMismatches = PLANS.filter((src) => {
    const m = planById[src.planId];
    return !m || Number(m.version) !== Number(CATALOG_VERSION);
  }).map((p) => p.planId);
  if (versionMismatches.length) {
    ok = fail(`Catalog version mismatch on: ${versionMismatches.join(", ")}`) && ok;
  } else {
    ok = pass(`All plans at catalog version ${CATALOG_VERSION}`) && ok;
  }

  // ── Indexes ────────────────────────────────────────────────────────────
  const indexes = await Booking.collection.indexes();
  const hasSlotIndex = indexes.some((i) => i.name === REQUIRED_INDEX);
  if (!hasSlotIndex) {
    ok = fail(`Missing required index: ${REQUIRED_INDEX}`) && ok;
  } else {
    ok = pass(`Required index present: ${REQUIRED_INDEX}`) && ok;
  }

  const dups = await Booking.collection
    .aggregate([
      { $match: { bookingType: "counselling", status: "booked" } },
      {
        $group: {
          _id: { date: "$date", time: "$time" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();
  if (dups.length) {
    ok = fail(`Duplicate active counselling slots: ${dups.length}`) && ok;
  } else {
    ok = pass("No duplicate active counselling slots") && ok;
  }

  await mongoose.disconnect();

  if (!ok) {
    console.error("\n=== DEPLOY VERIFY: FAIL ===");
    console.error("Critical mismatch — release must not proceed.");
    process.exit(1);
  }

  console.log("\n=== DEPLOY VERIFY: PASS ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
