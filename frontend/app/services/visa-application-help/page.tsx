"use client";

import React, { useState, ReactNode } from "react";

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

// ─── Country Tab Content ──────────────────────────────────────────────────────

type Country = "USA" | "Canada" | "UK";

const countryContent: Record<
  Country,
  {
    highlight: { icon: string; title: string; desc: string };
    visaTypes?: { category: string; tags: string[] }[];
    intro?: string;
    features: { icon: string; title: string; desc: string }[];
  }
> = {
  USA: {
    highlight: {
      icon: "⏱️",
      title: "Quick Appointments",
      desc: "Leverage the best-in-class 24/7 visa monitoring and faster appointment booking without any effort needed on your end.",
    },
    visaTypes: [
      { category: "Student Visas", tags: ["F-1", "F-2", "J-1", "J-2", "M-1", "M-2"] },
      { category: "Work Visas", tags: ["H-4", "H-1B", "L-1A", "L-2"] },
      { category: "Business & Tourism", tags: ["B1", "B2"] },
      { category: "Others", tags: ["K/ U/ O/ C1-D"] },
    ],
    features: [
      { icon: "📄", title: "Visa Documentation", desc: "Ensure correctness in the DS-160 & Visa Portal to minimize the chances of rejections." },
      { icon: "💰", title: "Financial Documentation", desc: "Prove the right amount of finances needed to get your visa." },
      { icon: "🎭", title: "Mock Interviews", desc: "Get tailored training for your case on tackling the visa interview with confidence." },
      { icon: "📱", title: "Social Media Vetting", desc: "We vet your social media beforehand to ensure compliance." },
    ],
  },
  Canada: {
    intro:
      "Whether it's the Canadian Study Permit, Work Permit, or Temporary Resident (Tourist) Visa, here's how we make it smooth for you.",
    highlight: {
      icon: "🚦",
      title: "Picking the Right Stream",
      desc: "We'll see which study permit stream suits you best, whether it's SDS or General.",
    },
    features: [
      { icon: "📄", title: "Visa Documentation", desc: "Ensure correctness in the GCKey Visa Application to minimize the chances of rejections." },
      { icon: "💰", title: "Financial Documentation", desc: "Prove the right amount of finances needed to get your visa." },
      { icon: "🎭", title: "Mock Interviews", desc: "Get tailored training for your case on tackling the visa interview with confidence." },
      { icon: "📱", title: "Social Media Vetting", desc: "We vet your social media beforehand to ensure compliance." },
    ],
  },
  UK: {
    intro:
      "We offer assistance with the Tier 4 (Student), Tourist, and Business Visitor visa applications. We offer end-to-end assistance till you get your UK visa in your hands.",
    highlight: {
      icon: "⏱️",
      title: "Point-Based Immigration System",
      desc: "Get support for meeting the minimum points threshold required for your UK Visa.",
    },
    features: [
      { icon: "📄", title: "Visa Documentation", desc: "Ensure correctness in the Visa Application Form while minimizing chances of rejections." },
      { icon: "💰", title: "Financial Documentation", desc: "Prove the right amount of finances needed to get your visa." },
      { icon: "🎭", title: "Mock Interviews", desc: "Get tailored training for your case on tackling the visa interview with confidence." },
      { icon: "📱", title: "Social Media Vetting", desc: "We vet your social media beforehand to ensure compliance." },
    ],
  },
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VisaApplicationPage() {
  const [currency, setCurrency] = useState("INR");
  const [dependents, setDependents] = useState(0);
  const [mocks, setMocks] = useState(1);
  const [activeCountry, setActiveCountry] = useState<Country>("USA");

  const baseINR = 55772.95;
  const originalINR = 69716.0;
  const baseUSD = 669;
  const originalUSD = 836;

  const dependentMultiplier = 1 + dependents * 0.3;
  const mockMultiplier = 1 + (mocks - 1) * 0.15;

  const currentAmount =
    currency === "INR"
      ? `₹${(baseINR * dependentMultiplier * mockMultiplier).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
      : `$${(baseUSD * dependentMultiplier * mockMultiplier).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  const originalAmount =
    currency === "INR"
      ? `INR ${originalINR.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      : `USD ${originalUSD.toLocaleString("en-US")}.00`;

  const countries: Country[] = ["USA", "Canada", "UK"];
  const countryFlags: Record<Country, string> = { USA: "🇺🇸", Canada: "🇨🇦", UK: "🇬🇧" };
  const content = countryContent[activeCountry];

  const faqs = [
    { q: "Do you only help for applications to the US? What about other countries?", a: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore." },
    { q: "Does the price include GST/Taxes?", a: "Yes, all prices shown are inclusive of applicable taxes unless stated otherwise at checkout." },
    { q: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?", a: "We use structured Google Meet sessions, dedicated support channels, and encrypted document sharing to replicate the experience of in-person consulting." },
    { q: "What is the best time for me to enroll in the services?", a: "As early as possible — ideally 2–3 months before your intended visa appointment to allow for thorough documentation review." },
    { q: "I have done most of the process by myself but I am unable to find a date for my Visa appointment at my convenience.", a: "We offer 24/7 slot monitoring and will book the fastest available appointment on your behalf with no additional effort needed from you." },
    { q: "Are the timelines mentioned on the website followed religiously?", a: "We adhere strictly to our stated 1–2 month timelines and will notify you proactively if any delays are anticipated." },
    { q: "Is there a slot booking guarantee with a specific deadline?", a: "Yes, we guarantee appointment slot booking within a defined window based on your target travel date. Details are shared at onboarding." },
    { q: "Is the embassy fee included in our service fee?", a: "No, embassy/consulate fees are paid directly by you to the respective government. Our service fee covers only our consulting support." },
    { q: "Are there any ongoing discount offers?", a: "A 20% discount is currently applied. This is a limited-time offer." },
    { q: "Do you offer support for applying for the Emergency Appointments?", a: "Yes, we have a dedicated process for emergency appointment booking and will prioritize your case accordingly." },
    { q: "What does the Visa Guarantee in the service mean?", a: "Our Visa Guarantee means we will work with you at no extra charge until your visa is approved, subject to our terms and conditions." },
    { q: "Which documents will I need to begin with the service?", a: "A valid passport, admission/offer letter (if applicable), financial statements, and any prior visa history. Our team will provide a complete checklist upon enrollment." },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] text-[#e5e5e5] selection:bg-[#d4af37]/30">

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:px-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
              Visa Application Help
            </h1>
            <p className="text-lg text-[#e5e5e5]/80 mb-10 max-w-xl leading-relaxed font-medium">
              Ace the visa application through our help in the paperwork, financial planning, and visa Interview mock rounds.{" "}
              <span className="text-[#ffffff]">Applicable for USA, Canada, UK, Germany, and more.</span>
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
            <div className="relative w-full h-[320px] md:h-[400px]">
              <div className="absolute inset-0 bg-[#d4af37]/8 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] blur-2xl" />
              <div className="absolute inset-6 flex flex-col items-center justify-center gap-6">
                {/* Expert badge */}
                <div className="bg-[#0f0f0f] border border-[#c6a96b]/30 rounded-2xl px-8 py-5 shadow-2xl text-center">
                  <p className="text-[#c6a96b] text-xs font-black uppercase tracking-widest mb-1">Expert Support</p>
                  <p className="text-[#ffffff] font-black text-base">Get support from Visa experts</p>
                  <p className="text-[#a1a1a1] text-sm">with decades of experience</p>
                </div>
                {/* Country flags */}
                <div className="flex gap-4">
                  {(["🇺🇸", "🇨🇦", "🇬🇧", "🇩🇪"] as const).map((flag, i) => (
                    <div key={i} className="w-12 h-12 bg-[#0f0f0f] border border-[#c6a96b]/20 rounded-xl flex items-center justify-center text-2xl hover:border-[#c6a96b]/50 transition-all">
                      {flag}
                    </div>
                  ))}
                </div>
                {/* Success rate badge */}
                <div className="flex items-center gap-3 bg-[#c6a96b]/5 border border-[#c6a96b]/20 rounded-xl px-6 py-3">
                  <span className="text-3xl font-black text-[#d4af37]">98.7%</span>
                  <span className="text-xs text-[#a1a1a1] font-bold uppercase tracking-widest">Success Rate</span>
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

            {/* Country Tabs */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-2 flex gap-2 mb-8">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                    activeCountry === c
                      ? "bg-[#ffffff] text-[#000000] shadow-lg"
                      : "text-[#a1a1a1] hover:text-[#ffffff] hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{countryFlags[c]}</span>
                  {c}
                </button>
              ))}
            </div>

            {/* Visa Types (USA only) */}
            {content.visaTypes && (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-6">
                <h3 className="text-xs font-black text-[#c6a96b] uppercase tracking-[0.3em] mb-5">
                  This service is valid for the following visa types:
                </h3>
                <div className="space-y-4">
                  {content.visaTypes.map((vt) => (
                    <div key={vt.category} className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-[#e5e5e5]/80 w-40 shrink-0">{vt.category}:</span>
                      <div className="flex flex-wrap gap-2">
                        {vt.tags.map((tag) => (
                          <span key={tag} className="border border-[#c6a96b]/30 text-[#c6a96b] text-[11px] font-black px-3 py-1 rounded-lg hover:bg-[#c6a96b]/10 transition-all">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Canada/UK intro */}
            {content.intro && (
              <p className="text-[#e5e5e5]/80 text-base leading-relaxed mb-6">{content.intro}</p>
            )}

            {/* Highlight card */}
            <div className="relative bg-[#1a2a35] border border-[#c6a96b]/20 rounded-2xl p-8 mb-8">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-[#0a0a0a] border border-[#c6a96b]/30 rounded-xl flex items-center justify-center text-2xl">
                {content.highlight.icon}
              </div>
              <div className="mt-2">
                <h3 className="font-black text-[#ffffff] text-base mb-2">{content.highlight.title}</h3>
                <p className="text-sm text-[#e5e5e5]/70 leading-relaxed">{content.highlight.desc}</p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              {content.features.map((f, idx) => (
                <div key={idx} className="relative bg-[#c6a96b]/5 border border-[#c6a96b]/15 rounded-2xl p-6 hover:border-[#c6a96b]/40 transition-all group">
                  <div className="absolute -top-4 left-6 w-9 h-9 bg-[#0a0a0a] border border-[#c6a96b]/20 rounded-xl flex items-center justify-center text-lg group-hover:border-[#c6a96b]/50 transition-all">
                    {f.icon}
                  </div>
                  <div className="mt-3">
                    <h4 className="font-black text-[#ffffff] text-sm mb-2">{f.title}</h4>
                    <p className="text-xs text-[#a1a1a1] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Rate Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#c6a96b]/10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a22] via-[#1a2a35] to-[#0d1a22]" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=60')] bg-cover bg-center opacity-10" />
            <div className="relative px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black text-[#ffffff] mb-2">Success Rate</h3>
                <p className="text-sm text-[#a1a1a1] max-w-xs leading-relaxed">
                  You can rest assured that your application is in safe hands.
                </p>
              </div>
              <div className="text-center">
                <span className="text-7xl font-black text-[#d4af37] tracking-tighter">98.7%</span>
              </div>
            </div>
          </div>

          {/* Don't let the last step block */}
          <div>
            <p className="text-[#e5e5e5]/70 text-base leading-relaxed">
              Don't let the last step of the process be a showstopper. Once you enroll, our goal is the same as yours:{" "}
              <span className="text-[#ffffff] font-semibold">to get you and your family that visa seamlessly and quickly.</span>
            </p>
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
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-[#0a0a0a] border border-[#c6a96b]/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[32px] p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#c6a96b]">Start Now</h3>
              <div className="w-10 h-[1px] bg-[#c6a96b]/30 mx-auto mt-4" />
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <span className="text-[#a1a1a1]">Services</span>
                <span className="text-[#ffffff] text-right text-[11px]">Visa Application Help</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <span className="text-[#a1a1a1]">Duration</span>
                <span className="text-[#ffffff]">1–2 months</span>
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
              <div className="flex justify-between items-center">
                <span className="text-[#a1a1a1] text-[10px] font-bold uppercase tracking-widest">Dependents</span>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="bg-[#000000] text-[#c6a96b] border border-[#c6a96b]/20 rounded-lg px-3 py-1.5 text-[10px] font-black outline-none focus:border-[#c6a96b] cursor-pointer"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#a1a1a1] text-[10px] font-bold uppercase tracking-widest">Mocks</span>
                <select
                  value={mocks}
                  onChange={(e) => setMocks(Number(e.target.value))}
                  className="bg-[#000000] text-[#c6a96b] border border-[#c6a96b]/20 rounded-lg px-3 py-1.5 text-[10px] font-black outline-none focus:border-[#c6a96b] cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visa Guarantee badge */}
            <div className="bg-gradient-to-r from-[#c6a96b]/20 to-[#d4af37]/20 border border-[#c6a96b]/40 rounded-xl p-4 text-center">
              <p className="text-xs font-black text-[#d4af37] uppercase tracking-widest">✦ Visa Guarantee Included</p>
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-[#a1a1a1] text-sm line-through mb-1 opacity-50 tracking-tighter">{originalAmount}</p>
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-black text-[#ffffff] tracking-tighter">{currentAmount}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[#a1a1a1] text-xs">You save:</span>
                <span className="bg-[#c6a96b] text-[#000000] text-[10px] font-black px-2 py-0.5 rounded-md">20% off</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-5 bg-[#c6a96b] text-[#000000] font-black rounded-xl shadow-xl shadow-[#c6a96b]/10 hover:bg-[#d4af37] transition-all text-xs uppercase tracking-widest">
                Log In To Pay
              </button>
            </div>

            {/* Discuss Card */}
            <div className="border-t border-white/5 pt-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#c6a96b]/10 border border-[#c6a96b]/20 overflow-hidden flex items-center justify-center text-lg shrink-0">👤</div>
                <div>
                  <p className="text-xs font-black text-[#c6a96b] uppercase tracking-widest mb-1">Discuss Your Case</p>
                  <p className="text-xs text-[#a1a1a1] leading-relaxed">Chat with a team member to see how we can help.</p>
                  <button className="mt-3 text-xs font-bold text-[#ffffff] border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                    Message now →
                  </button>
                </div>
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