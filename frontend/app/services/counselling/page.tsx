"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";

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
  const [currency, setCurrency] = useState("INR");

  const prices = {
    INR: { current: "₹11,658", original: "INR 14,573.00" },
    USD: { current: "$139", original: "USD 175.00" }
  };

  const currentPrice = currency === "USD" ? prices.USD : prices.INR;
  
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

            <div className="flex gap-10 mb-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/5 border border-[#c6a96b]/20 rounded-2xl flex items-center justify-center text-2xl">📹</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#a1a1a1]">Video call</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-2xl text-green-400">💬</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#a1a1a1]">Text Support</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button className="bg-[#c6a96b] text-[#000000] font-black py-4 px-10 rounded-xl hover:bg-[#d4af37] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#c6a96b]/20 uppercase tracking-widest text-xs">
                Discuss Your Case
              </button>
              <p className="text-sm text-[#a1a1a1] italic">Have questions? Let's chat.</p>
            </div>
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
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-[#0a0a0a] border border-[#c6a96b]/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[32px] p-8 space-y-8">
            <div className="text-center">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#c6a96b]">Book Now</h3>
                <div className="w-10 h-[1px] bg-[#c6a96b]/30 mx-auto mt-4" />
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <span className="text-[#a1a1a1]">Tier</span>
                <span className="text-[#ffffff]">Initial Session</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <span className="text-[#a1a1a1]">Duration</span>
                <span className="text-[#ffffff]">1 hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#a1a1a1] text-[10px] font-bold uppercase tracking-widest">Currency</span>
                <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-[#000000] text-[#c6a96b] border border-[#c6a96b]/20 rounded-lg px-3 py-1.5 text-[10px] font-black outline-none focus:border-[#c6a96b] cursor-pointer"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[#a1a1a1] text-sm line-through mb-1 opacity-50 tracking-tighter">{currentPrice.original}</p>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-black text-[#ffffff] tracking-tighter">{currentPrice.current}</p>
                <span className="text-[#c6a96b] text-[10px] font-black uppercase tracking-widest">Save 20%</span>
              </div>
            </div>

            <div className="space-y-4">
                <button className="w-full py-4 bg-transparent border border-[#c6a96b]/20 text-[#ffffff] font-bold rounded-xl hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Add to Cart</button>
                <button className="w-full py-5 bg-[#c6a96b] text-[#000000] font-black rounded-xl shadow-xl shadow-[#c6a96b]/10 hover:bg-[#d4af37] transition-all text-xs uppercase tracking-widest">Buy Now</button>
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