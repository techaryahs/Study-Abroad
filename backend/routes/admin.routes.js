const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");

router.post("/receipt", adminCtrl.submitReceipt);
router.post("/save-api-key", adminCtrl.saveApiKey);
router.get("/receipts", adminCtrl.getReceipts);

router.post("/approve", adminCtrl.approveUser);
router.post("/deny", adminCtrl.denyUser);

router.post("/register-consultant", adminCtrl.registerConsultant);

// Consultant video call management
router.get("/consultants", adminCtrl.getAllConsultantsForAdmin);
router.put("/consultants/:consultantId/toggle-video", adminCtrl.toggleConsultantVideoCall);

// Partner management
const { verifyToken, requireAdmin } = require("../middleware/auth");
const partnerCtrl = require("../controllers/adminPartners.controller");

router.get("/partners", verifyToken, requireAdmin, partnerCtrl.getPartners);
router.get("/partners/:id", verifyToken, requireAdmin, partnerCtrl.getPartnerById);
router.put("/partners/:id/approve", verifyToken, requireAdmin, partnerCtrl.approvePartner);
router.put("/partners/:id/reject", verifyToken, requireAdmin, partnerCtrl.rejectPartner);
router.put("/partners/:id/suspend", verifyToken, requireAdmin, partnerCtrl.suspendPartner);

// Seminar approval management
const seminarCtrl = require("../controllers/adminSeminars.controller");
router.get("/seminars", verifyToken, requireAdmin, seminarCtrl.getSeminars);
router.put("/seminars/:id/approve", verifyToken, requireAdmin, seminarCtrl.approveSeminar);
router.put("/seminars/:id/reject", verifyToken, requireAdmin, seminarCtrl.rejectSeminar);

// College Management
const collegeCtrl = require("../controllers/adminColleges.controller");
router.get("/colleges", verifyToken, requireAdmin, collegeCtrl.getColleges);
router.post("/colleges", verifyToken, requireAdmin, collegeCtrl.createCollege);
router.get("/colleges/:id", verifyToken, requireAdmin, collegeCtrl.getCollegeById);
router.patch("/colleges/:id/status", verifyToken, requireAdmin, collegeCtrl.updateCollegeStatus);
router.post("/colleges/:id/coordinators", verifyToken, requireAdmin, collegeCtrl.addCoordinator);

module.exports = router;
