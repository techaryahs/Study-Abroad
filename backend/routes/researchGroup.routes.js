const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  createResearchGroup,
  getResearchGroups,
  joinResearchGroup,
} = require("../controllers/researchGroup.controller");
const {
  requireMembership,
  requireEntitlement,
} = require("../middleware/membershipAuth.middleware");

// Public: browse groups
router.get("/", getResearchGroups);

// Paid: create / join require essential+ research_groups entitlement
router.post(
  "/create",
  verifyToken,
  requireMembership(),
  requireEntitlement("human", "research_groups"),
  createResearchGroup
);

router.post(
  "/:id/join",
  verifyToken,
  requireMembership(),
  requireEntitlement("human", "research_groups"),
  joinResearchGroup
);

module.exports = router;
