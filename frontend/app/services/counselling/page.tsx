"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

// ─── Components ──────────────────────────────────────────────────────────────

interface AccordionProps {
  title: string;
  children?: ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-[#c6a96b]/20 rounded-xl bg-[#0a0a0a] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-[#ffffff] hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm md:text-base tracking-tight">{title}</span>
        <span className="text-[#d4af37] text-2xl leading-none">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && children && (
        <div className="p-5 pt-0 text-sm text-[#e5e5e5]/70 border-t border-white/5 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CounsellingPage() {
  
  const services = [
    { name: "Complete Application Help", link: "/services/application-help" },
    { name: "Job Application Help", link: "/services/application-help" },
    { name: "3 Research Papers", link: "/services/research-papers" },
    { name: "Express Entry/PNP Help", link: "/services/express-entry" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] text-[#e5e5e5] selection:bg-[#d4af37]/30">
      
      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:px-20 overflow-hidden border-b border-white/5">
        {/* Muted Gold glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
            Counselling Session
            </h1>
            <p className="text-lg text-[#e5e5e5]/80 mb-10 max-w-xl leading-relaxed font-medium">
              Google Meet session with our counselors. Get transparency on your case for studying or 
              working overseas. <span className="text-[#ffffff]">Charges fully adjustable</span> in service pricing.
            </p>

            <DiscussionSection serviceId="counselling" />
          </div>

          <div className="w-[85%] h-[280px] md:h-[380px] mx-auto rounded-3xl overflow-hidden border border-[#c6a96b]/20 shadow-2xl">
            <video 
              src="/application1.mp4" 
              autoPlay muted loop playsInline
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
            />
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-20">
          <div>
            <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 text-[#ffffff]">About Service</h2>
                <div className="w-20 h-1.5 bg-[#c6a96b] rounded-full" />
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-[#c6a96b] uppercase tracking-[0.3em] mb-6">Charges Fully Adjustable In</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((item) => (
                  <Link key={item.name} href={item.link} className="block">
                    <div className="group bg-white/5 border border-white/5 p-5 rounded-xl flex justify-between items-center hover:border-[#c6a96b]/40 transition-all cursor-pointer">
                      <span className="text-sm font-semibold text-[#e5e5e5]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-black text-[#c6a96b] border border-[#c6a96b]/20 px-3 py-1.5 rounded-lg group-hover:bg-[#c6a96b] group-hover:text-[#000000] transition-all">
                        CHECK
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-2xl font-black border-l-4 border-[#c6a96b] pl-6 uppercase tracking-tight text-[#ffffff]">This service is for you if...</h3>
            <div className="grid gap-10">
                {[
                  { t: "Elite Positioning", d: "You need to architect a narrative that resonates with top-tier global institutions.", i: "💎" },
                  { t: "Exploring Opportunities", d: "Need clarification on which country or job market suits your profile best.", i: "🌍" },
                  { t: "Profile Improvement", d: "Worried about the competitive market? Let our experts set the right goals.", i: "📈" }
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="w-16 h-16 shrink-0 bg-[#c6a96b]/5 border border-[#c6a96b]/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-[#c6a96b]/10 transition-colors">
                      {point.i}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#ffffff] mb-1">{point.t}</h4>
                      <p className="text-[#a1a1a1] leading-relaxed max-w-lg">{point.d}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-[#050505] to-[#141414] border border-[#c6a96b]/10 rounded-3xl p-10 flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-[200px]">
                <p className="text-[#c6a96b] text-xs font-black uppercase tracking-widest mb-2 font-mono">CEO at </p>
                <h4 className="text-4xl font-black mb-4 text-[#ffffff]">Yash Mittra</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-[#ffffff]">10K+</span>
                    <span className="text-[#a1a1a1] font-bold uppercase text-xs tracking-widest">Cases Managed</span>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 pb-20">
          <div className="sticky top-28 space-y-8">
            <AddToCart serviceId="counselling" />
            <div className="bg-[#0a0a0a] border border-[#c6a96b]/20 rounded-2xl p-6 shadow-2xl">
              <DiscussionSection serviceId="counselling" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase text-[#ffffff]">
              Frequently Asked <span className="text-[#c6a96b] italic font-serif">Questions</span>
            </h2>
            <div className="space-y-4">
              <Accordion title="International Scope of Applications">
                We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.
              </Accordion>
              <Accordion title="Taxation & Inclusions">
                Yes, all prices shown are inclusive of applicable taxes unless stated otherwise at checkout.
              </Accordion>
              <Accordion title="Digital Infrastructure">
                Our platform is designed for seamless global interaction via high-definition Google Meet sessions and dedicated encrypted support.
              </Accordion>
            </div>
        </div>
      </section>
    </main>
  );
}