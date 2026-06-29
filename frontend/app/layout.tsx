import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "EduLeaderGlobal Admissions | Elite Study Abroad Mentorship",

  description:
    "Personalized admissions guidance for global success. Secure your path to Ivy League and prestigious international universities.",

  applicationName: "EduLeaderGlobal",

  openGraph: {
    title: "EduLeaderGlobal",
    siteName: "EduLeaderGlobal",
    description:
      "Personalized admissions guidance for global success.",
    url: "https://iec.aryahsworld.com",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EduLeaderGlobal",
    description:
      "Personalized admissions guidance for global success.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J1H0NFV4P6"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-J1H0NFV4P6');
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EduLeaderGlobal",
              url: "https://iec.aryahsworld.com",
            }),
          }}
        />

      </head>

      <body className="bg-[#FAFAFA] text-[#675F5B] antialiased">
        <Navbar />

        <main className="pt-[64px] md:pt-[104px]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}