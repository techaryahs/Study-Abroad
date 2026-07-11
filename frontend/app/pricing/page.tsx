import React from "react";
import PricingClient from "./PricingClient";
import { MembershipPlan } from "@/types/membership";
import { MembershipMapper } from "@/app/lib/membership/MembershipMapper";
import { isTestPaymentMode } from "@/app/lib/testPaymentMode";

// Revalidate every hour
export const revalidate = 3600;

async function getPlans(): Promise<{ plans: MembershipPlan[]; error?: string }> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    const plansRes = await fetch(`${backendUrl}/api/memberships/plans`, {
      next: { revalidate: 3600 }
    });

    if (!plansRes.ok) {
      throw new Error("Failed to fetch plans");
    }

    const rawPlans = await plansRes.json();
    // Single normalization pipeline — never pass raw backend documents to the UI
    const catalog = MembershipMapper.mapCatalog({
      plans: Array.isArray(rawPlans) ? rawPlans : [],
      services: []
    });

    return { plans: catalog.plans };
  } catch (err: unknown) {
    console.error("Pricing fetch error:", err);
    return {
      plans: [],
      error: "Our membership system is currently undergoing maintenance. Please try again in a few minutes."
    };
  }
}

export default async function PricingPage() {
  const { plans, error } = await getPlans();

  // Resolve once on the server so SSR HTML and client hydration share one flag.
  // PricingClient must not re-read env for prices.
  const testPaymentMode = isTestPaymentMode();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#FDFBF7] text-[#3C2A21]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .pricing-gold {
          background: linear-gradient(105deg, #C5A059 0%, #E6D5B8 45%, #B3985E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Soft parchment atmosphere — not neon SaaS dark mode */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#F5EDE0_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#C5A059]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-72 w-72 rounded-full bg-[#3C2A21]/5 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-16 md:px-10 md:pt-24">
        {/* Hero — generic; unlock-specific messaging lives in PricingClient banner */}
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <p className="mb-5 inline-flex items-center rounded-full border border-[#C5A059]/25 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A7B3C] shadow-sm">
            Membership
          </p>

          <h1 className="fd text-4xl font-semibold leading-[1.15] tracking-tight text-[#2D2926] sm:text-5xl md:text-6xl">
            Choose the path that
            <span className="pricing-gold block mt-1 italic font-bold">
              matches your ambition
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[15px] font-medium leading-relaxed text-[#6B5E51] md:text-base">
            Expert guidance, intelligent tools, and a clear plan for universities abroad—
            designed for students who take their future seriously.
          </p>
        </header>

        <PricingClient
          initialPlans={plans}
          error={error}
          testPaymentMode={testPaymentMode}
        />

        {/* Quiet trust footer — not a hard sell bar */}
        <footer className="mx-auto mt-16 max-w-2xl border-t border-[#EDE6DC] pt-10 text-center">
          <p className="text-[12px] font-medium leading-relaxed text-[#8B8078]">
            Private by design · Change or upgrade anytime · Built for ambitious applicants
          </p>
        </footer>
      </div>
    </main>
  );
}
