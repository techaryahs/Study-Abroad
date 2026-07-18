/**
 * P0+P1 — Automatic Catalog Bootstrap, Migration & Startup Validation
 *
 * Runs after MongoDB connects and before Express accepts requests.
 *
 * 1. If MembershipPlan collection is empty → auto-seed from membershipCatalog.js
 * 2. Run any pending catalog migrations (P1 migration engine)
 * 3. Always validate that all required plans exist, are active, and well-formed
 * 4. Throws on validation failure → server refuses to start
 *
 * Concurrency safe: syncCatalog() uses findOneAndUpdate with upsert keyed on
 * planId, so concurrent pod startups cannot create duplicate documents.
 * Migrations use an atomic MongoDB lock with timeout.
 */

const MembershipPlan = require("../models/MembershipPlan");
const { syncCatalog } = require("../scripts/syncMembershipCatalog");
const { CATALOG_VERSION } = require("../catalog/membershipCatalog");
const { runMigrations } = require("../services/catalogMigrationService");

const REQUIRED_PLAN_IDS = ["starter", "essential", "premium", "elite"];

/**
 * Validates a single plan document against Mongoose schema + business rules.
 * Returns an array of error strings (empty = valid).
 */
function validatePlanDocument(planDoc) {
  const errors = [];
  const id = planDoc.planId || "(unknown)";

  // 1. Mongoose schema validation
  const instance = new MembershipPlan(planDoc);
  const schemaError = instance.validateSync();
  if (schemaError) {
    for (const field of Object.keys(schemaError.errors)) {
      errors.push(`${id}: Mongoose schema violation — ${field}: ${schemaError.errors[field].message}`);
    }
  }

  // 2. Business rules (fields that Mongoose marks optional but we require)
  if (!planDoc.planId || typeof planDoc.planId !== "string") {
    errors.push(`${id}: Missing or invalid planId`);
  }
  if (!planDoc.appleProductId || typeof planDoc.appleProductId !== "string") {
    errors.push(`${id}: Missing appleProductId`);
  }
  if (planDoc.price == null || typeof planDoc.price !== "number" || planDoc.price <= 0) {
    errors.push(`${id}: Missing or invalid price (got ${planDoc.price})`);
  }
  if (!planDoc.entitlements || typeof planDoc.entitlements !== "object") {
    errors.push(`${id}: Missing entitlements object`);
  } else {
    for (const category of ["ai", "human", "access"]) {
      if (!planDoc.entitlements[category]) {
        errors.push(`${id}: Missing entitlements.${category}`);
      }
    }
  }
  if (planDoc.version !== CATALOG_VERSION) {
    errors.push(`${id}: Version mismatch — expected ${CATALOG_VERSION}, got ${planDoc.version}`);
  }
  if (planDoc.isActive !== true) {
    errors.push(`${id}: isActive is not true`);
  }

  return errors;
}

/**
 * Main bootstrap entry point. Call once during server initialization.
 * Throws if validation fails — the caller must catch and abort startup.
 */
async function bootstrapCatalog() {
  // ── Step 1: Seed if empty (P0) ──────────────────────────────────────────
  const count = await MembershipPlan.countDocuments();

  if (count === 0) {
    console.log(
      `[CatalogBootstrap] Empty catalog detected — seeding from membershipCatalog.js v${CATALOG_VERSION}`
    );
    await syncCatalog();
    const postSeedCount = await MembershipPlan.countDocuments();
    console.log(
      `[CatalogBootstrap] Seeded ${postSeedCount} plans into MembershipPlan collection`
    );
  } else {
    console.log(
      `[CatalogBootstrap] Catalog already populated (${count} plans). Skipping auto-seed.`
    );
  }

  // ── Step 2: Run pending migrations (P1) ─────────────────────────────────
  const migrationResult = await runMigrations();
  console.log(
    `[CatalogBootstrap] Migration engine: ran=${migrationResult.ran}, ` +
      `pending=${migrationResult.pending}, migrationVersion=${migrationResult.migrationVersion}`
  );

  // ── Step 3: Validate required plans exist and are active (P0) ───────────
  const allErrors = [];

  for (const requiredId of REQUIRED_PLAN_IDS) {
    const doc = await MembershipPlan.findOne({ planId: requiredId }).lean();

    if (!doc) {
      allErrors.push(`Required plan "${requiredId}" not found in MembershipPlan collection`);
      continue;
    }

    const docErrors = validatePlanDocument(doc);
    allErrors.push(...docErrors);
  }

  if (allErrors.length > 0) {
    console.error("\n[CatalogBootstrap] ❌ CATALOG VALIDATION FAILED:");
    for (const err of allErrors) {
      console.error(`  • ${err}`);
    }
    console.error("");
    throw new Error(
      `[CatalogBootstrap] Startup aborted — ${allErrors.length} catalog validation error(s). See logs above.`
    );
  }

  console.log(
    `[CatalogBootstrap] ✅ Catalog validated — Required plans active, version ${CATALOG_VERSION}`
  );
}

module.exports = { bootstrapCatalog, validatePlanDocument, REQUIRED_PLAN_IDS };

