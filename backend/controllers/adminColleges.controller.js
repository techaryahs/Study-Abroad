const College = require("../models/College");
const User = require("../models/User");
const Audit = require("../models/Audit");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const createAudit = async (req, action, entity, entityId, previousValue, newValue, reason = "") => {
  try {
    await Audit.create({
      userId: req.user?.id || req.user?._id,
      role: req.user?.role,
      action,
      entity,
      entityId,
      previousValue,
      newValue,
      reason
    });
  } catch (err) {}
};

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCollege = async (req, res) => {
  try {
    const { collegeId, name, code, address, city, state, country, website, status } = req.body;
    
    // Check for duplicate college code or ID if applicable
    const existing = await College.findOne({ 
      $or: [
        { collegeId: collegeId || code },
        { name: new RegExp('^' + name + '$', 'i') }
      ]
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "A college with this name or ID already exists." });
    }

    const newCollege = new College({
      collegeId: collegeId || code || `COL-${Date.now()}`,
      name,
      address,
      city,
      state,
      country,
      status: status || "ACTIVE",
      createdBy: req.user.id
    });
    
    await newCollege.save();
    
    await createAudit(req, "COLLEGE_CREATED", "College", newCollege._id, null, newCollege.toObject());
    
    res.status(201).json({ success: true, college: newCollege });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: "College not found" });
    
    // Get coordinators for this college
    const coordinators = await User.find({ role: "college_coordinator", collegeId: college._id }).select("-password");
    
    res.json({ success: true, college, coordinators });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCollegeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: "College not found" });
    
    const previousStatus = college.status;
    college.status = status;
    await college.save();
    
    await createAudit(req, status === "ACTIVE" ? "COLLEGE_ACTIVATED" : "COLLEGE_DEACTIVATED", "College", college._id, { status: previousStatus }, { status: college.status });
    
    res.json({ success: true, college });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addCoordinator = async (req, res) => {
  try {
    const { name, email, mobile, designation } = req.body;
    const collegeId = req.params.id;
    
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ success: false, message: "College not found" });
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }
    
    // Generate secure temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: tempPassword,
      phone: mobile,
      role: "college_coordinator",
      collegeId: college._id,
      isApproved: true,
      partnerProfile: { designation }
    });
    
    await newUser.save();
    
    await createAudit(req, "COORDINATOR_CREATED", "User", newUser._id, null, { name, email, role: "college_coordinator", collegeId: college._id });
    
    // We send back the temp password so admin can communicate it
    // In a real system this might email the user, but for now we provide it in response.
    res.status(201).json({ success: true, user: { _id: newUser._id, name: newUser.name, email: newUser.email }, tempPassword });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
