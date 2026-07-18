/**
 * P3 — Membership Sweeper Job
 *
 * Daily scheduled job to process expirations and grace periods.
 * Avoids overlapping executions using a simple MongoDB lock if running multi-pod.
 */

const cron = require("node-cron");
const { processDailyExpirations } = require("../services/membership/lifecycle.service");
const SystemConfig = require("../models/SystemConfig");

// 0 0 * * * -> Runs at 00:00 UTC every day.
const DAILY_CRON_EXPRESSION = process.env.MEMBERSHIP_SWEEPER_CRON || "0 0 * * *";

async function runSweeper() {
  console.log("[MembershipSweeper] Starting daily cleanup job...");
  
  try {
    // Optional: distributed lock using SystemConfig (P1) to prevent multi-pod duplicate execution.
    // We attempt to atomically set a lock valid for 5 minutes.
    const lockExpiry = new Date(Date.now() - 5 * 60 * 1000);
    const lock = await SystemConfig.findOneAndUpdate(
      {
        $or: [
          { sweeperLocked: { $ne: true } },
          { sweeperLockedAt: { $lt: lockExpiry } } // Recover stale lock
        ]
      },
      {
        $set: {
          sweeperLocked: true,
          sweeperLockedAt: new Date()
        }
      },
      { new: true }
    );

    if (!lock) {
      console.log("[MembershipSweeper] Another instance is already running this job. Skipping.");
      return;
    }

    // Execute transitions
    const results = await processDailyExpirations();
    console.log(`[MembershipSweeper] Finished. Graced: ${results.graced}, Expired: ${results.expired}`);

    // Release lock
    await SystemConfig.updateOne(
      { _id: lock._id },
      { $set: { sweeperLocked: false } }
    );
  } catch (error) {
    console.error("[MembershipSweeper] Error during execution:", error);
    // Attempt emergency unlock if crashed
    await SystemConfig.updateOne({}, { $set: { sweeperLocked: false } });
  }
}

/**
 * Initializes the cron job.
 */
function initMembershipSweeper() {
  if (process.env.NODE_ENV === 'test') return;
  
  console.log(`[MembershipSweeper] Scheduled with expression: ${DAILY_CRON_EXPRESSION}`);
  cron.schedule(DAILY_CRON_EXPRESSION, runSweeper);
}

module.exports = {
  initMembershipSweeper,
  runSweeper // exported for manual testing
};
