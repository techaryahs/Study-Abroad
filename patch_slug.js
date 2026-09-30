const fs = require('fs');
const file = 'frontend/app/universities/[slug]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace local imports and static combinedData with a fetch.
code = code.replace(
  /const combinedData = \[\s*\.\.\.singaporeData,[\s\S]*?\.\.\.franceData\s*\];/g,
  ''
);

code = code.replace(
  /const data: any = combinedData\.find\(\(uni: any\) => \{[\s\S]*?return uniSlug === slug;\s*\}\);/g,
  ''
);

code = code.replace(
  'const [activeProgram, setActiveProgram] = useState(currentPrograms[0]);',
  'const [activeProgram, setActiveProgram] = useState("");'
);

code = code.replace(
  'const [activeSection, setActiveSection] = useState("About");\n    const [mounted, setMounted] = useState(false);',
  `const [data, setData] = useState<any>(null);\n    const [loading, setLoading] = useState(true);\n    const [activeSection, setActiveSection] = useState("About");\n    const [mounted, setMounted] = useState(false);`
);

const fetchEffect = `
    useEffect(() => {
        const fetchUni = async () => {
            try {
                const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
                const headers: any = {};
                if (token) headers.Authorization = \`Bearer \${token}\`;
                
                const url = \`\${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/universities/\${slug}\`;
                const res = await fetch(url, { headers });
                if (res.ok) {
                    const json = await res.json();
                    if (json.data) {
                        setData(json.data);
                        if (json.data.branches?.length > 0) {
                            setActiveProgram(json.data.branches[0].name);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUni();
    }, [slug]);
`;

code = code.replace(
  'useEffect(() => { setMounted(true); }, []);',
  `useEffect(() => { setMounted(true); }, []);${fetchEffect}`
);

code = code.replace(
  /if \(!data\) \{[\s\S]*?\}\n/,
  `if (loading) {
        return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>;
    }
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#2D2926]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">University Not Found</h1>
                    <p className="text-[#6B5E51]">We couldn't find the university you're looking for.</p>
                </div>
            </div>
        );
    }
    
    const currentPrograms = data.branches?.map((b: any) => b.name) || ["Engineering"];
`
);

code = code.replace(
  '<EntitlementGuard featureId="university_search" fallbackTitle="Unlock University Details" fallbackDescription="Get premium access to explore detailed admission chances, tuition costs, and student demographics for this university.">',
  '{(data.hasAccess === false || data.access === "locked") ? (\n                    <div className="card" style={{ padding: 40, textAlign: "center", marginTop: 40 }}>\n                        <p style={{ fontSize: 40, marginBottom: 20 }}>🔒</p>\n                        <h3 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#2D2926" }}>Premium University Data</h3>\n                        <p style={{ fontSize: 16, color: "#6B5E51", marginBottom: 24 }}>This university is beyond your current access limit. Upgrade to unlock its stats, tuition, and admission demographics.</p>\n                        <a href="/pricing" style={{ background: "#C5A059", color: "#FFF", padding: "12px 24px", borderRadius: 12, fontWeight: 700, display: "inline-block" }}>View Membership Plans</a>\n                    </div>\n                ) : (\n                <EntitlementGuard featureId="university_search" fallbackTitle="Unlock University Details" fallbackDescription="Get premium access to explore detailed admission chances, tuition costs, and student demographics for this university.">'
);

code = code.replace(
  '                </EntitlementGuard>\n            </div>\n        </div>',
  '                </EntitlementGuard>\n                )}\n            </div>\n        </div>'
);

code = code.replace(/import singaporeData from ["'].*?["'];/g, '');
code = code.replace(/import newZealandData from ["'].*?["'];/g, '');
code = code.replace(/import germanyData from ["'].*?["'];/g, '');
code = code.replace(/import usaData from ["'].*?["'];/g, '');
code = code.replace(/import ukData from ["'].*?["'];/g, '');
code = code.replace(/import ausData from ["'].*?["'];/g, '');
code = code.replace(/import canadaData from ["'].*?["'];/g, '');
code = code.replace(/import dubaiData from ["'].*?["'];/g, '');
code = code.replace(/import irelandData from ["'].*?["'];/g, '');
code = code.replace(/import switzerlandData from ["'].*?["'];/g, '');
code = code.replace(/import netherlandsData from ["'].*?["'];/g, '');
code = code.replace(/import franceData from ["'].*?["'];/g, '');

fs.writeFileSync(file, code);
console.log('Patched [slug]/page.tsx');
