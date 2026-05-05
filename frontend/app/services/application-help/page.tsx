"use client";

import { useEffect, useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

// ─── Components ──────────────────────────────────────────────────────────────

function StatBar({ country, flagUrl, count, percentage }: { country: string; flagUrl: string; count: string; percentage: string }) {
  return (
    <div className="flex items-center gap-4 mb-4 group">
      {/* Country Name */}
      <span className="w-28 text-[10px] font-bold text-[#675F5B] truncate uppercase tracking-widest group-hover:text-[#362B25] transition-colors">
        {country}
      </span>

      {/* Circular Flag Image */}
      <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D4A848]/20 flex-shrink-0 bg-[#FFFFFF]">
        <img
          src={flagUrl}
          alt={country}
          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-1 h-[3px] bg-[#D4A848]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D4A848] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,168,72,0.2)]"
          style={{ width: percentage }}
        />
      </div>

      {/* Count */}
      <span className="w-12 text-[10px] font-bold text-[#D4A848] text-right tracking-tighter">
        {count}
      </span>
    </div>
  );
}

function IncludeItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-[#D4A848]/10 bg-[#FFFFFF] hover:border-[#D4A848]/30 hover:bg-[#F8F6F1] shadow-sm transition-all group">
      <div className="text-xl mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
      <span className="text-sm font-medium text-[#000000] group-hover:text-[#000000] leading-snug tracking-tight">{title}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ApplicationHelpPage() {

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#362B25] selection:bg-[#D4A848]/30">

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-12 md:py-24 md:px-20 border-b border-[#D4A848]/10 overflow-hidden">
        {/* Subtle Luxury Ambient Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D4A848]/10 rounded-full blur-[140px] -z-10" />

        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4">
              {/* Mobile Hero Visual */}
              <div className="lg:hidden w-16 h-16 rounded-2xl overflow-hidden border border-[#D4A848]/20 bg-[#FFFFFF] shadow-lg shrink-0">
                <video
                  src="/application1.mp4"
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              <div className="space-y-1 md:space-y-3">
                <div className="inline-block border border-[#D4A848]/30 px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-[#FFFFFF]">
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-[#D4A848]">Admissions • Premium Mentorship</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-7xl font-bold tracking-tighter leading-[1.1] break-words">
                  <span className="text-[#362B25] block">COMPLETE</span>
                  <span className="text-[#D4A848] italic font-serif">APPLICATION HELP</span>
                </h1>
              </div>
            </div>

            <p className="text-base md:text-xl text-[#000000] italic leading-relaxed max-w-xl font-light">
              The only service in the market with an admissions and visa guarantee.
              Top universities. <span className="text-[#000000] font-black underline decoration-[#D4A848]/30">No BS.</span>
            </p>

            <DiscussionSection serviceId="application-help" />
          </div>

          {/* Hero Video Section (Desktop) */}
          <div className="hidden lg:block relative group flex-1">
            <div className="absolute -inset-4 bg-[#D4A848]/10 rounded-full blur-3xl group-hover:bg-[#D4A848]/20 transition-all" />
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-[#D4A848]/20 bg-[#FFFFFF] shadow-2xl">
              <video
                src="/application1.mp4"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-2xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-20">

        <div className="lg:col-span-2 space-y-24">

          {/* Eligibility Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#362B25]">Valid Categories</h2>
              <div className="flex-1 h-[1px] bg-[#D4A848]/20" />
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[#675F5B] text-sm italic font-light">
              {["Bachelor's", "Diploma", "Master's", "Ph.D.", "Transfer Apps", "MBA Specialists"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A848]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Student Stats Section */}
          <div className="bg-[#FFFFFF] border border-[#D4A848]/20 rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/10 rounded-full blur-3xl" />
            <h3 className="text-xs font-bold text-center mb-16 uppercase tracking-[0.4em] text-[#362B25]">Global Placement Distribution</h3>
            <div className="space-y-2 max-w-2xl mx-auto">
              <StatBar country="United States" flagUrl="https://flagcdn.com/w80/us.png" count="10k+" percentage="95%" />
              <StatBar country="United Kingdom" flagUrl="https://ymgrad.com/static/base/Flags_icon/uk.png" count="3k+" percentage="55%" />
              <StatBar country="Australia" flagUrl="https://flagcdn.com/w80/au.png" count="4k+" percentage="65%" />
              <StatBar country="Canada" flagUrl="https://ymgrad.com/static/base/Flags_icon/canada.png" count="2k+" percentage="40%" />
              <StatBar country="Germany" flagUrl="https://flagcdn.com/w80/de.png" count="1k+" percentage="25%" />
              <StatBar country="Switzerland" flagUrl="https://ymgrad.com/static/base/Flags_icon/switzerland.png" count="250k+" percentage="55%" />
            </div>
          </div>

          {/* Infinity Stats Box */}
          <div className="grid grid-cols-3 bg-[#FFFFFF] border border-[#D4A848]/20 rounded-2xl overflow-hidden divide-x divide-[#D4A848]/10 shadow-sm">
            <div className="p-10 text-center group">
              <p className="text-4xl font-light text-[#D4A848] mb-2 group-hover:scale-110 transition-transform">22%</p>
              <p className="text-[9px] font-bold text-[#675F5B] uppercase tracking-[0.2em]">Full Funding</p>
            </div>
            <div className="p-10 text-center group">
              <p className="text-4xl font-light text-[#362B25] mb-2 group-hover:scale-110 transition-transform">∞</p>
              <p className="text-[9px] font-bold text-[#675F5B] uppercase tracking-[0.2em]">Priority Support</p>
            </div>
            <div className="p-10 text-center group">
              <p className="text-4xl font-light text-[#D4A848] mb-2 group-hover:scale-110 transition-transform">83%</p>
              <p className="text-[9px] font-bold text-[#675F5B] uppercase tracking-[0.2em]">Scholarship &gt;$10k</p>
            </div>
          </div>

          {/* Includes Grid */}
          <div className="space-y-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#362B25] italic">Inclusive Concierge Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <IncludeItem icon="🏫" title="University Shortlisting & Profile Evaluation" />
              <IncludeItem icon="👤" title="Strategic Profile Building Advice" />
              <IncludeItem icon="📄" title="3 Letters of Recommendation" />
              <IncludeItem icon="✍️" title="SOP & MBA Essay Crafting" />
              <IncludeItem icon="💼" title="Executive Resume Overhaul" />
              <IncludeItem icon="📅" title="Unlimited Expert Video Consultations" />
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            <AddToCart serviceId="application-help" />
          </div>
        </div>
      </section>
    </main>
  );
}