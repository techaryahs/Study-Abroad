const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/profile.controller");

const upload = require("../middleware/multer");

const { optionalAuth } = require("../middleware/auth");

// ✅ Only routes that actually exist in controller
router.get("/profile/:userId", profileCtrl.getProfile);
router.put(
  "/profile/:userId",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  profileCtrl.updateProfile
);
router.post("/profile/:userId/add-item", profileCtrl.addProfileItem);
router.put("/profile/:userId/update-item", profileCtrl.updateProfileItem);
router.delete("/profile/:userId/delete-item", profileCtrl.deleteProfileItem);
router.post("/profile/upload-document", optionalAuth, upload.single("document"), profileCtrl.uploadDocument);
router.get("/document/:fileId", profileCtrl.getDocument);

module.exports = router;
