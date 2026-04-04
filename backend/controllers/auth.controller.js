const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");
const { getEmailSearchRegex } = require("../utils/emailUtils");
const { findUserByEmail } = require("../utils/userHelper");


const otpStore = new Map();
// Normalization now handled via regex in lookups, we keep the original for display.

/* =========================
   REGISTER STUDENT (Base User)
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, dob, gender, country, state, profile: profileInput } = req.body;
    const emailLower = email.toLowerCase().trim();
    // 🔍 1. Check if Email is Verified in otpStore
    const storedData = otpStore.get(emailLower);
    if (!storedData || !storedData.verified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email before registering." });
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

    console.log("🛠️ Building Student Profile Data:", JSON.stringify(profileData, null, 2));

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
    console.log(`✅ Student Saved with ${targetUniversities.length} target universities.`);

    // 🔢 3️⃣ Cleanup otpStore
    otpStore.delete(emailLower);

    console.log(`✅ Student Registered Successfully: ${emailLower}`);

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

    console.log(`📌 OTP for Signup (${emailLower}): ${otp}`);

    // 3️⃣ Send Email
    await sendEmail(
      emailLower,
      "Verify Your Email - StudyAbroad",
      "",
      `<div style="font-family:serif;padding:30px;background:#090909;color:white;border-radius:20px;">
         <h2 style="color:#EAB308;font-style:italic;font-size:24px;">Confirm Your Identity</h2>
         <p style="color:#9ca3af;">Use the code below to verify your email for StudyAbroad.</p>
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
        isVerified: profile.isVerified || user.isVerified || false,
        mobile: user.mobile,
        profileImage: profile.profileImage || user.image || null,
        isPremium: profile.isPremium || user.isPremium || false
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
    let user;
    if (req.user.role === "student") {
      user = await Student.findById(req.user.id).select("-password");
    } else if (req.user.role === "consultant") {
      user = await Consultant.findById(req.user.id).select("-password");
    } else {
      user = await User.findById(req.user.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
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
    console.log("📌 Incoming Consultant Registration Payload:", req.body);
    console.log("📌 Incoming File Data:", req.file);

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

    const emailLower = email?.toLowerCase().trim();
    const normalizedEmail = normalizeEmail(emailLower);

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
    console.log(`✅ Consultant Registered Successfully: ${emailLower}`);

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
  const emailLower = email?.toLowerCase().trim();
  const normalizedEmail = normalizeEmail(emailLower);

  const data = otpStore.get(emailLower);

  if (!data) return res.status(400).json({ error: "No OTP found" });

  const isOtpMatch = data.otp.toString() === otp.toString();
  const isExpired = Date.now() > data.expiresAt;

  if (!isOtpMatch) return res.status(400).json({ error: "Invalid OTP" });
  if (isExpired) {
    otpStore.delete(emailLower);
    return res.status(400).json({ error: "OTP expired" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Find the user first to identify the correct collection
  const identified = await findUserByEmail(emailLower);
  if (!identified) {
    return res.status(404).json({ error: "User no longer exists" });
  }

  // Update ONLY the identified collection
  const { user, model } = identified;
  user.password = hashedPassword;
  await user.save();

  otpStore.delete(emailLower);
  res.json({ message: "Password reset" });
};


