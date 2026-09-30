const fs = require('fs');
const file = 'frontend/app/universities/byprogram/ClientPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
if (!code.includes('useMembership')) {
  code = code.replace(
    'import { EntitlementGuard } from "@/components/shared/EntitlementGuard";',
    'import { EntitlementGuard } from "@/components/shared/EntitlementGuard";\nimport { useMembership } from "@/app/lib/membership/MembershipContext";'
  );
}

// Add hook
code = code.replace(
  'const unis = byProgram[selectedProgram] || [];',
  'const unis = byProgram[selectedProgram] || [];\n  const { canAccess } = useMembership();\n  const hasPremium = canAccess("university_search");'
);

// Map isLocked into UniversityCard for slice(0, 3)
code = code.replace(
  '{unis.slice(0, 3).map((uni: any) => (',
  '{unis.slice(0, 3).map((uni: any, i: number) => ('
);
code = code.replace(
  '<UniversityCard key={uni.slug} uni={uni} />',
  '<UniversityCard key={uni.slug} uni={{...uni, isLocked: !hasPremium && i >= 3}} />'
);

// Map isLocked into UniversityCard for slice(3, 8)
code = code.replace(
  '{unis.slice(3, 8).map((uni: any) => (',
  '{unis.slice(3, 8).map((uni: any, i: number) => ('
);
code = code.replace(
  '<UniversityCard uni={uni} />',
  '<UniversityCard uni={{...uni, isLocked: !hasPremium}} />'
);

fs.writeFileSync(file, code);
console.log('Patched byprogram');
