"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function SopLorSupportPage() {
  return (
    <ServiceLayout 
      title="SOP & LOR Support"
      serviceId="sop-lor-support"
      description="Assistance in writing compelling Statement of Purpose and Letters of Recommendation to impact the admissions committee."
      details={[
        "Creative storytelling workshop",
        "Structural and grammatical polishing",
        "Unique value proposition drafting",
        "Plagiarism checks",
        "Multiple iteration support"
      ]}
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    />
  );
}
