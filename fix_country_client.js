const fs = require('fs');
const file = 'frontend/app/universities/by-country/[country]/CountryPageClient.tsx';
let code = fs.readFileSync(file, 'utf8');

// The declaration of countryLower is currently after the useEffect
const targetDecl = 'const countryLower = (country as string).toLowerCase().replace(/-/g, " ");';

// Remove it from its current position
code = code.replace(targetDecl, '');

// Place it before the useEffects, right after we get 'country' from useParams
code = code.replace(
  'const { country } = useParams();',
  'const { country } = useParams();\n  const countryLower = (country as string).toLowerCase().replace(/-/g, " ");'
);

fs.writeFileSync(file, code);
console.log('Fixed initialization order in CountryPageClient.tsx');
