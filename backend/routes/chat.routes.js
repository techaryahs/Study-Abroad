const express = require("express");
const router = express.Router();
const chatCtrl = require("../controllers/chat.controller");
const auth = require("../middleware/auth");
const {
  requireMembership,
  requireEntitlement,
  requireUsage,
} = require("../middleware/membershipAuth.middleware");

// Study-abroad assistant — starter AI entitlement
router.post(
  "/chat",
  auth,
  requireMembership(),
  requireEntitlement("ai", "study_abroad_assistant"),
  requireUsage("study_abroad_assistant"),
  chatCtrl.chat
);

module.exports = router;
