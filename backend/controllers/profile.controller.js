const { findUserById } = require("../utils/userHelper");
const Student = require("../models/Student");
const fs = require("fs");
const mongoose = require("mongoose");

const saveToGridFS = (file) => {
  return new Promise((resolve, reject) => {
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

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });

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

    // Top-level updates
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;
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
        Object.keys(pData).forEach(key => {
          user.profile[key] = pData[key];
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
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error updating profile" });
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
    if (existing && typeof existing.set === 'function') {
      existing.set(data);
    } else {
      user.profile[section][itemIndex] = { ...(existing && existing.toObject ? existing.toObject() : existing), ...data };
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

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });
    const { user } = result;

    if (!user.profile || !user.profile[section]) {
      return res.status(404).json({ message: "Section not found" });
    }

    user.profile[section] = user.profile[section].filter(item => item._id && item._id.toString() !== itemId);
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

