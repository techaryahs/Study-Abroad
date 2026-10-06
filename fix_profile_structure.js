const fs = require('fs');

// 1. Update Backend API
const backendFile = 'backend/controllers/partnershipController.js';
let backendContent = fs.readFileSync(backendFile, 'utf8');

const regex = /res\.json\(\{\n\s*success: true,\n\s*lead: \{[\s\S]*?\}\n\s*\}\);/g;

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
        collegeName: student.collegeName || resolvedCollegeName || "-",
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

backendContent = backendContent.replace(regex, replacement);
fs.writeFileSync(backendFile, backendContent);
console.log('Backend updated.');

// 2. Update Frontend Page
const frontendFile = 'frontend/app/partnership/students/[studentId]/page.tsx';
let frontendContent = fs.readFileSync(frontendFile, 'utf8');

// Replace state and fetch logic
frontendContent = frontendContent.replace(
  /const \[lead, setLead\] = useState<any>\(null\);/,
  'const [student, setStudent] = useState<any>(null);'
);

frontendContent = frontendContent.replace(
  /if \(res\.data\.success\) \{\n\s*setLead\(res\.data\.lead\);\n\s*\} else \{\n\s*setError\(res\.data\.message \|\| "Failed to load student profile"\);\n\s*return;\n\s*\}/,
  `if (res.data.success) {
        setStudent(res.data.student);
      } else {
        setError(res.data.message || "Failed to load student profile");
        return;
      }`
);

// Fix applications and offers fetch to check if studentLead exists
frontendContent = frontendContent.replace(
  /const appsRes = await axios\.get\(`\$\{API_URL\}\/api\/partnership-applications\/\$\{res\.data\.lead\.studentLeadId\}\/applications`, \{ headers \}\);/g,
  `const appsRes = res.data.student?.studentLead 
          ? await axios.get(\`\${API_URL}/api/partnership-applications/\${res.data.student.studentLead.studentLeadId}/applications\`, { headers }) 
          : { data: { applications: [] } };`
);

frontendContent = frontendContent.replace(
  /const offersRes = await axios\.get\(`\$\{API_URL\}\/api\/partnership-applications\/\$\{res\.data\.lead\.studentLeadId\}\/offers`, \{ headers \}\);/g,
  `const offersRes = res.data.student?.studentLead 
          ? await axios.get(\`\${API_URL}/api/partnership-applications/\${res.data.student.studentLead.studentLeadId}/offers\`, { headers }) 
          : { data: { offers: [] } };`
);

// Replace all `lead.` with `(student.studentLead?.xxx || student.xxx)`
frontendContent = frontendContent.replace(/if \(error \|\| !lead\) \{/g, 'if (error || !student) {');
frontendContent = frontendContent.replace(/lead\.pipelineStage/g, 'student.studentLead?.pipelineStage');
frontendContent = frontendContent.replace(/lead\.fullName/g, 'student.fullName');
frontendContent = frontendContent.replace(/lead\.studentLeadId/g, '(student.studentLead?.studentLeadId || "-")');
frontendContent = frontendContent.replace(/lead\.leadStatus/g, 'student.studentLead?.leadStatus');
frontendContent = frontendContent.replace(/lead\.email/g, 'student.email');
frontendContent = frontendContent.replace(/lead\.phone \|\| lead\.mobile/g, 'student.mobile');
frontendContent = frontendContent.replace(/lead\.collegeName/g, 'student.collegeName');
frontendContent = frontendContent.replace(/lead\.course \|\| lead\.preferredProgram/g, 'student.studentLead?.course');
frontendContent = frontendContent.replace(/lead\.graduationYear/g, 'student.studentLead?.graduationYear');
frontendContent = frontendContent.replace(/lead\.preferredCountry/g, 'student.studentLead?.preferredCountry');
frontendContent = frontendContent.replace(/lead\.createdAt/g, 'student.createdAt');
frontendContent = frontendContent.replace(/lead\.documents/g, '(student.studentLead?.documents || [])');
frontendContent = frontendContent.replace(/lead\.assignedConsultantId/g, 'student.studentLead?.assignedConsultantId');
frontendContent = frontendContent.replace(/lead\.assignedAt/g, 'student.studentLead?.assignedAt');
frontendContent = frontendContent.replace(/lead\.assignmentNotes/g, 'student.studentLead?.assignmentNotes');
frontendContent = frontendContent.replace(/lead\.sourceType/g, 'student.studentLead?.inquirySource');
frontendContent = frontendContent.replace(/lead\.attributionStatus/g, 'student.studentLead?.attributionStatus');
frontendContent = frontendContent.replace(/lead\.consentGiven/g, 'student.studentLead?.consentGiven');

fs.writeFileSync(frontendFile, frontendContent);
console.log('Frontend updated.');
