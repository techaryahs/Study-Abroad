"use client";

import { useEffect, useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

// ─── Components ──────────────────────────────────────────────────────────────

function StatBar({ country, flagUrl, count, percentage }: { country: string; flagUrl: string; count: string; percentage: string }) {
  return (
    <div className="flex items-center gap-4 mb-4 group">
      {/* Country Name */}
      <span className="w-28 text-[10px] font-bold text-[#a1a1a1] truncate uppercase tracking-widest group-hover:text-white transition-colors">
        {country}
      </span>
      
      {/* Circular Flag Image */}
      <div className="w-7 h-7 rounded-full overflow-hidden border border-[#c6a96b]/20 flex-shrink-0 bg-black">
        <img 
          src={flagUrl} 
          alt={country}
          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" 
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#c6a96b] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(198,169,107,0.2)]" 
          style={{ width: percentage }}
        />
      </div>

      {/* Count */}
      <span className="w-12 text-[10px] font-bold text-[#c6a96b] text-right tracking-tighter">
        {count}
      </span>
    </div>
  );
}

function IncludeItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-white/5 hover:border-[#c6a96b]/20 hover:bg-white/[0.01] transition-all group">
      <div className="text-xl mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
      <span className="text-sm font-medium text-[#a1a1a1] group-hover:text-[#e5e5e5] leading-snug tracking-tight">{title}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ApplicationHelpPage() {

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5] selection:bg-[#c6a96b]/30">
      
      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-24 md:px-20 border-b border-white/5 overflow-hidden">
        {/* Subtle Luxury Ambient Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#c6a96b]/5 rounded-full blur-[140px] -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block border border-[#c6a96b]/30 px-4 py-1 rounded-full">
               <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#c6a96b]">Global Admissions • Premium Mentorship</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              <span className="text-white block">COMPLETE</span> 
              <span className="text-[#c6a96b] italic font-serif">APPLICATION</span> HELP
            </h1>

            <p className="text-xl text-[#a1a1a1] italic leading-relaxed max-w-xl font-light">
              The only service in the market with an admissions and visa guarantee. 
              Top universities. <span className="text-white">No BS.</span>
            </p>

            <DiscussionSection serviceId="application-help" />
          </div>

          {/* Hero Video Section */}
          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 bg-[#c6a96b]/5 rounded-full blur-3xl group-hover:bg-[#c6a96b]/10 transition-all" />
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"> 
              <video 
                src="/application1.mp4" 
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-80" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-20">
        
        <div className="lg:col-span-2 space-y-24">
          
          {/* Eligibility Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">Valid Categories</h2>
               <div className="flex-1 h-[1px] bg-white/10" />
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[#a1a1a1] text-sm italic font-light">
              {["Bachelor's", "Diploma", "Master's", "Ph.D.", "Transfer Apps", "MBA Specialists"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c6a96b]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Student Stats Section */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6a96b]/5 rounded-full blur-3xl" />
            <h3 className="text-xs font-bold text-center mb-16 uppercase tracking-[0.4em] text-[#c6a96b]">Global Placement Distribution</h3>
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
          <div className="grid grid-cols-3 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden divide-x divide-white/5 shadow-xl">
            <div className="p-10 text-center group">
                <p className="text-4xl font-light text-[#c6a96b] mb-2 group-hover:scale-110 transition-transform">22%</p>
                <p className="text-[9px] font-bold text-[#a1a1a1] uppercase tracking-[0.2em]">Full Funding</p>
            </div>
            <div className="p-10 text-center group">
                <p className="text-4xl font-light text-white mb-2 group-hover:scale-110 transition-transform">∞</p>
                <p className="text-[9px] font-bold text-[#a1a1a1] uppercase tracking-[0.2em]">Priority Support</p>
            </div>
            <div className="p-10 text-center group">
                <p className="text-4xl font-light text-[#c6a96b] mb-2 group-hover:scale-110 transition-transform">83%</p>
                <p className="text-[9px] font-bold text-[#a1a1a1] uppercase tracking-[0.2em]">Scholarship &gt;$10k</p>
            </div>
          </div>

          {/* Includes Grid */}
          <div className="space-y-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white italic">Inclusive Concierge Services</h3>
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
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl">
              <DiscussionSection serviceId="application-help" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}