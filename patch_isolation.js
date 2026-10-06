const fs = require('fs');

let cController = fs.readFileSync('backend/controllers/partnershipController.js', 'utf8');

cController = cController.replace(
  /if \(partnerType === "edu_mitra"\) \{[\s\S]*?\} else \{[\s\S]*?return res\.status\(403\)\.json\(\{ success: false, message: "Access denied" \}\);\n\s*\}/g,
  `// Allow all partners to view any student's profile (Read-only Directory)`
);

fs.writeFileSync('backend/controllers/partnershipController.js', cController);


let aController = fs.readFileSync('backend/controllers/partnershipApplication.controller.js', 'utf8');

aController = aController.replace(
  /let filter = \{ studentLeadId \};[\s\S]*?return false;\n\s*\}/g,
  `let filter = { studentLeadId };\n    // Allow all approved partners to view`
);

fs.writeFileSync('backend/controllers/partnershipApplication.controller.js', aController);

console.log('removed strict profile isolation');
