import React, { Suspense } from 'react';
import fs from 'fs';
import path from 'path';
import ClientPage from './ClientPage';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Top Universities by State with International Eduleader Council | Best Colleges by Region",

  description:
    "Explore top universities by state and region with the International Eduleader Council including California, Texas, Ontario, and more for smarter study abroad planning.",

  keywords: [
    "Top universities by state",
    "Best colleges by region",
    "Universities in California",
    "Universities in Texas",
    "Study abroad universities",
    "International Eduleader Council",
    "Top universities worldwide",
    "Regional universities abroad",
  ],

  alternates: {
    canonical:
      "https://yourdomain.com/universities/by-state",
  },

  openGraph: {
    title:
      "Top Universities by State | International Eduleader Council",

    description:
      "Discover top-ranked universities by state and region for smarter study abroad planning.",

    url:
      "https://yourdomain.com/universities/by-state",

    siteName: "International Eduleader Council",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Top Universities by State | IEC",

    description:
      "Explore leading universities by region and state worldwide with IEC.",
  },
};

function getCurrencySymbol(country: string) {
    if (!country) return '$';
    const c = country.toLowerCase();
    if (c.includes('united kingdom') || c.includes('uk') || c.includes('england') || c.includes('scotland')) return '£';
    if (c.includes('germany') || c.includes('france') || c.includes('ireland') || c.includes('netherlands')) return '€';
    if (c.includes('australia')) return 'A$';
    if (c.includes('new zealand')) return 'NZ$';
    if (c.includes('switzerland')) return 'CHF ';
    if (c.includes('singapore')) return 'S$';
    if (c.includes('dubai') || c.includes('uae')) return 'AED ';
    return '$';
}

function formatCurrency(amount: number, symbol: string) {
    return `${symbol}${amount.toLocaleString()}`;
}

export default function ByStatePage() {
    // 1. Read data securely on the server
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir).filter(f => 
        f.endsWith('.json') && 
        !['scolarship.json', 'services-pricing.json'].includes(f)
    );

    let allUnis: any[] = [];
    files.forEach(file => {
        try {
            const raw = fs.readFileSync(path.join(dataDir, file), 'utf-8');
            const parsed = JSON.parse(raw);
            if(Array.isArray(parsed)) {
                // Imbue country logic
                parsed.forEach(u => {
                    if (!u.location) u.location = {};
                    if (!u.location.country) {
                        u.location.country = file.replace('.json', '');
                    }
                });
                allUnis = allUnis.concat(parsed);
            }
        } catch (e) {
            console.error("Parse fail", file);
        }
    });

    // 2. Group correctly by state name
    const byState: Record<string, any[]> = {};
    
    allUnis.forEach(uni => {
        const stateRaw = uni.location?.state?.trim();
        if (stateRaw && stateRaw.length > 2) { 
            // Avoid malformed state names
            if (!byState[stateRaw]) byState[stateRaw] = [];
            
            const branch = uni.branches?.[0] || {};
            const stats = branch.stats || {};
            
            let salaryRaw = uni.common_sections?.employment_figures?.average_salary || stats.avg_salary || null;
            const tuitionRaw = stats.tuition_fee;
            let rank = parseInt(uni.ranking_details?.overall_ranking || uni.ranking, 10);
            
            if (isNaN(rank)) {
                if (stats.acceptance_rate) rank = Math.max(1, Math.round(stats.acceptance_rate * 1.5));
                else if (stats.avg_gpa) rank = Math.max(1, Math.round((4.0 - stats.avg_gpa) * 100 + 10));
                else rank = 999;
            }

            const symbol = getCurrencySymbol(uni.location.country);

            byState[stateRaw].push({
                originalName: uni.name,
                slug: uni.slug,
                name: uni.name,
                ranking: rank,
                image: uni.logo || "🏛️",
                location: `${uni.location?.city || ''}, ${uni.location?.country || ''}`.replace(/^, /, ''),
                address: uni.location?.state || '',
                acceptance: stats.acceptance_rate ? `${stats.acceptance_rate}%` : null,
                acceptanceRaw: stats.acceptance_rate || null,
                tuition: tuitionRaw ? formatCurrency(tuitionRaw, symbol) : null,
                salary: salaryRaw ? formatCurrency(salaryRaw, symbol) : null,
                sat: stats.avg_sat || null,
                toefl: stats.min_toefl || null,
                gpa: stats.avg_gpa || null,
            });
        }
    });

    // 3. Sort logic
    Object.keys(byState).forEach(st => {
        byState[st] = byState[st].sort((a, b) => a.ranking - b.ranking);
    });

    // Extract top states that have the most universities
    const sortedStates = Object.keys(byState)
        .sort((a, b) => byState[b].length - byState[a].length)
        .slice(0, 50); // Keep purely to 50 active main states

    // Prune out any states that didn't make the cut from the byState object
    const finalByState: Record<string, any[]> = {};
    sortedStates.forEach(st => finalByState[st] = byState[st]);

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">Loading regional data...</div>}>
            <ClientPage states={sortedStates} byState={finalByState} />
        </Suspense>
    );
}
