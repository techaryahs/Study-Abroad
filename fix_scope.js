const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove it from inside if(loading)
const badInjectRegex = /\s*const allDocuments = \[\.\.\.\(student\?\.studentLead\?\.documents \|\| \[\]\), \.\.\.\(student\?\.profile\?\.documents \|\| \[\]\)\];\n\s*if \(student\?\.profile\?\.resumeUrl \|\| student\?\.profile\?\.resume\) \{\n\s*allDocuments\.push\(\{\n\s*docType: "Resume",\n\s*url: student\.profile\.resumeUrl \|\| student\.profile\.resume,\n\s*status: "UPLOADED"\n\s*\}\);\n\s*\}\n\s*/g;
content = content.replace(badInjectRegex, '');

// 2. Add it before the main return (after `const currentStageIndex ...`)
const correctInjectPoint = 'return (\n    <PartnerGuard>';
const correctInject = `
  const allDocuments = [...(student?.studentLead?.documents || []), ...(student?.profile?.documents || [])];
  if (student?.profile?.resumeUrl || student?.profile?.resume) {
    allDocuments.push({
      docType: "Resume",
      url: student.profile.resumeUrl || student.profile.resume,
      status: "UPLOADED"
    });
  }
  
  `;
content = content.replace(correctInjectPoint, correctInject + correctInjectPoint);

fs.writeFileSync(file, content);
console.log("Scope fixed!");
