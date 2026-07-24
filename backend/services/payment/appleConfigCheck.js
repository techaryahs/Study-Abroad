const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");

/**
 * Validates the Apple StoreKit 2 configuration during server startup.
 * Throws a fatal Error if the configuration is invalid.
 */
function validateAppleConfig() {
  logger.info("[AppleConfigCheck] Validating Apple StoreKit 2 Configuration...");

  // 1. Bundle ID
  if (!process.env.APPLE_BUNDLE_ID) {
    throw new Error("FATAL: APPLE_BUNDLE_ID is missing from environment variables.");
  }

  // 2. Environment
  const env = process.env.APPLE_ENVIRONMENT;
  if (!env || (env !== "Sandbox" && env !== "Production")) {
    throw new Error("FATAL: APPLE_ENVIRONMENT must be strictly set to 'Sandbox' or 'Production'.");
  }

  if (!process.env.APPLE_KEY_ID) {
    throw new Error("FATAL: APPLE_KEY_ID is missing.");
  }
  
  if (!process.env.APPLE_ISSUER_ID) {
    throw new Error("FATAL: APPLE_ISSUER_ID is missing.");
  }
  
  // 4. Private Key (Path or Raw)
  const keyPath = process.env.APPLE_PRIVATE_KEY_PATH;
  const keyEnv = process.env.APPLE_API_KEY_P8;
  let privateKeySource = "None";
  let loadedKey = "";

  if (keyPath && fs.existsSync(keyPath)) {
    privateKeySource = "File";
    loadedKey = fs.readFileSync(keyPath, "utf8");
  } else if (keyEnv) {
    privateKeySource = "Environment";
    loadedKey = keyEnv.replace(/\\n/g, "\n");
  } else {
    throw new Error("FATAL: Neither APPLE_PRIVATE_KEY_PATH nor APPLE_API_KEY_P8 is configured. Cannot authenticate with App Store Server API.");
  }

  const hasPemHeader = loadedKey.includes("-----BEGIN PRIVATE KEY-----") && loadedKey.includes("-----END PRIVATE KEY-----");

  logger.debug(
    `Apple Config Loaded: BundleID=${process.env.APPLE_BUNDLE_ID}, Env=${env}, KeySource=${privateKeySource}, PEM=${hasPemHeader}`
  );

  // 5. Certificates (for SignedDataVerifier)
  const certsDir = path.resolve(__dirname, "../../certs");

  if (!fs.existsSync(certsDir)) {
    throw new Error(`FATAL: Apple root certificates directory missing at ${certsDir}`);
  }

  let hasCert = false;
  try {
    const files = fs.readdirSync(certsDir);
    for (const file of files) {
      if (file.endsWith(".cer")) {
        hasCert = true;
        break;
      }
    }
  } catch (err) {
    throw new Error(`FATAL: Failed to read backend/certs/ directory: ${err.message}`);
  }

  if (!hasCert) {
    throw new Error("FATAL: No .cer files found in backend/certs/ directory. StoreKit 2 JWS verification requires Apple root certificates.");
  }

  logger.info("[AppleConfigCheck] Apple configuration validated.");
}

module.exports = validateAppleConfig;
