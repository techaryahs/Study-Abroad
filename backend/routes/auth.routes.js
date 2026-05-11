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
router.get("/search-student", authCtrl.searchStudent);      // ✅ Student search for parents
const upload = require("../config/multer.config");
router.post("/register-consultant", upload.single('image'), authCtrl.registerConsultant); // ✅ Consultant register (NEW)

router.post("/send-otp-signup", authCtrl.sendOtpSignup);
router.post("/verify-otp-signup", authCtrl.verifyOtpSignup);
router.post("/send-otp-mobile", authCtrl.sendOtpMobile);
router.post("/verify-otp-mobile", authCtrl.verifyOtpMobile);

router.post("/login", authCtrl.login);
router.post("/create-basic-account", authCtrl.createBasicAccount);

router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/verifyfp-otp", authCtrl.verifyForgotOtp);
router.post("/reset-password", authCtrl.resetPassword);

// ── ADMIN-SPECIFIC PASSWORD MANAGEMENT ──────────────────────────────────────
// These routes validate that the email belongs to an admin account
router.post("/admin/forgot-password", authCtrl.adminForgotPassword);
router.post("/admin/verify-otp", authCtrl.adminVerifyForgotOtp);
router.post("/admin/reset-password", authCtrl.adminResetPassword);

module.exports = router;
