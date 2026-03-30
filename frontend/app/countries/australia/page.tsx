"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function AustraliaPage() {
  return (
    <CountryLayout 
      name="Australia"
      code="AU"
      description="Vibrant living and top-tier group of eight universities."
      benefits={["Excellent living standards", "Diverse job markets", "Strong group of eight universities", "High graduate employability"]}
      universities={["University of Melbourne", "University of Sydney", "University of Queensland", "Monash University", "UNSW Sydney"]}
      essentials={{
        intakes: "Feb & July",
        psw: "2 to 4 Years",
        living: "A$21,000 - A$25,000 / Year",
        work: "48 Hours / Fortnight"
      }}
    />
  );
}
