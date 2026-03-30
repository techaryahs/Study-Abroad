"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function CanadaPage() {
  return (
    <CountryLayout 
      name="Canada"
      code="CA"
      description="Student-friendly policies and high-quality lifestyle."
      benefits={["Post-graduation work permit", "Pathways to PR", "DLI certified colleges", "High-quality lifestyle"]}
      universities={["University of Toronto", "UBC", "McGill University", "University of Waterloo", "University of Alberta"]}
      essentials={{
        intakes: "Jan, May & Sept",
        psw: "Up to 3 Years (PGWP)",
        living: "C$15,000 - C$20,000 / Year",
        work: "20 Hours / Week (Off-campus)"
      }}
      accentClass="accent-glow-blue"
    />
  );
}
