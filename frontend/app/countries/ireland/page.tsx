"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function IrelandPage() {
  return (
    <CountryLayout 
      name="Ireland"
      code="IE"
      description="Europe's tech hub with excellent post-study work visa."
      benefits={["Europe's primary tech base", "English speaking environment", "Friendly immigration policy", "Growing job sector"]}
      universities={["Trinity College Dublin", "UCD", "University of Galway", "UCC", "Dublin City University"]}
      essentials={{
        intakes: "Jan & Sept",
        psw: "2 Years",
        living: "€10,000 - €12,000 / Year",
        work: "20 Hours / Week"
      }}
      accentClass="accent-glow-blue"
    />
  );
}
