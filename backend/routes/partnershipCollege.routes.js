const express = require("express");
const verifyToken = require("../middleware/auth");
const collegeController = require("../controllers/partnershipCollegeController");

const router = express.Router();
const allowedRoles = new Set([
  "admin",
  "super_admin",
  "eduleader",
  "edumitra",
  "college_coordinator",
  "partner",
]);

router.use(verifyToken);
router.use((req, res, next) => {
  if (allowedRoles.has(String(req.user?.role || "").toLowerCase())) return next();
  return res.status(403).json({ error: "Access denied" });
});

router.get("/", collegeController.getColleges);
router.post("/", collegeController.createCollege);

module.exports = router;