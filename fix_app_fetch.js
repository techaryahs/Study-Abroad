const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const appsRes = await axios\.get\(`\$\{API_URL\}\/api\/partnership-applications\/\$\{studentId\}\/applications`, \{ headers \}\);/g,
  'const appsRes = await axios.get(`${API_URL}/api/partnership-applications/${profileData.studentLeadId}/applications`, { headers });'
);

content = content.replace(
  /const offersRes = await axios\.get\(`\$\{API_URL\}\/api\/partnership-applications\/\$\{studentId\}\/offers`, \{ headers \}\);/g,
  'const offersRes = await axios.get(`${API_URL}/api/partnership-applications/${profileData.studentLeadId}/offers`, { headers });'
);

fs.writeFileSync(file, content);
console.log('Fixed applications fetch to use profileData.studentLeadId');
