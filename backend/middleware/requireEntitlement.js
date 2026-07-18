/**
 * P3 — Entitlement Middleware
 *
 * Reusable Express middleware to protect feature endpoints.
 */

const { authorize } = require("../services/membership/authorization.service");
const { findUserById } = require("../utils/userHelper");

/**
 * Returns an Express middleware that checks if the authenticated user
 * has access and remaining usage for a specific feature.
 *
 * @param {String} feature - The feature key to check (e.g., 'resume_builder')
 */
function requireEntitlement(feature) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id || req.user._id;
      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const found = await findUserById(userId);
      if (!found || !found.user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const authResult = await authorize(found.user, feature);

      if (!authResult.allowed) {
        return res.status(403).json({
          success: false,
          error: "Feature access denied",
          reason: authResult.reason,
        });
      }

      // Attach auth result to req for downstream controllers to use (e.g. knowing it's unlimited)
      req.entitlement = authResult;
      
      // Keep a reference to the found user model so controllers don't have to fetch it again
      req.resolvedUser = found.user;
      req.resolvedUserModel = found.model;

      next();
    } catch (error) {
      console.error("[RequireEntitlement Middleware] Error:", error);
      res.status(500).json({ success: false, error: "Internal authorization error" });
    }
  };
}

module.exports = {
  requireEntitlement
};
