const Seminar = require("../../models/Seminar");
const College = require("../../models/College");

exports.generateSeminarId = async (collegeId, year) => {
  const college = await College.findById(collegeId);
  if (!college) throw new Error("College not found");
  
  const collegeCode = college.collegeId.substring(0, 4).toUpperCase();
  
  // Find latest seminar for this college and year
  const regex = new RegExp(`^EDL-EM-${year}-${collegeCode}-`);
  const latestSeminar = await Seminar.findOne({ seminarId: regex }).sort({ createdAt: -1 });
  
  let sequence = 1;
  if (latestSeminar) {
    const parts = latestSeminar.seminarId.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    sequence = lastSeq + 1;
  }
  
  const seqStr = sequence.toString().padStart(3, "0");
  return `EDL-EM-${year}-${collegeCode}-${seqStr}`;
};
