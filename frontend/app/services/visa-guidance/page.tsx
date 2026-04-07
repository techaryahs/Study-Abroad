"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function VisaGuidancePage() {
  return (
    <ServiceLayout 
      title="Visa Guidance"
      serviceId="visa-guidance"
      accentClass="accent-glow-blue"
      description="Complete support for the visa application process, document checklist, and interview preparation for successful outcomes."
      details={[
        "Country-specific document checklist",
        "Mock visa interviews",
        "Financial proof documentation",
        "Sponsorship advisory",
        "Visa rejection appeal support"
      ]}
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      }
    />
  );
}
