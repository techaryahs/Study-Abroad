"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function PolandPage() {
  return (
    <CountryLayout 
      name="Poland"
      code="PL"
      description="Affordable quality education in the heart of Europe."
      benefits={["Low cost of living", "European degree value", "Rising startup ecosystem", "Rich history & culture"]}
      universities={["University of Warsaw", "Jagiellonian University", "Warsaw University of Technology", "University of Wroclaw", "AGH University"]}
      essentials={{
        intakes: "Oct & Feb",
        psw: "1 Year",
        living: "PLN 20,000 - 30,000 / Year",
        work: "Unlimited during vacation"
      }}
      accentClass="accent-glow-purple"
    />
  );
}
