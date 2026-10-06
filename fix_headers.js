const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const headers = { Authorization: `Bearer ${token + "?download=1" }` };', 'const headers = { Authorization: `Bearer ${token}` };');

fs.writeFileSync(file, content);
