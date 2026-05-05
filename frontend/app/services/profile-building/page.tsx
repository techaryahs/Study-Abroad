"use client";

import ServiceLayout from "@/components/layout/ServiceLayout";

export default function ProfileBuildingPage() {
  return (
    <div>
      <style>{`
        .profile-building-page p,
        .profile-building-page li {
          color: #000000 !important;
        }
      `}</style>
      <div className="profile-building-page">
        <ServiceLayout
          title="Profile Building"
          accentClass="accent-glow-gold"
          serviceId="profile-building"
          description="Strategies to enhance your profile with research papers, internships, and certifications before applying for Ivy League universities."
          details={[
            "Research paper publication help",
            "Internship placement advisory",
            "Certification recommendation",
            "Extra-curricular portfolio building",
            "Skill gap identification"
          ]}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}