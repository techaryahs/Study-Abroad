const fs = require("fs");
const path = require("path");
const { PLANS, SERVICES } = require("../catalog/membershipCatalog");

const CONSUMERS = {
  ai_sop: "Protected entitlement; no backend consumer found",
  ai_humanizer: "Protected entitlement; no backend consumer found",
  mock_interview: "Protected entitlement; no backend consumer found",
  study_abroad_assistant: "POST /api/chat/chat",
  consultation: "POST /api/bookings/book-consultant",
  university_shortlist: "Protected entitlement; no backend consumer found",
  profile_evaluation: "Protected entitlement; no backend consumer found",
  sop_writing: "Protected entitlement; no backend consumer found",
  resume_drafting: "POST /api/careers/generate-resume",
  lor_drafting: "Protected entitlement; no backend consumer found",
  cover_letter: "Protected entitlement; no backend consumer found",
  linkedin_optimization: "Protected entitlement; no backend consumer found",
  application_review: "Protected entitlement; no backend consumer found",
  personal_history: "Protected entitlement; no backend consumer found",
  research_paper: "Protected entitlement; no backend consumer found",
  portfolio_building: "Protected entitlement; no backend consumer found",
  university_finalization: "Protected entitlement; no backend consumer found",
};

function entitlementEntries(plan) {
  const rows = [];
  for (const category of ["ai", "human", "access"]) {
    const bag = plan.entitlements?.[category] || {};
    for (const [featureId, entitlement] of Object.entries(bag)) {
      if (entitlement?.limit == null) continue;
      const service = SERVICES.find((s) => s.serviceId === featureId);
      rows.push({
        planId: plan.planId,
        category,
        featureId,
        name: service?.name || featureId,
        limit: entitlement.limit,
        renewal: entitlement.renewal || "none",
        accessDays: entitlement.accessDays ?? "",
        consumer: CONSUMERS[featureId] || "Protected entitlement; no backend consumer found",
      });
    }
  }
  return rows;
}

function generateUsageMatrix() {
  const rows = PLANS.flatMap(entitlementEntries);
  const lines = [
    "# Usage Matrix",
    "",
    "Generated from `backend/catalog/membershipCatalog.js`.",
    "",
    "Usage policy:",
    "",
    "- Validate membership, plan, feature entitlement, and initialized usage.",
    "- Reserve usage atomically before execution.",
    "- Commit on successful execution.",
    "- Release on failed execution.",
    "- Unknown usage: DENY.",
    "- Usage exhausted: DENY.",
    "- Negative usage and overflow are blocked by conditional updates.",
    "",
    "| Plan | Feature | Category | Limit | Renewal | Access window | Backend consumer |",
    "| --- | --- | --- | ---: | --- | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.planId} | ${row.name} (${row.featureId}) | ${row.category} | ${row.limit} | ${row.renewal} | ${row.accessDays || "-"} | ${row.consumer} |`
    );
  }

  lines.push("");
  lines.push("Renewal and plan-change rules:");
  lines.push("");
  lines.push("- Initial purchase initializes every metered feature to `used=0`, `remaining=limit`.");
  lines.push("- Renewal resets a counter only when `MembershipPlan.entitlements[category][feature].renewal` matches the plan period.");
  lines.push("- One-time `renewal: never` counters are preserved on same-plan re-provisioning.");
  lines.push("- Upgrade/downgrade preserves overlapping metered usage, capped to the new plan limit.");
  lines.push("- Unlimited entitlements do not create usage counters.");
  lines.push("");

  return lines.join("\n");
}

if (require.main === module) {
  const outputPath = path.resolve(__dirname, "../../docs/usage-matrix.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateUsageMatrix(), "utf8");
  console.log(`Wrote ${outputPath}`);
}

module.exports = {
  generateUsageMatrix,
};
