const fs = require('fs');
const file = 'frontend/app/partnership/students/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update TH
content = content.replace(
  '<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">\n                      ACTION\n                    </th>',
  '<th className="sticky right-0 bg-gray-50 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)] z-10">\n                      ACTION\n                    </th>'
);

// Update TD
content = content.replace(
  '<td className="px-6 py-4 text-right space-x-3">',
  '<td className="sticky right-0 bg-white/95 backdrop-blur-sm px-6 py-4 text-right space-x-3 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.03)] z-10">'
);

fs.writeFileSync(file, content);
console.log('Fixed sticky');
