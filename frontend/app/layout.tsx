import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "International Eduleader Council Admissions | Elite Study Abroad Mentorship",

  description:
    "Personalized admissions guidance for global success. Secure your path to Ivy League and prestigious international universities.",

  applicationName: "International Eduleader Council",

  openGraph: {
    title: "International Eduleader Council",
    siteName: "International Eduleader Council",
    description:
      "Personalized admissions guidance for global success.",
    url: "https://iec.aryahsworld.com",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "International Eduleader Council",
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-J1H0NFV4P6"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
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
              name: "International Eduleader Council",
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