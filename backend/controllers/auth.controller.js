const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");
const { getEmailSearchRegex, normalizeEmail } = require("../utils/emailUtils");
const { findUserByEmail, findUserByMobile } = require("../utils/userHelper");
const { sendSMSOTP } = require("../utils/otpsms");
const { applyLifecycleToUser } = require("../utils/membershipLifecycle");
const logger = require("../utils/logger");


const otpStore = new Map();
const otpStoreMobile = new Map();
// Normalization now handled via regex in lookups, we keep the original for display.

/* =========================
   REGISTER STUDENT (Base User)
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, dob, gender, country, state, profile: profileInput } = req.body;
    const emailLower = email.toLowerCase().trim();
    // 🔍 1. Check if Email and Mobile are Verified
    const storedData = otpStore.get(emailLower);
    if (!storedData || !storedData.verified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email before registering." });
    }

    const storedMobileData = otpStoreMobile.get(mobile);
    if (!storedMobileData || !storedMobileData.verified) {
      return res.status(400).json({ error: "Mobile number not verified. Please verify your number before registering." });
    }

    // 🎯 Prepare target universities from goal
    const targetUniversities = [];
    if (profileInput?.goal?.targetUniv) {
      targetUniversities.push({
        uniName: profileInput.goal.targetUniv,
        degree: Array.isArray(profileInput.goal.degree) ? profileInput.goal.degree.join(", ") : profileInput.goal.degree,
        major: profileInput.goal.targetMajor || "",
        term: profileInput.goal.targetTerm,
        year: profileInput.goal.targetYear
      });
    }

    // 👤 Build Dynamic Profile Data
    const profileData = {
      isPremium: false,
      isVerified: true
    };

    if (profileInput?.source) profileData.source = profileInput.source;
    if (profileInput?.lookUpFor && profileInput.lookUpFor.length > 0) profileData.lookUpFor = profileInput.lookUpFor;
    if (profileInput?.loanInterest !== undefined) profileData.loanInterest = profileInput.loanInterest;
    if (targetUniversities.length > 0) profileData.targetUniversities = targetUniversities;

    const newStudent = new Student({
      name,
      email: emailLower,
      mobile,
      password: password,
      dob,
      gender,
      country,
      state,
      role: "student",
      profile: profileData
    });

    await newStudent.save();

    // 🔢 3️⃣ Cleanup otpStore
    otpStore.delete(emailLower);
    otpStoreMobile.delete(mobile);

    logger.info(`Student Registered Successfully: ${logger.maskEmail(emailLower)}`);

    // 4️⃣ Send Success Response
    res.status(201).json({
      message: "Student registered successfully. Welcome aboard!",
      user: { id: newStudent._id, name: newStudent.name, email: newStudent.email }
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



/* =========================
   SEND OTP FOR SIGNUP (Pre-Registration)
========================= */
exports.sendOtpSignup = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const emailLower = email.toLowerCase().trim();
    const searchRegex = getEmailSearchRegex(emailLower);

    // 1️⃣ Check if already registered (Search across all collections using regex)
    const existing = await findUserByEmail(emailLower);

    if (existing) {
      return res.status(400).json({ error: "Email already registered. Please log in." });
    }

    // 2️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(emailLower, { otp, expiresAt, verified: false });

    logger.info(`OTP for Signup (${logger.maskEmail(emailLower)}): ${logger.maskOtp(otp)}`);

    // 3️⃣ Send Email
    await sendEmail(
      emailLower,
      "Verify Your Email - EduLeaderGlobal",
      "",
      `<div style="font-family:serif;padding:30px;background:#090909;color:white;border-radius:20px;">
         <h2 style="color:#EAB308;font-style:italic;font-size:24px;">Confirm Your Identity</h2>
         <p style="color:#9ca3af;">Use the code below to verify your email for EduLeaderGlobal.</p>
         <div style="background:#1a1a1a;color:#EAB308;padding:25px;text-align:center;font-size:36px;letter-spacing:12px;font-weight:900;border-radius:15px;margin:25px 0;border:1px solid #EAB308/20;">
           ${otp}
         </div>
         <p style="font-size:12px;color:#4b5563;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
       </div>`
    );

    res.json({ message: "Verification code sent successfully" });
  } catch (err) {
    console.error("❌ sendOtpSignup Error:", err);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

/* =========================
   VERIFY OTP FOR SIGNUP
========================= */
exports.verifyOtpSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const emailLower = email?.toLowerCase().trim();
    const storedData = otpStore.get(emailLower);

    if (!storedData) {
      return res.status(400).json({ error: "Verification record not found. Please try again." });
    }

    if (storedData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(emailLower);
      return res.status(400).json({ error: "Verification code has expired" });
    }

    // ✅ Mark as verified
    storedData.verified = true;
    otpStore.set(emailLower, storedData);

    res.json({ message: "Email verified successfully", verified: true });
  } catch (err) {
    console.error("❌ verifyOtpSignup Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

/* =========================
   SEND OTP FOR MOBILE SIGNUP
========================= */
exports.sendOtpMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

    // 1️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStoreMobile.set(mobile, { otp, expiresAt, verified: false });

    logger.info(`Mobile OTP for Signup generated: ${logger.maskOtp(otp)}`);

    // 2️⃣ Send SMS
    const smsResult = await sendSMSOTP(mobile, otp);
    if (!smsResult.success) {
      return res.status(500).json({ error: smsResult.message });
    }

    res.json({ message: "Verification code sent to your mobile successfully" });
  } catch (err) {
    console.error("❌ sendOtpMobile Error:", err);
    res.status(500).json({ error: "Failed to send mobile verification code" });
  }
};

