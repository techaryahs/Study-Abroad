const { findUserById, findUserByEmail } = require("../utils/userHelper");

// @desc    Get user premium status
exports.getPremiumStatus = async (req, res) => {
  try {
    const result = await findUserById(req.user.id);
    if (!result) return res.status(404).json({ message: 'User not found' });

    const { user, role } = result;
    const profile = user.profile || user; // Consultants have flat fields

    res.json({
      isPremium: profile.isPremium || false,
      premiumPlan: profile.premiumPlan || null,
      premiumStartAt: profile.premiumStartAt || null,
      premiumExpiresAt: profile.premiumExpiresAt || null,
    });
  } catch (error) {
    console.error("Premium status error:", error);
    res.status(500).json({ message: 'Server error fetching premium status' });
  }
};

// @desc    Poll premium status (checks payment)
exports.pollPremiumStatus = async (req, res) => {
  try {
    const result = await findUserById(req.user.id);
    if (!result) return res.status(404).json({ message: 'User not found' });

    const { user } = result;
    const profile = user.profile || user;

    res.json({
      isPremium: profile.isPremium || false,
      receiptStatus: profile.receiptStatus || "none"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error polling premium status' });
  }
};

// @desc    Activate premium (Dev only)
exports.activatePremium = async (req, res) => {
  try {
    const result = await findUserById(req.user.id);
    if (!result) return res.status(404).json({ message: 'User not found' });

    const { user } = result;
    
    // For Consultants, update at top level. For others, inside profile.
    if (user.profile) {
      user.profile.isPremium = true;
      user.profile.premiumPlan = 'lifetime-dev';
      user.profile.premiumStartAt = new Date();
    } else {
      user.isPremium = true;
      user.price = 0; // Just an example
    }
    
    await user.save();
    res.json({ message: "Premium activated successfully for testing" });
  } catch (error) {
    res.status(500).json({ message: "Server error activating premium" });
  }
};

// @desc    Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await findUserByEmail(email, email.toLowerCase());

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const { user } = result;
    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, user: userData });
  } catch (err) {
    console.error("Fetch user by email error:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, mobile, bio, location, portfolio } = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    let result = null;
    if (req.user && req.user.id) {
      result = await findUserById(req.user.id);
    } else if (email) {
      result = await findUserByEmail(email, email.toLowerCase());
    }

    if (!result) return res.status(404).json({ message: "User not found" });

    const { user, role } = result;

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (req.body.country) user.country = req.body.country;
    if (req.body.state) user.state = req.body.state;

    if (role === "consultant") {
      if (bio) user.bio = bio;
      if (location) user.country = location;
      if (imagePath) user.image = imagePath;
    } else {
      if (!user.profile) user.profile = {};
      if (bio) user.profile.bio = bio;
      if (location) user.profile.location = location;
      if (portfolio) user.profile.portfolio = portfolio;
      if (imagePath) user.profile.profileImage = imagePath;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

