const fs = require('fs');
const file = 'frontend/app/universities/[slug]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '                </EntitlementGuard>',
  '                </EntitlementGuard>\n                )}'
);

fs.writeFileSync(file, code);
console.log('Fixed syntax error in [slug]/page.tsx');
