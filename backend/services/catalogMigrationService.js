/**
 * P1 — Catalog Migration Service
 *
 * Orchestrates versioned, locked, checksummed catalog migrations.
 *
 * Responsibilities:
 *   1. Acquire a distributed Mongo lock (atomic, with timeout).
 *   2. Read migration scripts from backend/migrations/catalog/.
 *   3. Compare disk migrations against MigrationLog to find pending work.
 *   4. Verify checksums of previously-run migrations (detect tampering).
 *   5. Execute pending migrations sequentially.
 *   6. Update SystemConfig.migrationVersion after each success.
 *   7. Release the lock.
 *
 * Guarantees:
 *   - Only one pod runs migrations at a time (Mongo atomic lock).
 *   - Lock auto-expires after LOCK_TIMEOUT_MS to recover from crashes.
 *   - Previously-run migration files cannot be silently modified.
 *   - Failed migrations abort startup (fail-fast).
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const SystemConfig = require("../models/SystemConfig");
const MigrationLog = require("../models/MigrationLog");
const { CATALOG_VERSION } = require("../catalog/membershipCatalog");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations", "catalog");
const LOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const CONFIG_ID = "membership_catalog";
const POD_ID = `${os.hostname()}-${process.pid}`;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse migration number from filename.
 * Expects format: "002_description.js" → 2
 */
