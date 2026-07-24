const Consultant = require("../models/Consultant");
const logger = require("../utils/logger");

/* =========================
   GET CONSULTANT PROFILE
========================= */
exports.getConsultantProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "No user ID provided" });
    }

    logger.debug(`[ConsultantProfile] Fetching ID: ${userId}`);

    const consultant = await Consultant.findById(userId).select("-password");

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({
      user: consultant,
      role: "consultant",
    });

  } catch (err) {
    logger.error("Consultant profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching consultant profile" });
  }
};

/* =========================
   UPDATE CONSULTANT PROFILE
========================= */
exports.updateConsultantProfile = async (req, res) => {
  try {
    // 🔐 Always use logged-in user (NO param trust)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData = req.body;

    // 📸 Handle image upload
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const consultant = await Consultant.findById(userId);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    /* =========================
       ALLOWED FIELDS ONLY
    ========================= */
    const allowedFields = [
      "name",
      "mobile",
      "expertise",
      "experience",
      "bio",
      "price",
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        consultant[field] = updateData[field];
      }
    });

    /* =========================
       AVAILABILITY UPDATE
    ========================= */
    if (updateData.availability) {
      if (!Array.isArray(updateData.availability)) {
        return res.status(400).json({ message: "Availability must be an array" });
      }

      // Validate time slots
      for (let slot of updateData.availability) {
        if (!slot.day || !slot.startTime || !slot.endTime) {
          return res.status(400).json({ message: "Invalid availability format" });
        }

        if (slot.startTime >= slot.endTime) {
          return res.status(400).json({
            message: `Invalid time range for ${slot.day}`,
          });
        }
      }

      consultant.availability = updateData.availability;
    }

    /* =========================
       IMAGE UPDATE
    ========================= */
    if (imagePath) {
      consultant.image = imagePath;
    }

    await consultant.save();

    logger.info(`[ConsultantProfile] Updated: ${logger.maskEmail(consultant.email)}`);

    res.json({
      message: "Consultant profile updated successfully",
      user: consultant,
    });

  } catch (err) {
    logger.error("Consultant profile update error:", err);
    res.status(500).json({ message: "Server error updating consultant profile" });
  }
};