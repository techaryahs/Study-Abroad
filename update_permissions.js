const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentLeadId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert permission logic after getUser() call or add it
const permissionLogic = `
  const user = getUser();
  const role = String(user?.role || "").toLowerCase();
  
  const isPartner = role === "partner";
  const isAdmin = ["admin", "super_admin"].includes(role);
  const isConsultant = role === "consultant" || role === "counsellor";
  
  const canViewStudentProfile = true; // both can view
  
  const canEditStudentProfile = isAdmin || isConsultant;
  const canManageDocuments = isAdmin || isConsultant;
  const canManageApplications = isAdmin || isConsultant;
  const canManageOffers = isAdmin || isConsultant;
  const canAssignConsultant = isAdmin;
`;

content = content.replace(
  'const { studentLeadId } = useParams();',
  permissionLogic + '\n  const { studentLeadId } = useParams();'
);

fs.writeFileSync(file, content);
console.log('Added permissions logic');
