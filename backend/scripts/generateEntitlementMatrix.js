const fs = require("fs");
const path = require("path");
const { PLANS, SERVICES } = require("../catalog/membershipCatalog");

const PLAN_IDS = ["starter", "essential", "premium", "elite"];

function cellFor(plan, service) {
  const entitlement = plan.entitlements?.[service.category]?.[service.serviceId];
  if (!entitlement || entitlement.enabled === false) return "-";

  const details = [];
  if (entitlement.limit != null) details.push(`${entitlement.limit} use${entitlement.limit === 1 ? "" : "s"}`);
  if (entitlement.accessDays != null) details.push(`${entitlement.accessDays} days`);
  return details.length > 0 ? details.join(", ") : "Included";
}

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|");
}

function generateMatrix() {
  const plans = PLAN_IDS.map((planId) => PLANS.find((plan) => plan.planId === planId));
  const missingPlans = PLAN_IDS.filter((_, index) => !plans[index]);
  if (missingPlans.length > 0) {
    throw new Error(`Missing plans: ${missingPlans.join(", ")}`);
  }

  const lines = [
    "# Entitlement Matrix",
    "",
    "Generated from `backend/catalog/membershipCatalog.js`.",
    "",
    "| Feature | Category | Starter | Essential | Premium | Elite |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const service of SERVICES) {
    lines.push(
      [
        escapeCell(`${service.name} (${service.serviceId})`),
        service.category,
        ...plans.map((plan) => cellFor(plan, service)),
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    );
  }

  lines.push("");
  lines.push("Unknown feature: DENY.");
  lines.push("Unknown plan: DENY.");
  lines.push("Unknown membership: DENY.");
  lines.push("Authorization is driven by `MembershipPlan.entitlements`; `requiredPlanTier` is presentation metadata only.");
  lines.push("");

  return lines.join("\n");
}

if (require.main === module) {
  const outputPath = path.resolve(__dirname, "../../docs/entitlement-matrix.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateMatrix(), "utf8");
  console.log(`Wrote ${outputPath}`);
}

module.exports = {
  generateMatrix,
};
