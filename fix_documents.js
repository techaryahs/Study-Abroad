const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject allDocuments array before the return statement
const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
  const injection = `
  const allDocuments = [...(student?.studentLead?.documents || []), ...(student?.profile?.documents || [])];
  if (student?.profile?.resumeUrl || student?.profile?.resume) {
    allDocuments.push({
      docType: "Resume",
      url: student.profile.resumeUrl || student.profile.resume,
      status: "UPLOADED"
    });
  }
  
  `;
  content = content.slice(0, returnIndex) + injection + content.slice(returnIndex);
}

// Replace the documents render block
const documentsRegex = /\{\(!\(student\.studentLead\?\.documents \|\| \[\]\) \|\| \(student\.studentLead\?\.documents \|\| \[\]\)\.length === 0\) \? \([\s\S]*?No documents uploaded yet<\/p>\n\s*<\/div>\n\s*\) : \([\s\S]*?\{.*?\.map\(\(doc: any, i: number\) => \(/;

const newDocumentsBlock = `{allDocuments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {allDocuments.map((doc: any, i: number) => (`;

content = content.replace(documentsRegex, newDocumentsBlock);

fs.writeFileSync(file, content);
console.log("Documents rendering fixed!");
