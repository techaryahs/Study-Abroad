const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentLeadId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Header Edit Profile button
content = content.replace(
  '{lead.leadStatus || "REGISTERED"}\n                </span>\n              </div>',
  `{lead.leadStatus || "REGISTERED"}\n                </span>\n                {canEditStudentProfile && (\n                  <button className="ml-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md">\n                    Edit Profile\n                  </button>\n                )}\n              </div>`
);

// Documents Add button
content = content.replace(
  '<FileText className="text-blue-600" size={18} /> Documents\n                </h3>',
  `<FileText className="text-blue-600" size={18} /> Documents\n                </h3>\n                {canManageDocuments && (\n                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 absolute top-6 right-6">\n                    + Upload\n                  </button>\n                )}`
);

// Shortlists & Applications
content = content.replace(
  '<h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Applications</h4>',
  `<div className="flex justify-between items-center mb-3">\n                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Applications</h4>\n                      {canManageApplications && <button className="text-xs font-bold text-blue-600 hover:text-blue-800">+ Add</button>}\n                    </div>`
);

content = content.replace(
  '<h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Offers</h4>',
  `<div className="flex justify-between items-center mb-3">\n                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Offers</h4>\n                      {canManageOffers && <button className="text-xs font-bold text-blue-600 hover:text-blue-800">+ Add</button>}\n                    </div>`
);

// Consultant Assign button
content = content.replace(
  '<UserCheck className="text-blue-600" size={18} /> Counselling Info\n                </h3>',
  `<UserCheck className="text-blue-600" size={18} /> Counselling Info\n                </h3>\n                {canAssignConsultant && (\n                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 absolute top-6 right-6">\n                    Assign\n                  </button>\n                )}`
);

// We need to add relative class to the parent divs to make 'absolute top-6 right-6' work.
content = content.replace(
  /<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">/g,
  '<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">'
);

fs.writeFileSync(file, content);
console.log('Added buttons');
