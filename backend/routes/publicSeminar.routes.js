const express = require("express");
const router = express.Router();
const publicSeminarController = require("../controllers/publicSeminarController");

router.get("/:seminarId", publicSeminarController.getPublicSeminar);
router.post("/:seminarId/register", publicSeminarController.registerStudent);
router.post("/:seminarId/verify-otp", publicSeminarController.verifyOtp);

module.exports = router;
