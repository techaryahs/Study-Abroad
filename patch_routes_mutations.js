const fs = require('fs');

const files = [
  'backend/routes/partnershipApplication.routes.js',
  'backend/routes/partnershipLead.routes.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the logic inside requireEduMitraOrAdmin to explicitly block Partners on non-GET methods for student profile/applications
  content = content.replace(
    /if \(p\.partnerType !== "edu_mitra" && req\.method !== "GET"\) \{[\s\S]*?return next\(\);\n    \} catch/g,
    `if (req.method !== "GET") {
        return res.status(403).json({ error: "Partners are strictly read-only for this resource." });
      }
      return next();
    } catch`
  );
  
  // Also just in case the existing middleware was written slightly differently in partnershipLead.routes.js:
  content = content.replace(
    /if \(p\.partnerType !== "edu_mitra"\) \{\n\s*return res\.status\(403\)\.json\(\{ error: "Only Edu Mitra can perform this operation" \}\);\n\s*\}/g,
    `if (req.method !== "GET") {
         return res.status(403).json({ error: "Partners are strictly read-only for this resource." });
      }`
  );
  
  fs.writeFileSync(file, content);
});

console.log('patched routes for mutations');
