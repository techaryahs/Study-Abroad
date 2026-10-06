const College = require("../models/College");
const Seminar = require("../models/Seminar");
const StudentLead = require("../models/StudentLead");
const Consultant = require("../models/Consultant");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const seminarService = require("../services/partnership/seminarService");
const { resolveEduMitraPartnerId } = require("../utils/tenantHelper");

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
    
    const registrationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/RegisterStudent?seminarId=${encodeURIComponent(seminarId)}`;

    const resolvedMitraId = await resolveEduMitraPartnerId(req.body);
    
    const seminar = new Seminar({
      ...req.body,
      seminarId,
      registrationUrl,
      createdBy: req.user.id,
      eduMitraId: resolvedMitraId || null,
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
    const role = String(req.user?.role || "").toLowerCase();
    
    // Check access
    if (role === "partner") {
      const userDoc = await User.findById(req.user.id).select("partnerProfile");
      if (!userDoc || !userDoc.partnerProfile || userDoc.partnerProfile.onboardingStatus !== "approved") {
        return res.status(403).json({ success: false, message: "Access denied." });
      }
    } else if (!["admin", "super_admin", "consultant", "counsellor"].includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const { page, limit, search, status, collegeId, preferredCountry, course, consultantId } = req.query;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : null;
    const skip = limitNumber ? (pageNumber - 1) * limitNumber : 0;

    const pipeline = [];

    // Pre-lookup search (on Student fields)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Lookup StudentLead
    pipeline.push({
      $lookup: {
        from: "studentleads",
        localField: "email",
        foreignField: "email",
        as: "leadData"
      }
    });

    pipeline.push({
      $unwind: {
        path: "$leadData",
        preserveNullAndEmptyArrays: true
      }
    });

    // Post-lookup match (on StudentLead fields or Lead ID)
    const postMatch = {};
    if (search) {
      // If we searched, we might have matched a Lead ID
      postMatch.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { "leadData.studentLeadId": { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) postMatch["leadData.leadStatus"] = status;
    if (preferredCountry) postMatch["leadData.preferredCountry"] = preferredCountry;
    if (course) postMatch["leadData.course"] = { $regex: course, $options: 'i' };
    
    if (consultantId) {
      const mongoose = require('mongoose');
      if (consultantId === 'unassigned') {
        postMatch["leadData.assignedConsultantId"] = null;
      } else {
        postMatch["leadData.assignedConsultantId"] = new mongoose.Types.ObjectId(consultantId);
      }
    }

    if (Object.keys(postMatch).length > 0) {
      pipeline.push({ $match: postMatch });
    }

    // Lookup College info for the lead
    pipeline.push({
      $lookup: {
        from: "colleges",
        localField: "leadData.collegeId",
        foreignField: "_id",
        as: "collegeData"
      }
    });
    
    pipeline.push({
      $unwind: {
        path: "$collegeData",
        preserveNullAndEmptyArrays: true
      }
    });

    // Lookup Consultant info
    pipeline.push({
      $lookup: {
        from: "users", // Consultant/Counsellor is in User collection
        localField: "leadData.assignedConsultantId",
        foreignField: "_id",
        as: "consultantData"
      }
    });
    
    pipeline.push({
      $unwind: {
        path: "$consultantData",
        preserveNullAndEmptyArrays: true
      }
    });

    pipeline.push({ $sort: { createdAt: -1 } });
    
    // Pagination
    const totalPipeline = [...pipeline, { $count: "total" }];
    const Student = require("../models/Student");
    const countResult = await Student.aggregate(totalPipeline);
    const total = countResult[0] ? countResult[0].total : 0;

    if (skip) pipeline.push({ $skip: skip });
    if (limitNumber) pipeline.push({ $limit: limitNumber });
    
    // Exclusion projection
    pipeline.push({
      $project: {
        password: 0,
        loginOtp: 0,
        "leadData.__v": 0
      }
    });

    const rawStudents = await Student.aggregate(pipeline);

    // Map to the expected format
    const leads = rawStudents.map(student => {
      const lead = student.leadData || {};
      const college = student.collegeData || {};
      const consultant = student.consultantData || {};
      
      const resolvedCollegeName = college.name || lead.collegeName || "-";
      const collegeObj = college._id ? { _id: college._id, name: college.name } : null;
      
      let assignedConsultantObj = null;
      if (consultant._id) {
        assignedConsultantObj = {
          _id: consultant._id,
          name: consultant.name,
          email: consultant.email,
          role: consultant.role
        };
      }

      return {
        _id: student._id, // the true Student ID
        studentId: student._id,
        studentLeadId: lead.studentLeadId || "-",
        leadId: lead.studentLeadId || "-",
        fullName: student.name || lead.fullName || "Unknown",
        email: student.email || lead.email || "-",
        mobile: student.mobile || lead.mobile || "-",
        course: lead.course || lead.preferredProgram || "-",
        preferredProgram: lead.preferredProgram || "-",
        preferredCountry: lead.preferredCountry || student.country || "-",
        graduationYear: lead.graduationYear || "",
        leadStatus: lead.leadStatus || "REGISTERED",
        attributionStartDate: lead.attributionStartDate || null,
        collegeId: collegeObj,
        collegeName: resolvedCollegeName,
        assignedConsultantId: assignedConsultantObj,
        inquirySource: lead.inquirySource || "DIRECT",
        hasLead: !!student.leadData
      };
    });

    res.json({ 
      success: true, 
      leads, 
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber || total,
        totalPages: limitNumber ? Math.ceil(total / limitNumber) : 1
      }
    });
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


exports.getStudentLeadProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const role = String(req.user?.role || "").toLowerCase();

    if (role === "partner") {
      const userDoc = await User.findById(req.user.id).select("partnerProfile name");
      const partnerType = userDoc?.partnerProfile?.partnerType;
      // Allow all approved partners to view any student's profile (Read-only Directory)
    } else if (!["admin", "super_admin", "consultant", "counsellor"].includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const Student = require("../models/Student");
    const StudentLead = require("../models/StudentLead");
    const Seminar = require("../models/Seminar");

    const student = await Student.findById(studentId).select("-password -loginOtp -loginOtpExpiresAt -cart").lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const lead = await StudentLead.findOne({ email: student.email })
      .populate("collegeId", "name city state")
      .populate("assignedConsultantId", "name email role image status")
      .lean();

    let resolvedCollegeName = lead?.collegeId?.name || lead?.collegeName || student.collegeName || null;
    if (!resolvedCollegeName && lead?.seminarId) {
      const linkedSeminar = await Seminar.findOne({ seminarId: lead.seminarId }).select("collegeName").lean();
      if (linkedSeminar && linkedSeminar.collegeName) {
        resolvedCollegeName = linkedSeminar.collegeName;
      }
    }

    const collegeObj =
      lead?.collegeId && typeof lead.collegeId === "object"
        ? lead.collegeId
        : resolvedCollegeName
        ? { _id: null, name: resolvedCollegeName }
        : null;

    res.json({
      success: true,
      student: {
        _id: student._id,
        studentId: student._id,
        fullName: student.name,
        email: student.email,
        mobile: student.mobile,
        dob: student.dob,
        country: student.country,
        profile: student.profile,
        collegeName: student.profile?.location || student.location || resolvedCollegeName || "-",
        createdAt: student.createdAt,
        
        studentLead: lead ? {
          studentLeadId: lead.studentLeadId,
          leadStatus: lead.leadStatus,
          pipelineStage: lead.pipelineStage || "REGISTERED",
          course: lead.course || lead.preferredProgram,
          preferredCountry: lead.preferredCountry,
          graduationYear: lead.graduationYear,
          inquirySource: lead.inquirySource || lead.sourceType,
          attributionStartDate: lead.attributionStartDate,
          attributionStatus: lead.attributionStatus,
          assignedConsultantId: lead.assignedConsultantId,
          assignedAt: lead.assignedAt,
          assignmentNotes: lead.assignmentNotes,
          consentGiven: lead.consentGiven,
          documents: lead.documents || []
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
