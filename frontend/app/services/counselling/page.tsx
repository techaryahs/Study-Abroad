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
    <div className="border border-white/10 rounded-xl bg-[#141414] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-white/90 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm md:text-base">{title}</span>
        <span className="text-yellow-400 text-2xl leading-none">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && children && (
        <div className="p-5 pt-0 text-sm text-white/50 border-t border-white/5 line-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CounsellingPage() {
  const [currency, setCurrency] = useState("INR");

  // Price Mapping for Currency Toggle
  const prices = {
    INR: { current: "₹11,658", original: "INR 14,573.00" },
    USD: { current: "$139", original: "USD 175.00" }
  };

  const currentPrice = currency === "USD" ? prices.USD : prices.INR;

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white selection:bg-yellow-400/30">
      
      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:px-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white uppercase">
              COUNSELLING <span className="text-yellow-400">SESSION</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed font-medium">
              Google Meet session with our counselors. Get transparency on your case for studying or 
              working overseas. <span className="text-white">Charges fully adjustable</span> in service pricing.
            </p>

            <div className="flex gap-10 mb-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl">📹</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Video call</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-2xl text-green-400">💬</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Text Support</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button className="bg-yellow-400 text-black font-black py-4 px-10 rounded-xl hover:bg-yellow-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-400/20">
                Discuss Your Case
              </button>
              <p className="text-sm text-white/30 italic">Have questions? Let's chat.</p>
            </div>
          </div>

           <div className="w-50 h-40 bg-white/5 rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
              <video 
                src="/application.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover" 
              />
            </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-20">
          <div>
            <div className="mb-10">
                <h2 className="text-3xl font-black mb-2">About Service</h2>
                <div className="w-20 h-1.5 bg-yellow-400 rounded-full" />
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-yellow-400/80 uppercase tracking-widest mb-6">Charges Fully Adjustable In</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["Complete Application Help", "Job Application Help", "3 Research Papers", "Express Entry/PNP Help"].map((item) => (
                  <div key={item} className="group bg-white/5 border border-white/5 p-5 rounded-xl flex justify-between items-center hover:border-yellow-400/40 transition-all cursor-default">
                    <span className="text-sm font-semibold text-white/80">{item}</span>
                    <button className="text-[10px] font-black text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-all">CHECK</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-2xl font-black border-l-4 border-yellow-400 pl-6 uppercase tracking-tight">This service is for you if...</h3>
            <div className="grid gap-10">
                {[
                  { t: "Big Investments Can Start Small", d: "Don't know if a bigger package is right? Opt for a consultation call first.", i: "💎" },
                  { t: "Exploring Opportunities", d: "Need clarification on which country or job market suits your profile best.", i: "🌍" },
                  { t: "Profile Improvement", d: "Worried about the competitive market? Let our experts set the right goals.", i: "📈" }
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{point.i}</div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{point.t}</h4>
                      <p className="text-white/40 leading-relaxed max-w-lg">{point.d}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-[#1a1500] to-[#141414] border border-yellow-400/10 rounded-3xl p-10 flex flex-wrap items-center gap-8">
            <div className="flex-1 min-w-[200px]">
                <p className="text-yellow-400/60 text-xs font-black uppercase tracking-widest mb-2 font-mono">CEO at YMGrad</p>
                <h4 className="text-4xl font-black mb-4">Yash Mittra</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white">10K+</span>
                    <span className="text-white/30 font-bold uppercase text-xs tracking-widest">Cases Managed</span>
                </div>
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-[#141414] border border-white/10 shadow-2xl rounded-[32px] p-8 space-y-8">
            <div className="text-center">
                <h3 className="text-xl font-black uppercase tracking-widest text-white/90">Book Now</h3>
                <div className="w-10 h-1 bg-yellow-400 mx-auto mt-2" />
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 font-bold">Services</span>
                <span className="text-white/90 font-semibold">Initial Session</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 font-bold">Duration</span>
                <span className="text-white/90 font-semibold">1 hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm font-bold">Currency</span>
                <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-black text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-yellow-400 cursor-pointer"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-white/20 text-sm line-through mb-1">{currentPrice.original}</p>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-white">{currentPrice.current}</p>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse uppercase">Save 20%</span>
              </div>
            </div>

            <div className="space-y-4">
                <button className="w-full py-4 bg-transparent border-2 border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">Add to Cart</button>
                <button className="w-full py-5 bg-yellow-400 text-black font-black rounded-2xl shadow-xl shadow-yellow-400/20 hover:bg-yellow-500 hover:-translate-y-1 active:translate-y-0 transition-all">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase">
              Frequently Asked <span className="text-yellow-400">Questions</span>
            </h2>
            <div className="space-y-4">
              <Accordion title="Do you only help for applications to the US?">
                We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.
              </Accordion>
              <Accordion title="Does the price include GST/Taxes?">
                Yes, all prices shown are inclusive of applicable taxes unless stated otherwise at checkout.
              </Accordion>
              <Accordion title="Since services are online, is it smooth?">
                Our platform is designed for seamless global interaction via high-definition Google Meet sessions and dedicated WhatsApp support.
              </Accordion>
              <Accordion title="Are there any ongoing discount offers?">
                Currently, we are offering a 20% discount on Initial Counselling sessions as part of our seasonal promotion.
              </Accordion>
            </div>
        </div>
      </section>
    </main>
  );
}