"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * AppChrome controls the top-level application shell.
 * When inside the Admin Console (/admin-dashboard or /admin), it unmounts
 * the public marketing navbar and footer so the admin experience has 100%
 * viewport control, dedicated admin navigation, and no decorative clutter.
 */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin-dashboard") || pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <main className="min-h-screen bg-[#05070a] text-white">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-[64px] md:pt-[104px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
