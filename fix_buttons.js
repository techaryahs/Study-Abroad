const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. First remove the corrupted injection (the <any>(null) part was because the regex matched the whole document tail)
// Wait, the regex `/<a[\s\S]*?title="View Document"[\s\S]*?<\/a>/` matched EVERYTHING from the first button to the last `</a>` in the file?
// Oh! There was no other `</a>`? Actually, yes!
// Let me just restore the file from before I broke it by looking for the `div className="flex items-center gap-3"`

// I'll just rewrite the map function for documents.
const mapStart = '{allDocuments.map((doc: any, i: number) => (';
const mapEndIndex = content.indexOf('</div>\n                )}', content.indexOf(mapStart));

const newMap = `{allDocuments.map((doc: any, i: number) => {
                      const fileHref = (doc.url || doc.fileUrl || doc.proofReference || doc.documentUrl || doc.resumeUrl || doc.resume);
                      const fullHref = fileHref?.startsWith('/') 
                        ? \`\${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}\${fileHref}\`
                        : fileHref;
                        
                      return (
                      <div key={i} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.docType}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={\`text-xs font-bold px-2.5 py-1 rounded-full border
                            \${doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                            {doc.status || 'PENDING'}
                          </span>
                          
                          {fullHref && (
                            <div className="flex items-center gap-1">
                              <a 
                                href={fullHref} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors"
                                title="View Document"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a 
                                href={fullHref.includes('?') ? fullHref + '&download=1' : fullHref + '?download=1'} 
                                download
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors"
                                title="Download Document"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>`;
                  
const beforeMap = content.substring(0, content.indexOf(mapStart));
const afterMap = content.substring(mapEndIndex);

content = beforeMap + newMap + afterMap;

fs.writeFileSync(file, content);
console.log("Documents map fixed!");
