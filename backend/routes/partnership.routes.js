const express = require("express");
const router = express.Router();
const partnershipController = require("../controllers/partnershipController");
const { verifyToken } = require("../middleware/auth");

// Add basic role checking for Part 1 (simplified)
const requirePartnerRole = (req, res, next) => {
  const allowed = ["admin", "super_admin", "eduleader", "edumitra", "college_coordinator"];
  if (req.user && allowed.includes(String(req.user.role).toLowerCase())) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
};

router.use(verifyToken);
router.use(requirePartnerRole);

// Colleges
router.post("/colleges", partnershipController.createCollege);
router.get("/colleges", partnershipController.getColleges);

// Seminars
router.post("/seminars", partnershipController.createSeminar);
router.get("/seminars", partnershipController.getSeminars);
router.get("/seminars/:id", partnershipController.getSeminar);

// Students
router.get("/student-leads", partnershipController.getStudentLeads);

// Attendance
router.post("/attendance", partnershipController.markAttendance);

module.exports = router;
