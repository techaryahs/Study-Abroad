const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /exports\.getStudentLeadProfile = async \(req, res\) => \{[\s\S]*?res\.json\(\{ success: true, lead: \{[\s\S]*?\}\n  \} catch \(err\) \{\n    res\.status\(500\)\.json\(\{ success: false, message: err\.message \}\);\n  \}\n\};/g;
const fallbackRegex = /exports\.getStudentLeadProfile = async \(req, res\) => \{[\s\S]*?\n\};/g;

const replacement = `exports.getStudentLeadProfile = async (req, res) => {
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
      lead: {
        ...lead, // Spread lead fields if it exists
        _id: student._id, // Prefer true student ID
        studentId: student._id,
        studentLeadId: lead?.studentLeadId || "-", // fallback if no lead
        fullName: student.name || lead?.fullName,
        email: student.email || lead?.email,
        mobile: student.mobile || lead?.mobile,
        collegeId: collegeObj,
        collegeName: resolvedCollegeName,
        preferredProgram: lead?.preferredProgram || lead?.course || "-",
        preferredCountry: lead?.preferredCountry || student.country || "-",
        graduationYear: lead?.graduationYear || "-",
        leadStatus: lead?.leadStatus || "REGISTERED",
        attributionStartDate: lead?.attributionStartDate || null,
        assignedConsultantId: lead?.assignedConsultantId || null,
        source: lead?.inquirySource || "DIRECT",
        hasLead: !!lead
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
} else {
  content = content.replace(fallbackRegex, replacement);
}

fs.writeFileSync(file, content);
console.log('patched getStudentLeadProfile');
