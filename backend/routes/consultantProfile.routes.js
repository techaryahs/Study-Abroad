const express = require("express");
const router = express.Router();
const consultantProfileCtrl = require("../controllers/consultantProfile.controller");

const upload = require("../middleware/multer");

// ✅ Dedicated Consultant Profile Routes
router.get("/profile/:userId", consultantProfileCtrl.getConsultantProfile);
router.put("/profile/:userId", upload.single("profileImage"), consultantProfileCtrl.updateConsultantProfile);

module.exports = router;
