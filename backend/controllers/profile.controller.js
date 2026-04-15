const { findUserById } = require("../utils/userHelper");
const fs = require("fs");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(400).json({ message: "No user ID provided" });

    const result = await findUserById(userId);
    if (!result) return res.status(404).json({ message: "User not found" });

    const { user } = result;
    // Populate bookings/sessions if it's a student (which usually has these)
    if (user.profile && user.profile.populate) {
       await user.populate("profile.myBookings profile.mySessions");
    }

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
    const { name, mobile, email, gender, dob, country, profile } = req.body;
    
    // Ensure profile object exists for non-consultants
    if (!user.profile && result.role !== "consultant") {
      user.profile = {};
    }

    // Handle image upload
    if (req.file) {
      try {
        const fileData = fs.readFileSync(req.file.path);
        const base64Image = `data:${req.file.mimetype};base64,${fileData.toString('base64')}`;
        if (user.profile) {
          user.profile.profileImage = base64Image;
        } else {
          user.profileImage = base64Image; // Fallback
        }
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error processing image:", uploadError);
      }
    }

    // Top-level updates
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (country) user.country = country;

    // Profile sub-object updates
    if (user.profile) {
      if (req.body.bio !== undefined) user.profile.bio = req.body.bio;
      if (req.body.portfolio !== undefined) user.profile.portfolio = req.body.portfolio;
      if (req.body.linkedin !== undefined) user.profile.linkedin = req.body.linkedin;
      if (req.body.isPublic !== undefined) user.profile.isPublic = req.body.isPublic;

      // Handle nested profile data if passed as object
      if (profile) {
        const pData = typeof profile === 'string' ? JSON.parse(profile) : profile;
        Object.keys(pData).forEach(key => {
          user.profile[key] = pData[key];
        });
      }
      user.markModified('profile');
    } else {
      // Flat profile (Consultants)
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
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

    if (!userId) return res.status(401).json({ message: "Authentication required" });
    if (!section || !data) return res.status(400).json({ message: "Missing section or data" });

    const validSections = [
      "highSchool", "underGrad", "masters", "testScores", "workExperience",
      "research", "projects", "volunteering", "targetUniversities"
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({ message: "Invalid profile section" });
    }

    const user = await Student.findById(userId);
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (!user.profile) user.profile = {};
    if (!user.profile[section]) user.profile[section] = [];

    user.profile[section].push(data);
    await user.save();

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

    const user = await Student.findById(userId);
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (!user.profile || !user.profile[section]) {
      return res.status(404).json({ message: "Section not found" });
    }

    const itemIndex = user.profile[section].findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    user.profile[section][itemIndex] = { ...user.profile[section][itemIndex].toObject(), ...data };
    user.markModified(`profile.${section}`);
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

    const user = await Student.findById(userId);
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (!user.profile || !user.profile[section]) {
      return res.status(404).json({ message: "Section not found" });
    }

    user.profile[section] = user.profile[section].filter(item => item._id.toString() !== itemId);
    user.markModified(`profile.${section}`);
    await user.save();

    res.json({ message: "Item deleted successfully", profile: user.profile });
  } catch (err) {
    console.error("Profile item deletion error:", err);
    res.status(500).json({ message: "Server error deleting profile item" });
  }
};

