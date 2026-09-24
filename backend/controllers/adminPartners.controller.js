const User = require("../models/User");

// Get all partners (pending, approved, rejected, suspended)
exports.getPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: "partner" })
      .select("-password -loginOtp -cart")
      .sort({ createdAt: -1 });
    res.json({ partners });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching partners" });
  }
};

// Get single partner by id
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await User.findOne({ _id: req.params.id, role: "partner" }).select("-password -loginOtp -cart");
    if (!partner) return res.status(404).json({ error: "Partner not found" });
    res.json({ partner });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching partner" });
  }
};

// Approve partner
exports.approvePartner = async (req, res) => {
  try {
    const partner = await User.findOne({ _id: req.params.id, role: "partner" });
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    if (!partner.partnerProfile) partner.partnerProfile = {};
    partner.partnerProfile.isApproved = true;
    partner.partnerProfile.isActive = true;
    partner.partnerProfile.onboardingStatus = "approved";
    partner.partnerProfile.approvedAt = new Date();
    partner.partnerProfile.approvedBy = req.user.id;

    await partner.save();
    res.json({ message: "Partner approved successfully", partner });
  } catch (err) {
    res.status(500).json({ error: "Server error approving partner" });
  }
};

// Reject partner
exports.rejectPartner = async (req, res) => {
  try {
    const partner = await User.findOne({ _id: req.params.id, role: "partner" });
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    if (!partner.partnerProfile) partner.partnerProfile = {};
    partner.partnerProfile.isApproved = false;
    partner.partnerProfile.onboardingStatus = "rejected";

    await partner.save();
    res.json({ message: "Partner rejected successfully", partner });
  } catch (err) {
    res.status(500).json({ error: "Server error rejecting partner" });
  }
};

// Suspend partner
exports.suspendPartner = async (req, res) => {
  try {
    const partner = await User.findOne({ _id: req.params.id, role: "partner" });
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    if (!partner.partnerProfile) partner.partnerProfile = {};
    partner.partnerProfile.isActive = false;
    partner.partnerProfile.onboardingStatus = "suspended";

    await partner.save();
    res.json({ message: "Partner suspended successfully", partner });
  } catch (err) {
    res.status(500).json({ error: "Server error suspending partner" });
  }
};
