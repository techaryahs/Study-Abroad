"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function FrancePage() {
  return (
    <CountryLayout 
      name="France"
      code="FR"
      description="Top-tier business schools and rich cultural heritage."
      benefits={["Excellent management programs", "European work exposure", "Cultural diversity", "Quality research"]}
      universities={["HEC Paris", "INSEAD", "Sorbonne University", "PSL Research University", "École Polytechnique"]}
      essentials={{
        intakes: "Jan & Sept",
        psw: "2 Years",
        living: "€8,000 - €12,000 / Year",
        work: "964 Hours / Year"
      }}
    />
  );
}