/* =========================
   VERIFY OTP FOR MOBILE
========================= */
exports.verifyOtpMobile = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const storedData = otpStoreMobile.get(mobile);

    if (!storedData) {
      return res.status(400).json({ error: "Verification record not found. Please try again." });
    }

    if (storedData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid mobile verification code" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStoreMobile.delete(mobile);
      return res.status(400).json({ error: "Mobile verification code has expired" });
    }

    // ✅ Mark as verified
    storedData.verified = true;
    otpStoreMobile.set(mobile, storedData);

    res.json({ message: "Mobile number verified successfully", verified: true });
  } catch (err) {
    console.error("❌ verifyOtpMobile Error:", err);
    res.status(500).json({ error: "Mobile verification failed" });
  }
};

/* =========================
   SEARCH STUDENT (For Parent Linking)
========================= */
exports.searchStudent = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const emailLower = email.toLowerCase().trim();
    const searchRegex = getEmailSearchRegex(emailLower);

    const student = await Student.findOne({
      email: { $regex: searchRegex },
      role: "student"
    }).select("name email country dob profile.profileImage");

    if (!student) {
      return res.status(404).json({ error: "Student not found with this email." });
    }

    res.json({ success: true, student });
  } catch (err) {
    console.error("❌ searchStudent Error:", err);
    res.status(500).json({ error: "Failed to search student" });
  }
};

