const fs = require('fs');
const file = 'frontend/app/universities/by-country/UniversityCard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add isLocked
code = code.replace(
  'const acceptanceRaw = uni.acceptanceRaw ?? (uni.acceptance ? parseFloat(uni.acceptance) : null);',
  'const acceptanceRaw = uni.acceptanceRaw ?? (uni.acceptance ? parseFloat(uni.acceptance) : null);\n  const isLocked = uni.isLocked;'
);

// Add locked state styling to card
code = code.replace(
  'className="uni-card"',
  'className="uni-card"\n        style={{ background: isLocked ? "#FAFAF7" : "#FFFFFF", borderColor: isLocked ? "rgba(197,160,89, 0.4)" : "rgba(197,160,89, 0.15)", borderWidth: isLocked ? 2 : 1 }}'
);

// Add locked banner at the top of the card inner
code = code.replace(
  '<div className="card-inner" style={{ padding: "32px" }}>',
  `<div className="card-inner" style={{ padding: "32px" }}>\n          {isLocked && (\n            <div style={{ padding: "6px 12px", background: "rgba(197,160,89, 0.15)", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>\n              <span style={{ fontSize: 12 }}>🔒</span>\n              <span style={{ fontSize: 10, fontWeight: 900, color: "#2D2926", letterSpacing: 0.5 }}>PREMIUM UNIVERSITY • UNLOCK WITH MEMBERSHIP</span>\n            </div>\n          )}`
);

// Replace Stats grid values if locked
code = code.replace(
  '<StatCell label="Average Salary" value={uni.salary} icon="💼" />',
  '<StatCell label="Average Salary" value={isLocked ? "🔒 Locked" : uni.salary} icon="💼" />'
);
code = code.replace(
  '<StatCell label="Tuition Fees" value={uni.tuition} icon="💵" />',
  '<StatCell label="Tuition Fees" value={isLocked ? "🔒 Locked" : uni.tuition} icon="💵" />'
);
code = code.replace(
  '<StatCell label="Avg SAT Score" value={uni.sat ? String(uni.sat) : null} icon="📝" />',
  '<StatCell label="Avg SAT Score" value={isLocked ? "🔒" : (uni.sat ? String(uni.sat) : null)} icon="📝" />'
);
code = code.replace(
  '<StatCell label="Min. TOEFL" value={uni.toefl ? String(uni.toefl) : null} icon="🗣️" />',
  '<StatCell label="Min. TOEFL" value={isLocked ? "🔒" : (uni.toefl ? String(uni.toefl) : null)} icon="🗣️" />'
);
code = code.replace(
  '<StatCell label="Average GPA" value={uni.gpa ? String(uni.gpa) : null} icon="📊" />',
  '<StatCell label="Average GPA" value={isLocked ? "🔒" : (uni.gpa ? String(uni.gpa) : null)} icon="📊" />'
);

// Acceptance Rate Bar inside stats grid
code = code.replace(
  '<AcceptanceBar pct={acceptanceRaw} />',
  '{isLocked ? <div style={{ fontSize: 18, fontWeight: 700, color: "#C5A059", marginTop: 4 }}>🔒 Locked</div> : <AcceptanceBar pct={acceptanceRaw} />}'
);

// Pill badges
code = code.replace(
  '{uni.acceptance && (',
  '{!isLocked && uni.acceptance && ('
);
code = code.replace(
  '{uni.tuition && (',
  '{!isLocked && uni.tuition && ('
);
code = code.replace(
  '{uni.salary && (',
  '{!isLocked && uni.salary && ('
);

fs.writeFileSync(file, code);
console.log('Patched UniversityCard.tsx');
