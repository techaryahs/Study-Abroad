const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\$\{API_URL\}\/api\/partnership-applications\/\$\{studentLeadId\}\/applications/g,
  '${API_URL}/api/partnership-applications/${res.data.lead.studentLeadId}/applications'
);

content = content.replace(
  /\$\{API_URL\}\/api\/partnership-applications\/\$\{studentLeadId\}\/offers/g,
  '${API_URL}/api/partnership-applications/${res.data.lead.studentLeadId}/offers'
);

content = content.replace(
  /\[studentLeadId\]\);/g,
  '[studentId]);'
);

fs.writeFileSync(file, content);
console.log('Fixed type error 2');
