"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Bookmark, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import scholarshipData from "@/data/scolarship.json";

const ScholarshipsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

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
    <div className="min-h-screen transition-colors duration-300" style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}>  
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        
        .gold-shimmer {
          background: linear-gradient(90deg, #C5A059, #E6D5B8, #C5A059, #D4AF37, #C5A059);
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
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .scholarship-card:hover {
          transform: translateY(-4px);
          border-color: rgba(197,160,89, 0.4);
          box-shadow: 0 15px 35px rgba(197,160,89, 0.08);
        }

        .search-container {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.2);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
        }
        @media (min-width: 768px) {
          .search-container {
            border-radius: 100px;
          }
        }
      `}</style>
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.06) 0%, transparent 100%)" }}>
         <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <span className="inline-block px-4 py-1 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[10px] tracking-[0.2em] uppercase mb-6">
                 Financial Support Index
               </span>
               <h1 className="fd text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight mb-10 leading-[0.95] text-[#2D2926]">
                 Elite <span className="gold-shimmer">Scholarships</span>
               </h1>
            </motion.div>
            
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2 p-2 search-container">
               <div className="flex-1 w-full relative flex items-center px-6">
                  <Search size={18} className="text-[#A8A29E] mr-4" />
                  <input 
                    type="text" 
                    placeholder="Search by program name or provider..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#A8A29E] font-medium"
                  />
               </div>
               <div className="h-8 w-[1px] bg-[#F1EDEA] hidden md:block" />
               <div className="w-full md:w-64 relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent py-4 px-6 text-sm outline-none appearance-none cursor-pointer text-[#6B5E51] font-bold"
                  >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-white">{cat}</option>)}
                  </select>
                  <Filter size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#C5A059] pointer-events-none" />
               </div>
               <button className="w-full md:w-auto px-10 py-4 bg-[#2D2926] text-white font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-[#C5A059] transition-all">
                  Apply Filter
               </button>
            </div>
         </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-32">
         
         <div className="flex items-center gap-10 mb-12 border-b border-[#F1EDEA] pb-6">
            <button className="relative group flex items-center gap-2">
               <span className="text-[#2D2926] font-bold text-[11px] uppercase tracking-[0.15em]">{`Opportunities (${filteredScholarships.length})`}</span>
               <div className="absolute -bottom-6 left-0 w-full h-0.5 bg-[#C5A059]" />
            </button>
            <button className="flex items-center gap-2 text-[#A8A29E] hover:text-[#C5A059] transition-colors">
               <Bookmark size={14} />
               <span className="font-bold text-[11px] uppercase tracking-[0.15em]">Portfolio (0)</span>
            </button>
         </div>

         <div className="grid gap-6">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s) => (
                <Link 
                  href={`/resources/scholarships/${s.slug}`}
                  key={s.id} 
                  className="scholarship-card block group p-8 md:p-10"
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-3">
                           <span className="px-3 py-1 bg-[#F8F5F0] text-[#C5A059] text-[9px] font-bold uppercase tracking-widest rounded-md border border-[rgba(197,160,89,0.1)]">
                             {s.category}
                           </span>
                         </div>
                         <h3 className="fd text-2xl md:text-3xl font-bold text-[#2D2926] transition-colors mb-2">{s.name}</h3>
                         <p className="text-xs font-bold text-[#6B5E51] tracking-wide">PROVIDER: <span className="font-medium opacity-80">{s.sponsor}</span></p>
                      </div>

                      <div className="flex items-center gap-10 md:gap-14 flex-shrink-0">
                         <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Closing Date</span>
                            <span className="text-sm font-bold text-[#2D2926] whitespace-nowrap">{s.deadline}</span>
                         </div>
                         <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Award value</span>
                            <span className="text-sm font-bold text-[#2D2926] whitespace-nowrap">{s.amount}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <button className="p-3 bg-[#F8F5F0] text-[#6B5E51] rounded-full hover:text-[#C5A059] transition-colors" onClick={(e) => e.preventDefault()}>
                               <Bookmark size={20} />
                            </button>
                            <div className="w-12 h-12 bg-[#2D2926] text-white rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all">
                              <ArrowRight size={20} />
                            </div>
                         </div>
                      </div>

                   </div>
                </Link>
              ))
            ) : (
              <div className="py-40 text-center card-shell">
                 <div className="w-24 h-24 bg-[#F8F5F0] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <GraduationCap size={48} className="text-[#A8A29E]" />
                 </div>
                 <h2 className="fd text-3xl font-bold text-[#2D2926] tracking-tight">Access Restricted</h2>
                 <p className="text-[#6B5E51] mt-2 font-medium">No scholarship matches your specific parameters.</p>
              </div>
            )}
         </div>
      </main>

      {/* Advisor CTA */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="bg-[#2D2926] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #C5A059 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="fd text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">Expert Financial <br/><span className="gold-shimmer">Guidance</span></h2>
            <p className="text-[#A8A29E] text-lg md:text-xl font-medium mb-10 leading-relaxed">Connect with our dedicated funding specialists to maximize your chances of securing institutional support.</p>
            <Link href="/contact" className="inline-block bg-[#C5A059] text-white font-bold px-12 py-5 rounded-2xl hover:bg-white hover:text-[#2D2926] transition-all text-xs tracking-widest uppercase">
              Schedule Briefing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScholarshipsPage;
