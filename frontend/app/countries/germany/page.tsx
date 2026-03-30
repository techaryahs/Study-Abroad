"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function GermanyPage() {
  return (
    <CountryLayout 
      name="Germany"
      code="DE"
      description="Zero tuition fees in public universities and precision engineering."
      benefits={["No tuition fees in public universities", "Strong industrial connection", "Excellent engineering programs", "Top manufacturing economy"]}
      universities={["TUM", "LMU Munich", "Heidelberg University", "RWTH Aachen", "Technische Universität Berlin"]}
      essentials={{
        intakes: "Winter (Oct) & Summer (April)",
        psw: "18 Months (Job Seek)",
        living: "€10,000 - €11,000 / Year",
        work: "120 Full Days / Year"
      }}
      accentClass="accent-glow-purple"
    />
  );
}
