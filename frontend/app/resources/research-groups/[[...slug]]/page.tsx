import type { Metadata } from "next";
import ResearchGroupsClientPage from "./ResearchGroupsClientPage";

export const metadata: Metadata = {
  title:
    "Research Groups with EduLeaderGlobal | Connect with Global Academic Research",

  description:
    "Explore international research groups with the EduLeaderGlobal and discover opportunities for academic research, innovation, publications, and university collaborations abroad.",

  keywords: [
    "Research groups",
    "Academic collaborations",
    "International research",
    "Research publications",
    "Global academic research",
    "Research opportunities abroad",
    "EduLeaderGlobal",
    "University collaborations",
    "Research clusters",
    "Academic innovation",
  ],

  alternates: {
    canonical:
      "https://yourdomain.com/resources/research-groups",
  },

  openGraph: {
    title:
      "Research Groups | EduLeaderGlobal",

    description:
      "Connect with international academic research groups, collaborations, publications, and innovation networks worldwide.",

    url:
      "https://yourdomain.com/resources/research-groups",

    siteName: "EduLeaderGlobal",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Research Groups | EduLeaderGlobal",

    description:
      "Discover global research collaborations, academic clusters, and publication opportunities.",
  },
};

export default function Page() {
  return <ResearchGroupsClientPage />;
}