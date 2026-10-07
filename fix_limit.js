const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const { page = 1, limit = 20, search, status, collegeId, preferredCountry, course, consultantId } = req.query;',
  'const { page, limit, search, status, collegeId, preferredCountry, course, consultantId } = req.query;'
);

content = content.replace(
  'const pageNumber = parseInt(page, 10) || 1;\n    const limitNumber = parseInt(limit, 10) || 20;\n    const skip = (pageNumber - 1) * limitNumber;\n\n    const total = await StudentLead.countDocuments(filter);',
  `const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : null;
    const skip = limitNumber ? (pageNumber - 1) * limitNumber : 0;
    const total = await StudentLead.countDocuments(filter);`
);

content = content.replace(
  '.skip(skip)\n      .limit(limitNumber)',
  '.skip(skip)\n      .limit(limitNumber || 10000)'
);

fs.writeFileSync(file, content);
console.log('Fixed pagination default for backwards compatibility');
