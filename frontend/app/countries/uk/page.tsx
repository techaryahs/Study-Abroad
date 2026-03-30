"use client";

import CountryLayout from "@/components/layout/CountryLayout";

export default function UKPage() {
  return (
    <CountryLayout 
      name="UK"
      code="GB"
      description="Centuries of academic tradition and research excellence."
      benefits={["One 1-year Master's degree", "2-year post-study work permit", "Rich academic heritage", "Global research hub"]}
      universities={["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "King's College London"]}
      essentials={{
        intakes: "Jan, May & Sept",
        psw: "2 Years (Graduate Route)",
        living: "£12,000 - £15,000 / Year",
        work: "20 Hours / Week (Part-time)"
      }}
    />
  );
}
