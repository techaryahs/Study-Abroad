const fs = require('fs');

const files = [
  'frontend/app/universities/bystate/ClientPage.tsx',
  'frontend/app/universities/affordable/AffordableUnisClient.tsx',
  'frontend/app/universities/unipredict/UniPredictClient.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Add import if missing
  if (!code.includes('useMembership')) {
    code = code.replace(
      'import { EntitlementGuard } from "@/components/shared/EntitlementGuard";',
      'import { EntitlementGuard } from "@/components/shared/EntitlementGuard";\nimport { useMembership } from "@/app/lib/membership/MembershipContext";'
    );
  }

  // Find a good place to add the hook
  if (code.includes('const searchParams = useSearchParams();')) {
    code = code.replace(
      'const searchParams = useSearchParams();',
      'const searchParams = useSearchParams();\n  const { canAccess } = useMembership();\n  const hasPremium = canAccess("university_search");'
    );
  } else if (code.includes('const [isFilterOpen, setIsFilterOpen] = useState(false);')) {
    code = code.replace(
      'const [isFilterOpen, setIsFilterOpen] = useState(false);',
      'const [isFilterOpen, setIsFilterOpen] = useState(false);\n  const { canAccess } = useMembership();\n  const hasPremium = canAccess("university_search");'
    );
  } else {
    // just append after component declaration
    code = code.replace(
      /export default function .*?\(.*?\) \{/,
      '$&\n  const { canAccess } = useMembership();\n  const hasPremium = canAccess("university_search");'
    );
  }

  // Map isLocked into UniversityCard for slice(0, 3)
  code = code.replace(
    /\{unis\.slice\(0, 3\)\.map\(\(uni: any\) => \(/g,
    '{unis.slice(0, 3).map((uni: any, i: number) => ('
  );
  code = code.replace(
    /<UniversityCard key=\{uni\.slug\} uni=\{uni\} \/>/g,
    '<UniversityCard key={uni.slug} uni={{...uni, isLocked: !hasPremium && i >= 3}} />'
  );

  // Map isLocked into UniversityCard for slice(3, 8) or slice(3, 10)
  code = code.replace(
    /\{unis\.slice\(3, \d+\)\.map\(\(uni: any\) => \(/g,
    '{unis.slice(3, 8).map((uni: any, i: number) => ('
  );
  code = code.replace(
    /<UniversityCard uni=\{uni\} \/>/g,
    '<UniversityCard uni={{...uni, isLocked: !hasPremium}} />'
  );

  fs.writeFileSync(file, code);
  console.log('Patched ' + file);
});
