import type { Metadata } from "next";
import ResearchGroupsClientPage from "./ResearchGroupsClientPage";

export const metadata: Metadata = {
  title:
    "Research Groups with International Eduleader Council | Connect with Global Academic Research",

  description:
    "Explore international research groups with the International Eduleader Council and discover opportunities for academic research, innovation, publications, and university collaborations abroad.",

  keywords: [
    "Research groups",
    "Academic collaborations",
    "International research",
    "Research publications",
    "Global academic research",
    "Research opportunities abroad",
    "International Eduleader Council",
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
      "Research Groups | International Eduleader Council",

    description:
      "Connect with international academic research groups, collaborations, publications, and innovation networks worldwide.",

    url:
      "https://yourdomain.com/resources/research-groups",

    siteName: "International Eduleader Council",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Research Groups | IEC",

    description:
      "Discover global research collaborations, academic clusters, and publication opportunities.",
  },
};

export default function Page() {
  return <ResearchGroupsClientPage />;
}