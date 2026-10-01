const fs = require('fs');
const file = 'frontend/app/universities/[slug]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// The state declarations are currently around line 170. Let's find them.
const stateDecls = 'const [data, setData] = useState<any>(null);\n    const [loading, setLoading] = useState(true);\n    const [activeSection, setActiveSection] = useState("About");\n    const [mounted, setMounted] = useState(false);';

// Remove them from where they are
code = code.replace(stateDecls, '');
// Re-insert them at the very top of the component, right after `const slug = params?.slug;`
code = code.replace(
  'const slug = params?.slug;',
  'const slug = params?.slug;\n\n    ' + stateDecls
);

// Also I see duplicate 'currentPrograms' error TS2451
const duplicatePrograms = 'const currentPrograms = data.branches?.map((b: any) => b.name) || ["Engineering"];';
// Remove one of them if there are multiple.
if (code.split(duplicatePrograms).length > 2) {
  code = code.replace(duplicatePrograms, ''); // remove the first occurrence
}

fs.writeFileSync(file, code);
console.log('Fixed order in [slug]/page.tsx');
