"use client";

import { useEffect, useState } from "react";

// ─── Components ──────────────────────────────────────────────────────────────

function StatBar({ country, flagUrl, count, percentage }: { country: string; flagUrl: string; count: string; percentage: string }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {/* Country Name */}
      <span className="w-28 text-xs font-bold text-white/60 truncate uppercase tracking-wider">
        {country}
      </span>
      
      {/* Circular Flag Image - Now uses the direct URL you paste */}
      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
        <img 
          src={flagUrl} 
          alt={country}
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(250,204,21,0.3)]" 
          style={{ width: percentage }}
        />
      </div>

      {/* Count */}
      <span className="w-12 text-[11px] font-black text-white/80 text-right">
        {count}
      </span>
    </div>
  );
}

function IncludeItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className="text-2xl mt-1 opacity-80">{icon}</div>
      <span className="text-sm font-semibold text-white/70 leading-snug">{title}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ApplicationHelpPage() {
  const [numUnis, setNumUnis] = useState("8 Universities");

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white selection:bg-yellow-400/30">
      
      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 md:px-20 border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
              COMPLETE <span className="text-yellow-400 text-glow">APPLICATION</span> HELP
            </h1>
            <p className="text-lg text-white/70 font-bold mb-4">
              The only service in the market with an admissions and visa guarantee. Top universities. No BS.
            </p>
            <p className="text-md text-white/50 mb-10 leading-relaxed max-w-xl">
              1 year of unlimited support via counselors with decades of experience. Get your application into the top 10% of the applications the committee evaluates for admission.
            </p>

            <div className="flex gap-8 mb-10">
              {["📹 Video call", "📞 Audio call", "💬 Text Support"].map((item) => (
                <div key={item} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                    {item.split(" ")[0]}
                  </div>
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">{item.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button className="bg-yellow-400 text-black font-black py-4 px-10 rounded-xl hover:bg-yellow-500 shadow-xl shadow-yellow-400/20 transition-all">
                Discuss Your Case
              </button>
              <span className="text-xs text-white/30 italic max-w-[120px]">Have questions? Let's chat.</span>
            </div>
          </div>

          {/* Hero Video Section */}
          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 bg-yellow-400/10 rounded-full blur-3xl group-hover:bg-yellow-400/20 transition-all" />
            <div className="relative w-[500px] h-[450px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"> 
              <video 
                src="/application.mp4" 
                autoPlay muted loop playsInline
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-16">
          
          {/* Eligibility Section */}
          <div className="space-y-6">
            <div className="inline-block border-l-4 border-yellow-400 pl-4">
              <h2 className="text-2xl font-black">Package valid for:</h2>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-white/50 font-medium">
              {["Bachelor's", "Diploma", "Master's", "Ph.D.", "Transfer Applications"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-yellow-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Student Stats Section - FIXED WITH URLS */}
          <div className="bg-[#141414] border border-white/5 rounded-[32px] p-8 md:p-12">
            <h3 className="text-xl font-black text-center mb-10 uppercase tracking-widest">Where our students went</h3>
            <div className="space-y-3">
              {/* PASTE YOUR URLS BELOW IN THE flagUrl PROP */}
              <StatBar country="United States" flagUrl="https://flagcdn.com/w80/us.png" count="10k+" percentage="95%" />
              <StatBar country="Canada" flagUrl="https://ymgrad.com/static/base/Flags_icon/canada.png" count="2k+" percentage="40%" />
              <StatBar country="United Kingdom" flagUrl="https://ymgrad.com/static/base/Flags_icon/uk.png" count="3k+" percentage="55%" />
              <StatBar country="Australia" flagUrl="https://flagcdn.com/w80/au.png" count="4k+" percentage="65%" />
              <StatBar country="Ireland" flagUrl="https://ymgrad.com/static/base/Flags_icon/ireland.png" count="800+" percentage="20%" />
              <StatBar country="Singapore" flagUrl="https://ymgrad.com/static/base/Flags_icon/singapore.png" count="250+" percentage="12%" />
              <StatBar country="Germany" flagUrl="https://flagcdn.com/w80/de.png" count="1k+" percentage="25%" />
               <StatBar country="Netherlands" flagUrl="https://ymgrad.com/static/base/Flags_icon/netherlands.png" count="250+" percentage="95%" />
              <StatBar country="France" flagUrl="https://ymgrad.com/static/base/Flags_icon/france.png" count="250+" percentage="40%" />
              <StatBar country="Switzerland" flagUrl="https://ymgrad.com/static/base/Flags_icon/switzerland.png" count="250k+" percentage="55%" />
              <StatBar country="New Zealand" flagUrl="https://ymgrad.com/static/base/Flags_icon/switzerland.png" count="100k+" percentage="65%" />
              <StatBar country="Rest of the world" flagUrl="https://ymgrad.com/static/base/Flags_icon/rest_of_the_world.png" count="500+" percentage="20%" />
              
            </div>
          </div>

          {/* Infinity Stats Box */}
          <div className="grid grid-cols-3 gap-1 bg-gradient-to-r from-yellow-900/20 to-[#141414] border border-yellow-400/10 rounded-3xl overflow-hidden">
            <div className="p-8 text-center border-r border-white/5">
                <p className="text-4xl font-black text-yellow-400 mb-1">22%</p>
                <p className="text-[10px] font-bold text-white/40 uppercase">Full Funding</p>
            </div>
            <div className="p-8 text-center border-r border-white/5">
                <p className="text-4xl font-black text-white mb-1">∞</p>
                <p className="text-[10px] font-bold text-white/40 uppercase">Unlimited Calls</p>
            </div>
            <div className="p-8 text-center">
                <p className="text-4xl font-black text-yellow-400 mb-1">83%</p>
                <p className="text-[10px] font-bold text-white/40 uppercase">Scholarship &gt;$10k</p>
            </div>
          </div>

          {/* Includes Grid */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-10">
            <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4">What's Included:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <IncludeItem icon="🏫" title="University Shortlisting & Profile Evaluation" />
              <IncludeItem icon="👤" title="Profile Building Advice" />
              <IncludeItem icon="📄" title="3 Letters of Recommendation" />
              <IncludeItem icon="✍️" title="Statements of Purpose/MBA Essays" />
              <IncludeItem icon="💼" title="Resume Review" />
              <IncludeItem icon="🖥️" title="Application Portals' Help" />
              <IncludeItem icon="📅" title="Unlimited Google Meet Counseling" />
              <IncludeItem icon="💰" title="Expedited Education Loans" />
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-[#141414] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase">Start Now</h3>
                <div className="w-12 h-1 bg-yellow-400 mx-auto" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40 font-bold">Duration</span>
                <span className="text-white/80">2-3 weeks (Minimum)</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase">No. of Universities</label>
                <select 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 text-white"
                  value={numUnis}
                  onChange={(e) => setNumUnis(e.target.value)}
                >
                  <option>8 Universities</option>
                  <option>10 Universities</option>
                  <option>12 Universities</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl flex items-center gap-3">
              <span className="text-yellow-400">✨</span>
              <span className="text-[10px] font-black uppercase text-yellow-400/80">Admissions Guarantee Included</span>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/20 text-sm line-through">INR 2,25,601.00</span>
                <span className="bg-red-500 text-[10px] font-black px-2 py-0.5 rounded italic">20% OFF</span>
              </div>
              <p className="text-4xl font-black">₹1,80,481</p>
            </div>

            <div className="space-y-4">
                <button className="w-full py-4 bg-transparent border-2 border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">Add to Cart</button>
                <button className="w-full py-5 bg-yellow-400 text-black font-black rounded-2xl shadow-xl shadow-yellow-400/10 hover:bg-yellow-500 transition-all">Buy Now</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}