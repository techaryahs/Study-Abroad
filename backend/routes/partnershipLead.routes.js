const express = require("express");
const router = express.Router();
const leadController = require("../controllers/partnershipLead.controller");
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
      if (p.partnerType !== "edu_mitra") {
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
// Wait, read operations should be available to both Edu Leader and Edu Mitra.
// So we apply the write protection only to POST/PUT endpoints.

router.put("/:id/stage", requireEduMitraOrAdmin, leadController.updatePipelineStage);
router.put("/:id/document", requireEduMitraOrAdmin, leadController.updateDocument);


router.post("/:id/shortlists", requireEduMitraOrAdmin, leadController.addShortlist);
router.put("/:id/shortlists/:shortlistId", requireEduMitraOrAdmin, leadController.updateShortlist);
module.exports = router;


