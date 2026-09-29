const College = require("../models/College");
const Seminar = require("../models/Seminar");
const StudentLead = require("../models/StudentLead");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const seminarService = require("../services/partnership/seminarService");

exports.getPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: { $in: ["partner", "admin"] } }).select("name email role partnerProfile");
    res.json({ success: true, partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCoordinatorsForCollege = async (req, res) => {
  try {
    const coordinators = await User.find({ role: "college_coordinator", collegeId: req.params.id }).select("name email phone partnerProfile");
    res.json({ success: true, coordinators });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let filter = {};
    if (req.user && req.user.role === "partner") {
        filter = { createdBy: req.user.id };
    }
    
    const totalColleges = await College.countDocuments(filter);
    const totalSeminars = await Seminar.countDocuments(filter);
    const registeredStudents = await StudentLead.countDocuments(filter);
    const activeLeads = await StudentLead.countDocuments({ ...filter, status: 'active' });
    
    res.json({
      success: true,
      totalColleges,
      totalSeminars,
      registeredStudents,
      activeLeads,
      applications: 0,
      admissions: 0,
      expectedCommission: "0.00",
      receivedCommission: "0.00",
      outstandingShare: "0.00"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- COLLEGES ---
exports.createCollege = async (req, res) => {
  try {
    const college = new College({ ...req.body, createdBy: req.user.id });
    await college.save();
    res.status(201).json({ success: true, college });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

exports.createSeminar = async (req, res) => {
  try {
    const year = new Date(req.body.date).getFullYear() || new Date().getFullYear();
    const seminarId = await seminarService.generateSeminarId(req.body.collegeId, year);
    
    const registrationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/register/seminar/${seminarId}`;
    
    const seminar = new Seminar({
      ...req.body,
      seminarId,
      registrationUrl,
      createdBy: req.user.id,
      status: "PENDING"
    });
    await seminar.save();
    
    await createAudit(req, "SEMINAR_CREATED", "Seminar", seminar._id, null, seminar.toObject());

    res.status(201).json({ success: true, seminar });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getSeminars = async (req, res) => {
  try {
    const seminars = await Seminar.find().populate("collegeId", "name");
    res.json({ success: true, seminars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findOne({ seminarId: req.params.id }).populate("collegeId");
    if (!seminar) return res.status(404).json({ success: false, message: "Seminar not found" });
    res.json({ success: true, seminar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- STUDENT LEADS ---
exports.getStudentLeads = async (req, res) => {
  try {
    const leads = await StudentLead.find().populate("collegeId", "name");
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ATTENDANCE ---
exports.markAttendance = async (req, res) => {
  try {
    const { studentLeadId, seminarId } = req.body;
    let attendance = await Attendance.findOne({ studentLeadId, seminarId });
    
    if (attendance) {
      attendance.attendanceStatus = "PRESENT";
      attendance.verifiedBy = req.user.id;
      attendance.verificationMethod = "MANUAL";
    } else {
      attendance = new Attendance({
        studentLeadId,
        seminarId,
        attendanceStatus: "PRESENT",
        verifiedBy: req.user.id,
        verificationMethod: "MANUAL"
      });
    }
    
    await attendance.save();
    
    // Update lead status
    await StudentLead.findOneAndUpdate({ studentLeadId }, { leadStatus: "ATTENDED" });
    
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
