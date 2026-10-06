const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\$\{API_URL\}\/api\/partnership\/student-leads\/\$\{studentLeadId\}/g,
  '${API_URL}/api/partnership/students/${studentId}'
);

fs.writeFileSync(file, content);
console.log('Fixed type error');
