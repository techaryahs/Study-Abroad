"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Bookmark, ArrowRight, GraduationCap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import scholarshipData from "@/data/scolarship.json";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";

const ScholarshipsPage = () => {
  const { isPremium } = usePremiumStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const scholarships = scholarshipData.scholarships;

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, scholarships]);

  const categories = useMemo(() => {
    return ["All Categories", ...Array.from(new Set(scholarships.map(s => s.category)))];
  }, [scholarships]);

  return (
    <div
      className="min-h-screen transition-colors duration-300 text-[#10324a]"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >

      <style>{`
        .gold-shimmer {
          background: linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .scholarship-card {
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(16,50,74, 0.10);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(16,50,74, 0.04);
        }

        .scholarship-card:hover {
          transform: translateY(-4px);
          border-color: rgba(210,161,74, 0.45);
          box-shadow: 0 15px 35px rgba(16,50,74, 0.08);
        }

        .search-container {
          background: #FFFFFF;
          border: 1px solid rgba(16,50,74, 0.12);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(16,50,74,0.06);
        }
        @media (min-width: 768px) {
          .search-container {
            border-radius: 100px;
          }
        }
      `}</style>

      {/* Hero Header */}
      <section className="relative pt-20 pb-12 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(44,165,157, 0.10) 0%, transparent 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[9px] tracking-[0.2em] uppercase mb-4">
              Financial Support Index
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 leading-[0.95]">
              <span className="gold-shimmer">Elite Scholarships</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">500+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Scholarships</p>
              </div>
              <div className="hidden sm:block w-[1px] bg-gradient-to-b from-transparent via-[#d2a14a]/40 to-transparent"></div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">$10M+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Financial Aid</p>
              </div>
              <div className="hidden sm:block w-[1px] bg-gradient-to-b from-transparent via-[#d2a14a]/40 to-transparent"></div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">15+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Countries</p>
              </div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-1.5 p-1.5 search-container">
            <div className="flex-1 w-full relative flex items-center px-6">
              <Search size={16} className="text-[#4b5b6a]/50 mr-3" />
              <input
                type="text"
                placeholder="Search by program name or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 text-xs outline-none placeholder:text-[#4b5b6a]/50 font-medium text-[#10324a]"
              />
            </div>
            <div className="h-6 w-[1px] bg-[#10324a]/10 hidden md:block" />
            <div className="w-full md:w-56 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent py-3.5 px-6 text-xs outline-none appearance-none cursor-pointer text-[#4b5b6a] font-bold"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-white">{cat}</option>)}
              </select>
              <Filter size={12} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#d2a14a] pointer-events-none" />
            </div>
            <button className="w-full md:w-auto px-8 py-3.5 bg-[#10324a] text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#d2a14a] hover:text-[#10324a] transition-all">
              Apply Filter
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">

        <div className="flex items-center gap-8 mb-10 border-b border-[#10324a]/10 pb-5">
          <button className="relative group flex items-center gap-2">
            <span className="text-[#10324a] font-black text-[10px] uppercase tracking-[0.15em]">{`Opportunities (${filteredScholarships.length})`}</span>
            <div className="absolute -bottom-5 left-0 w-full h-0.5 bg-[#d2a14a]" />
          </button>
          <button className="flex items-center gap-2 text-[#4b5b6a]/60 hover:text-[#d2a14a] transition-colors">
            <Bookmark size={12} />
            <span className="font-black text-[10px] uppercase tracking-[0.15em]">Portfolio (0)</span>
          </button>
        </div>

        <div className="grid gap-5">
          {filteredScholarships.length > 0 ? (
            <>
              {filteredScholarships.slice(0, 3).map((s) => (
                <Link
                  href={`/resources/scholarships/${s.slug}`}
                  key={s.id}
                  className="scholarship-card block group p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-0.5 bg-[#2ca59d]/8 text-[#0f4c5c] text-[8px] font-black uppercase tracking-widest rounded border border-[#2ca59d]/15">
                          {s.category}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-[#10324a] transition-colors mb-1">{s.name}</h3>
                      <p className="text-[10px] font-black text-[#4b5b6a] tracking-wide">PROVIDER: <span className="font-medium opacity-80">{s.sponsor}</span></p>
                    </div>

                    <div className="flex items-center gap-8 md:gap-10 flex-shrink-0">
                      <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#4b5b6a]/60">Closing Date</span>
                        {isPremium ? (
                          <span className="text-xs font-bold text-[#10324a] whitespace-nowrap">{s.deadline}</span>
                        ) : (
                          <div className="flex items-center gap-1 bg-white border border-[#d2a14a]/25 px-2 py-0.5 rounded shadow-sm text-[#d2a14a]">
                            <Lock size={10} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#d2a14a]">Award value</span>
                        {isPremium ? (
                          <span className="text-xs font-bold text-[#10324a] whitespace-nowrap">{s.amount}</span>
                        ) : (
                          <div className="flex items-center gap-1 bg-white border border-[#d2a14a]/25 px-2 py-0.5 rounded shadow-sm text-[#d2a14a]">
                            <Lock size={10} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-[#2ca59d]/8 text-[#4b5b6a] rounded-full hover:text-[#d2a14a] transition-colors" onClick={(e) => e.preventDefault()}>
                          <Bookmark size={18} />
                        </button>
                        <div className="w-10 h-10 bg-[#10324a] text-white rounded-full flex items-center justify-center group-hover:bg-[#d2a14a] group-hover:text-[#10324a] transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
              
              {filteredScholarships.length > 3 && (
                /* Premium Lock for remaining scholarships */
                <PremiumLock isPremium={isPremium} title="Unlock 500+ Scholarships" description="Get premium access to explore over 500 fully-funded scholarships, exclusive financial aids, and step-by-step application guides." price={4999} discountedPrice={1999}>
                  <div className="grid gap-5">
                    {filteredScholarships.slice(3).map((s) => (
                      <Link
                        href={`/resources/scholarships/${s.slug}`}
                        key={s.id}
                        className="scholarship-card block group p-6 md:p-8"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2.5 py-0.5 bg-[#2ca59d]/8 text-[#0f4c5c] text-[8px] font-black uppercase tracking-widest rounded border border-[#2ca59d]/15">
                                {s.category}
                              </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-[#10324a] transition-colors mb-1">{s.name}</h3>
                            <p className="text-[10px] font-black text-[#4b5b6a] tracking-wide">PROVIDER: <span className="font-medium opacity-80">{s.sponsor}</span></p>
                          </div>

                          <div className="flex items-center gap-8 md:gap-10 flex-shrink-0">
                            <div className="flex flex-col items-center md:items-end gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#4b5b6a]/60">Closing Date</span>
                              <span className="text-xs font-bold text-[#10324a] whitespace-nowrap">{s.deadline}</span>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#d2a14a]">Award value</span>
                              <span className="text-xs font-bold text-[#10324a] whitespace-nowrap">{s.amount}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="p-2.5 bg-[#2ca59d]/8 text-[#4b5b6a] rounded-full hover:text-[#d2a14a] transition-colors" onClick={(e) => e.preventDefault()}>
                                <Bookmark size={18} />
                              </button>
                              <div className="w-10 h-10 bg-[#10324a] text-white rounded-full flex items-center justify-center group-hover:bg-[#d2a14a] group-hover:text-[#10324a] transition-all">
                                <ArrowRight size={18} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </PremiumLock>
              )}
            </>
          ) : (
            <div className="py-24 text-center card-shell">
              <div className="w-20 h-20 bg-[#2ca59d]/8 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <GraduationCap size={40} className="text-[#4b5b6a]/50" />
              </div>
              <h2 className="text-2xl font-black text-[#10324a] tracking-tight">Access Restricted</h2>
              <p className="text-xs text-[#4b5b6a] mt-2 font-medium">No scholarship matches your specific parameters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Advisor CTA */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-[#10324a] rounded-[32px] p-10 md:p-14 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #d2a14a 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(44,165,157,0.14),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white mb-6 leading-tight">
              <span className="gold-shimmer">Expert Financial Guidance</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg font-medium mb-8 leading-relaxed">Connect with our dedicated funding specialists to maximize your chances of securing institutional support.</p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-block bg-[#d2a14a] text-[#10324a] font-black px-10 py-4 rounded-xl hover:bg-white transition-all text-[10px] tracking-widest uppercase"
            >
              Schedule Briefing
            </button>
          </div>
        </div>
      </section>

      <BookCounsellingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};

export default ScholarshipsPage;