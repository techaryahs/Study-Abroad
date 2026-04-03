"use client";

import { useParams } from "next/navigation";
import UniversityCard from "../UniversityCard";
import singaporeData from "@/data/singapore.json";
import newZealandData from "@/data/NewZealand Universities.json";
import germanyData from "@/data/YM_Grad_Germany_Universities.json";
import germanyPart2Data from "@/data/Germany_Universities_Part2.json";

export default function CountryPage() {
  const { country } = useParams();

  let dataCountry = country as string;
  let rawUniversities: any[] = [];

  const countryLower = (country as string).toLowerCase().replace(/-/g, " ");

  // 🔥 Dynamic dataset selection
  if (countryLower === "singapore") {
    dataCountry = singaporeData.country || "Singapore";
    rawUniversities = singaporeData.universities;
  } else if (countryLower === "new zealand") {
    dataCountry = newZealandData.country || "New Zealand";
    rawUniversities = newZealandData.universities;
  } else if (countryLower === "germany") {
    dataCountry = germanyData.country || "Germany";
    rawUniversities = [
      ...germanyData.universities,
      ...(germanyPart2Data as any[]),
    ];
  }

  // 🔥 Normalize the data from different JSON schemas
  const universities = rawUniversities.map((uni: any, index: number) => {
    const name = uni.university || uni.university_name || `University ${index + 1}`;
    const location = uni.location || uni.country || dataCountry;
    const address = uni.address || uni.city || "";

    let tuition = null;
    if (uni.annual_tuition_sgd) {
      tuition = `S$${uni.annual_tuition_sgd.toLocaleString()}`;
    } else if (uni.annual_tuition_eur) {
      tuition = `€${uni.annual_tuition_eur.toLocaleString()}`;
    } else if (uni.tuition_fees_eur) {
      tuition = `€${uni.tuition_fees_eur.toLocaleString()}`;
    } else if (uni.tuition_eur) {
      tuition = `€${uni.tuition_eur.toLocaleString()}`;
    }

    let acceptance = null;
    if (uni.acceptance_rate_pct != null) {
      acceptance = `${uni.acceptance_rate_pct}%`;
    }

    return {
      id: uni.id || index + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      location,
      address,
      tuition,
      acceptance,
      image: "/assets/university-placeholder.jpg", // keep placeholder
      ranking: uni.ymgrad_rank || index + 1,
    };
  });

  return (
    <div className="bg-[#f5f6f7] min-h-screen px-6 md:px-16 py-10">

      <h1 className="text-3xl font-bold mb-8 capitalize text-gray-800">
        Top Universities in {dataCountry}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Filters</h2>
            <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
              Clear All
            </span>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="border-b pb-3">Acceptance Rate</div>
            <div className="border-b pb-3">Tuition Fee</div>
            <div className="border-b pb-3">Living Expense</div>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-3 space-y-6">
          {universities.length > 0 ? (
            universities.map((uni: any) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-lg">No data available for {dataCountry}</p>
              <p className="text-gray-400 text-sm mt-2">More countries will be added soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}