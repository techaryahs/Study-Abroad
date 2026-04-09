"use client";

import UniversityCard from "./UniversityCard";
import data from "@/data/singapore.json";

export default function ByCountryPage() {
  
  // 🔥 Transform dataset
  const universities = data.map((uni: any, index: number) => ({
    id: uni._id || index,
    name: uni.name,
    slug: uni.slug || uni.name.toLowerCase().replace(/\s+/g, "-"),
    location: uni.location ? `${uni.location.city}, ${uni.location.country}` : "Singapore",
    address: uni.location?.city || "Singapore",
    tuition: uni.branches?.[0]?.stats?.tuition_fee
      ? `S$${uni.branches[0].stats.tuition_fee.toLocaleString()}`
      : "N/A",
    acceptance: uni.branches?.[0]?.stats?.acceptance_rate
      ? `${uni.branches[0].stats.acceptance_rate}%`
      : "N/A",
    image: "/university-placeholder.png", // keep placeholder
    ranking: index + 1,
  }));

  return (
    <div className="min-h-screen px-6 md:px-16 py-16" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .card-shell {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="fd text-5xl font-bold text-[#2D2926] mb-12">
          Premier Institutions in <span style={{ color: "#C5A059" }}>Singapore</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

          {/* PARAMETERS PANEL */}
          <div className="card-shell lg:sticky lg:top-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-[#2D2926] tracking-tight uppercase text-sm">Parameters</h2>
              <span className="text-xs text-[#6B5E51] cursor-pointer hover:text-[#C5A059] font-bold">
                Reset All
              </span>
            </div>

            <div className="space-y-6 text-sm text-[#6B5E51] font-medium">
              <div className="border-b border-[#F1EDEA] pb-4 flex justify-between">Admission Selectivity <span>▾</span></div>
              <div className="border-b border-[#F1EDEA] pb-4 flex justify-between">Institutional Investment <span>▾</span></div>
              <div className="border-b border-[#F1EDEA] pb-4 flex justify-between">Geographic Distribution <span>▾</span></div>
              <div className="pt-2 flex justify-between">Advanced Metrics <span>▾</span></div>
            </div>
          </div>

          {/* INSTITUTIONAL LIST */}
          <div className="lg:col-span-3 space-y-8">
            {universities.map((uni: any) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}