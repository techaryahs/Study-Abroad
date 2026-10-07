const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

const code = `
exports.getStudentLeadProfile = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    let filter = { studentLeadId };
    const role = String(req.user?.role || "").toLowerCase();

    if (role === "partner") {
      const userDoc = await User.findById(req.user.id).select("partnerProfile name");
      const partnerType = userDoc?.partnerProfile?.partnerType;

      if (partnerType === "edu_mitra") {
        filter.partnerId = req.user.id;
      } else if (partnerType === "edu_leader") {
        const mySeminars = await Seminar.find({ createdBy: req.user.id }).select("seminarId");
        const seminarIds = mySeminars.map((s) => s.seminarId);
        filter.seminarId = { $in: seminarIds };
      } else {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else if (!["admin", "super_admin"].includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const lead = await StudentLead.findOne(filter)
      .populate("collegeId", "name city state")
      .populate("assignedConsultantId", "name email role image status")
      .lean();

    if (!lead) {
      return res.status(404).json({ success: false, message: "Student lead not found or unauthorized." });
    }

    // Resolve college name if missing
    let resolvedCollegeName = lead.collegeId?.name || lead.collegeName || null;
    if (!resolvedCollegeName && lead.seminarId) {
      const seminar = await Seminar.findOne({ seminarId: lead.seminarId }).select("collegeName collegeId").lean();
      if (seminar) {
        resolvedCollegeName = seminar.collegeName;
      }
    }
    
    // Attempt to find any applications if the model exists.
    // For now we will return documents and shortlists from the lead itself if they exist.
    // Ensure arrays are at least initialized
    lead.documents = lead.documents || [];
    lead.shortlists = lead.shortlists || [];
    lead.interactions = lead.interactions || [];

    res.json({
      success: true,
      lead: {
        ...lead,
        leadId: lead.studentLeadId,
        phone: lead.mobile,
        collegeName: resolvedCollegeName,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
`;

content = content + "\n" + code;
fs.writeFileSync(file, content);
console.log('patched controller');
