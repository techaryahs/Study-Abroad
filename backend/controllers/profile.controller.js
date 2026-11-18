const { findUserById } = require("../utils/userHelper");
const Student = require("../models/Student");
const fs = require("fs");
const mongoose = require("mongoose");

const saveToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!mongoose.connection || !mongoose.connection.db) {
      if (fs.existsSync(file.path)) {
        try { fs.unlinkSync(file.path); } catch (_) {}
      }
      return reject(new Error("Database connection is not ready for GridFS operations"));
    }
    const { GridFSBucket } = mongoose.mongo;
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'student_documents' });
    const readStream = fs.createReadStream(file.path);
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: { originalName: file.originalname, size: file.size, uploadedAt: new Date() }
    });
    readStream.pipe(uploadStream)
      .on('error', (err) => {
        if (fs.existsSync(file.path)) {
          try { fs.unlinkSync(file.path); } catch (_) {}
        }
        reject(err);
      })
      .on('finish', () => {
        if (fs.existsSync(file.path)) {
          try { fs.unlinkSync(file.path); } catch (_) {}
        }
        resolve(uploadStream.id);
      });
  });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(400).json({ message: "No user ID provided" });

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });

    const { user } = result;

    // Ensure all nested array items have an _id (important for User schema where they are Mixed)
    let profileModified = false;
    if (user.profile) {
      const mongoose = require("mongoose");
      const validSections = [
        "highSchool", "underGrad", "masters", "testScores", "workExperience",
        "research", "projects", "volunteering", "targetUniversities", "achievements", "documents"
      ];
      for (const section of validSections) {
        if (Array.isArray(user.profile[section])) {
          for (let i = 0; i < user.profile[section].length; i++) {
            if (!user.profile[section][i]._id) {
              user.profile[section][i]._id = new mongoose.Types.ObjectId();
              profileModified = true;
            }
          }
        }
      }
      if (profileModified) {
        user.markModified('profile');
        await user.save();
      }

      // Populate bookings/sessions if available in schema
      await user.populate([
        { path: "profile.myBookings", strictPopulate: false },
        { path: "profile.mySessions", strictPopulate: false }
      ]);
    }

    if (typeof res.set === 'function') {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    }

    // Safely format response, ensuring email is present and stripping sensitive fields
    const sanitizedUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.loginOtp;
    delete sanitizedUser.pendingEmailOtp;
    if (!sanitizedUser.email && user.email) {
      sanitizedUser.email = user.email;
    }
    sanitizedUser.pendingEmail = user.pendingEmail || null;

    res.json(sanitizedUser);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    // Authorization check: users can only update their own profile unless admin
    if (req.user && String(req.user.id || req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to modify another user's profile." });
    }

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ error: "User not found" });

    const { user } = result;
    const { name, mobile, email, gender, dob, country, state, location, profile } = req.body;
    
    // Ensure profile object exists for non-consultants
    if (!user.profile && result.role !== "consultant") {
      user.profile = {};
    }

    // Handle image upload (supports req.files from upload.fields or fallback req.file)
    const imageFile = req.files?.['profileImage']?.[0] || req.file;
    if (imageFile) {
      try {
        const fileData = fs.readFileSync(imageFile.path);
        const base64Image = `data:${imageFile.mimetype};base64,${fileData.toString('base64')}`;
        if (user.profile) {
          user.profile.profileImage = base64Image;
        } else {
          user.profileImage = base64Image; // Fallback
        }
        if (fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
      } catch (uploadError) {
        console.error("Error processing image:", uploadError);
      }
    }

    // Handle resume document upload
    const resumeFile = req.files?.['resume']?.[0];
    if (resumeFile) {
      try {
        const gridFsId = await saveToGridFS(resumeFile);
        const fileUrl = `/api/user/document/${gridFsId}`;
        const fileName = resumeFile.originalname;
        if (user.profile) {
          user.profile.resumeUrl = fileUrl;
          user.profile.resumeName = fileName;
          user.profile.resume = fileUrl; // Backwards compatibility
        } else {
          user.resumeUrl = fileUrl;
          user.resumeName = fileName;
        }
      } catch (resumeError) {
        console.error("Error processing resume to GridFS:", resumeError);
      }
    }

    // Handle resume deletion
    if (req.body.deleteResume === true || req.body.deleteResume === 'true') {
      if (user.profile) {
        user.profile.resumeUrl = null;
        user.profile.resumeName = null;
        user.profile.resume = null;
      } else {
        user.resumeUrl = null;
        user.resumeName = null;
      }
    }

    // 1. Full Name Validation & Update
    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return res.status(400).json({ error: "Full Name cannot be empty." });
      }
      user.name = trimmedName;
    }

    // 2. Email Address Editing & Verification Initiation
    let emailVerificationInitiated = false;
    let pendingEmailTarget = null;

    if (email !== undefined) {
      const normalizedNewEmail = String(email).toLowerCase().trim();
      const currentEmail = (user.email || "").toLowerCase().trim();

      if (normalizedNewEmail && normalizedNewEmail !== currentEmail) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedNewEmail)) {
          return res.status(400).json({ error: "Please enter a valid email address." });
        }

        // Check cross-collection email uniqueness
        const { findUserByEmail } = require("../utils/userHelper");
        const existingAccount = await findUserByEmail(normalizedNewEmail);
        if (existingAccount && String(existingAccount.user._id) !== String(user._id)) {
          return res.status(409).json({ error: "This email address is already registered to another account." });
        }

        // Generate secure 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.pendingEmail = normalizedNewEmail;
        user.pendingEmailOtp = otp;
        user.pendingEmailExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.pendingEmailAttempts = 0;

        const sendEmail = require("../utils/sendEmail");
        const logger = require("../utils/logger");
        logger.info(`Generated Email Change OTP for ${logger.maskEmail(normalizedNewEmail)}: ${logger.maskOtp(otp)}`);

        try {
          await sendEmail(
            normalizedNewEmail,
            "Verify Your New Email - EduLeaderGlobal",
            `Your email verification code is: ${otp}`,
            `<div style="font-family:serif;max-width:550px;margin:0 auto;padding:32px;background:#090909;color:#ffffff;border-radius:18px;border:1px solid rgba(197,160,89,0.3);">
              <h2 style="color:#C5A059;font-size:24px;margin-bottom:12px;font-style:italic;">Verify Your Email Address</h2>
              <p style="color:#a8a29e;font-size:14px;line-height:1.6;">You requested to update your email for EduLeaderGlobal to <strong>${normalizedNewEmail}</strong>.</p>
              <p style="color:#a8a29e;font-size:14px;line-height:1.6;">Use the verification code below to confirm this change:</p>
              <div style="background:#1a1a1a;color:#C5A059;padding:22px;text-align:center;font-size:34px;letter-spacing:12px;font-weight:900;border-radius:14px;margin:24px 0;border:1px solid rgba(197,160,89,0.25);">
                ${otp}
              </div>
              <p style="font-size:12px;color:#78716c;margin-top:20px;">This code will expire in 10 minutes. Your current email remains unchanged until verification is complete.</p>
            </div>`
          );
          emailVerificationInitiated = true;
          pendingEmailTarget = normalizedNewEmail;
        } catch (mailErr) {
          console.error("❌ Failed to send verification email:", mailErr);
          return res.status(500).json({ error: "Failed to dispatch verification email. Please check the email address and try again." });
        }
      } else if (!normalizedNewEmail && user.email) {
        return res.status(400).json({ error: "Email address cannot be empty." });
      }
    }
    if (mobile) user.mobile = mobile;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (country) user.country = country;
    if (state !== undefined) user.state = state;
    if (location !== undefined) user.location = location;

    // Profile sub-object updates
    if (user.profile) {
      if (req.body.bio !== undefined) user.profile.bio = req.body.bio;
      if (req.body.portfolio !== undefined) user.profile.portfolio = req.body.portfolio;
      if (req.body.linkedin !== undefined) user.profile.linkedin = req.body.linkedin;
      if (req.body.website !== undefined) user.profile.website = req.body.website;
      if (req.body.location !== undefined) {
        user.profile.location = req.body.location;
        user.location = req.body.location;
      }
      if (req.body.isPublic !== undefined) user.profile.isPublic = req.body.isPublic;

      // Handle nested profile data if passed as object
      if (profile) {
        const pData = typeof profile === 'string' ? JSON.parse(profile) : profile;
        const arraySections = [
          "highSchool", "underGrad", "masters", "testScores", "workExperience",
          "research", "projects", "volunteering", "targetUniversities", "achievements", "documents"
        ];

        Object.keys(pData).forEach(key => {
          if (arraySections.includes(key) && Array.isArray(pData[key])) {
            const existingArray = Array.isArray(user.profile[key]) ? user.profile[key] : [];
            user.profile[key] = pData[key].map((incomingItem, idx) => {
              if (!incomingItem || typeof incomingItem !== 'object') return incomingItem;

              let existingMatch = null;
              if (incomingItem._id) {
                existingMatch = existingArray.find(e => e && e._id && e._id.toString() === incomingItem._id.toString());
              }
              if (!existingMatch && existingArray[idx]) {
                existingMatch = existingArray[idx];
              }

              if (existingMatch) {
                const existingObj = existingMatch.toObject ? existingMatch.toObject() : existingMatch;
                return {
                  ...existingObj,
                  ...incomingItem,
                  documentUrl: (incomingItem.documentUrl !== undefined && incomingItem.documentUrl !== '')
                    ? incomingItem.documentUrl
                    : (existingObj.documentUrl || ''),
                  documentName: (incomingItem.documentName !== undefined && incomingItem.documentName !== '')
                    ? incomingItem.documentName
                    : (existingObj.documentName || ''),
                  fileType: (incomingItem.fileType !== undefined && incomingItem.fileType !== '')
                    ? incomingItem.fileType
                    : (existingObj.fileType || ''),
                  size: incomingItem.size !== undefined ? incomingItem.size : existingObj.size,
                };
              }
              return incomingItem;
            });
          } else {
            user.profile[key] = pData[key];
          }
        });

        if (pData.location !== undefined) {
          user.profile.location = pData.location;
          user.location = pData.location;
        }
      }
      user.markModified('profile');
    } else {
      // Flat profile (Consultants)
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
      if (req.body.location !== undefined) {
        user.location = req.body.location;
        user.country = req.body.location;
      }
    }

    await user.save();

    const sanitizedUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.loginOtp;
    delete sanitizedUser.pendingEmailOtp;
    sanitizedUser.pendingEmail = user.pendingEmail || null;

    res.json({
      message: emailVerificationInitiated
        ? "Profile saved! A verification code has been sent to your new email."
        : "Profile updated successfully",
      user: sanitizedUser,
      emailVerificationPending: emailVerificationInitiated,
      pendingEmail: pendingEmailTarget
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error updating profile" });
  }
};

