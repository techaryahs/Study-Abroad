const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Download to imports
if (!content.includes('Download,')) {
  content = content.replace(/ExternalLink,/g, 'ExternalLink,\n  Download,');
}

// 2. Add the download button next to the view button
const viewButtonRegex = /<a[\s\S]*?className="p-1\.5 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors"[\s\S]*?title="View Document"[\s\S]*?>[\s\S]*?<ExternalLink size=\{16\} \/>[\s\S]*?<\/a>/;

const viewButtonMatch = content.match(viewButtonRegex);
if (viewButtonMatch) {
  const originalViewButton = viewButtonMatch[0];
  
  // Create download button by replacing href to include ?download=true
  const downloadButton = originalViewButton
    .replace('title="View Document"', 'title="Download Document" download')
    .replace('<ExternalLink size={16} />', '<Download size={16} />');
    
  // Wait, the href is complex. Let's just do string replacement on the href logic.
  // Actually, HTML5 `download` attribute on an `<a>` tag often forces a download if the same origin.
  // But since it might be cross-origin (port 3000 vs 5011), the backend `Content-Disposition` is king.
  // So adding `?download=1` to the URL is the safest bet.
  
  const modifiedHrefButton = originalViewButton.replace(
    /<ExternalLink size=\{16\} \/>/g,
    '<Download size={16} />'
  ).replace(
    'title="View Document"',
    'title="Download Document"'
  );
  
  // We need to inject `?download=1` at the end of the URL.
  // Let's just modify the backend to always support `?download=1`.
  
  content = content.replace(originalViewButton, originalViewButton + '\n' + modifiedHrefButton.replace(/}/, ` + "?download=1" }`));
  // Wait, this regex replacement might be brittle. Let's just write a clean replacement.
}

fs.writeFileSync(file, content);
console.log("Done");
