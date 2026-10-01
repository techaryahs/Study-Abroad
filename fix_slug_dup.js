const fs = require('fs');
const file = 'frontend/app/universities/[slug]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = 'const currentPrograms = data.branches?.map((b: any) => b.name) || ["Engineering"];';
const parts = code.split(target);
if (parts.length > 2) {
  code = parts.slice(0, 2).join(target) + parts.slice(2).join('');
}

fs.writeFileSync(file, code);
console.log('Fixed currentPrograms duplicate');
