const express = require("express");
const router = express.Router();
const commController = require("../controllers/partnershipCommission.controller");
const { verifyToken } = require("../middleware/auth");
const User = require("../models/User");

const requireEduMitraOrAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (["admin", "super_admin"].includes(String(req.user.role).toLowerCase())) return next();
  
  if (req.user.role === "partner") {
    try {
      const userDoc = await User.findById(req.user.id);
      if (!userDoc || !userDoc.partnerProfile) return res.status(403).json({ error: "Access denied" });
      const p = userDoc.partnerProfile;
      if (p.onboardingStatus !== "approved" || p.isApproved !== true || p.isActive === false) {
         return res.status(403).json({ error: "Partner is not fully approved or active" });
      }
      if (p.partnerType !== "edu_mitra" && req.method !== "GET") {
         return res.status(403).json({ error: "Only Edu Mitra can perform this operation" });
      }
      return next();
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }
  return res.status(403).json({ error: "Access denied" });
};

router.use(verifyToken);
router.use(requireEduMitraOrAdmin);

// Visa & Enrolment (tied to application)
router.put("/applications/:applicationId/visa", commController.updateVisa);
router.put("/applications/:applicationId/enrolment", commController.updateEnrolment);

// Commission
router.get("/commissions", commController.getCommissions);
router.post("/commissions", commController.createCommission);
router.put("/commissions/:commissionId/receive", commController.recordCommissionReceived);
router.put("/commissions/:commissionId/share-paid", commController.recordSharePaid);

module.exports = router;
