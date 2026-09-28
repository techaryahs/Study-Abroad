/**
 * P1 — MigrationLog Model
 *
 * Append-only audit trail of every catalog migration execution.
 * Each document records what ran, when, and whether it succeeded.
 */

const mongoose = require("mongoose");

const MigrationLogSchema = new mongoose.Schema(
  {
    /** Migration sequence number extracted from filename (e.g. 2 from "002_add_plan.js"). */
    migrationNumber: { type: Number, required: true },

    /** Original filename (e.g. "002_add_plan.js"). */
    filename: { type: String, required: true },

    /** SHA-256 hash of the migration file contents at execution time. */
    checksum: { type: String, required: true },

    /** "success" | "failed" */
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },

    /** ISO timestamp when execution started. */
    startedAt: { type: Date, required: true },

    /** ISO timestamp when execution finished. */
    completedAt: { type: Date, default: null },

    /** Duration in milliseconds. */
    durationMs: { type: Number, default: null },

    /** Error message if status === "failed". */
    error: { type: String, default: null },

    /** Hostname / pod identifier that ran the migration. */
    executedBy: { type: String, default: null },
  },
  { timestamps: true }
);

// Compound index: one log entry per migration number (prevents re-recording).
MigrationLogSchema.index({ migrationNumber: 1 }, { unique: true });

module.exports =
  mongoose.models.MigrationLog ||
  mongoose.model("MigrationLog", MigrationLogSchema);
