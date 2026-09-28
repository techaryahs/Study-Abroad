const College = require("../models/College");
const Seminar = require("../models/Seminar");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Audit = require("../models/Audit");

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

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("collegeId");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, profile: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeminars = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.collegeId) return res.status(403).json({ success: false, message: "No college assigned." });
    
    // Get seminars for this college ONLY
    const seminars = await Seminar.find({ collegeId: user.collegeId }).sort({ date: -1 });
    res.json({ success: true, seminars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeminar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const seminar = await Seminar.findById(req.params.id);
    
    if (!seminar) return res.status(404).json({ success: false, message: "Seminar not found" });
    if (String(seminar.collegeId) !== String(user.collegeId)) {
      return res.status(403).json({ success: false, message: "Access denied to this seminar." });
    }
    
    // Get attendance count
    const totalAttendance = await Attendance.countDocuments({ seminarId: seminar.seminarId, attendanceStatus: "PRESENT" });
    
    res.json({ success: true, seminar, totalAttendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyAttendance = async (req, res) => {
  try {
    const { remarks } = req.body;
    const user = await User.findById(req.user.id);
    const seminar = await Seminar.findById(req.params.id);
    
    if (!seminar) return res.status(404).json({ success: false, message: "Seminar not found" });
    if (String(seminar.collegeId) !== String(user.collegeId)) {
      return res.status(403).json({ success: false, message: "Access denied to this seminar." });
    }
    
    const previousStatus = seminar.attendanceVerifiedStatus;
    
    seminar.attendanceVerifiedStatus = "VERIFIED";
    seminar.attendanceVerifiedBy = req.user.id;
    seminar.attendanceVerifiedAt = new Date();
    seminar.attendanceRemarks = remarks;
    
    await seminar.save();
    
    await createAudit(req, "ATTENDANCE_VERIFIED", "Seminar", seminar._id, { status: previousStatus }, { status: "VERIFIED", remarks });
    
    res.json({ success: true, seminar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
