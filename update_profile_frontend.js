const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace studentLeadId with studentId
content = content.replace(/const \{ studentLeadId \} = useParams\(\);/g, 'const { studentId } = useParams();');
content = content.replace(/`\$\{BACKEND_URL\}\/api\/partnership\/student-leads\/\$\{studentLeadId\}`/g, '`${BACKEND_URL}/api/partnership/students/${studentId}`');
// The applications/offers API calls still expect studentLeadId. If the profile API returns it, we can use it.
content = content.replace(/`\$\{BACKEND_URL\}\/api\/partnership-applications\/\$\{studentLeadId\}\/applications`/g, '`${BACKEND_URL}/api/partnership-applications/${studentId}/applications`');
content = content.replace(/`\$\{BACKEND_URL\}\/api\/partnership-applications\/\$\{studentLeadId\}\/offers`/g, '`${BACKEND_URL}/api/partnership-applications/${studentId}/offers`');

fs.writeFileSync(file, content);
console.log('updated profile route');