/**
 * Verifies email change OTP and commits the new email to the account.
 */
exports.verifyEmailChange = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    // Authorization check
    if (req.user && String(req.user.id || req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ error: "User not found" });

    const { user } = result;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "Verification code is required." });
    }

    if (!user.pendingEmail || !user.pendingEmailOtp) {
      return res.status(400).json({ error: "No pending email verification request found." });
    }

    // Brute force protection
    if (user.pendingEmailAttempts >= 5) {
      user.pendingEmail = null;
      user.pendingEmailOtp = null;
      user.pendingEmailExpiresAt = null;
      user.pendingEmailAttempts = 0;
      await user.save();
      return res.status(400).json({ error: "Too many invalid attempts. Email update request cancelled." });
    }

    // Check expiration
    if (new Date() > user.pendingEmailExpiresAt) {
      user.pendingEmail = null;
      user.pendingEmailOtp = null;
      user.pendingEmailExpiresAt = null;
      user.pendingEmailAttempts = 0;
      await user.save();
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }

    if (String(user.pendingEmailOtp).trim() !== String(otp).trim()) {
      user.pendingEmailAttempts = (user.pendingEmailAttempts || 0) + 1;
      await user.save();
      const remaining = 5 - user.pendingEmailAttempts;
      return res.status(400).json({ error: `Invalid verification code. ${remaining} attempts remaining.` });
    }

    // Re-verify uniqueness
    const { findUserByEmail } = require("../utils/userHelper");
    const existingAccount = await findUserByEmail(user.pendingEmail);
    if (existingAccount && String(existingAccount.user._id) !== String(user._id)) {
      user.pendingEmail = null;
      user.pendingEmailOtp = null;
      user.pendingEmailExpiresAt = null;
      user.pendingEmailAttempts = 0;
      await user.save();
      return res.status(409).json({ error: "This email address was registered by another user in the interim." });
    }

    // Commit new email
    user.email = user.pendingEmail;
    user.isEmailVerified = true;
    if (user.profile) {
      user.profile.isVerified = true;
    }
    user.pendingEmail = null;
    user.pendingEmailOtp = null;
    user.pendingEmailExpiresAt = null;
    user.pendingEmailAttempts = 0;

    await user.save();

    const sanitizedUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.loginOtp;
    delete sanitizedUser.pendingEmailOtp;
    sanitizedUser.pendingEmail = null;

    res.json({
      message: "Email address updated and verified successfully!",
      user: sanitizedUser
    });
  } catch (err) {
    console.error("❌ verifyEmailChange Error:", err);
    res.status(500).json({ error: "Server error verifying email code" });
  }
};

