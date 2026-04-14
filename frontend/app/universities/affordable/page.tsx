import fs from 'fs';
import path from 'path';
import UniversityCard from '../by-country/UniversityCard';

export const metadata = {
  title: 'High Ranked, Low Tuition Universities',
};

// Map country to currency symbol
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

export default function AffordableUnisPage() {
    // Read and parse all country JSON data files synchronously on the server
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir).filter(f => 
        f.endsWith('.json') && 
        !['scolarship.json', 'services-pricing.json'].includes(f)
    );

    let unis: any[] = [];

    for (const file of files) {
        const filePath = path.join(dataDir, file);
        try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                // Attach the country deduced from the filename or the internal location
                parsed.forEach(u => {
                    if (!u.location) u.location = {};
                    if (!u.location.country) {
                        u.location.country = file.replace('.json', '');
                    }
                });
                unis = unis.concat(parsed);
            }
        } catch (err) {
            console.error(`Failed to parse ${file}`, err);
        }
    }

    // Process and map to UniversityCard expected props
    const formattedUnis = unis.map(uni => {
        const branch = uni.branches?.[0] || {};
        const stats = branch.stats || {};
        
        let salaryRaw = uni.common_sections?.employment_figures?.average_salary 
            || stats.avg_salary 
            || null;
            
        const tuitionRaw = stats.tuition_fee;
        let rank = parseInt(uni.ranking_details?.overall_ranking || uni.ranking, 10);
        const country = uni.location?.country || '';
        const symbol = getCurrencySymbol(country);

        // Normalize rank.
        if (isNaN(rank)) {
            if (stats.acceptance_rate) {
                rank = Math.max(1, Math.round(stats.acceptance_rate * 1.5));
            } else if (stats.avg_gpa) {
                rank = Math.max(1, Math.round((4.0 - stats.avg_gpa) * 100 + 10));
            } else {
                rank = 999;
            }
        }

        // Calculate a "value score" combining rank and price
        const valueScore = rank * (tuitionRaw || 1000000);

        // Enhanced requirement extraction
        let sat = stats.avg_sat || null;
        let toefl = stats.toefl_min || branch.admitted_profiles?.toefl_min || null;
        let gpa = stats.avg_gpa || null;

        // If not found in first branch, try to find in any branch
        if (uni.branches && (!sat || !toefl || !gpa)) {
            const bs = uni.branches.find((b: any) => b.stats?.avg_sat);
            if (bs && !sat) sat = bs.stats.avg_sat;
            const bt = uni.branches.find((b: any) => b.admitted_profiles?.toefl_min || b.stats?.toefl_min);
            if (bt && !toefl) toefl = bt.admitted_profiles?.toefl_min || bt.stats?.toefl_min;
            const bg = uni.branches.find((b: any) => b.stats?.avg_gpa);
            if (bg && !gpa) gpa = bg.stats.avg_gpa;
        }

        return {
            originalName: uni.name,
            slug: uni.slug,
            name: uni.name,
            ranking: rank,
            image: uni.logo || "🏛️",
            location: `${uni.location?.city || ''}, ${uni.location?.country || ''}`.replace(/^, /, ''),
            address: uni.location?.state || '',
            acceptance: stats.acceptance_rate ? `${stats.acceptance_rate}%` : null,
            acceptanceRaw: stats.acceptance_rate || null,
            tuitionRaw: tuitionRaw,
            tuition: tuitionRaw ? formatCurrency(tuitionRaw, symbol) : null,
            salary: salaryRaw ? formatCurrency(salaryRaw, symbol) : null,
            sat,
            toefl,
            gpa,
            valueScore
        };
    }).filter(u => u.tuitionRaw && u.ranking && u.ranking < 200).slice(0, 50); // Filter to top 50 affordable

    // Sort according to rank and price combined metric
    formattedUnis.sort((a, b) => {
        // If one is significantly cheaper, but similar rank, it bubbles up. Using the value score.
        return a.valueScore - b.valueScore;
    });

    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#362B25] font-base selection:bg-[#D4A848]/20 overflow-x-hidden pt-[120px] pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-[#D4A848] tracking-tighter mb-4 text-center md:text-left font-serif">
                        High Ranked, Low Tuition
                    </h1>
                    <p className="text-[#675F5B] text-base sm:text-lg max-w-2xl text-center md:text-left font-medium leading-relaxed">
                        Discover top-tier education optimized for your budget. These institutions provide exceptional academic value globally based on independent rankings and tuition.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {formattedUnis.map((uni, idx) => (
                        <UniversityCard key={uni.slug || idx} uni={uni} />
                    ))}
                </div>
            </div>
        </main>
    );
}
