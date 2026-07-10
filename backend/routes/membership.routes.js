const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membership.controller");
const verifyToken = require("../middleware/auth");

router.get("/plans", membershipController.getActivePlans);
router.get("/services", membershipController.getServices);
router.get("/access", verifyToken, membershipController.getAccessSummary);
router.post("/seed", membershipController.seedInitialCatalog);

module.exports = router;