/**
 * Resends verification OTP to the user's pending email.
 */
exports.resendEmailOtp = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    if (req.user && String(req.user.id || req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ error: "User not found" });

    const { user } = result;
    if (!user.pendingEmail) {
      return res.status(400).json({ error: "No pending email change request found to resend code for." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.pendingEmailOtp = otp;
    user.pendingEmailExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.pendingEmailAttempts = 0;
    await user.save();

    const sendEmail = require("../utils/sendEmail");
    const logger = require("../utils/logger");
    logger.info(`Resent Email Change OTP for ${logger.maskEmail(user.pendingEmail)}: ${logger.maskOtp(otp)}`);

    try {
      await sendEmail(
        user.pendingEmail,
        "Verify Your New Email - EduLeaderGlobal",
        `Your verification code is: ${otp}`,
        `<div style="font-family:serif;max-width:550px;margin:0 auto;padding:32px;background:#090909;color:#ffffff;border-radius:18px;">
          <h2 style="color:#C5A059;font-size:24px;margin-bottom:12px;">Confirm Your Email Update</h2>
          <p style="color:#a8a29e;font-size:14px;">Your new verification code is:</p>
          <div style="background:#1a1a1a;color:#C5A059;padding:22px;text-align:center;font-size:34px;letter-spacing:12px;font-weight:900;border-radius:14px;margin:24px 0;">
            ${otp}
          </div>
          <p style="font-size:12px;color:#78716c;">This code expires in 10 minutes.</p>
        </div>`
      );
      res.json({ message: `Verification code resent to ${user.pendingEmail}` });
    } catch (mailErr) {
      console.error("❌ Failed to resend email:", mailErr);
      res.status(500).json({ error: "Failed to dispatch email. Please try again." });
    }
  } catch (err) {
    console.error("❌ resendEmailOtp Error:", err);
    res.status(500).json({ error: "Server error resending email verification code" });
  }
};

/**
 * Cancels a pending email change.
 */
exports.cancelEmailChange = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    if (req.user && String(req.user.id || req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ error: "User not found" });

    const { user } = result;
    user.pendingEmail = null;
    user.pendingEmailOtp = null;
    user.pendingEmailExpiresAt = null;
    user.pendingEmailAttempts = 0;
    await user.save();

    const sanitizedUser = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.loginOtp;
    delete sanitizedUser.pendingEmailOtp;
    sanitizedUser.pendingEmail = null;

    res.json({ message: "Email change request cancelled.", user: sanitizedUser });
  } catch (err) {
    console.error("❌ cancelEmailChange Error:", err);
    res.status(500).json({ error: "Server error cancelling email change" });
  }
};

