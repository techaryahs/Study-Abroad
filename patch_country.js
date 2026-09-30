const fs = require('fs');
const file = 'frontend/app/universities/by-country/[country]/CountryPageClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add serverData state
code = code.replace(
  'const [isBookingOpen, setIsBookingOpen] = useState(false);',
  'const [isBookingOpen, setIsBookingOpen] = useState(false);\n  const [serverData, setServerData] = useState<any[] | null>(null);'
);

// Add useEffect to fetch from API
code = code.replace(
  'useEffect(() => { setMounted(true); }, []);',
  `useEffect(() => { setMounted(true); }, []);\n\n  useEffect(() => {\n    const fetchUnis = async () => {\n      try {\n        const token = localStorage.getItem("token") || localStorage.getItem("auth_token");\n        const headers: any = {};\n        if (token) headers.Authorization = \`Bearer \${token}\`;\n        \n        const url = \`\${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/universities?country=\${countryLower}\`;\n        const res = await fetch(url, { headers });\n        if (res.ok) {\n          const json = await res.json();\n          if (json.data) setServerData(json.data);\n        }\n      } catch (e) { console.error(e); }\n    };\n    fetchUnis();\n  }, [countryLower]);`
);

// Switch rawUniversities to activeUniversities in useMemo
code = code.replace(
  'const universities = useMemo(() => rawUniversities.map((uni: any, index: number) => {',
  'const activeData = serverData || rawUniversities;\n  const universities = useMemo(() => activeData.map((uni: any, index: number) => {'
);
code = code.replace(
  '}), [rawUniversities]);',
  '}), [activeData]);'
);

// Add isLocked to the returned uni object
code = code.replace(
  'ranking: uni.ymgrad_rank || index + 1,\n    };',
  'ranking: uni.ymgrad_rank || index + 1,\n      isLocked: uni.hasAccess !== undefined ? (!uni.hasAccess || uni.access === "locked") : index >= 3,\n    };'
);

fs.writeFileSync(file, code);
console.log('Patched CountryPageClient.tsx');
