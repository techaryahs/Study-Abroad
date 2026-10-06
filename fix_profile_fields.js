const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /leadStatus: lead\?\.leadStatus \|\| "REGISTERED",/,
  `leadStatus: lead?.leadStatus || "REGISTERED",
        pipelineStage: lead?.pipelineStage || "REGISTERED",
        createdAt: student.createdAt || lead?.createdAt,`
);

fs.writeFileSync(file, content);
console.log('Fixed profile fields');
