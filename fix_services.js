const fs = require('fs');
const file = 'frontend/app/services/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// replace the duplicate import
const lines = code.split('\n');
let found = false;
const filtered = lines.filter(line => {
  if (line.trim() === 'import { Suspense } from "react";') {
    if (found) return false;
    found = true;
  }
  return true;
});

fs.writeFileSync(file, filtered.join('\n'));
console.log('Fixed services');