/* =========================
   LOGIN
========================= */
const generateToken = (id, role) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {

  try {
    // 🔥 NORMALIZE INPUT
    const emailInput = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    if (!emailInput || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 🔍 FIND USER
    const identified = await findUserByEmail(emailInput);
    if (!identified) {
      return res.status(401).json({ error: "Email not registered" });
    }

    const { user, role } = identified;

    // Use the model method matchPassword
    if (user && (await user.matchPassword(password))) {
      const profile = user.profile || {};

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        // Robust isVerified check covering different model structures
        isVerified: user.isVerified === true || (user.profile && user.profile.isVerified === true) || false,
        mobile: user.mobile,
        profileImage: (user.profile && user.profile.profileImage) || user.image || null,
        isPremium: (user.profile && user.profile.isPremium) || user.isPremium || false,
        isBasicAccount: (user.profile && user.profile.isBasicAccount) || false,
        hasUsedFreeBooking: (user.profile && user.profile.hasUsedFreeBooking) || false
      };

      // Add videoCallEnabled for consultants
      if (role === 'consultant') {
        userData.videoCallEnabled = user.videoCallEnabled || false;
      }

      res.json({
        message: "Login successful",
        token: generateToken(user._id, role),
        user: userData
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   GET CURRENT USER
========================= */
exports.getMe = async (req, res) => {
  try {
    const { serializeMembership } = require("../utils/membershipLifecycle");
    const PaymentTransaction = require("../models/PaymentTransaction");
    const { findUserById } = require("../utils/userHelper");

    const found = await findUserById(req.user.id || req.user._id);
    if (!found || !found.user) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = found.user;

    // Runtime membership lifecycle: if expiryDate passed, status becomes expired (persisted)
    if (user.membership) {
      try {
        await applyLifecycleToUser(user, { persist: true });
      } catch (lifecycleErr) {
        console.warn("Membership lifecycle evaluation skipped:", lifecycleErr.message);
      }
    }

    // Return a plain object with normalized membership purchase fields for clients
    const userPayload =
      typeof user.toObject === "function"
        ? user.toObject({ flattenMaps: true })
        : { ...user };

    if (userPayload.membership) {
      const serialized = serializeMembership(userPayload.membership);
      if (serialized) {
        // Backfill amount/dates from ledger when membership record is incomplete
        if (
          serialized.planId &&
          serialized.planId !== "free" &&
          (serialized.amountPaid == null ||
            !serialized.purchaseDate ||
            !serialized.transactionId ||
            !serialized.expiryDate)
        ) {
          try {
            const txnQuery = {
              userId: user._id,
              status: { $in: ["ENTITLED", "VERIFIED", "succeeded"] },
            };
            if (serialized.transactionId) {
              txnQuery.$or = [
                { transactionId: serialized.transactionId },
                { externalTransactionId: serialized.transactionId },
              ];
            } else if (serialized.planId) {
              txnQuery.planId = serialized.planId;
            }
            const txn = await PaymentTransaction.findOne(txnQuery)
              .sort({ createdAt: -1 })
              .lean();
            if (txn) {
              if (serialized.amountPaid == null && typeof txn.amount === "number") {
                serialized.amountPaid = txn.amount;
              }
              if (!serialized.currency && txn.currency) {
                serialized.currency = txn.currency;
              }
              if (!serialized.transactionId) {
                serialized.transactionId =
                  txn.externalTransactionId || txn.transactionId || null;
              }
              const txnDate = txn.processedAt || txn.createdAt;
              if (txnDate && !serialized.purchaseDate) {
                const iso = new Date(txnDate).toISOString();
                serialized.purchaseDate = iso;
                serialized.purchasedAt = iso;
                serialized.activatedAt = iso;
                if (!serialized.paymentDate) serialized.paymentDate = iso;
              }
              if (!serialized.paymentStatus && txn.status) {
                serialized.paymentStatus =
                  txn.status === "ENTITLED" || txn.status === "VERIFIED"
                    ? "paid"
                    : String(txn.status).toLowerCase();
              }
            }

            // Derive missing expiry for recurring plans from purchase date + plan type
            if (!serialized.expiryDate && serialized.purchaseDate) {
              const MembershipPlan = require("../models/MembershipPlan");
              const planDoc = await MembershipPlan.findOne({
                planId: serialized.planId,
                isActive: true,
              })
                .select("type")
                .lean();
              if (planDoc && (planDoc.type === "yearly" || planDoc.type === "monthly")) {
                const base = new Date(serialized.purchaseDate);
                if (planDoc.type === "yearly") {
                  base.setFullYear(base.getFullYear() + 1);
                } else {
                  base.setMonth(base.getMonth() + 1);
                }
                const expIso = base.toISOString();
                serialized.expiryDate = expIso;
                serialized.expiresAt = expIso;
              }
            }
          } catch (txnErr) {
            console.warn("PaymentTransaction membership backfill skipped:", txnErr.message);
          }
        }
        userPayload.membership = serialized;
      }
    }

    res.json({ success: true, user: userPayload });
  } catch (err) {
    console.error("🔥 getMe error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



/* =========================
   REGISTER CONSULTANT
========================= */
exports.registerConsultant = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role: consultantRole,
      expertise,
      experience,
      bio,
      availability,
      image
    } = req.body;

    const emailLower = normalizeEmail(email);

    // 🔍 Check if Email is Verified in otpStore
    const storedData = otpStore.get(emailLower);
    if (!storedData || !storedData.verified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email before registering." });
    }

    // 1️⃣ HANDLE MULTIPART (FormData) PARSING
    if (!req.file) {
      return res.status(400).json({ error: "Profile image is required for consultants." });
    }
    image = `/uploads/${req.file.filename}`;

    if (typeof availability === 'string') {
      try {
        availability = JSON.parse(availability);
      } catch (e) {
        console.warn("⚠️ Failed to parse availability string, keeping as is:", e.message);
      }
    }

    if (!emailLower || !password || !name || !consultantRole || !expertise || !experience || !bio) {
      return res.status(400).json({ error: "Missing required professional profile fields." });
    }

    // 2️⃣ CHECK UNIQUE EMAIL (Across all collections) using Regex
    const existing = await findUserByEmail(emailLower);

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newConsultant = new Consultant({
      name,
      email: emailLower,
      mobile: '0000000000',
      password: password,
      role: consultantRole,
      expertise,
      experience,
      bio,
      image,
      availability: availability || [],
      isVerified: true,
      isPremium: true
    });

    await newConsultant.save();

    // 🔢 Cleanup otpStore
    otpStore.delete(emailLower);
    logger.info(`Consultant Registered Successfully: ${logger.maskEmail(emailLower)}`);

    res.status(201).json({
      message: "Consultant registered successfully. Welcome to the Elite.",
      email: emailLower
    });

  } catch (error) {
    console.error("❌ Consultant Registration Error:", error);

    // Check for Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ error: "Server error: " + error.message });
  }
};

/* =========================
   REGISTER PARENT
========================= */
exports.registerParent = async (req, res) => {
  try {
    const { parentName, email, password, studentId } = req.body;
    const emailLower = email?.toLowerCase().trim();

    // Check existing using Regex
    const existing = await findUserByEmail(emailLower);
    if (existing) return res.status(400).json({ error: "Email already registered" });

    // Validate Student in the Students collection
    const student = await Student.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create Parent User
    const parent = new User({
      name: parentName,
      email: emailLower,
      password,
      role: "parent",
      profile: {
        parentOf: [student._id],
        isVerified: false
      }
    });
    await parent.save();

    // Link Student to Parent Profile
    if (!student.profile) student.profile = {};
    if (!student.profile.parents) student.profile.parents = [];
    student.profile.parents.push(parent._id);
    await student.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(emailLower, { otp, expiresAt });

    await sendEmail(emailLower, "Verify Parent Account", "", `<p>OTP: ${otp}</p><p>Valid for 10 mins.</p>`);

    res.status(201).json({ message: "Parent registered", parentId: parent._id });

  } catch (error) {
    console.error("❌ Parent Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   FORGOT / RESET PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const emailLower = email?.toLowerCase().trim();

  const identified = await findUserByEmail(emailLower);
  if (!identified) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(emailLower, { otp, expiresAt: Date.now() + 600000 });

  await sendEmail(emailLower, "Reset Password", "", `<p>OTP: ${otp}</p>`);
  res.json({ message: "OTP sent" });
};

/* =========================
   ADMIN FORGOT PASSWORD
   (validates admin role before sending OTP)
========================= */
exports.adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const emailLower = email.toLowerCase().trim();

    const identified = await findUserByEmail(emailLower);
    if (!identified) return res.status(404).json({ error: "No admin account found with this email" });

    // Only allow admin role
    if (identified.role !== "admin") {
      return res.status(403).json({ error: "This email is not registered as an admin account" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(emailLower, { otp, expiresAt, verified: false });

    logger.info(`Admin Forgot Password OTP generated for ${logger.maskEmail(emailLower)}: ${logger.maskOtp(otp)}`);

    await sendEmail(
      emailLower,
      "Admin Password Reset — EduLeaderGlobal",
      "",
      `<div style="font-family:serif;padding:30px;background:#090909;color:white;border-radius:20px;">
         <h2 style="color:#EAB308;font-style:italic;font-size:24px;">Admin Password Reset</h2>
         <p style="color:#9ca3af;">You requested a password reset for your admin account.</p>
         <div style="background:#1a1a1a;color:#EAB308;padding:25px;text-align:center;font-size:36px;letter-spacing:12px;font-weight:900;border-radius:15px;margin:25px 0;border:1px solid rgba(234,179,8,0.2);">
           ${otp}
         </div>
         <p style="font-size:12px;color:#4b5563;">This code expires in 10 minutes. If you did not request this, secure your account immediately.</p>
       </div>`
    );

    res.json({ message: "Reset code sent to your admin email" });
  } catch (err) {
    console.error("❌ adminForgotPassword Error:", err);
    res.status(500).json({ error: "Failed to send reset code" });
  }
};

/* =========================
   ADMIN VERIFY FORGOT OTP
========================= */
exports.adminVerifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const emailLower = email?.toLowerCase().trim();
    const data = otpStore.get(emailLower);

    if (!data) return res.status(400).json({ error: "No reset code found. Please request a new one." });
    if (Date.now() > data.expiresAt) {
      otpStore.delete(emailLower);
      return res.status(400).json({ error: "Reset code has expired. Please request a new one." });
    }
    if (data.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    // Mark OTP as verified so reset step can proceed
    data.verified = true;
    otpStore.set(emailLower, data);

    res.json({ message: "Code verified successfully", verified: true });
  } catch (err) {
    console.error("❌ adminVerifyForgotOtp Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

/* =========================
   ADMIN RESET PASSWORD
========================= */
exports.adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const emailLower = email?.toLowerCase().trim();
    const data = otpStore.get(emailLower);

    if (!data) return res.status(400).json({ error: "No reset code found. Please restart the process." });
    if (!data.verified) return res.status(400).json({ error: "OTP not yet verified" });
    if (Date.now() > data.expiresAt) {
      otpStore.delete(emailLower);
      return res.status(400).json({ error: "Reset code expired" });
    }
    if (data.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: "Password must be 8+ characters with uppercase, lowercase & numbers" });
    }

    const identified = await findUserByEmail(emailLower);
    if (!identified) return res.status(404).json({ error: "Admin account not found" });
    if (identified.role !== "admin") return res.status(403).json({ error: "Not an admin account" });

    const { user } = identified;
    user.password = newPassword; // Mongoose pre-save hook will handle hashing
    await user.save();

    otpStore.delete(emailLower);
    logger.info(`Admin password reset for: ${logger.maskEmail(emailLower)}`);
    res.json({ message: "Admin password reset successfully" });
  } catch (err) {
    logger.error("adminResetPassword Error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

exports.verifyForgotOtp = async (req, res) => {
  const { email, otp } = req.body;
  const emailLower = email?.toLowerCase().trim();
  const data = otpStore.get(emailLower);

  if (!data) return res.status(400).json({ error: "No OTP found" });

  const isOtpMatch = data.otp.toString() === otp.toString();
  const isExpired = Date.now() > data.expiresAt;

  if (!isOtpMatch) return res.status(400).json({ error: "Invalid OTP" });
  if (isExpired) return res.status(400).json({ error: "OTP expired" });

  res.json({ message: "Verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const emailLower = normalizeEmail(email);

  const data = otpStore.get(emailLower);

  if (!data) return res.status(400).json({ error: "No OTP found" });

  const isOtpMatch = data.otp.toString() === otp.toString();
  const isExpired = Date.now() > data.expiresAt;

  if (!isOtpMatch) return res.status(400).json({ error: "Invalid OTP" });
  if (isExpired) {
    otpStore.delete(emailLower);
    return res.status(400).json({ error: "OTP expired" });
  }

  // Password strength validation (minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: "Password must be 8+ characters with uppercase, lowercase & numbers" });
  }

  // Find the user first to identify the correct collection
  const identified = await findUserByEmail(emailLower);
  if (!identified) {
    return res.status(404).json({ error: "User no longer exists" });
  }

  // Update ONLY the identified collection
  const { user } = identified;
  user.password = newPassword; // Mongoose pre-save hook will handle hashing
  await user.save();

  otpStore.delete(emailLower);
  res.json({ message: "Password reset" });
};

/* =========================
   CREATE BASIC ACCOUNT
   For non-registered users booking their first session
========================= */
exports.createBasicAccount = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: "Email and phone are required" });
    }

    const emailLower = email.toLowerCase().trim();
    const phoneClean = phone.trim();

    const existing = await findUserByEmail(emailLower);
    const existingMobile = await findUserByMobile(phoneClean);

    if (existing || existingMobile) {
      return res.status(409).json({
        code: "LOGIN_REQUIRED",
        error: "An account already exists with this email or phone number. Please log in instead."
      });
    }

    const { getBookingOtpStore } = require("../utils/otpStore");
    const bookingOtpStore = getBookingOtpStore();
    const otpData = bookingOtpStore.get(phoneClean);

    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        error: "Mobile number not verified. Please verify your phone number first."
      });
    }

    bookingOtpStore.delete(phoneClean);

    const randomPassword = crypto.randomBytes(12).toString("base64").slice(0, 16);

    const newStudent = new Student({
      name: name || "Guest User",
      email: emailLower,
      mobile: phoneClean,
      password: randomPassword,
      role: "student",
      profile: {
        isVerified: true,
        isPremium: false,
        isBasicAccount: true,
        hasUsedFreeBooking: false
      }
    });

    await newStudent.save();

    const token = generateToken(newStudent._id, "student");

    logger.info(`Basic account created for: ${logger.maskEmail(emailLower)}`);

    res.status(201).json({
      message: "Basic account created successfully",
      token,
      user: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        mobile: newStudent.mobile,
        role: "student",
        isBasicAccount: true,
        hasUsedFreeBooking: false,
        profileImage: null
      },
      isNewUser: true
    });
  } catch (err) {
    logger.error("createBasicAccount Error:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
};

/* =========================
   SEND OTP FOR PASSWORDLESS LOGIN
   POST /api/auth/send-login-otp
========================= */
exports.sendLoginOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const { toE164 } = require("../middleware/rateLimiter");
    const standardizedPhone = toE164(mobile);

    // Find the user by mobile across all collections
    const identified = await findUserByMobile(standardizedPhone);
    if (!identified) {
      return res.status(404).json({
        error: "Phone number not registered. Please book a session or register first."
      });
    }

    const { user } = identified;

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save to database user document
    user.loginOtp = otp;
    user.loginOtpExpiresAt = expiresAt;
    user.loginOtpAttempts = 0;
    await user.save();

    logger.info(`Generated Login OTP for user: ${logger.maskOtp(otp)}`);

    // Dispatch SMS using sendSMSOTP
    const smsResult = await sendSMSOTP(standardizedPhone, otp);
    if (!smsResult.success) {
      console.error(`❌ Failed to send SMS to ${standardizedPhone}: ${smsResult.message}`);
    }

    res.json({
      message: "Verification code sent to your mobile successfully",
      expiresIn: 600
    });
  } catch (err) {
    console.error("❌ sendLoginOtp Error:", err);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

/* =========================
   VERIFY OTP FOR PASSWORDLESS LOGIN
   POST /api/auth/verify-login-otp
========================= */
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP are required" });
    }

    const { toE164 } = require("../middleware/rateLimiter");
    const standardizedPhone = toE164(mobile);

    const identified = await findUserByMobile(standardizedPhone);
    if (!identified) {
      return res.status(404).json({ error: "User not found" });
    }

    const { user, role } = identified;

    // Brute-force protection: check attempts
    if (user.loginOtpAttempts >= 3) {
      // Invalidate the code
      user.loginOtp = null;
      user.loginOtpExpiresAt = null;
      await user.save();
      return res.status(400).json({
        error: "Too many invalid attempts. Your OTP has been invalidated. Please request a new OTP."
      });
    }

    // Verify OTP and expiry
    if (!user.loginOtp) {
      return res.status(400).json({ error: "No active OTP found. Please request a new code." });
    }

    if (new Date() > user.loginOtpExpiresAt) {
      user.loginOtp = null;
      user.loginOtpExpiresAt = null;
      user.loginOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: "OTP has expired. Please request a new code." });
    }

    if (user.loginOtp.toString() !== otp.toString()) {
      user.loginOtpAttempts += 1;
      await user.save();

      const remaining = 3 - user.loginOtpAttempts;
      if (remaining <= 0) {
        // Invalidate immediately
        user.loginOtp = null;
        user.loginOtpExpiresAt = null;
        await user.save();
        return res.status(400).json({
          error: "Too many invalid attempts. Your OTP has been invalidated. Please request a new OTP."
        });
      }

      return res.status(400).json({
        error: `Invalid OTP. You have ${remaining} attempts remaining.`
      });
    }

    // OTP matches! Clear OTP state
    user.loginOtp = null;
    user.loginOtpExpiresAt = null;
    user.loginOtpAttempts = 0;
    await user.save();

    // Standard login response payload
    const profile = user.profile || {};
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role,
      isVerified: user.isVerified === true || (user.profile && user.profile.isVerified === true) || false,
      mobile: user.mobile,
      profileImage: (user.profile && user.profile.profileImage) || user.image || null,
      isPremium: (user.profile && user.profile.isPremium) || user.isPremium || false,
      isBasicAccount: (user.profile && user.profile.isBasicAccount) || false,
      hasUsedFreeBooking: (user.profile && user.profile.hasUsedFreeBooking) || false
    };

    if (role === 'consultant') {
      userData.videoCallEnabled = user.videoCallEnabled || false;
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id, role),
      user: userData
    });
  } catch (err) {
    console.error("❌ verifyLoginOtp Error:", err);
    res.status(500).json({ error: "Server error during verification" });
  }
};


