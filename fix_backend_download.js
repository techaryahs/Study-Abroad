const fs = require('fs');
const file = 'backend/controllers/user.controller.js';
let content = fs.readFileSync(file, 'utf8');

// Replace the Content-Disposition line
content = content.replace(
  'res.set("Content-Disposition", `inline; filename="${file.filename}"`);',
  'res.set("Content-Disposition", req.query.download ? `attachment; filename="${file.filename}"` : `inline; filename="${file.filename}"`);'
);

fs.writeFileSync(file, content);
console.log("Backend updated for download!");
