const College = require("../models/College");
const Seminar = require("../models/Seminar");
const StudentLead = require("../models/StudentLead");
const Attendance = require("../models/Attendance");
const seminarService = require("../services/partnership/seminarService");

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

// --- SEMINARS ---
exports.createSeminar = async (req, res) => {
  try {
    const year = new Date(req.body.date).getFullYear() || new Date().getFullYear();
    const seminarId = await seminarService.generateSeminarId(req.body.collegeId, year);
    
    const registrationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/register/seminar/${seminarId}`;
    
    const seminar = new Seminar({
      ...req.body,
      seminarId,
      registrationUrl,
      createdBy: req.user.id
    });
    await seminar.save();
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
