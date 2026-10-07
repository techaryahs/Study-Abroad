const fs = require('fs');
const file = 'backend/controllers/partnershipApplication.controller.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const verifyStudentAccess = async \(req, studentLeadId\) => \{[\s\S]*?return !!lead;\n  \}\n  return false;\n\};/g,
  `const verifyStudentAccess = async (req, studentLeadId) => {
  const role = String(req.user?.role || "").toLowerCase();
  if (["admin", "super_admin"].includes(role)) return true;

  if (role === "partner") {
    // All approved partners have read-only access to the global student directory
    return true;
  }
  return false;
};`
);

fs.writeFileSync(file, content);
console.log('Fixed verifyStudentAccess to allow global directory view');
