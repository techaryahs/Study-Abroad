/**
 * Ops-only: re-seed MembershipPlan/Service from frozen catalog and verify metering.
 * Does not change architecture or catalog contents.
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

function getConsultation(plan) {
  const human = plan.entitlements?.human;
  if (!human) return null;
  if (typeof human.get === "function") return human.get("consultation") || null;
  if (typeof human.toObject === "function") {
    return human.toObject().consultation || null;
  }
  return human.consultation || null;
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding catalog version", CATALOG_VERSION);
  console.log("Expected limits", CONSULTATION_LIMITS);

  for (const plan of PLANS) {
    await MembershipPlan.findOneAndUpdate(
      { planId: plan.planId },
      { $set: { ...plan, isActive: true } },
      { upsert: true, new: true }
    );
    console.log("Seeded plan", plan.planId, "v" + plan.version);
  }

  for (const service of SERVICES) {
    await Service.findOneAndUpdate(
      { serviceId: service.serviceId },
      { $set: { ...service, isActive: true } },
      { upsert: true, new: true }
    );
  }
  console.log("Seeded services", SERVICES.length);

  // Ensure slot index
  try {
    await Booking.collection.createIndex(
      { date: 1, time: 1, bookingType: 1 },
      {
        unique: true,
        name: "unique_active_counselling_slot",
        partialFilterExpression: {
          bookingType: "counselling",
          status: "booked",
        },
        background: true,
      }
    );
    console.log("Index ensured: unique_active_counselling_slot");
  } catch (err) {
    console.error("Index ensure error:", err.message);
  }

  const plans = await MembershipPlan.find({ isActive: true }).lean();
  const expected = CONSULTATION_LIMITS;
  let ok = true;

  console.log("\n=== POST-SEED VERIFICATION ===");
  for (const planId of Object.keys(expected)) {
    const p = plans.find((x) => x.planId === planId);
    const c = p ? getConsultation(p) : null;
    const limitOk = c && Number(c.limit) === expected[planId];
    const enabledOk = c && c.enabled === true;
    const versionOk = p && Number(p.version) === CATALOG_VERSION;
    const rowOk = limitOk && enabledOk && versionOk;
    if (!rowOk) ok = false;
    console.log(
      rowOk ? "PASS" : "FAIL",
      planId,
      "version=" + (p?.version ?? "missing"),
      "consultation=" + JSON.stringify(c)
    );
  }

  const indexes = await Booking.collection.indexes();
  const hasIndex = indexes.some((i) => i.name === "unique_active_counselling_slot");
  console.log(hasIndex ? "PASS" : "FAIL", "unique_active_counselling_slot present");

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
  console.log(
    dups.length === 0 ? "PASS" : "FAIL",
    "duplicate active slots=" + dups.length
  );
  if (dups.length) console.log(JSON.stringify(dups));

  await mongoose.disconnect();
  if (!ok || !hasIndex || dups.length > 0) {
    console.log("\nRESULT: NO-GO");
    process.exit(1);
  }
  console.log("\nRESULT: OPS GO — Mongo matches catalog v" + CATALOG_VERSION);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
