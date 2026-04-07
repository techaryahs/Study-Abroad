"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function AdmissionGuidancePage() {
  return (
    <ServiceLayout 
      title="Admission Guidance"
      serviceId="admission-guidance"
      description="Personalized advice from experts to help you apply for the best universities based on your profile and career goals."
      details={[
        "Profile evaluation and gap analysis",
        "One-on-one expert mentorship",
        "University application strategy",
        "Admission interview preparation",
        "Enrollment and deposit assistance"
      ]}
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      }
    />
  );
}
