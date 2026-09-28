/**
 * P0+P1 — Health check routes.
 *
 * GET /api/health
 *   Returns overall system health with catalog + migration status.
 *   No auth required (health probes are public).
 */

const express = require("express");
const router = express.Router();
const MembershipPlan = require("../models/MembershipPlan");
const { CATALOG_VERSION } = require("../catalog/membershipCatalog");
const { REQUIRED_PLAN_IDS } = require("../config/catalogBootstrap");
const { getMigrationStatus } = require("../services/catalogMigrationService");

// Track when catalog was last validated at startup
let lastValidatedAt = null;

function setLastValidatedAt(date) {
  lastValidatedAt = date;
}

router.get("/", async (req, res) => {
  try {
    const totalPlans = await MembershipPlan.countDocuments();
    const activePlans = await MembershipPlan.countDocuments({ isActive: true });

    // Check that every required plan exists and is active
    const activePlanIds = await MembershipPlan.find({ isActive: true })
      .select("planId")
      .lean();
    const activeIdSet = new Set(activePlanIds.map((p) => p.planId));
    const requiredPlansPresent = REQUIRED_PLAN_IDS.every((id) =>
      activeIdSet.has(id)
    );

    // Migration status from the engine
    let migration = {};
    try {
      migration = await getMigrationStatus();
    } catch (migrationErr) {
      migration = {
        codeVersion: CATALOG_VERSION,
        catalogVersion: null,
        migrationVersion: null,
        pendingMigrations: null,
        lastMigration: null,
        migrationStatus: "unknown",
      };
    }

    const isHealthy =
      requiredPlansPresent &&
      activePlans >= REQUIRED_PLAN_IDS.length &&
      migration.migrationStatus !== "pending";

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "healthy" : "degraded",
      catalog: {
        catalogLoaded: activePlans > 0,
        catalogVersion: migration.catalogVersion ?? CATALOG_VERSION,
        requiredPlansPresent,
        totalPlans,
        activePlans,
        lastValidatedAt: lastValidatedAt ? lastValidatedAt.toISOString() : null,
      },
      migration: {
        codeVersion: migration.codeVersion,
        migrationVersion: migration.migrationVersion,
        pendingMigrations: migration.pendingMigrations,
        lastMigration: migration.lastMigration,
        migrationStatus: migration.migrationStatus,
      },
    });
  } catch (error) {
    console.error("[Health] Error checking health:", error);
    res.status(503).json({
      status: "unhealthy",
      catalog: {
        catalogLoaded: false,
        catalogVersion: CATALOG_VERSION,
        requiredPlansPresent: false,
        totalPlans: 0,
        activePlans: 0,
        lastValidatedAt: null,
      },
      migration: {
        codeVersion: CATALOG_VERSION,
        migrationVersion: null,
        pendingMigrations: null,
        lastMigration: null,
        migrationStatus: "unknown",
      },
    });
  }
});

module.exports = router;
module.exports.setLastValidatedAt = setLastValidatedAt;

