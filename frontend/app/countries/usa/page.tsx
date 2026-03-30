"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function USAPage() {
  return (
    <CountryLayout 
      name="USA"
      code="US"
      description="World-class Ivy League universities and unmatched industry ROI."
      benefits={["Stay back options for 3 years", "World-renowned Ivy League reputation", "Wide variety of STEM courses", "Globally recognized certifications"]}
      universities={["Harvard University", "Stanford University", "MIT", "Columbia University", "Yale University"]}
      essentials={{
        intakes: "Spring (Jan) & Fall (Aug)",
        psw: "Up to 36 Months (STEM)",
        living: "$10,000 - $18,000 / Year",
        work: "20 Hours / Week (On-campus)"
      }}
      accentClass="accent-glow-blue"
    />
  );
}
