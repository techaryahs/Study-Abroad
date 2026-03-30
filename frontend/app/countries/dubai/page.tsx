"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function DubaiPage() {
  return (
    <CountryLayout 
      name="Dubai"
      code="AE"
      description="Emerging global hub for business and hospitality."
      benefits={["Tax free earnings", "Modern infrastructure", "Global hospitality lead", "Easy visa processing"]}
      universities={["Zayed University", "University of Wollongong Dubai", "Middlesex University", "Heriot-Watt University", "American University in Dubai"]}
      essentials={{
        intakes: "Jan, May & Sept",
        psw: "Varies by Sponsor",
        living: "AED 35,000 - 45,000 / Year",
        work: "Student Work Permit Required"
      }}
    />
  );
}
