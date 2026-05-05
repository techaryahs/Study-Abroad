import React from 'react';
import fs from 'fs';
import path from 'path';
import ClientPage from './ClientPage';

export default async function ByProgramPage() {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['scolarship.json', 'services-pricing.json'].includes(f));

  // Program name -> List of related universities
  const byProgram: Record<string, any[]> = {};

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const countryName = file.replace('.json', '');
    
    content.forEach((uni: any) => {
      const branches = uni.branches || [];
      
      branches.forEach((branch: any) => {
        const programName = branch.name || "General";
        
        if (!byProgram[programName]) {
          byProgram[programName] = [];
        }

        const alreadyAdded = byProgram[programName].some(u => u.slug === uni.slug);
        
        if (!alreadyAdded) {
          const normalizedUni = {
            name: uni.name,
            slug: uni.slug || uni.name.toLowerCase().replace(/\s+/g, '-'),
            image: uni.logo || "/university-placeholder.png",
            location: uni.location ? `${uni.location.city}, ${uni.location.country || countryName}` : countryName,
            address: uni.location?.city || "",
            ranking: uni.ranking || 999,
            acceptance: branch.stats?.acceptance_rate ? `${branch.stats.acceptance_rate}%` : "Variable",
            acceptanceRaw: branch.stats?.acceptance_rate || null,
            tuition: branch.stats?.tuition_fee ? `$${branch.stats.tuition_fee.toLocaleString()}` : "Contact for fees",
            salary: branch.stats?.avg_salary ? `$${branch.stats.avg_salary.toLocaleString()}` : null,
            sat: branch.stats?.avg_sat || null,
            toefl: uni.admitted_profiles?.toefl_min || null,
            gpa: branch.stats?.avg_gpa || null
          };
          
          byProgram[programName].push(normalizedUni);
        }
      });
    });
  });

  const sortedPrograms = Object.keys(byProgram).sort((a, b) => byProgram[b].length - byProgram[a].length);

  const categories: Record<string, string[]> = {
    "Engineering & Tech": sortedPrograms.filter(p => p.toLowerCase().includes('engineer') || p.toLowerCase().includes('computer') || p.toLowerCase().includes('data science') || p.toLowerCase().includes('robotics')),
    "Business & Management": sortedPrograms.filter(p => p.toLowerCase().includes('business') || p.toLowerCase().includes('mba') || p.toLowerCase().includes('management') || p.toLowerCase().includes('finance') || p.toLowerCase().includes('economy')),
    "Humanities & Law": sortedPrograms.filter(p => p.toLowerCase().includes('law') || p.toLowerCase().includes('art') || p.toLowerCase().includes('design') || p.toLowerCase().includes('politics')),
    "Sciences & Health": sortedPrograms.filter(p => p.toLowerCase().includes('science') || p.toLowerCase().includes('medicine') || p.toLowerCase().includes('bio') || p.toLowerCase().includes('psychology')),
  };

  const categoricallyUsed = new Set(Object.values(categories).flat());
  const otherPrograms = sortedPrograms.filter(p => !categoricallyUsed.has(p));
  if (otherPrograms.length > 0) categories["Other Programs"] = otherPrograms;

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-black">Loading academic data...</div>}>
      <ClientPage 
        categories={categories} 
        byProgram={byProgram} 
        allPrograms={sortedPrograms}
      />
    </React.Suspense>
  );
}