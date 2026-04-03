"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import AddToCart from "@/components/shared/AddToCart";


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

// ─── Stat Bar ────────────────────────────────────────────────────────────────

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-[#e5e5e5]/70 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#c6a96b] to-[#d4af37]"
          style={{ width: `${value}%` }}
        />
        <div
          className="absolute inset-y-0 rounded-full bg-[#d4af37]/20"
          style={{ left: `${value}%`, right: 0 }}
        />
      </div>
      <span className="text-sm font-black text-[#ffffff] w-12 text-right">{value}%</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ResearchPaperPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const advantages = [
    { icon: "🏛️", text: "Admits from some of the top-most universities worldwide!" },
    { icon: "💰", text: "Increased chances of funding and research assistantships." },
    { icon: "💼", text: "Amazing job offers in R&D with a high pay-grade." },
    { icon: "📋", text: "One of the most prominent ways to cover gaps on your resume." },
    { icon: "🇺🇸", text: "Easier pathway to the green card (through the O-1/EB-1 Visa)." },
    { icon: "✈️", text: "Residency fast-track in the UK and Australia via Global Talent Visa." },
  ];

  const pathways = [
    {
      flag: "🇺🇸",
      country: "United States (O-1/EB-1 Visa)",
      desc: "Your research achievements can qualify you for extraordinary ability visas, providing a pathway to permanent residency.",
    },
    {
      flag: "🇬🇧",
      country: "United Kingdom (Global Talent Visa - GTV)",
      desc: "Research excellence can make you eligible for high-skilled worker visas and opportunities in academia and industry.",
    },
    {
      flag: "🇦🇺",
      country: "Australia (National Innovation Visa - NIV)",
      desc: "Demonstrating outstanding research skills can help you secure this fast-track visa for talented professionals.",
    },
  ];

  const o1Data = [
    { label: "With 8 Papers", value: 98 },
    { label: "With 7 Papers", value: 93 },
    { label: "With 6 Papers", value: 87 },
    { label: "With 5 Papers", value: 82 },
    { label: "With 4 Papers", value: 71 },
  ];

  const eb1Data = [
    { label: "With 6 Papers", value: 70 },
    { label: "With 7 Papers", value: 79 },
    { label: "With 8 Papers", value: 85 },
    { label: "With 9 Papers", value: 93 },
    { label: "With 10 Papers", value: 97.5 },
  ];

  const gtvData = [
    { label: "With 5 Papers", value: 78 },
    { label: "With 6 Papers", value: 85 },
    { label: "With 7 Papers", value: 91 },
    { label: "With 8 Papers", value: 96 },
  ];

  const nivData = [
    { label: "With 5 Papers", value: 72 },
    { label: "With 6 Papers", value: 80 },
    { label: "With 7 Papers", value: 89 },
    { label: "With 8 Papers", value: 96 },
  ];

  const harvardAdmits = [
    { label: "Harvard University", withPaper: 50, without: 25 },
    { label: "Stanford University", withPaper: 40, without: 20 },
    { label: "MIT", withPaper: 30, without: 20 },
    { label: "University of Oxford", withPaper: 25, without: 20 },
    { label: "University of Cambridge", withPaper: 10, without: 5 },
  ];

  const researchGroups = [
    { date: "Feb 26, 2026", slots: "1/3", title: "Construction Project Management", user: "P C", desc: "I'm planning to publish a research paper..." },
    { date: "Feb 08, 2026", slots: "1/3", title: "Clinical and Translational Research", user: "K V", desc: "Clinical Research" },
    { date: "Oct 30, 2025", slots: "1/6", title: "Information Systems (MIS)", user: "U S", desc: "I'm interested in starting a research gr..." },
  ];

  const faqs = [
    { q: "Do you only help for applications to the US? What about other countries?", a: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore." },
    { q: "Does the price include GST/Taxes?", a: "Yes, all prices shown are inclusive of applicable taxes unless stated otherwise at checkout." },
    { q: "Do you have research partners from all the fields? My field is a bit unique.", a: "We work with research partners across a wide range of fields. Reach out to discuss your specific domain and we'll match you accordingly." },
    { q: "Which journals or conferences are these papers published in?", a: "Research is published in IEEE, Springer, Elsevier, or Taylor & Francis — all high-impact, peer-reviewed publications." },
    { q: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?", a: "We use structured Google Meet sessions, dedicated support channels, and encrypted document sharing to replicate the experience of in-person consulting." },
    { q: "What is the best time for me to enroll in the services?", a: "As early as possible — ideally 6–12 months before your intended application deadline to allow for publication timelines." },
    { q: "Can I divide the charges between my co-author(s) and I?", a: "Yes, charges can be split among co-authors. Select the number of co-authors in the pricing panel above." },
    { q: "Are the timelines mentioned on the website followed religiously?", a: "We adhere strictly to our stated 3–4 week timelines and will notify you proactively if any delays are anticipated." },
    { q: "Are there any ongoing discount offers?", a: "A 20% discount is currently applied. This is a limited-time offer." },
    { q: "Are the publishing charges covered?", a: "Publishing charges depend on the journal selected. Please discuss during your counselling session for a complete cost breakdown." },
    { q: "Does help with applying for the O-1/EB-1 Visa?", a: "Yes, we provide end-to-end support for O-1/EB-1 Visa petitions, including research paper strategy and documentation." },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] text-[#e5e5e5] selection:bg-[#d4af37]/30">

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:px-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
              Research Paper Drafting &amp; Publishing Help
            </h1>
            <p className="text-lg text-[#e5e5e5]/80 mb-10 max-w-xl leading-relaxed font-medium">
              Publishing credible research papers with your name on them can help boost your profile!{" "}
              <span className="text-[#ffffff]">Extremely crucial</span> for MS/PhD and O-1/EB-1 visa applicants.
            </p>

            <div className="flex gap-10 mb-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/5 border border-[#c6a96b]/20 rounded-2xl flex items-center justify-center text-2xl">📹</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#a1a1a1]">Video call</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-white/5 border border-[#c6a96b]/20 rounded-2xl flex items-center justify-center text-2xl">🎧</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#a1a1a1]">Audio call</span>
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
              <p className="text-sm text-[#a1a1a1] italic">Have questions about this service? Let's chat.</p>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="w-[85%] mx-auto flex items-center justify-center">
            <div className="relative w-full h-[340px] md:h-[420px]">
              {/* Blob background */}
              <div className="absolute inset-0 bg-[#d4af37]/10 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] blur-2xl" />
              <div className="absolute inset-6 flex flex-col items-center justify-center gap-4">
                {/* Paper mockup */}
                <div className="bg-[#0f0f0f] border border-[#c6a96b]/30 rounded-xl p-6 w-64 shadow-2xl relative">
                  <div className="text-[10px] text-[#c6a96b] uppercase tracking-widest mb-3 font-bold">Research Publication</div>
                  <div className="space-y-2">
                    {[100, 90, 95, 80, 70, 85, 60].map((w, i) => (
                      <div key={i} className={`h-1.5 rounded-full bg-white/10`} style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-[#c6a96b]/20 border border-[#c6a96b]/40 flex items-center justify-center text-[8px] font-bold text-[#c6a96b]">YM</div>
                    <div className="text-[9px] text-[#a1a1a1]">Published in IEEE · Springer</div>
                  </div>
                </div>
                {/* Publisher logos */}
                <div className="flex gap-4 items-center">
                  {["IEEE", "Springer", "Elsevier"].map((pub) => (
                    <span key={pub} className="text-[10px] font-black text-[#c6a96b]/60 border border-[#c6a96b]/20 px-3 py-1.5 rounded-lg">{pub}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">

        {/* ── LEFT / MAIN ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-20">

          {/* About Service */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-black mb-2 text-[#ffffff]">About Service</h2>
              <div className="w-20 h-1.5 bg-[#c6a96b] rounded-full" />
            </div>

            {/* Advantages grid */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#c6a96b] uppercase tracking-[0.3em] mb-6">Advantages of research papers</h3>
              <p className="text-[#a1a1a1] text-sm mb-6">Unlock a world of opportunities.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {advantages.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-xl flex gap-4 items-start hover:border-[#c6a96b]/30 transition-all">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-sm text-[#e5e5e5]/80 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Impact banner */}
            <div className="border border-[#c6a96b]/30 rounded-2xl p-8 bg-[#c6a96b]/5 text-center">
              <h3 className="text-lg font-black text-[#d4af37] mb-3 uppercase tracking-widest">High-Impact Research Publications</h3>
              <p className="text-sm text-[#e5e5e5]/70 max-w-lg mx-auto mb-6 leading-relaxed">
                The research work under this program is highly valuable and is guaranteed to be published in IEEE, Springer, or Elsevier or Taylor &amp; Francis.
              </p>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {["Springer", "IEEE", "Elsevier"].map((pub) => (
                  <span key={pub} className="text-sm font-black text-[#c6a96b] border border-[#c6a96b]/30 px-5 py-2.5 rounded-xl">{pub}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Admissions Impact Chart */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#c6a96b] pl-6 uppercase tracking-tight text-[#ffffff] mb-3">
              The Impact of Research Papers on Your Application
            </h3>
            <p className="text-[#a1a1a1] text-sm mb-8 pl-6">
              The graph below shows a clear distinction between applicants who utilized our research paper service and those who didn't.
            </p>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
              <h4 className="text-center text-sm font-black text-[#ffffff] uppercase tracking-widest mb-1">Impact of Research Papers on Admissions</h4>
              <div className="w-16 h-[2px] bg-[#c6a96b] mx-auto mb-8 rounded-full" />

              <div className="space-y-6">
                {harvardAdmits.map((uni) => (
                  <div key={uni.label} className="flex items-center gap-4">
                    <div className="text-xs text-[#a1a1a1] w-36 shrink-0 text-right">{uni.label}</div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#d4af37]/20 rounded-full h-5 overflow-hidden">
                          <div className="h-full bg-[#d4af37] rounded-full" style={{ width: `${(uni.withPaper / 55) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#d4af37] w-20">{uni.withPaper}+ admits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-5 overflow-hidden">
                          <div className="h-full bg-white/30 rounded-full" style={{ width: `${(uni.without / 55) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#a1a1a1] w-20">{uni.without}+ admits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-6 mt-8 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#d4af37]" />
                  <span className="text-xs text-[#a1a1a1]">Admits with research papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-white/30" />
                  <span className="text-xs text-[#a1a1a1]">Admits without research papers</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-[#a1a1a1]/50 mt-4">*Statistics based on data points from 2025–2026</p>
            </div>
          </div>

          {/* Pathways */}
          <div>
            <div className="bg-[#0a0a0a] border border-[#c6a96b]/20 rounded-2xl p-8">
              <h3 className="text-center text-sm font-black text-[#ffffff] uppercase tracking-widest mb-6">Pathways for working and settling overseas</h3>
              <div className="w-16 h-[2px] bg-[#c6a96b] mx-auto mb-8 rounded-full" />
              <div className="space-y-4">
                {pathways.map((p, idx) => (
                  <div key={idx} className="flex gap-5 items-start bg-[#c6a96b]/5 border border-[#c6a96b]/10 p-5 rounded-xl hover:border-[#c6a96b]/30 transition-all">
                    <span className="text-3xl shrink-0">{p.flag}</span>
                    <div>
                      <h4 className="font-bold text-[#ffffff] text-sm mb-1">{p.country}</h4>
                      <p className="text-xs text-[#a1a1a1] leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* O-1 Visa Success */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#c6a96b] pl-6 uppercase tracking-tight text-[#ffffff] mb-3">
              Easier pathway to the green card (through the O-1/EB-1 Visa)
            </h3>
            <p className="text-[#a1a1a1] text-sm mb-8 pl-6">
              Success rates for O-1/EB-1 visa applications significantly increase when applicants have published research papers, as shown by recent studies.
            </p>

            {/* O-1 Visa */}
            <div className="bg-[#1a2a35] border border-[#c6a96b]/10 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#ffffff] text-lg">O-1 Visa Success Rate</h4>
                  <p className="text-xs text-[#a1a1a1] mt-1">Based on petition outputs of our clients (Jul 2025 to Dec 2025)</p>
                </div>
                <span className="text-2xl">🇺🇸</span>
              </div>
              <div className="space-y-4">
                {o1Data.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-center text-xs text-[#d4af37] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>

            {/* EB-1 Visa */}
            <div className="bg-[#1a2a35] border border-[#c6a96b]/10 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#ffffff] text-lg">EB-1 Visa Success Rate</h4>
                  <p className="text-xs text-[#a1a1a1] mt-1">Based on petition outputs of our clients (Jul 2025 to Dec 2025)</p>
                </div>
                <span className="text-2xl">🇺🇸</span>
              </div>
              <div className="space-y-4">
                {eb1Data.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-center text-xs text-[#d4af37] font-bold">Average 20–30 citations per paper (Total 200 to 300 citations)</p>
              </div>
            </div>
          </div>

          {/* Global Talent Visa */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#c6a96b] pl-6 uppercase tracking-tight text-[#ffffff] mb-3">
              Proven Success with Global Talent Visas
            </h3>
            <p className="text-[#a1a1a1] text-sm mb-8 pl-6">
              Our expertise ensures high success rates for Global Talent Visas in the UK and Australia, helping applicants achieve their goals with tailored strategies.
            </p>

            {/* UK GTV */}
            <div className="bg-[#1a2a35] border border-[#c6a96b]/10 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#ffffff] text-lg">Global Talent Visa Success Rate</h4>
                  <p className="text-xs text-[#a1a1a1] mt-1">Based on petition outputs of our clients (2025)</p>
                </div>
                <span className="text-2xl">🇬🇧</span>
              </div>
              <div className="space-y-4">
                {gtvData.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-center text-xs text-[#d4af37] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>

            {/* Australia NIV */}
            <div className="bg-[#1a2a35] border border-[#c6a96b]/10 rounded-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#ffffff] text-lg">NIV Australia Success Rates</h4>
                  <p className="text-xs text-[#a1a1a1] mt-1">Based on petition outputs of our clients (2025)</p>
                </div>
                <span className="text-2xl">🇦🇺</span>
              </div>
              <div className="space-y-4">
                {nivData.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-center text-xs text-[#d4af37] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>
          </div>

          {/* The Help You Need */}
          <div className="bg-gradient-to-r from-[#0d1a22] to-[#141414] border border-[#c6a96b]/10 rounded-3xl p-10">
            <h3 className="text-2xl font-black text-center text-[#ffffff] mb-2 uppercase tracking-tight">The Help YOU Need</h3>
            <div className="w-16 h-[2px] bg-[#c6a96b] mx-auto mb-8 rounded-full" />
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <p className="text-[#a1a1a1] text-base leading-relaxed">
                Understand what's in the service after your purchase.
              </p>
              <div className="bg-[#0a0a0a] border border-[#c6a96b]/20 rounded-2xl p-6 flex items-center gap-4 hover:border-[#c6a96b]/50 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-2xl">▶️</div>
                <div>
                  <p className="text-xs font-black text-[#c6a96b] uppercase tracking-widest mb-1">Watch on YouTube</p>
                  <p className="text-sm font-bold text-[#ffffff]">How do services work?</p>
                  <p className="text-xs text-[#a1a1a1]">SAM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 pb-20">
          <div className="sticky top-28">
            <AddToCart serviceId="research-papers" />

            {/* Research Groups */}
            <div className="mt-8 bg-[#0a0a0a] border border-[#c6a96b]/20 rounded-[32px] p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#c6a96b] mb-6">Join or Create a Research Group</h3>
              <div className="space-y-4">
                {researchGroups.map((g, idx) => (
                  <div key={idx} className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-[#c6a96b]/20 transition-all">
                    <div className="bg-gradient-to-r from-[#0d1a22] to-[#141414] px-4 py-3 flex justify-between items-center">
                      <span className="text-[10px] text-[#a1a1a1]">Created on: {g.date}</span>
                      <span className="text-[10px] text-[#c6a96b] font-bold">👥 {g.slots}</span>
                    </div>
                    <div className="px-4 py-3">
                      <h4 className="text-xs font-black text-[#ffffff] mb-2">{g.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-[#a1a1a1]">{g.user}</div>
                        <p className="text-[10px] text-[#a1a1a1]">{g.desc}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 text-[10px] font-bold border border-white/10 py-1.5 rounded-lg text-[#a1a1a1] hover:bg-white/5 transition-all">View Members</button>
                        <button className="flex-1 text-[10px] font-black bg-[#c6a96b] text-[#000000] py-1.5 rounded-lg hover:bg-[#d4af37] transition-all">Join Group</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-[#a1a1a1]">Didn't find what you were looking for?</p>
                <button className="w-full border border-[#c6a96b]/20 text-[#ffffff] font-bold py-3 rounded-xl text-xs hover:bg-white/5 transition-all">
                  + Create Research Group
                </button>
                <button className="text-xs text-[#c6a96b] underline hover:text-[#d4af37] transition-colors">View More Groups</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase text-[#ffffff]">
            Frequently Asked <span className="text-[#c6a96b] italic font-serif">Questions!</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Accordion key={idx} title={faq.q}>
                {faq.a}
              </Accordion>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}