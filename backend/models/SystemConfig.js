/**
 * P1 — SystemConfig Model
 *
 * Singleton document tracking the catalog and migration state of this
 * deployment. Also acts as the distributed migration lock.
 *
 * There is exactly one document with configId = "membership_catalog".
 */

const mongoose = require("mongoose");

const SystemConfigSchema = new mongoose.Schema(
  {
    /** Fixed identifier — ensures a single document via unique index. */
    configId: {
      type: String,
      required: true,
      unique: true,
      default: "membership_catalog",
    },

    /** Business epoch — bumped when the catalog structure changes materially. */
    catalogVersion: { type: Number, required: true, default: 0 },

    /** Monotonically increasing — tracks the last successfully applied migration. */
    migrationVersion: { type: Number, required: true, default: 0 },

    // ── Distributed Migration Lock ────────────────────────────────────────
    migrationLocked: { type: Boolean, default: false },
    migrationLockedAt: { type: Date, default: null },
    migrationLockedBy: { type: String, default: null }, // hostname / pod ID
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SystemConfig ||
  mongoose.model("SystemConfig", SystemConfigSchema);
