const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth");

// =========================
// AUTH ROUTES
// =========================
router.get("/me", verifyToken, authCtrl.getMe);
router.post("/register", authCtrl.register);              // Student register
router.post("/register-parent", authCtrl.registerParent); // ✅ Parent register (NEW)
const upload = require("../config/multer.config");
router.post("/register-consultant", upload.single('image'), authCtrl.registerConsultant); // ✅ Consultant register (NEW)

router.post("/send-otp-signup", authCtrl.sendOtpSignup);
router.post("/verify-otp-signup", authCtrl.verifyOtpSignup);

router.post("/login", authCtrl.login);

router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/verifyfp-otp", authCtrl.verifyForgotOtp);
router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
