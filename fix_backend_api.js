const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /res\.json\(\{\n\s*success: true,\n\s*lead: \{[\s\S]*?\}\n\s*\}\);/g;
// I will use a more robust regex or just split and replace
const startIndex = content.indexOf('res.json({\n      success: true,\n      lead: {');
if (startIndex !== -1) {
  const endBracket = content.indexOf('});', startIndex);
  if (endBracket !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endBracket + 3);
    
    const replacement = `res.json({
      success: true,
      student: {
        _id: student._id,
        studentId: student._id,
        fullName: student.name,
        email: student.email,
        mobile: student.mobile,
        dob: student.dob,
        country: student.country,
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
    });`;
    
    content = before + replacement + after;
    fs.writeFileSync(file, content);
    console.log("Successfully replaced backend API structure!");
  }
} else {
  console.log("Could not find start index.");
}

