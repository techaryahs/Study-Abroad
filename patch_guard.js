const fs = require('fs');
const file = 'frontend/components/partnership/common/PartnerGuard.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('"consultant"')) {
  content = content.replace(
    'const legacyRoles = ["admin", "super_admin", "eduleader", "edumitra", "college_coordinator"];',
    'const legacyRoles = ["admin", "super_admin", "eduleader", "edumitra", "college_coordinator", "consultant", "counsellor"];'
  );
  fs.writeFileSync(file, content);
  console.log('Patched PartnerGuard');
}
