const express = require("express");
const router = express.Router();
const consultantProfileCtrl = require("../controllers/consultantProfile.controller");

const { verifyToken, requireActiveConsultant } = require("../middleware/auth");
const upload = require("../middleware/multer");

// Dedicated Consultant Assigned Students Route (Active Consultant Only)
router.get("/assigned-students", verifyToken, requireActiveConsultant, consultantProfileCtrl.getAssignedStudents);

// Dedicated Consultant Profile Routes (Requires active consultant authentication or admin)
router.get("/profile/:userId", verifyToken, requireActiveConsultant, consultantProfileCtrl.getConsultantProfile);
router.put("/profile/:userId", verifyToken, requireActiveConsultant, upload.single("profileImage"), consultantProfileCtrl.updateConsultantProfile);

module.exports = router;
