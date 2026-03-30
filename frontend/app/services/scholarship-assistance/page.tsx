"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function ScholarshipAssistancePage() {
  return (
    <ServiceLayout 
      title="Scholarship Assistance"
      description="Guidance in identifying and applying for scholarships, grants, and bursaries to reduce the financial burden of education."
      details={[
        "Global scholarship database access",
        "Merit-based application support",
        "Financial need documentation",
        "External grant identification",
        "Essay writing for scholarships"
      ]}
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
}