exports.addProfileItem = async (req, res) => {
  try {
    const { section, data } = req.body;
    const userId = req.params.userId || (req.user ? req.user.id : null);

    console.log(`📥 Adding profile item - Section: ${section}, UserId: ${userId}`);
    console.log("📦 Data received:", JSON.stringify(data, null, 2));

    if (!userId) return res.status(401).json({ message: "Authentication required" });
    if (!section || !data) {
      console.error("❌ Missing section or data");
      return res.status(400).json({ message: "Missing section or data" });
    }

    const validSections = [
      "highSchool", "underGrad", "masters", "testScores", "workExperience",
      "research", "projects", "volunteering", "targetUniversities", "achievements", "documents"
    ];

    if (!validSections.includes(section)) {
      console.error(`❌ Invalid section: ${section}`);
      return res.status(400).json({ message: "Invalid profile section" });
    }

    const result = await findUserById(userId);
    if (!result) {
      console.error("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const { user } = result;

    if (!user.profile) user.profile = {};
    if (!user.profile[section]) user.profile[section] = [];

    // Ensure _id exists for Mixed schemas
    const mongoose = require("mongoose");
    if (!data._id) {
      data._id = new mongoose.Types.ObjectId();
    }

    // Clean up undefined values (convert to null or remove)
    const cleanedData = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        cleanedData[key] = data[key];
      }
    });

    console.log("🧹 Cleaned data:", JSON.stringify(cleanedData, null, 2));

    user.profile[section].push(cleanedData);
    user.markModified(`profile.${section}`);
    user.markModified('profile');
    await user.save();

    console.log(`✅ ${section} added successfully`);

    res.json({
      message: `${section} added successfully`,
      profile: user.profile
    });
  } catch (err) {
    console.error("❌ Profile add error:", err);
    res.status(500).json({ 
      message: "Server error adding profile section",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.updateProfileItem = async (req, res) => {
  try {
    const { section, itemId, data } = req.body;
    const userId = req.params.userId || (req.user ? req.user.id : null);

    if (!userId) return res.status(401).json({ message: "Authentication required" });
    if (!section || !itemId || !data) return res.status(400).json({ message: "Missing information" });

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });
    const { user } = result;

    if (!user.profile || !user.profile[section]) {
      return res.status(404).json({ message: "Section not found" });
    }

    const itemIndex = user.profile[section].findIndex(item => item._id && item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    const existing = user.profile[section][itemIndex];
    const existingObj = existing && existing.toObject ? existing.toObject() : existing;
    const mergedData = {
      ...existingObj,
      ...data,
      documentUrl: (data.documentUrl !== undefined && data.documentUrl !== '')
        ? data.documentUrl
        : (existingObj.documentUrl || ''),
      documentName: (data.documentName !== undefined && data.documentName !== '')
        ? data.documentName
        : (existingObj.documentName || ''),
      fileType: (data.fileType !== undefined && data.fileType !== '')
        ? data.fileType
        : (existingObj.fileType || ''),
      size: data.size !== undefined ? data.size : existingObj.size,
    };
    if (existing && typeof existing.set === 'function') {
      existing.set(mergedData);
    } else {
      user.profile[section][itemIndex] = mergedData;
    }
    user.markModified(`profile.${section}`);
    user.markModified('profile');
    await user.save();

    res.json({ message: "Item updated successfully", profile: user.profile });
  } catch (err) {
    console.error("Profile item update error:", err);
    res.status(500).json({ message: "Server error updating profile item" });
  }
};

exports.deleteProfileItem = async (req, res) => {
  try {
    const { section, itemId } = req.body;
    const userId = req.params.userId || (req.user ? req.user.id : null);

    if (!userId) return res.status(401).json({ message: "Authentication required" });
    if (!section || !itemId) return res.status(400).json({ message: "Missing section or itemId" });

    const validSections = [
      "highSchool", "underGrad", "masters", "testScores", "workExperience",
      "research", "projects", "volunteering", "targetUniversities", "achievements", "documents"
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({ message: "Invalid profile section" });
    }

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });
    const { user } = result;

    if (!user.profile) user.profile = {};
    if (!Array.isArray(user.profile[section])) user.profile[section] = [];

    // Optional GridFS cleanup if deleting from documents vault
    if (section === 'documents') {
      const itemToDelete = user.profile.documents.find(
        item => item._id && item._id.toString() === itemId.toString()
      );
      if (itemToDelete && itemToDelete.documentUrl && itemToDelete.documentUrl.startsWith('/api/user/document/')) {
        const fileId = itemToDelete.documentUrl.split('/').pop();
        if (mongoose.Types.ObjectId.isValid(fileId) && mongoose.connection.db) {
          try {
            const { GridFSBucket } = mongoose.mongo;
            const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'student_documents' });
            await bucket.delete(new mongoose.Types.ObjectId(fileId));
          } catch (bucketErr) {
            console.warn("Could not delete GridFS file:", bucketErr.message);
          }
        }
      }
    }

    user.profile[section] = user.profile[section].filter(
      item => item._id && item._id.toString() !== itemId.toString()
    );
    user.markModified(`profile.${section}`);
    user.markModified('profile');
    await user.save();

    res.json({ message: "Item deleted successfully", profile: user.profile });
  } catch (err) {
    console.error("Profile item deletion error:", err);
    res.status(500).json({ message: "Server error deleting profile item" });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No document file provided" });
    }

    const gridFsId = await saveToGridFS(req.file);
    const fileUrl = `/api/user/document/${gridFsId}`;

    res.json({
      success: true,
      message: "Document stored in MongoDB database successfully",
      fileUrl,
      fileName: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    console.error("❌ Document upload to GridFS error:", err);
    res.status(500).json({ message: "Server error saving document to DB", error: err.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const { GridFSBucket } = mongoose.mongo;
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'student_documents' });
    
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Document not found in database" });
    }

    const file = files[0];
    res.setHeader('Content-Type', file.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.filename)}"`);
    if (file.length) {
      res.setHeader('Content-Length', file.length);
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.on('error', (streamErr) => {
      console.error("GridFS download stream error:", streamErr);
      if (!res.headersSent) res.status(500).json({ message: "Error reading document from DB" });
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving document from DB:", err);
    res.status(500).json({ message: "Server error retrieving document" });
  }
};

