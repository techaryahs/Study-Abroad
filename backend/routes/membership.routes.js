const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membership.controller");
const verifyToken = require("../middleware/auth");
const requireAdmin = verifyToken.requireAdmin;

router.get("/plans", membershipController.getActivePlans);
router.get("/services", membershipController.getServices);
router.get("/access", verifyToken, membershipController.getAccessSummary);
router.get("/my", verifyToken, membershipController.getMyMembership);
// Ops: catalog seed is admin-only (never public).
router.post("/seed", verifyToken, requireAdmin, membershipController.seedInitialCatalog);

module.exports = router;
