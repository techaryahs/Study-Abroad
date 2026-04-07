const upload = require("../middleware/multer"); // ✅ ADDED
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.get("/premium-status", authMiddleware, userController.getPremiumStatus);

router.post("/activate", userController.activatePremium);
router.post("/update-profile", upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), userController.updateProfile);
router.post("/add-to-cart", authMiddleware, userController.addToCart);
router.get("/get-cart", authMiddleware, userController.getCart);
router.delete("/remove-from-cart", authMiddleware, userController.removeFromCart);
router.delete("/clear-cart", authMiddleware, userController.clearCart);
router.get("/:email", userController.getUserByEmail);
module.exports = router;
