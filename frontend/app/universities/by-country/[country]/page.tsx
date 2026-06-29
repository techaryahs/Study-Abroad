import type { Metadata } from "next";
import CountryPageClient from "./CountryPageClient";

type Props = {
  params: {
    country: string;
  };
};

const SEO_DATA: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  usa: {
    title:
      "Study in USA with EduLeaderGlobal | Top Universities & Student Visa Guidance",
    description:
      "Study in the USA with EduLeaderGlobal – EduLeaderGlobal. Get expert guidance for university admissions, scholarships, SOPs, and F1 student visa applications.",
  },

  canada: {
    title:
      "Study in Canada with EduLeaderGlobal | Top Canadian Universities",
    description:
      "Study in Canada with the EduLeaderGlobal and receive expert support for admissions, visas, scholarships, tuition fees, and top Canadian universities.",
  },

  uk: {
    title:
      "Study in UK with EduLeaderGlobal | Top UK Universities for International Students",
    description:
      "Apply to leading UK universities with EduLeaderGlobal’s expert guidance for admissions, scholarships, SOPs, and UK student visa assistance.",
  },

  germany: {
    title:
      "Study in Germany with EduLeaderGlobal | Affordable Education Abroad",
    description:
      "Study in Germany with the EduLeaderGlobal and get complete support for admissions, APS, SOPs, scholarships, and student visa applications.",
  },

  australia: {
    title:
      "Study in Australia with EduLeaderGlobal | Top Australian Universities",
    description:
      "EduLeaderGlobal helps students study in Australia with expert support for admissions, scholarships, SOP writing, and student visa processing.",
  },

  singapore: {
    title:
      "Study in Singapore with EduLeaderGlobal | Top Universities & Career Opportunities",
    description:
      "Study in Singapore with the EduLeaderGlobal and explore globally ranked universities, scholarships, admissions guidance, and career-focused education opportunities.",
  },

  ireland: {
    title:
      "Study in Ireland with EduLeaderGlobal | Top Irish Universities",
    description:
      "Explore study opportunities in Ireland with EduLeaderGlobal’s expert guidance for university admissions, scholarships, SOPs, and student visa assistance.",
  },

  netherlands: {
    title:
      "Study in Netherlands with EduLeaderGlobal | Best Dutch Universities",
    description:
      "Study in the Netherlands with the EduLeaderGlobal and get expert guidance for admissions, scholarships, tuition fees, and student visas at top Dutch universities.",
  },

  france: {
    title:
      "Study in France with EduLeaderGlobal | Universities & Scholarship Guidance",
    description:
      "Discover top universities in France with EduLeaderGlobal’s expert assistance for admissions, scholarships, SOP writing, and student visa applications.",
  },

  switzerland: {
    title:
      "Study in Switzerland with EduLeaderGlobal | World-Class Universities",
    description:
      "Study in Switzerland with the EduLeaderGlobal and access expert guidance for admissions, scholarships, visas, and global career opportunities.",
  },

  "new-zealand": {
    title:
      "Study in New Zealand with EduLeaderGlobal | Universities & Visa Support",
    description:
      "Explore higher education opportunities in New Zealand with EduLeaderGlobal’s guidance for admissions, scholarships, SOPs, and student visa applications.",
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const country = params?.country?.toLowerCase() || "";

  const seo =
    SEO_DATA[country] || {
      title:
        "EduLeaderGlobal | Study Abroad Consultants",

      description:
        "Explore top universities worldwide with EduLeaderGlobal.",
    };

  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function Page() {
  return <CountryPageClient />;
}