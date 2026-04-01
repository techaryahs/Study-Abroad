const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Consultant = require("../models/Consultant");


const otpStore = new Map();

/* =========================
   REGISTER STUDENT (Base User)
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, dob, gender, country, state } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 🔍 2️⃣ Check if Email is Verified in otpStore
    const storedData = otpStore.get(normalizedEmail);
    if (!storedData || !storedData.verified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email before registering." });
    }

    // 👤 Create user
    const newUser = new User({
      name,
      email: normalizedEmail,
      mobile,
      password: password, // Pre-save hook will hash
      dob,
      gender,
      country,
      state,
      role: "student",
      profile: {
        isPremium: false,
        isVerified: true // ✅ Marked as verified since we checked otpStore
      }
    });

    await newUser.save();

    // 🔢 3️⃣ Cleanup otpStore
    otpStore.delete(normalizedEmail);

    console.log(`✅ Student Registered Successfully: ${normalizedEmail}`);

    // 4️⃣ Send Success Response
    res.status(201).json({ 
      message: "Student registered successfully. Welcome aboard!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
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
    const normalizedEmail = email.toLowerCase().trim();

    // 1️⃣ Check if already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered. Please log in." });
    }

    // 2️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(normalizedEmail, { otp, expiresAt, verified: false });

    console.log(`📌 OTP for Signup (${normalizedEmail}): ${otp}`);

    // 3️⃣ Send Email
    await sendEmail(
      normalizedEmail,
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
    const normalizedEmail = email?.toLowerCase().trim();
    const storedData = otpStore.get(normalizedEmail);

    if (!storedData) {
      return res.status(400).json({ error: "Verification record not found. Please try again." });
    }

    if (storedData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ error: "Verification code has expired" });
    }

    // ✅ Mark as verified
    storedData.verified = true;
    otpStore.set(normalizedEmail, storedData);

    res.json({ message: "Email verified successfully", verified: true });
  } catch (err) {
    console.error("❌ verifyOtpSignup Error:", err);
    res.status(500).json({ error: "Verification failed" });
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
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1️⃣ FIND USER and populate nested Linked profiles
    const user = await User.findOne({ email }).populate('profile.consultantProfile');

    // Use the model method matchPassword
    if (user && (await user.matchPassword(password))) {

      await user.save();

      const profile = user.profile || {};

      res.json({
        message: "Login successful",
        token: generateToken(user._id, user.role),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: profile.isVerified || false,
          mobile: user.mobile,
          profileImage: profile.profileImage || profile.consultantProfile?.image || null,
          isPremium: profile.isPremium || false
        }
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
    const user = await User.findById(req.user.id).select("-password").populate('profile.consultantProfile');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Safety fallback
    if (!user.profile) {
      user.profile = {};
      await user.save();
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

    // 1️⃣ HANDLE MULTIPART (FormData) PARSING
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (typeof availability === 'string') {
      try {
        availability = JSON.parse(availability);
      } catch (e) {
        console.warn("⚠️ Failed to parse availability string, keeping as is:", e.message);
      }
    }

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password || !name) {
      return res.status(400).json({ error: "Missing required basic fields (name, email, password)" });
    }

    // 2️⃣ CHECK UNIQUE EMAIL
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newConsultant = new Consultant({
      name,
      email: normalizedEmail,
      role: consultantRole,
      expertise,
      experience,
      bio,
      image,
      availability: availability || [], // Now array of objects {day, startTime, endTime}
      bookings: []
    });

    // 3️⃣ CREATE USER (Role: consultant)
    const newUser = new User({
      name,
      email: normalizedEmail,
      mobile: '0000000000', // Placeholder
      password: password,
      role: "consultant",
      profile: {
        isPremium: true,
        isVerified: false,
        consultantProfile: newConsultant._id
      }
    });
    await newUser.save();

    // 4️⃣ SAVE CONSULTANT
    newConsultant.user = newUser._id;
    await newConsultant.save();

    // 7️⃣ GENERATE & SEND OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(normalizedEmail, { otp, expiresAt });

    console.log("📌 Generated OTP for Consultant:", otp);

    const emailHtml = `
        <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Hello ${name}, 👋</h2>
        <p>Thank you for registering as a Consultant on <b>CareerGenAI</b>.</p>
        <p>Your OTP is: <b style="font-size:24px;color:#1e40af;">${otp}</b></p>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
        `;

    await sendEmail(normalizedEmail, "Verify Consultant Account - CareerGenAI", "", emailHtml);

    res.status(201).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      email: normalizedEmail
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

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    // Validate Student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create Parent User
    const parent = new User({
      name: parentName,
      email,
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
    otpStore.set(email, { otp, expiresAt });

    await sendEmail(email, "Verify Parent Account", "", `<p>OTP: ${otp}</p><p>Valid for 10 mins.</p>`);

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
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 600000 });

  await sendEmail(email, "Reset Password", "", `<p>OTP: ${otp}</p>`);
  res.json({ message: "OTP sent" });
};

exports.verifyForgotOtp = async (req, res) => {
  const { email, otp } = req.body;
  const data = otpStore.get(email);

  if (!data) return res.status(400).json({ error: "No OTP found" });

  const isOtpMatch = data.otp.toString() === otp.toString();
  const isExpired = Date.now() > data.expiresAt;

  if (!isOtpMatch) return res.status(400).json({ error: "Invalid OTP" });
  if (isExpired) return res.status(400).json({ error: "OTP expired" });

  res.json({ message: "Verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const data = otpStore.get(email);

  if (!data) return res.status(400).json({ error: "No OTP found" });

  const isOtpMatch = data.otp.toString() === otp.toString();
  const isExpired = Date.now() > data.expiresAt;

  if (!isOtpMatch) return res.status(400).json({ error: "Invalid OTP" });
  if (isExpired) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  otpStore.delete(email);
  res.json({ message: "Password reset" });
};