function parseMigrationNumber(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * SHA-256 hash of file contents.
 */
function fileChecksum(filepath) {
  const content = fs.readFileSync(filepath, "utf8");
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Discover migration files on disk, sorted by number.
 */
function discoverMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((filename) => {
      const num = parseMigrationNumber(filename);
      if (num === null) {
        throw new Error(
          `[CatalogMigration] Invalid migration filename: "${filename}". ` +
            `Expected format: NNN_description.js`
        );
      }
      const filepath = path.join(MIGRATIONS_DIR, filename);
      return { filename, number: num, filepath, checksum: fileChecksum(filepath) };
    })
    .sort((a, b) => a.number - b.number);

  // Detect duplicate migration numbers
  const seen = new Set();
  for (const m of files) {
    if (seen.has(m.number)) {
      throw new Error(
        `[CatalogMigration] Duplicate migration number ${m.number} detected`
      );
    }
    seen.add(m.number);
  }

  return files;
}

// ── Locking ─────────────────────────────────────────────────────────────────

/**
 * Atomically acquire the migration lock.
 * Returns true if acquired, false if another pod holds it.
 */
async function acquireLock() {
  const now = new Date();

  // First, try to acquire an unlocked lock
  const result = await SystemConfig.findOneAndUpdate(
    { configId: CONFIG_ID, migrationLocked: false },
    {
      $set: {
        migrationLocked: true,
        migrationLockedAt: now,
        migrationLockedBy: POD_ID,
      },
    },
    { new: true }
  );

  if (result) return true;

  // Check for an expired lock (crash recovery)
  const stale = await SystemConfig.findOneAndUpdate(
    {
      configId: CONFIG_ID,
      migrationLocked: true,
      migrationLockedAt: { $lt: new Date(now.getTime() - LOCK_TIMEOUT_MS) },
    },
    {
      $set: {
        migrationLocked: true,
        migrationLockedAt: now,
        migrationLockedBy: POD_ID,
      },
    },
    { new: true }
  );

  if (stale) {
    console.warn(
      `[CatalogMigration] ⚠️ Recovered stale lock (was held by ${stale.migrationLockedBy})`
    );
    return true;
  }

  return false;
}

/**
 * Release the migration lock.
 */
async function releaseLock() {
  await SystemConfig.findOneAndUpdate(
    { configId: CONFIG_ID, migrationLockedBy: POD_ID },
    {
      $set: {
        migrationLocked: false,
        migrationLockedAt: null,
        migrationLockedBy: null,
      },
    }
  );
}

// ── Core Engine ─────────────────────────────────────────────────────────────

/**
 * Ensure the SystemConfig singleton document exists.
 */
async function ensureSystemConfig() {
  const existing = await SystemConfig.findOne({ configId: CONFIG_ID });
  if (!existing) {
    await SystemConfig.create({
      configId: CONFIG_ID,
      catalogVersion: CATALOG_VERSION,
      migrationVersion: 0,
    });
    console.log(
      `[CatalogMigration] Created SystemConfig (catalogVersion=${CATALOG_VERSION}, migrationVersion=0)`
    );
  }
}

/**
 * Main entry point. Called from catalogBootstrap before P0 validation.
 *
 * Returns a summary object for health reporting.
 */
async function runMigrations() {
  await ensureSystemConfig();

  const diskMigrations = discoverMigrations();

  if (diskMigrations.length === 0) {
    console.log("[CatalogMigration] No migration scripts found. Nothing to do.");
    return { ran: 0, pending: 0, migrationVersion: 0 };
  }

  // Fetch execution history
  const logs = await MigrationLog.find({}).lean();
  const logsByNumber = new Map(logs.map((l) => [l.migrationNumber, l]));

  // ── Checksum verification of previously-run migrations ──────────────────
  for (const migration of diskMigrations) {
    const log = logsByNumber.get(migration.number);
    if (log && log.status === "success") {
      if (log.checksum !== migration.checksum) {
        throw new Error(
          `[CatalogMigration] ❌ Checksum mismatch for migration ${migration.filename}. ` +
            `File has been modified after execution. ` +
            `Expected: ${log.checksum}, Got: ${migration.checksum}`
        );
      }
    }
  }

  // ── Identify pending migrations ─────────────────────────────────────────
  const config = await SystemConfig.findOne({ configId: CONFIG_ID }).lean();
  const currentVersion = config.migrationVersion;

  const pending = diskMigrations.filter((m) => m.number > currentVersion);

  if (pending.length === 0) {
    console.log(
      `[CatalogMigration] All migrations applied (migrationVersion=${currentVersion}). Nothing to do.`
    );
    return { ran: 0, pending: 0, migrationVersion: currentVersion };
  }

  console.log(
    `[CatalogMigration] ${pending.length} pending migration(s) found ` +
      `(current=${currentVersion}, latest=${pending[pending.length - 1].number})`
  );

  // ── Acquire lock ────────────────────────────────────────────────────────
  const locked = await acquireLock();
  if (!locked) {
    const holder = await SystemConfig.findOne({ configId: CONFIG_ID }).lean();
    throw new Error(
      `[CatalogMigration] ❌ Could not acquire migration lock. ` +
        `Currently held by: ${holder?.migrationLockedBy || "unknown"} ` +
        `since ${holder?.migrationLockedAt?.toISOString() || "unknown"}`
    );
  }

  console.log(`[CatalogMigration] 🔒 Lock acquired by ${POD_ID}`);

  // Re-check current version after acquiring lock (another pod may have run)
  const freshConfig = await SystemConfig.findOne({ configId: CONFIG_ID }).lean();
  const freshVersion = freshConfig.migrationVersion;
  const stillPending = pending.filter((m) => m.number > freshVersion);

  if (stillPending.length === 0) {
    console.log(
      `[CatalogMigration] Another pod already applied pending migrations. Releasing lock.`
    );
    await releaseLock();
    return { ran: 0, pending: 0, migrationVersion: freshVersion };
  }

  // ── Execute migrations sequentially ─────────────────────────────────────
  let ranCount = 0;
  const startTime = Date.now();

  try {
    for (const migration of stillPending) {
      // Timeout check
      if (Date.now() - startTime > LOCK_TIMEOUT_MS) {
        throw new Error(
          `[CatalogMigration] ❌ Migration timeout exceeded (${LOCK_TIMEOUT_MS / 1000}s). ` +
            `Aborting at migration ${migration.filename}.`
        );
      }

      const migrationStarted = new Date();
      console.log(
        `[CatalogMigration] ▶ Running migration ${migration.filename}...`
      );

      try {
        const migrationModule = require(migration.filepath);

        if (typeof migrationModule.up !== "function") {
          throw new Error(
            `Migration ${migration.filename} does not export an "up" function`
          );
        }

        await migrationModule.up();

        const durationMs = Date.now() - migrationStarted.getTime();

        // Record success
        await MigrationLog.create({
          migrationNumber: migration.number,
          filename: migration.filename,
          checksum: migration.checksum,
          status: "success",
          startedAt: migrationStarted,
          completedAt: new Date(),
          durationMs,
          executedBy: POD_ID,
        });

        // Advance migration version
        await SystemConfig.findOneAndUpdate(
          { configId: CONFIG_ID },
          { $set: { migrationVersion: migration.number } }
        );

        ranCount++;
        console.log(
          `[CatalogMigration] ✅ Migration ${migration.filename} completed (${durationMs}ms)`
        );
      } catch (migrationError) {
        // Record failure
        await MigrationLog.create({
          migrationNumber: migration.number,
          filename: migration.filename,
          checksum: migration.checksum,
          status: "failed",
          startedAt: migrationStarted,
          completedAt: new Date(),
          durationMs: Date.now() - migrationStarted.getTime(),
          error: migrationError.message,
          executedBy: POD_ID,
        }).catch(() => {}); // Best-effort logging

        throw new Error(
          `[CatalogMigration] ❌ Migration ${migration.filename} failed: ${migrationError.message}`
        );
      }
    }

    // Update catalogVersion to match codebase after all migrations pass
    await SystemConfig.findOneAndUpdate(
      { configId: CONFIG_ID },
      { $set: { catalogVersion: CATALOG_VERSION } }
    );

    const finalVersion =
      stillPending[stillPending.length - 1].number;

    console.log(
      `[CatalogMigration] ✅ All ${ranCount} migration(s) applied successfully ` +
        `(migrationVersion=${finalVersion}, catalogVersion=${CATALOG_VERSION})`
    );

    return { ran: ranCount, pending: 0, migrationVersion: finalVersion };
  } finally {
    await releaseLock();
    console.log(`[CatalogMigration] 🔓 Lock released by ${POD_ID}`);
  }
}

/**
 * Returns current migration status for health endpoints.
 */
async function getMigrationStatus() {
  const config = await SystemConfig.findOne({ configId: CONFIG_ID }).lean();
  const diskMigrations = discoverMigrations();
  const currentVersion = config?.migrationVersion ?? 0;
  const pending = diskMigrations.filter((m) => m.number > currentVersion);

  const lastLog = await MigrationLog.findOne({ status: "success" })
    .sort({ migrationNumber: -1 })
    .lean();

  return {
    codeVersion: CATALOG_VERSION,
    catalogVersion: config?.catalogVersion ?? 0,
    migrationVersion: currentVersion,
    pendingMigrations: pending.length,
    lastMigration: lastLog
      ? {
          number: lastLog.migrationNumber,
          filename: lastLog.filename,
          completedAt: lastLog.completedAt?.toISOString() ?? null,
          durationMs: lastLog.durationMs,
        }
      : null,
    migrationStatus:
      pending.length > 0
        ? "pending"
        : config?.migrationLocked
          ? "running"
          : "up_to_date",
  };
}

module.exports = { runMigrations, getMigrationStatus };
