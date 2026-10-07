const fs = require('fs');
const file = 'frontend/app/partnership/students/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /interface StudentLead \{/g,
  'interface StudentLead {\n  studentId?: string;'
);

fs.writeFileSync(file, content);
console.log('Fixed type error 3');
