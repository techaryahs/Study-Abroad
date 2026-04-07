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
    <div className="bg-[#f5f6f7] min-h-screen px-6 md:px-16 py-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Top Universities in Singapore
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* FILTER PANEL */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Filters</h2>
            <span className="text-xs text-gray-400 cursor-pointer">
              Clear All
            </span>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="border-b pb-3">Acceptance Rate</div>
            <div className="border-b pb-3">Tuition Fee</div>
            <div className="border-b pb-3">Living Expense</div>
            <div>Countries</div>
          </div>
        </div>

        {/* UNIVERSITY LIST */}
        <div className="md:col-span-3 space-y-6">
          {universities.map((uni: any) => (
            <UniversityCard key={uni.id} uni={uni} />
          ))}
        </div>
      </div>
    </div>
  );
}