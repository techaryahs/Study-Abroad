const express = require("express");
const router = express.Router();
const appController = require("../controllers/partnershipApplication.controller");
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
router.use(requireEduMitraOrAdmin); // Note: GET is allowed for Edu Leader in the middleware

router.get("/all-applications", requireEduMitraOrAdmin, appController.getAllApplications);
router.get("/:studentLeadId/applications", appController.getApplications);
router.post("/:studentLeadId/applications", appController.createApplication);
router.put("/:studentLeadId/applications/:applicationId", appController.updateApplication);

router.get("/all-offers", requireEduMitraOrAdmin, appController.getAllOffers);
router.get("/:studentLeadId/offers", appController.getOffers);
router.post("/:studentLeadId/offers", appController.createOffer);
router.put("/:studentLeadId/offers/:offerId", appController.updateOffer);
router.put("/:studentLeadId/offers/:offerId/accept", appController.acceptOffer);

module.exports = router;

