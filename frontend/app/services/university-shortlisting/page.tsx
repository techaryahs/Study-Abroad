"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function UniversityShortlistingPage() {
  return (
    <ServiceLayout 
      title="University Shortlisting"
      serviceId="university-shortlisting"
      description="Our data-driven process shortlists universities that maximize your chances of acceptance and offer the best programs."
      details={[
        "Data-backed success probability",
        "Country and city comparison",
        "Tuition vs. ROI analysis",
        "Alumni networking insights",
        "Application deadlines tracking"
      ]}
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
    />
  );
}
