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

module.exports = router;
