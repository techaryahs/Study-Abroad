import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Eduleader Council Admissions | Elite Study Abroad Mentorship",
  description: "Personalized admissions guidance for global success. Secure your path to Ivy League and prestigious international universities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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