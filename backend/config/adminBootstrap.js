const User = require("../models/User");
const logger = require("../utils/logger");

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const mobile = process.env.ADMIN_MOBILE;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !mobile || !password) {
    logger.info("[AdminBootstrap] Skipping admin bootstrap: missing credentials in environment.");
    return;
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        logger.info(`[AdminBootstrap] Updated existing user ${email} to admin role.`);
      } else {
        logger.info(`[AdminBootstrap] Admin user ${email} already exists.`);
      }
      return;
    }

    const newAdmin = new User({
      name: "Administrator",
      email,
      mobile,
      password,
      role: "admin",
      profile: { isVerified: true },
    });
    
    await newAdmin.save();
    logger.info(`[AdminBootstrap] Successfully created admin user: ${email}`);
  } catch (error) {
    logger.error("[AdminBootstrap] Failed to bootstrap admin:", error.message);
  }
}

module.exports = { bootstrapAdmin };
