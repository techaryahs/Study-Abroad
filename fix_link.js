const fs = require('fs');
const file = 'frontend/app/partnership/students/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /href=\{`\/partnership\/students\/\$\{encodeURIComponent\([\s\S]*?s\.studentLeadId[\s\S]*?\)\}`\}/g,
  'href={`/partnership/students/${encodeURIComponent(s.studentId || s._id)}`}'
);

fs.writeFileSync(file, content);
console.log('fixed link');
