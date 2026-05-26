import type { Metadata } from "next";
import EB1AToolkitClientPage from "./EB1AToolkitClientPage";

export const metadata: Metadata = {
  title:
    "EB-1A Toolkit with International Eduleader Council | USA Extraordinary Ability Visa Support",

  description:
    "International Eduleader Council’s EB-1A Toolkit helps students, researchers, and professionals strengthen their USA EB-1A visa profile with expert guidance and documentation support.",

  keywords: [
    "EB1A visa",
    "USA extraordinary ability visa",
    "EB1A toolkit",
    "EB1A petition",
    "US immigration visa",
    "Researcher visa USA",
    "Extraordinary ability immigration",
    "International Eduleader Council",
    "EB1A documentation support",
    "USCIS petition support",
  ],

  alternates: {
    canonical:
      "https://yourdomain.com/resources/eb1a-toolkit",
  },

  openGraph: {
    title:
      "EB-1A Toolkit | International Eduleader Council",

    description:
      "Strengthen your EB-1A USA visa profile with expert petition guidance, templates, USCIS support, and documentation strategies.",

    url:
      "https://yourdomain.com/resources/eb1a-toolkit",

    siteName: "International Eduleader Council",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "EB-1A Toolkit | IEC",

    description:
      "Expert EB-1A visa petition toolkit for researchers, students, and professionals applying for USA extraordinary ability immigration.",
  },
};

export default function Page() {
  return <EB1AToolkitClientPage />;
}