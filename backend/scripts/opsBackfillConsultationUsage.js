/**
 * Ops-only: for active members whose plan now has a metered consultation limit
 * but no usage.consultation row (former unlimited), initialize used=0 remaining=limit.
 *
 * Does NOT change plans, architecture, or existing usage counters.
 * Fail-closed engine requires knownUsage; this makes metering enforceable without inventing free uses beyond the plan limit.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("../models/Student");
const MembershipPlan = require("../models/MembershipPlan");

function getConsultationEntitlement(plan) {
  const human = plan?.entitlements?.human;
  if (!human) return null;
  if (typeof human.get === "function") return human.get("consultation") || null;
  if (typeof human.toObject === "function") return human.toObject().consultation || null;
  return human.consultation || null;
}

function getUsage(membership, featureId) {
  if (!membership?.usage) return null;
  if (typeof membership.usage.get === "function") return membership.usage.get(featureId);
  return membership.usage[featureId] || null;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const plans = await MembershipPlan.find({ isActive: true });
  const planById = Object.fromEntries(plans.map((p) => [p.planId, p]));

  const students = await Student.find({
    "membership.status": { $in: ["active", "grace_period"] },
    "membership.planId": { $in: Object.keys(planById) },
  });

  let initialized = 0;
  let skipped = 0;

  for (const student of students) {
    const planId = student.membership?.planId;
    const plan = planById[planId];
    const ent = getConsultationEntitlement(plan);
    if (!ent || ent.limit == null) {
      skipped++;
      continue;
    }

    const existing = getUsage(student.membership, "consultation");
    if (
      existing &&
      Number.isFinite(Number(existing.used)) &&
      Number.isFinite(Number(existing.remaining))
    ) {
      skipped++;
      continue;
    }

    const limit = Math.max(0, Number(ent.limit));
    if (!student.membership.usage) student.membership.usage = {};
    // Support Map or plain object on student.membership.usage
    if (typeof student.membership.usage.set === "function") {
      student.membership.usage.set("consultation", {
        used: 0,
        remaining: limit,
        lastUsedAt: null,
      });
    } else {
      student.membership.usage.consultation = {
        used: 0,
        remaining: limit,
        lastUsedAt: null,
      };
    }
    if (typeof student.markModified === "function") {
      student.markModified("membership");
      student.markModified("membership.usage");
    }
    await student.save();
    initialized++;
    console.log(
      "Initialized consultation usage",
      student.email,
      planId,
      "remaining=" + limit
    );
  }

  console.log(
    JSON.stringify({
      scanned: students.length,
      initialized,
      skipped,
    })
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
