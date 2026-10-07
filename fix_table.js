const fs = require('fs');
const file = 'frontend/app/partnership/students/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Eye to imports
content = content.replace(
  'import { UserCheck, UserPlus, X, Check, AlertCircle } from "lucide-react";',
  'import { UserCheck, UserPlus, X, Check, AlertCircle, Eye } from "lucide-react";'
);

// 2. Change 'Actions' to 'ACTION'
content = content.replace(
  /<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">\s*Actions\s*<\/th>/,
  '<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">\n                      ACTION\n                    </th>'
);

// 3. Update the Action buttons in the table row
const oldActions = `{isEduMitraOrAdmin && (
                          <button
                            onClick={() => openAssignModal(s)}
                            className="font-semibold text-xs text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            {s.assignedConsultantId ? "Reassign" : "Assign"}
                          </button>
                        )}
                        <Link
                          href={\`/partnership/students/\${encodeURIComponent(
                            s.studentLeadId
                          )}\`}
                          className="font-medium text-xs text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          View
                        </Link>`;

const newActions = `{isEduMitraOrAdmin && (
                          <button
                            onClick={() => openAssignModal(s)}
                            className="font-semibold text-xs text-blue-700 hover:text-blue-900 hover:underline mr-3"
                          >
                            {s.assignedConsultantId ? "Reassign" : "Assign"}
                          </button>
                        )}
                        <Link
                          href={\`/partnership/students/\${encodeURIComponent(
                            s.studentLeadId
                          )}\`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <Eye size={14} />
                          View Profile
                        </Link>`;

content = content.replace(oldActions, newActions);

fs.writeFileSync(file, content);
console.log('Fixed table');
