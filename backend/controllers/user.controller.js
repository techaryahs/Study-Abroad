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

const pricingData = require("../../frontend/data/services-pricing.json");

// @desc    Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { serviceId, cartData } = req.body;
    if (!serviceId || !cartData) {
      return res.status(400).json({ message: "Service ID and cart data are required" });
    }

    const result = await findUserById(req.user.id);
    if (!result) return res.status(404).json({ message: "User not found" });

    const { user } = result;

    // 1. Get snapshot from JSON to supplement frontend data
    const serviceConfig = pricingData[serviceId] || {};

    // 1. PRICE CLEANING
    const numericPrice = parseFloat(cartData.price.toString().replace(/,/g, ""));

    // 2. CREATE ITEM SNAPSHOT
    // We only save what the frontend passes, plus core IDs and timestamp.
    const newItem = {
      itemId: Date.now().toString(36) + Math.random().toString(36).substring(2),
      serviceId,
      ...cartData, // Saves title, price, currency, duration, selections, activeCheckboxes
      price: numericPrice, // Override with clean numeric value
      addedAt: new Date()
    };

    // 3. DUPLICATE PREVENTION
    if (!user.cart) user.cart = [];

    const isDuplicate = user.cart.some(item => item.serviceId === serviceId);

    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: "This service is already in your cart",
        cart: user.cart
      });
    }

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
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// @desc    Get user cart
exports.getCart = async (req, res) => {
  console.log("🔍 [getCart] User ID from token:", req.user?.id);
  try {
    const result = await findUserById(req.user.id);
    if (!result) return res.status(404).json({ message: "User not found" });

    const { user } = result;
    res.status(200).json({
      success: true,
      cart: user.cart || []
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// @desc    Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const result = await findUserById(req.user.id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const { user } = result;

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }

    // Find item index
    const itemIndex = user.cart.findIndex(item => item.itemId === itemId);

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
    res.status(500).json({ message: "Server error removing item" });
  }
};
exports.clearCart = async (req, res) => {
  console.log("clear cart");
  try {
    const { user } = await findUserById(req.user.id);

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