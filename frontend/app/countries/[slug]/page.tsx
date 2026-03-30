"use client";

import CountryLayout from "@/components/layout/CountryLayout";
import { useParams, notFound } from "next/navigation";

const countriesData: Record<string, {
  name: string;
  code: string;
  description: string;
  benefits: string[];
  universities: string[];
  essentials: {
    intakes: string;
    psw: string;
    living: string;
    work: string;
  };
  accentClass?: string;
}> = {
  "usa": {
    name: "USA",
    code: "US",
    description: "World-class Ivy League universities and unmatched industry ROI.",
    benefits: ["Stay back options for 3 years", "World-renowned Ivy League reputation", "Wide variety of STEM courses", "Globally recognized certifications"],
    universities: ["Harvard University", "Stanford University", "MIT", "Columbia University", "Yale University"],
    essentials: {
      intakes: "Spring (Jan) & Fall (Aug)",
      psw: "Up to 36 Months (STEM)",
      living: "$10,000 - $18,000 / Year",
      work: "20 Hours / Week (On-campus)"
    },
    accentClass: "accent-glow-blue"
  },
  "uk": {
    name: "UK",
    code: "GB",
    description: "Centuries of academic tradition and research excellence.",
    benefits: ["One 1-year Master's degree", "2-year post-study work permit", "Rich academic heritage", "Global research hub"],
    universities: ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "King's College London"],
    essentials: {
      intakes: "Jan, May & Sept",
      psw: "2 Years (Graduate Route)",
      living: "£12,000 - £15,000 / Year",
      work: "20 Hours / Week (Part-time)"
    }
  },
  "germany": {
    name: "Germany",
    code: "DE",
    description: "Zero tuition fees in public universities and precision engineering.",
    benefits: ["No tuition fees in public universities", "Strong industrial connection", "Excellent engineering programs", "Top manufacturing economy"],
    universities: ["TUM", "LMU Munich", "Heidelberg University", "RWTH Aachen", "Technische Universität Berlin"],
    essentials: {
      intakes: "Winter (Oct) & Summer (April)",
      psw: "18 Months (Job Seek)",
      living: "€10,000 - €11,000 / Year",
      work: "120 Full Days / Year"
    },
    accentClass: "accent-glow-purple"
  },
  "australia": {
    name: "Australia",
    code: "AU",
    description: "Vibrant living and top-tier group of eight universities.",
    benefits: ["Excellent living standards", "Diverse job markets", "Strong group of eight universities", "High graduate employability"],
    universities: ["University of Melbourne", "University of Sydney", "University of Queensland", "Monash University", "UNSW Sydney"],
    essentials: {
      intakes: "Feb & July",
      psw: "2 to 4 Years",
      living: "A$21,000 - A$25,000 / Year",
      work: "48 Hours / Fortnight"
    }
  },
  "canada": {
    name: "Canada",
    code: "CA",
    description: "Student-friendly policies and high-quality lifestyle.",
    benefits: ["Post-graduation work permit", "Pathways to PR", "DLI certified colleges", "High-quality lifestyle"],
    universities: ["University of Toronto", "UBC", "McGill University", "University of Waterloo", "University of Alberta"],
    essentials: {
      intakes: "Jan, May & Sept",
      psw: "Up to 3 Years (PGWP)",
      living: "C$15,000 - C$20,000 / Year",
      work: "20 Hours / Week (Off-campus)"
    },
    accentClass: "accent-glow-blue"
  },
  "france": {
    name: "France",
    code: "FR",
    description: "Top-tier business schools and rich cultural heritage.",
    benefits: ["Excellent management programs", "European work exposure", "Cultural diversity", "Quality research"],
    universities: ["HEC Paris", "INSEAD", "Sorbonne University", "PSL Research University", "École Polytechnique"],
    essentials: {
      intakes: "Jan & Sept",
      psw: "2 Years",
      living: "€8,000 - €12,000 / Year",
      work: "964 Hours / Year"
    }
  },
  "ireland": {
    name: "Ireland",
    code: "IE",
    description: "Europe's tech hub with excellent post-study work visa.",
    benefits: ["Europe's primary tech base", "English speaking environment", "Friendly immigration policy", "Growing job sector"],
    universities: ["Trinity College Dublin", "UCD", "University of Galway", "UCC", "Dublin City University"],
    essentials: {
      intakes: "Jan & Sept",
      psw: "2 Years",
      living: "€10,000 - €12,000 / Year",
      work: "20 Hours / Week"
    },
    accentClass: "accent-glow-blue"
  },
  "dubai": {
    name: "Dubai",
    code: "AE",
    description: "Emerging global hub for business and hospitality.",
    benefits: ["Tax free earnings", "Modern infrastructure", "Global hospitality lead", "Easy visa processing"],
    universities: ["Zayed University", "University of Wollongong Dubai", "Middlesex University", "Heriot-Watt University", "American University in Dubai"],
    essentials: {
      intakes: "Jan, May & Sept",
      psw: "Varies by Sponsor",
      living: "AED 35,000 - 45,000 / Year",
      work: "Student Work Permit Required"
    }
  },
  "poland": {
    name: "Poland",
    code: "PL",
    description: "Affordable quality education in the heart of Europe.",
    benefits: ["Low cost of living", "European degree value", "Rising startup ecosystem", "Rich history & culture"],
    universities: ["University of Warsaw", "Jagiellonian University", "Warsaw University of Technology", "University of Wroclaw", "AGH University"],
    essentials: {
      intakes: "Oct & Feb",
      psw: "1 Year",
      living: "PLN 20,000 - 30,000 / Year",
      work: "Unlimited during vacation"
    },
    accentClass: "accent-glow-purple"
  }
};

export default function CountryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const country = countriesData[slug.toLowerCase()];

  if (!country) return notFound();

  return (
    <CountryLayout 
      name={country.name}
      code={country.code}
      description={country.description}
      benefits={country.benefits}
      universities={country.universities}
      essentials={country.essentials}
      accentClass={country.accentClass}
    />
  );
}
