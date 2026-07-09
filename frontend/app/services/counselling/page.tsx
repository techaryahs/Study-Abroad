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
    <div className="border border-[#c6a96b]/20 rounded-xl bg-white/80 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-[#10324a] hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm md:text-base tracking-tight">{title}</span>
        <span className="text-[#d4af37] text-2xl leading-none">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && children && (
        <div className="p-5 pt-0 text-sm text-[#4b5b6a] border-t border-white/5 leading-relaxed">
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(44,165,157,0.16),_transparent_30%),linear-gradient(135deg,_#f8f4ea_0%,_#fcfbf7_100%)] text-[#10324a] selection:bg-[#d2a14a]/20">

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16">
        {/* Muted Gold glow */}
        <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tighter uppercase leading-[0.9] break-words">
              Counselling Session
            </h1>
            <p className="text-lg text-[#4b5b6a] mb-10 max-w-xl leading-relaxed font-medium">
              Google Meet session with our counselors. Get transparency on your case for studying or
              working overseas. <span className="text-[#ffffff]">Charges fully adjustable</span> in service pricing.
            </p>

            <DiscussionSection serviceId="counselling" />
            <div className="flex flex-wrap gap-4 mt-8">
  <Link
    href="/book-counselling"
    className="inline-flex items-center justify-center px-8 py-4 rounded-xl
    bg-[#D4A54A] text-[#10324a] font-black uppercase tracking-wider
    hover:bg-[#c9972d] hover:scale-105 transition-all duration-300
    shadow-lg shadow-[#D4A54A]/30"
  >
    Book Session
  </Link>

  <Link
    href="#about"
    className="inline-flex items-center justify-center px-8 py-4 rounded-xl
    border border-[#10324a]/20 text-[#10324a] font-bold
    hover:bg-[#10324a] hover:text-white transition-all duration-300"
  >
    Learn More
  </Link>
</div>
          </div>

          <div className="rounded-[32px] border border-[#10324a]/10 bg-white/80 p-3 shadow-[0_20px_60px_rgba(16,50,74,0.08)]">
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

            <div className="bg-white/80 border border-white/5 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-[#D4A54A] uppercase tracking-[0.3em] mb-6">Charges Fully Adjustable In</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((item) => (
                  <Link key={item.name} href={item.link} className="block">
                    <div className="group bg-[#f8fcfe]  border border-[#10324a]/10 p-5 rounded-xl flex justify-between items-center hover:border-[#c6a96b]/40 transition-all cursor-pointer">
                      <span className="text-sm font-semibold text-[#10324a]">
                        {item.name}
                      </span>
                      <span className="text-[14px] font-bold font-black text-[#D4A54A] border border-[#10324a]/10 px-3 py-1.5 rounded-lg group-hover:bg-[#c6a96b] group-hover:text-[#000000] transition-all">
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
                  <div className="w-16 h-16 shrink-0 bg-[#2ca59d]/10 border border-[#c6a96b]/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-[#c6a96b]/10 transition-colors">
                    {point.i}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#10324a] mb-1">{point.t}</h4>
                    <p className="text-[#4b5b6a] leading-relaxed max-w-lg">{point.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-[#10324a] border border-[#c6a96b]/10 rounded-3xl p-10 flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-[200px]">
               <p className="text-[#D4A54A] text-xs font-black uppercase tracking-[0.3em] mb-2">
      CEO at
    </p>
               <h4 className="text-4xl font-black mb-4 text-[#D4A54A]">
      Yash Mittra
    </h4>
              <div className="flex items-baseline gap-2">
                 <span className="text-6xl font-black text-[#D4A54A]">
        10K+
      </span>
           <span className="text-[#D4A54A]/80 font-bold uppercase text-xs tracking-[0.25em]">
        Cases Managed
      </span>     
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 pb-20">
          <div className="sticky top-28 space-y-8">
          <Link
  href="/book-counselling"
  className="block w-full bg-[#D4A54A] text-[#10324a]
  text-center py-4 rounded-2xl font-black uppercase tracking-wider
  hover:bg-[#c9972d] transition-all duration-300"
>
  Book Counselling Session
</Link>
            <div className="bg-white/80 border border-[#c6a96b]/20 rounded-2xl p-6 shadow-2xl">
              <DiscussionSection serviceId="counselling" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
   <section className="py-24 px-6 md:px-20 border-t border-[#10324a]/10 bg-transparent">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase text-[#10324a]">
      Frequently Asked{" "}
      <span className="text-[#D4A54A] italic font-serif">
        Questions
      </span>
    </h2>

    <div className="space-y-4">
      <Accordion title="International Scope of Applications">
        We support applications to most countries including but not limited to
        USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.
      </Accordion>

      <Accordion title="Taxation & Inclusions">
        Yes, all prices shown are inclusive of applicable taxes unless stated
        otherwise at checkout.
      </Accordion>

      <Accordion title="Digital Infrastructure">
        Our platform is designed for seamless global interaction via
        high-definition Google Meet sessions and dedicated encrypted support.
      </Accordion>
    </div>
  </div>
</section>
    </main>
  );
}