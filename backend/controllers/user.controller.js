const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { findUserById, findUserByEmail } = require("../utils/userHelper");
const logger = require("../utils/logger");
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

    const { user } = result;
    const profile = user.profile || user; // Consultants have flat fields

    const hasActiveMembership = user.membership && user.membership.planId !== 'free' && user.membership.status === 'active';

    res.json({
      isPremium: hasActiveMembership || profile.isPremium || false,
      premiumPlan: user.membership?.planId || profile.premiumPlan || null,
      premiumStartAt: user.membership?.purchaseDate || profile.premiumStartAt || null,
      premiumExpiresAt: user.membership?.expiryDate || profile.premiumExpiresAt || null,
      membership: user.membership || null,
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

// @desc    Add to cart (legacy cart path)
// Pricing snapshots come from the request payload and/or Membership catalog (MongoDB).
// Backend must never import frontend data files.
exports.addToCart = async (req, res) => {
  try {
    const { serviceId, cartData } = req.body;
    if (!serviceId || !cartData) {
      return res.status(400).json({ message: "Service ID and cart data are required" });
    }

    const result = await findUserById(req.user.id);
    if (!result) return res.status(401).json({ error: "Invalid session — user no longer exists" });

    const { user } = result;

    // PRICE CLEANING — trust numeric values from client cart payload
    // (membership purchases should use MembershipPlan from MongoDB, not a static JSON catalog)
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
      
      await user.save();

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

    await user.save();
    
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

/**
 * Safe JSON response helper — never throws after headers are sent,
 * never leaves the HTTP socket hanging without a status line.
 */
function sendJson(res, status, payload) {
  if (res.headersSent || res.writableEnded) {
    logger.warn("[DeleteAccount] Response already sent — skipping duplicate write", {
      status,
      payloadKeys: payload && Object.keys(payload),
    });
    return;
  }
  return res.status(status).json(payload);
}

/**
 * Run a cleanup step; log failures but never abort the whole deletion.
 * @param {string} label
 * @param {() => Promise<unknown>} fn
 */
async function safeCleanup(label, fn) {
  try {
    await fn();
  } catch (e) {
    logger.warn(`[DeleteAccount] ${label} cleanup warning:`, e && e.message ? e.message : e);
  }
}

// @desc    Delete user account and perform cascading cleanup
// @route   DELETE /api/user/delete-account
// @access  Private
//
// Contract: ALWAYS returns 200 or 4xx/5xx JSON. Never terminates the socket
// without an HTTP status line (that surfaces on Flutter as
// "Connection closed before full header was received").
exports.deleteAccount = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return sendJson(res, 401, {
        success: false,
        error: "Invalid session — missing user identifier",
      });
    }

    const result = await findUserById(userId);
    if (!result || !result.user) {
      // Idempotent: account already gone is a successful delete from the client POV.
      return sendJson(res, 200, {
        success: true,
        message: "Account already deleted",
      });
    }

    const { user, model, role } = result;
    const email = user.email ? String(user.email).trim().toLowerCase() : null;
    const targetId = user._id;

    logger.info(
      `[DeleteAccount] Starting account deletion for user _id=${targetId}, role=${role}, email=${logger.maskEmail(email)}`
    );

    // Use MongoDB transaction for atomic delete
    await session.withTransaction(async () => {
      // Cleanup operations (atomic - any failure aborts transaction)
      if (role === "student") {
        await ProgressReport.deleteMany({ userId: targetId }).session(session);
      }

      await FeatureActivity.deleteMany({ userId: targetId }).session(session);
      await Activity.deleteMany({ userId: targetId }).session(session);

      if (email) {
        await Receipt.deleteMany({ $or: [{ userId: targetId }, { userEmail: email }] }).session(session);
        await Review.deleteMany({ email }).session(session);
      } else {
        await Receipt.deleteMany({ userId: targetId }).session(session);
      }

      if (role === "consultant") {
        const bookingQuery = email
          ? { $or: [{ consultantId: targetId }, { consultantEmail: email }] }
          : { consultantId: targetId };
        await Booking.deleteMany(bookingQuery).session(session);
      } else if (email) {
        await Booking.deleteMany({ userEmail: email }).session(session);
      }

      // Delete AppleSubscription (ownership removed under Model A)
      const AppleSubscription = require("../models/AppleSubscription");
      const AppleSubscriptionEvent = require("../models/AppleSubscriptionEvent");
      const subsToDelete = await AppleSubscription.find({ userId: targetId }).session(session);
      const originalTxnIds = subsToDelete.map((s) => s.originalTransactionId);

      for (const sub of subsToDelete) {
        await AppleSubscriptionEvent.create([{
          originalTransactionId: sub.originalTransactionId,
          eventType: "ACCOUNT_DELETED",
          environment: sub.environment || "Sandbox",
          notificationData: {
            userId: targetId,
            reason: "User account deleted via deleteAccount()",
            deletedAt: new Date(),
          },
          signedDate: new Date(),
        }], { session });
      }

      const subDeleteResult = await AppleSubscription.deleteMany({ userId: targetId }).session(session);

      logger.info(
        `[DeleteAccount] AppleSubscription cleanup for userId=${targetId}: deletedCount=${subDeleteResult.deletedCount}, originalTransactionIds=${JSON.stringify(originalTxnIds)}`
      );

      // Delete UsageReservation (user data)
      const UsageReservation = require("../models/UsageReservation");
      await UsageReservation.deleteMany({ userId: targetId }).session(session);

      // KEEP: AppleSubscriptionEvent, PaymentTransaction, PaymentAttempt, MembershipHistory
      // (audit/financial history preserved)

      // Delete user document
      await model.deleteOne({ _id: targetId }).session(session);
    });

    logger.info(`[DeleteAccount] Account _id=${targetId} deleted successfully`);
    return sendJson(res, 200, {
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error("Delete account error:", error);
    return sendJson(res, 500, {
      success: false,
      message: (error && error.message) || "Server error deleting account",
    });
  } finally {
    session.endSession();
  }
};

