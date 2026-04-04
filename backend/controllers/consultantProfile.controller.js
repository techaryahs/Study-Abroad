const Consultant = require("../models/Consultant");

/* =========================
   GET CONSULTANT PROFILE
========================= */
exports.getConsultantProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(400).json({ message: "No user ID provided" });

    console.log(`📡 [ConsultantProfile] Fetching ID: ${userId}`);

    const consultant = await Consultant.findById(userId).select("-password");

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({ user: consultant, role: "consultant" });
  } catch (err) {
    console.error("Consultant profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching consultant profile" });
  }
};

/* =========================
   UPDATE CONSULTANT PROFILE
========================= */
exports.updateConsultantProfile = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const updateData = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const consultant = await Consultant.findById(userId);
    if (!consultant) return res.status(404).json({ message: "Consultant not found" });

    // Fields that consultants can update
    const fields = [
      "name", 
      "email", 
      "mobile", 
      "role", 
      "expertise", 
      "experience", 
      "bio", 
      "price"
    ];

    fields.forEach(field => {
      if (updateData[field] !== undefined) {
        consultant[field] = updateData[field];
      }
    });

    if (imagePath) consultant.image = imagePath;

    await consultant.save();
    console.log(`✅ [ConsultantProfile] Updated successfully for: ${consultant.email}`);

    res.json({ message: "Consultant profile updated successfully", user: consultant });
  } catch (err) {
    console.error("Consultant profile update error:", err);
    res.status(500).json({ message: "Server error updating consultant profile" });
  }
};
