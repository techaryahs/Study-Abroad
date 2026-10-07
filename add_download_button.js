const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ExternalLink to lucide-react imports
if (!content.includes('ExternalLink')) {
  content = content.replace(/FileText,/g, 'FileText,\n  ExternalLink,');
}

// 2. Replace the status span with a flex container holding the span AND the button
const statusRegex = /<span className=\{\`text-xs font-bold px-2\.5 py-1 rounded-full border[\s\S]*?\{doc\.status \|\| 'PENDING'\}\n\s*<\/span>/;

const newStatusBlock = `<div className="flex items-center gap-3">
                          <span className={\`text-xs font-bold px-2.5 py-1 rounded-full border
                            \${doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                            {doc.status || 'PENDING'}
                          </span>
                          
                          {(doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume) && (
                            <a 
                              href={
                                (doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume).startsWith('/')
                                ? \`\${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}\${doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume}\`
                                : (doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume)
                              } 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors"
                              title="View Document"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>`;

content = content.replace(statusRegex, newStatusBlock);

fs.writeFileSync(file, content);
console.log("Download/View button added!");
