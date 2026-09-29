const StudentLead = require("../../models/StudentLead");
const College = require("../../models/College");

const normalizePhone = (phone) => {
  return String(phone).trim().replace(/[\s().-]/g, "").replace(/^\+91/, "");
};

const normalizeEmail = (email) => {
  return email ? String(email).trim().toLowerCase() : "";
};

exports.generateStudentLeadId = async (collegeId, year) => {
  const college = await College.findById(collegeId);
  if (!college) throw new Error("College not found");

  const collegeCode = college.collegeId.substring(0, 4).toUpperCase();
  
  const regex = new RegExp(`^EL-${collegeCode}-${year}-`);
  const latestLead = await StudentLead.findOne({ studentLeadId: regex }).sort({ createdAt: -1 });
  
  let sequence = 1;
  if (latestLead) {
    const parts = latestLead.studentLeadId.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    sequence = lastSeq + 1;
  }
  
  const seqStr = sequence.toString().padStart(5, "0");
  return `EL-${collegeCode}-${year}-${seqStr}`;
};

exports.findDuplicate = async (mobile, email, name, collegeId) => {
  const normMobile = normalizePhone(mobile);
  const normEmail = normalizeEmail(email);

  // Primary: Mobile
  let existing = await StudentLead.findOne({ normalizedMobile: normMobile });
  if (existing) return existing;

  // Secondary: Email
  if (normEmail) {
    existing = await StudentLead.findOne({ normalizedEmail: normEmail });
    if (existing) return existing;
  }

  // Tertiary: Name + College
  existing = await StudentLead.findOne({ fullName: name, collegeId: collegeId });
  if (existing) return existing;

  return null;
};

exports.normalizePhone = normalizePhone;
exports.normalizeEmail = normalizeEmail;
