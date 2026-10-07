const fs = require('fs');
const file = 'backend/controllers/partnershipApplication.controller.js';
let content = fs.readFileSync(file, 'utf8');

const helper = `
const User = require("../models/User");
const Seminar = require("../models/Seminar");

const verifyStudentAccess = async (req, studentLeadId) => {
  const role = String(req.user?.role || "").toLowerCase();
  if (["admin", "super_admin"].includes(role)) return true;

  if (role === "partner") {
    const userDoc = await User.findById(req.user.id).select("partnerProfile");
    const partnerType = userDoc?.partnerProfile?.partnerType;

    let filter = { studentLeadId };
    if (partnerType === "edu_mitra") {
      filter.partnerId = req.user.id;
    } else if (partnerType === "edu_leader") {
      const mySeminars = await Seminar.find({ createdBy: req.user.id }).select("seminarId");
      const seminarIds = mySeminars.map((s) => s.seminarId);
      filter.seminarId = { $in: seminarIds };
    } else {
      return false;
    }

    const lead = await StudentLead.findOne(filter).select("_id");
    return !!lead;
  }
  return false;
};
`;

content = content.replace('const Audit = require("../models/Audit");', 'const Audit = require("../models/Audit");\n' + helper);

// Update getApplications
content = content.replace(
  /exports\.getApplications = async \(req, res\) => {[\s\S]*?res\.json\(\{ success: true, applications: apps \}\);\n\s*\} catch \(err\) \{/,
  `exports.getApplications = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const hasAccess = await verifyStudentAccess(req, studentLeadId);
    if (!hasAccess) return res.status(403).json({ success: false, message: "Access denied or lead not found." });

    const apps = await Application.find({ studentLeadId });
    res.json({ success: true, applications: apps });
  } catch (err) {`
);

// Update getOffers
content = content.replace(
  /exports\.getOffers = async \(req, res\) => {[\s\S]*?res\.json\(\{ success: true, offers \}\);\n\s*\} catch \(err\) \{/,
  `exports.getOffers = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const hasAccess = await verifyStudentAccess(req, studentLeadId);
    if (!hasAccess) return res.status(403).json({ success: false, message: "Access denied or lead not found." });

    const offers = await Offer.find({ studentLeadId });
    res.json({ success: true, offers });
  } catch (err) {`
);

fs.writeFileSync(file, content);
console.log('patched applications controller');
