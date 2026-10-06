const fs = require('fs');
const file = 'backend/routes/partnership.routes.js';
let content = fs.readFileSync(file, 'utf8');

// Insert after router.get("/student-leads", partnershipController.getStudentLeads);
content = content.replace(
  'router.get("/student-leads", partnershipController.getStudentLeads);',
  'router.get("/student-leads", partnershipController.getStudentLeads);\nrouter.get("/student-leads/:studentLeadId", partnershipController.getStudentLeadProfile);'
);

fs.writeFileSync(file, content);
console.log('patched routes');
