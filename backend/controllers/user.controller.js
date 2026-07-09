const bcrypt = require("bcryptjs");
const { findUserById, findUserByEmail } = require("../utils/userHelper");
const ProgressReport = require("../models/ProgressReport");
const FeatureActivity = require("../models/featureActivity");
const Activity = require("../models/Activity");
const Receipt = require("../models/Receipt");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// @desc    Get user premium status
exports.getPremiumStatus = async (req, res) => {
  try {
    const result = await findUserById(req.user.id);
    if (!result) return res.status(401).json({ error: 'Invalid session — user no longer exists' });

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

const pricingData = require("../../frontend/data/services-pricing.json");

// @desc    Add to cart (DEPRECATED)
exports.addToCart = async (req, res) => {
  try {
    console.log("==== ADD TO CART ====");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { serviceId, cartData } = req.body;
    if (!serviceId || !cartData) {
      return res.status(400).json({ message: "Service ID and cart data are required" });
    }

    console.log("Finding user...");
    const result = await findUserById(req.user.id);
    if (!result) return res.status(401).json({ error: "Invalid session — user no longer exists" });

    const { user } = result;
    console.log("User found:", user._id);
    await user.save();
    console.log("Current cart:", user.cart);

    // 1. Get snapshot from JSON to supplement frontend data
    const serviceConfig = pricingData[serviceId] || {};

    // 1. PRICE CLEANING
    console.log("Adding item...");
    const numericPrice = parseFloat(cartData.price.toString().replace(/,/g, ""));
    const numericActualPrice = cartData.actualPrice ? parseFloat(cartData.actualPrice.toString().replace(/,/g, "")) : numericPrice / 0.8;
    const requestedQuantity = Math.max(1, parseInt(cartData.quantity, 10) || 1);

    // 2. QUANTITY MERGE
    if (!user.cart) user.cart = [];

    const existingItem = user.cart.find(item => item.serviceId === serviceId || item.itemId === serviceId);

    if (existingItem) {
      existingItem.quantity = Math.max(1, parseInt(existingItem.quantity, 10) || 1) + requestedQuantity;
      existingItem.updatedAt = new Date();

      user.markModified("cart");
      
      console.log("Saving...");
      await user.save();
      console.log("Saved successfully");

      return res.status(200).json({
        success: true,
        message: `${serviceId} quantity updated`,
        cart: user.cart
      });
    }

    // 3. CREATE ITEM SNAPSHOT
    const newItem = {
      itemId: Date.now().toString(36) + Math.random().toString(36).substring(2),
      serviceId,
      ...cartData,
      price: numericPrice,
      actualPrice: numericActualPrice,
      quantity: requestedQuantity,
      addedAt: new Date()
    };

    user.cart.push(newItem);

    // Explicitly mark cart as modified since it's Mixed/Array
    user.markModified('cart');

    console.log("Saving...");
    await user.save();
    console.log("Saved successfully");
    
    res.status(200).json({
      success: true,
      message: `${serviceId} added to cart successfully`,
      cart: user.cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error.message,
        stack: error.stack
      });
    }
  }
};

// @desc    Update cart item quantity (DEPRECATED)
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const parsedQuantity = parseInt(quantity, 10);

    if (!itemId || Number.isNaN(parsedQuantity)) {
      return res.status(400).json({ message: "Item ID and quantity are required" });
    }

    const result = await findUserById(req.user.id);
    if (!result) return res.status(401).json({ error: "Invalid session — user no longer exists" });

    const { user } = result;

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }

    const itemIndex = user.cart.findIndex(item => item.itemId === itemId || item.serviceId === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (parsedQuantity <= 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = parsedQuantity;
      user.cart[itemIndex].updatedAt = new Date();
    }

    user.markModified("cart");
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    res.status(500).json({ message: "Server error updating cart quantity" });
  }
};

// @desc    Get user cart (DEPRECATED)
exports.getCart = async (req, res) => {
  try {
    // console.log("User:", req.user.id);

    const result = await findUserById(req.user.id);

    if (!result) {
      return res.status(401).json({
        error: "Invalid session"
      });
    }

    const { user } = result;

    // console.log("Cart from DB:", JSON.stringify(user.cart, null, 2));

    return res.status(200).json({
      success: true,
      cart: user.cart || []
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error fetching cart"
    });
  }
};

// @desc    Remove item from cart (DEPRECATED)
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const result = await findUserById(req.user.id);
    if (!result) {
      return res.status(401).json({ error: "Invalid session — user no longer exists" });
    }

    const { user } = result;

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }

    // Find item index
    const itemIndex = user.cart.findIndex(item => item.itemId === itemId || item.serviceId === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove item
    user.cart.splice(itemIndex, 1);

    // Important for mongoose
    user.markModified("cart");

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error removing from cart" });
  }
};

exports.clearCart = async (req, res) => {
  console.log("clear cart");
  try {
    const result = await findUserById(req.user.id);
    if (!result) {
      return res.status(401).json({ error: "Invalid session — user no longer exists" });
    }
    const { user } = result;

    user.cart = [];
    user.markModified("cart");

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: []
    });

  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};

// @desc    Change user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1. BASIC VALIDATIONS
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "New password and password confirmation are required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "New password and confirmation do not match" 
      });
    }

    // Password strength validation (minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and numbers" 
      });
    }

    // 2. FETCH USER FROM DB
    const result = await findUserById(req.user.id);
    if (!result) {
      return res.status(401).json({ error: "Invalid session — user no longer exists" });
    }

    const { user } = result;
    const isBasicAccount = user.profile && user.profile.isBasicAccount === true;

    // 3. CURRENT PASSWORD VALIDATION (IF NOT BASIC ACCOUNT)
    if (!isBasicAccount) {
      if (!currentPassword) {
        return res.status(400).json({ 
          success: false,
          message: "Current password is required" 
        });
      }

      const isPasswordValid = await user.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: "Current password is incorrect" 
        });
      }

      // Check if new password is same as old
      const isSameAsOld = await bcrypt.compare(newPassword, user.password);
      if (isSameAsOld) {
        return res.status(400).json({ 
          success: false,
          message: "New password must be different from current password" 
        });
      }
    } else {
      // If basic account, we upgrade them
      user.profile.isBasicAccount = false;
      user.markModified("profile");
    }

    // 4. UPDATE PASSWORD (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error changing password" 
    });
  }
};

// @desc    Delete user account and perform cascading cleanup
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await findUserById(userId);
    if (!result) {
      return res.status(401).json({ error: "Invalid session — user no longer exists" });
    }

    const { user, model, role } = result;
    const email = user.email;

    // 1. Cascading cleanups
    // Delete progress report (for student)
    if (role === "student") {
      await ProgressReport.deleteMany({ userId });
    }

    // Delete feature activity records
    await FeatureActivity.deleteMany({ userId });

    // Delete activity session logs
    await Activity.deleteMany({ userId });

    // Delete receipt payments
    await Receipt.deleteMany({ $or: [{ userId }, { userEmail: email }] });

    // Delete reviews
    if (email) {
      await Review.deleteMany({ email });
    }

    // Delete bookings
    if (role === "consultant") {
      await Booking.deleteMany({ $or: [{ consultantId: userId }, { consultantEmail: email }] });
    } else {
      await Booking.deleteMany({ userEmail: email });
    }

    // 2. Delete the user document itself
    await model.deleteOne({ _id: userId });

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Server error deleting account" });
  }
};

