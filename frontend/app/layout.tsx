import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Counselling Center Admissions | Elite Study Abroad Mentorship",
  description: "Personalized admissions guidance for global success. Secure your path to Ivy League and prestigious international universities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <Navbar />
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}