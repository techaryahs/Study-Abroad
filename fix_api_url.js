const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the inline env check with a global constant API_URL
const inlineRegex = /\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| process\.env\.NEXT_PUBLIC_BACKEND_URL \|\| "http:\/\/localhost:5000"\}\$\{doc\.url \|\| doc\.fileUrl \|\| doc\.proofReference \|\| doc\.documentUrl \|\| doc\.resumeUrl \|\| doc\.resume\}\`/g;

content = content.replace(inlineRegex, '`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}${doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume}`');

fs.writeFileSync(file, content);
console.log("Fixed API_URL inline");
