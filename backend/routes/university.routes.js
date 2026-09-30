const express = require("express");
const router = express.Router();
const universityController = require("../controllers/university.controller");
const { optionalAuth } = require("../middleware/auth");

// Public/Directory endpoints with optional authentication for entitlement check
router.get("/", optionalAuth, universityController.getUniversities);
router.get("/:slug", optionalAuth, universityController.getUniversityBySlug);

module.exports = router;
