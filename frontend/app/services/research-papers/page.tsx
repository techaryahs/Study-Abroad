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
    <div className="border border-[#10324a]/10 rounded-xl bg-white/80 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-[#10324a] hover:bg-[#f7fbfd] transition-colors"
      >
        <span className="text-sm md:text-base tracking-tight">{title}</span>
        <span className="text-[#d2a14a] text-2xl leading-none">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && children && (
        <div className="p-5 pt-0 text-sm text-[#4b5b6a] border-t border-[#10324a]/10 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Stat Bar ────────────────────────────────────────────────────────────────

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="text-xs text-[#4b5b6a] font-semibold w-full sm:w-28 shrink-0">{label}</span>
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 bg-[#d2a14a]/10 rounded-full h-6 overflow-hidden relative border border-[#d2a14a]/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d2a14a]/80 to-[#d2a14a]"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-black text-[#10324a] w-12 text-right">{value}%</span>
      </div>
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
    <main
      className="min-h-screen text-[#10324a] selection:bg-[#d2a14a]/20"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-12 md:px-20 overflow-hidden border-b border-[#10324a]/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d2a14a]/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] bg-[#2ca59d]/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-row lg:flex-row items-center gap-4 lg:gap-12 mb-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.28em] text-[#0f4c5c]">
                Our Services
              </span>
              <h1 className="text-2xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-[0.9] break-words">
                <span className="text-[#d2a14a]">Research Paper Drafting &amp; Publishing</span>
              </h1>
              <p className="hidden sm:block text-lg text-[#4b5b6a] mb-10 max-w-xl leading-relaxed font-medium">
                Publishing credible research papers with your name on them can help boost your profile!{" "}
                <span className="text-[#d2a14a] font-black">Extremely crucial</span> for MS/PhD and O-1/EB-1 visa applicants.
              </p>
            </div>

            {/* Hero illustration */}
            <div className="w-24 h-24 sm:w-[40%] flex-shrink-0 relative">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Blob background */}
                <div className="absolute inset-0 bg-[#d2a14a]/15 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex flex-col items-center justify-center gap-1 sm:gap-4 scale-[0.4] sm:scale-100">
                  {/* Paper mockup */}
                  <div className="bg-white border border-[#d2a14a]/30 rounded-xl p-6 w-64 shadow-[0_10px_40px_rgba(210,161,74,0.15)] relative">
                    <div className="text-[14px] font-bold text-[#d2a14a] uppercase tracking-widest mb-3 font-bold">Research Publication</div>
                    <div className="space-y-2">
                      {[100, 90, 95, 80, 70, 85, 60].map((w, i) => (
                        <div key={i} className={`h-1.5 rounded-full bg-[#10324a]/10`} style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                  {/* Publisher logos */}
                  <div className="flex gap-2 sm:gap-4 items-center">
                    {["IEEE", "Springer"].map((pub) => (
                      <span key={pub} className="text-[14px] font-bold font-black text-[#d2a14a] border border-[#d2a14a]/30 bg-white px-3 py-1.5 rounded-lg shadow-sm">{pub}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <p className="sm:hidden text-sm text-[#4b5b6a] leading-relaxed font-medium italic border-l-2 border-[#d2a14a] pl-4 py-1">
              Publish credible papers to boost profile for <span className="text-[#d2a14a] font-black">MS/PhD &amp; EB-1</span>.
            </p>
            <DiscussionSection serviceId="research-papers" />
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
              <h2 className="text-3xl font-black mb-2 text-[#10324a]">About Service</h2>
              <div className="w-20 h-1.5 bg-[#d2a14a] rounded-full" />
            </div>

            {/* Advantages grid */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#10324a] uppercase tracking-[0.3em] mb-6">Advantages of research papers</h3>
              <p className="text-[#4b5b6a] text-sm mb-6">Unlock a world of opportunities.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {advantages.map((item, idx) => (
                  <div key={idx} className="bg-white/80 border border-[#10324a]/10 shadow-sm p-5 rounded-xl flex gap-4 items-start hover:border-[#d2a14a]/50 hover:-translate-y-0.5 transition-all">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-sm text-[#10324a] font-semibold leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Impact banner */}
            <div className="border border-[#d2a14a]/25 rounded-2xl p-8 bg-white/80 shadow-sm text-center">
              <h3 className="text-lg font-black text-[#10324a] mb-3 uppercase tracking-widest">High-Impact Research Publications</h3>
              <p className="text-sm text-[#4b5b6a] max-w-lg mx-auto mb-6 leading-relaxed">
                The research work under this program is highly valuable and is guaranteed to be published in IEEE, Springer, or Elsevier or Taylor &amp; Francis.
              </p>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {["Springer", "IEEE", "Elsevier"].map((pub) => (
                  <span key={pub} className="text-sm font-black text-[#0f4c5c] border border-[#2ca59d]/30 px-5 py-2.5 rounded-xl bg-[#2ca59d]/5">{pub}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Admissions Impact Chart */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#d2a14a] pl-6 uppercase tracking-tight text-[#10324a] mb-3">
              The Impact of Research Papers on Your Application
            </h3>
            <p className="text-[#4b5b6a] text-sm mb-8 pl-6">
              The graph below shows a clear distinction between applicants who utilized our research paper service and those who didn't.
            </p>

            <div className="bg-white/80 border border-[#10324a]/10 shadow-md rounded-2xl p-8">
              <h4 className="text-center text-sm font-black text-[#10324a] uppercase tracking-widest mb-1">Impact of Research Papers on Admissions</h4>
              <div className="w-16 h-[2px] bg-[#d2a14a] mx-auto mb-8 rounded-full" />

              <div className="space-y-6">
                {harvardAdmits.map((uni) => (
                  <div key={uni.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-xs font-bold text-[#4b5b6a] w-full sm:w-36 shrink-0 sm:text-right">{uni.label}</div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#d2a14a]/10 border border-[#d2a14a]/20 rounded-full h-5 overflow-hidden">
                          <div className="h-full bg-[#d2a14a] rounded-full" style={{ width: `${(uni.withPaper / 55) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#d2a14a] w-20">{uni.withPaper}+ admits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#f7fbfd] border border-[#2ca59d]/20 rounded-full h-5 overflow-hidden">
                          <div className="h-full bg-[#2ca59d]/50 rounded-full" style={{ width: `${(uni.without / 55) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#4b5b6a] w-20">{uni.without}+ admits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-6 mt-8 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#d2a14a]" />
                  <span className="text-xs font-bold text-[#4b5b6a]">Admits with papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#2ca59d]/50" />
                  <span className="text-xs font-bold text-[#4b5b6a]">Admits without papers</span>
                </div>
              </div>
              <p className="text-center text-[14px] font-bold text-[#4b5b6a]/50 mt-4 font-bold">*Statistics based on data points from 2025–2026</p>
            </div>
          </div>

          {/* Pathways */}
          <div>
            <div className="bg-white/80 border border-[#10324a]/10 shadow-sm rounded-2xl p-8">
              <h3 className="text-center text-sm font-black text-[#10324a] uppercase tracking-widest mb-6">Pathways for working and settling overseas</h3>
              <div className="w-16 h-[2px] bg-[#d2a14a] mx-auto mb-8 rounded-full" />
              <div className="space-y-4">
                {pathways.map((p, idx) => (
                  <div key={idx} className="flex gap-5 items-start bg-[#f7fbfd] border border-[#10324a]/8 p-5 rounded-xl hover:border-[#d2a14a]/40 transition-all">
                    <span className="text-3xl shrink-0">{p.flag}</span>
                    <div>
                      <h4 className="font-bold text-[#10324a] text-sm mb-1">{p.country}</h4>
                      <p className="text-xs text-[#4b5b6a] leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* O-1 Visa Success */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#d2a14a] pl-6 uppercase tracking-tight text-[#10324a] mb-3">
              Easier pathway to the green card (through the O-1/EB-1 Visa)
            </h3>
            <p className="text-[#4b5b6a] text-sm mb-8 pl-6">
              Success rates for O-1/EB-1 visa applications significantly increase when applicants have published research papers, as shown by recent studies.
            </p>

            {/* O-1 Visa */}
            <div className="bg-white/80 border border-[#10324a]/10 shadow-md rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#10324a] text-lg">O-1 Visa Success Rate</h4>
                  <p className="text-xs text-[#4b5b6a] font-semibold mt-1">Based on petition outputs of our clients (Jul 2025 to Dec 2025)</p>
                </div>
                <span className="text-2xl">🇺🇸</span>
              </div>
              <div className="space-y-4">
                {o1Data.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-[#10324a]/10 pt-4">
                <p className="text-center text-xs text-[#d2a14a] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>

            {/* EB-1 Visa */}
            <div className="bg-white/80 border border-[#10324a]/10 shadow-md rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#10324a] text-lg">EB-1 Visa Success Rate</h4>
                  <p className="text-xs text-[#4b5b6a] font-semibold mt-1">Based on petition outputs of our clients (Jul 2025 to Dec 2025)</p>
                </div>
                <span className="text-2xl">🇺🇸</span>
              </div>
              <div className="space-y-4">
                {eb1Data.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-[#10324a]/10 pt-4">
                <p className="text-center text-xs text-[#d2a14a] font-bold">Average 20–30 citations per paper (Total 200 to 300 citations)</p>
              </div>
            </div>
          </div>

          {/* Global Talent Visa */}
          <div>
            <h3 className="text-2xl font-black border-l-4 border-[#d2a14a] pl-6 uppercase tracking-tight text-[#10324a] mb-3">
              Proven Success with Global Talent Visas
            </h3>
            <p className="text-[#4b5b6a] text-sm mb-8 pl-6">
              Our expertise ensures high success rates for Global Talent Visas in the UK and Australia, helping applicants achieve their goals with tailored strategies.
            </p>

            {/* UK GTV */}
            <div className="bg-white/80 border border-[#10324a]/10 shadow-md rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#10324a] text-lg">Global Talent Visa Success Rate</h4>
                  <p className="text-xs text-[#4b5b6a] font-semibold mt-1">Based on petition outputs of our clients (2025)</p>
                </div>
                <span className="text-2xl">🇬🇧</span>
              </div>
              <div className="space-y-4">
                {gtvData.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-[#10324a]/10 pt-4">
                <p className="text-center text-xs text-[#d2a14a] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>

            {/* Australia NIV */}
            <div className="bg-white/80 border border-[#10324a]/10 shadow-md rounded-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-[#10324a] text-lg">NIV Australia Success Rates</h4>
                  <p className="text-xs text-[#4b5b6a] font-semibold mt-1">Based on petition outputs of our clients (2025)</p>
                </div>
                <span className="text-2xl">🇦🇺</span>
              </div>
              <div className="space-y-4">
                {nivData.map((d) => <StatBar key={d.label} label={d.label} value={d.value} />)}
              </div>
              <div className="mt-6 border-t border-[#10324a]/10 pt-4">
                <p className="text-center text-xs text-[#d2a14a] font-bold">Average 20–30 citations per paper (Total 150 to 250 citations)</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 pb-20">
          <div className="sticky top-28">
            <AddToCart serviceId="research-papers" />

            {/* Research Groups */}
            <div className="mt-8 bg-white/85 shadow-lg border border-[#10324a]/10 rounded-[32px] p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#10324a] mb-6">Join or Create a Research Group</h3>
              <div className="space-y-4">
                {researchGroups.map((g, idx) => (
                  <div key={idx} className="bg-[#f7fbfd] border border-[#10324a]/8 rounded-xl overflow-hidden hover:border-[#d2a14a]/40 transition-all shadow-sm">
                    <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-[#10324a]/5">
                      <span className="text-[14px] font-bold text-[#4b5b6a] font-bold">Created on: {g.date}</span>
                      <span className="text-[14px] font-bold text-[#d2a14a] font-bold">👥 {g.slots}</span>
                    </div>
                    <div className="px-4 py-3">
                      <h4 className="text-xs font-black text-[#10324a] mb-2">{g.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#2ca59d]/10 flex items-center justify-center text-[12px] font-black font-bold text-[#0f4c5c]">{g.user}</div>
                        <p className="text-[14px] font-bold text-[#4b5b6a] font-medium">{g.desc}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 text-[14px] font-bold font-bold border border-[#10324a]/15 py-1.5 rounded-lg text-[#10324a] hover:bg-[#10324a]/5 transition-all">View Members</button>
                        <button className="flex-1 text-[14px] font-bold font-black bg-[#d2a14a] text-[#10324a] py-1.5 rounded-lg hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all">Join Group</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-[#4b5b6a] font-medium">Didn't find what you were looking for?</p>
                <button className="w-full border border-[#d2a14a]/30 text-[#10324a] font-bold py-3 rounded-xl text-xs hover:bg-[#d2a14a]/5 transition-all">
                  + Create Research Group
                </button>
                <button className="text-xs text-[#d2a14a] font-bold underline hover:text-[#10324a] transition-colors">View More Groups</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-20 border-t border-[#10324a]/10 bg-white/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase text-[#10324a]">
            Frequently Asked <span className="text-[#d2a14a] italic font-serif">Questions!</span>
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