const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Course / Program to fall back to underGrad[0]
content = content.replace(
  /\{student\.studentLead\?\.course \|\| "Not available"\}/g,
  '{student.studentLead?.course || student.profile?.underGrad?.[0]?.degreeName || student.profile?.masters?.[0]?.degreeName || "Not available"}'
);

// Update Preferred Country to fall back to targetUniversities[0]
content = content.replace(
  /\{student\.studentLead\?\.preferredCountry \|\| "Not available"\}/g,
  '{student.studentLead?.preferredCountry || student.profile?.targetUniversities?.[0]?.uniName || "Not available"}'
);

// We can also change "Preferred Country" label to "Preferred Country / Target Uni"
content = content.replace(
  /Preferred Country<\/span>/g,
  'Preferred Country / Uni</span>'
);

fs.writeFileSync(file, content);
console.log("Frontend overview updated!");
