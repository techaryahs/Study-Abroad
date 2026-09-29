const express = require("express");
const router = express.Router();
const reconController = require("../controllers/partnershipReconciliation.controller");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);
// Everyone (Edu Leader, Edu Mitra, Admin) can view reconciliation
router.get("/", reconController.getReconciliation);

module.exports = router;
