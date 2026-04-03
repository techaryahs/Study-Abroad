"use client";

import { useEffect, useState } from "react";

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
  const [numUnis, setNumUnis] = useState("8 Universities");

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

            <div className="flex gap-10">
              {["📹 Video", "📞 Audio", "💬 Text"].map((item) => (
                <div key={item} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-lg hover:border-[#c6a96b]/40 transition-colors">
                    {item.split(" ")[0]}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#a1a1a1] tracking-[0.2em]">{item.split(" ").slice(1).join(" ")} Support</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-4">
              <button className="bg-[#c6a96b] text-[#1a1a1a] font-bold text-xs uppercase tracking-widest py-5 px-12 rounded-lg hover:brightness-110 transition-all shadow-2xl shadow-black">
                Discuss Your Case
              </button>
              <span className="text-[10px] text-[#a1a1a1] italic uppercase tracking-widest leading-loose border-l border-white/10 pl-6">
                Direct Expert<br/>Access
              </span>
            </div>
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
          <div className="sticky top-12 bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 space-y-10 shadow-2xl">
            <div className="text-center space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c6a96b]">Enrolment Portal</h3>
                <div className="w-10 h-[1px] bg-[#c6a96b] mx-auto opacity-50" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                <span className="text-[#a1a1a1]">Standard Support</span>
                <span className="text-white">1 Year Unlimited</span>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#a1a1a1] uppercase tracking-widest">University Scope</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-4 text-xs tracking-widest outline-none focus:border-[#c6a96b]/50 text-white transition-all cursor-pointer"
                  value={numUnis}
                  onChange={(e) => setNumUnis(e.target.value)}
                >
                  <option>8 Universities</option>
                  <option>10 Universities</option>
                  <option>12 Universities</option>
                </select>
              </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4">
              <span className="text-[#c6a96b] text-xl">✦</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#c6a96b]">Legally Binding Admission Guarantee</span>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#a1a1a1] text-xs line-through tracking-widest opacity-40">INR 2,25,601</span>
                <span className="bg-[#c6a96b]/10 text-[#c6a96b] text-[9px] font-bold px-3 py-1 rounded border border-[#c6a96b]/20 tracking-tighter">ELITE DISCOUNT 20%</span>
              </div>
              <p className="text-5xl font-light tracking-tighter text-white">₹1,80,481</p>
            </div>

            <div className="space-y-3 pt-4">
                <button className="w-full py-5 bg-[#c6a96b] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:brightness-110 transition-all shadow-xl shadow-black">Secure Package</button>
                <button className="w-full py-5 bg-transparent border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-white/5 transition-all">Save to Cart</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}