import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from "next";
import ClientPage from './ClientPage';

type PageProps = {
  searchParams: {
    program?: string;
  };
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const program = (await searchParams)?.program?.toLowerCase() || "";

  // BUSINESS
  if (
    program.includes("business") ||
    program.includes("mba") ||
    program.includes("management") ||
    program.includes("finance")
  ) {
    return {
      title:
        "Business Programs Abroad with EduLeaderGlobal | MBA & Management Courses",

      description:
        "Study Business, MBA, Finance, Marketing, and Management programs abroad with EduLeaderGlobal expert university admissions and visa guidance.",
    };
  }

  // SCIENCE
  if (
    program.includes("science") ||
    program.includes("biotechnology") ||
    program.includes("physics") ||
    program.includes("chemistry") ||
    program.includes("biology")
  ) {
    return {
      title:
        "Science Programs Abroad with EduLeaderGlobal | Top Universities Worldwide",

      description:
        "Discover leading science programs abroad with the EduLeaderGlobal including Data Science, Biotechnology, Physics, Chemistry, and Life Sciences at top universities.",
    };
  }

  // DEFAULT ENGINEERING
  return {
    title:
      "Engineering Programs Abroad with EduLeaderGlobal | Top Global Universities",

    description:
      "Explore top engineering programs abroad with the EduLeaderGlobal including Computer Science, Mechanical, Civil, AI, and Electrical Engineering at leading universities worldwide.",
  };
}

export default async function ByProgramPage() {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['scolarship.json', 'services-pricing.json'].includes(f));

  // Program name -> List of related universities
  const byProgram: Record<string, any[]> = {};

  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const countryName = file.replace('.json', '');
    
    content.forEach((uni: any) => {
      // Logic from by-country to normalize uni data for the card
      const branches = uni.branches || [];
      
      branches.forEach((branch: any) => {
        const programName = branch.name || "General";
        
        if (!byProgram[programName]) {
          byProgram[programName] = [];
        }

        // We only add the university once per program
        const alreadyAdded = byProgram[programName].some(u => u.slug === uni.slug);
        
        if (!alreadyAdded) {
          // Normalize university data for UniversityCard
          const normalizedUni = {
            name: uni.name,
            slug: uni.slug || uni.name.toLowerCase().replace(/\s+/g, '-'),
            image: uni.logo || "/university-placeholder.png",
            location: uni.location ? `${uni.location.city}, ${uni.location.country || countryName}` : countryName,
            address: uni.location?.city || "",
            ranking: uni.ranking || 999,
            // Stats from this specific branch if available
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

  // Sort programs by popularity (uni count)
  const sortedPrograms = Object.keys(byProgram).sort((a, b) => byProgram[b].length - byProgram[a].length);

  // Group into categories for the UI
  const categories: Record<string, string[]> = {
    "Engineering & Tech": sortedPrograms.filter(p => p.toLowerCase().includes('engineer') || p.toLowerCase().includes('computer') || p.toLowerCase().includes('data science') || p.toLowerCase().includes('robotics')),
    "Business & Management": sortedPrograms.filter(p => p.toLowerCase().includes('business') || p.toLowerCase().includes('mba') || p.toLowerCase().includes('management') || p.toLowerCase().includes('finance') || p.toLowerCase().includes('economy')),
    "Humanities & Law": sortedPrograms.filter(p => p.toLowerCase().includes('law') || p.toLowerCase().includes('art') || p.toLowerCase().includes('design') || p.toLowerCase().includes('politics')),
    "Sciences & Health": sortedPrograms.filter(p => p.toLowerCase().includes('science') || p.toLowerCase().includes('medicine') || p.toLowerCase().includes('bio') || p.toLowerCase().includes('psychology')),
  };

  // Add "Other" for anything missed
  const categoricallyUsed = new Set(Object.values(categories).flat());
  const otherPrograms = sortedPrograms.filter(p => !categoricallyUsed.has(p));
  if (otherPrograms.length > 0) categories["Other Programs"] = otherPrograms;

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">Loading academic data...</div>}>
      <ClientPage 
        categories={categories} 
        byProgram={byProgram} 
        allPrograms={sortedPrograms}
      />
    </React.Suspense>
  );
}
