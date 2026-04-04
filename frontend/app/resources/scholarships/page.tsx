"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Bookmark, ArrowRight, GraduationCap, Atom, Beaker, BookOpen } from "lucide-react";
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
    <div className="min-h-screen bg-[#05070a] text-white">  
      
      {/* Hero Header */}
      <section className="relative pt-20 pb-4 overflow-hidden bg-gradient-to-b from-[#c2a878]/10 to-transparent">
         {/* Background Illustrations */}
         <div className="absolute top-10 left-10 w-32 h-32 opacity-10 border-2 border-[#c2a878] rounded-full rotate-45" />
         <div className="absolute bottom-10 right-10 w-48 h-48 opacity-10 border-2 border-[#c2a878] rounded-[3rem] -rotate-12" />
         
         <div className="absolute top-1/2 left-[10%] -translate-y-1/2 opacity-20 animate-pulse hidden lg:block">
            <Atom size={120} className="text-[#c2a878]/30 rotate-12" />
         </div>
         <div className="absolute top-1/4 right-[12%] opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '4s' }}>
            <Beaker size={100} className="text-[#c2a878]/40 -rotate-12" />
         </div>
         <div className="absolute bottom-[20%] right-[15%] opacity-10 hidden lg:block">
            <BookOpen size={80} className="text-white/20 rotate-45" />
         </div>

         <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div className="relative inline-block mb-8">
               <h1 className="text-6xl md:text-8xl font-black uppercase italic font-serif tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                 Scholarships
               </h1>
               <div className="absolute -top-10 -right-16 text-6xl animate-bounce pointer-events-none hidden md:block" style={{ animationDuration: '3s' }}>🎓</div>
               <div className="absolute -bottom-6 -left-12 text-4xl opacity-50 grayscale hover:grayscale-0 transition-all cursor-default hidden md:block">🔬</div>
            </div>
            
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 bg-[#0a0a0a] p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
               <div className="flex-1 w-full relative flex items-center px-6">
                  <Search size={20} className="text-gray-600 mr-4" />
                  <input 
                    type="text" 
                    placeholder="Search for a Scholarship"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-700"
                  />
               </div>
               <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
               <div className="w-full md:w-64 relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent py-4 px-6 text-sm outline-none appearance-none cursor-pointer text-gray-400 focus:text-white"
                  >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
                  </select>
                  <Filter size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#c2a878] pointer-events-none" />
               </div>
               <button className="w-full md:w-auto px-12 py-4 bg-[#c2a878] text-black font-black uppercase tracking-widest text-[11px] rounded-[2rem] hover:bg-yellow-200 transition-colors shadow-[0_10px_20px_rgba(194,168,120,0.2)]">
                  Search
               </button>
            </div>
         </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-0 pb-24">
         
         <div className="flex items-center gap-12 mb-12 border-b border-white/5 pb-6">
            <button className="relative group flex items-center gap-2">
               <span className="text-[#c2a878] font-black text-[10px] uppercase tracking-[0.2em]">{`Scholarship Search (${filteredScholarships.length})`}</span>
               <div className="absolute -bottom-6 left-0 w-full h-1 bg-[#c2a878] rounded-full" />
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors">
               <Bookmark size={14} />
               <span className="font-black text-[10px] uppercase tracking-[0.2em]">Saved Scholarships (0)</span>
            </button>
         </div>

         <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s, idx) => (
                <Link 
                  href={`/resources/scholarships/${s.slug}`}
                  key={s.id} 
                  className={`block group px-8 md:px-12 py-8 transition-all duration-300 hover:bg-white/[0.02] ${idx !== filteredScholarships.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      <div className="flex-1 min-w-0">
                         <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#c2a878] transition-colors mb-1 truncate">{s.name}</h3>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sponsor: <span className="text-gray-400 font-medium">{s.sponsor}</span></p>
                      </div>

                      <div className="flex items-center gap-8 md:gap-16 flex-shrink-0">
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#c2a878]/40">Deadline</span>
                            <span className="text-xs font-bold text-gray-300 whitespace-nowrap">{s.deadline}</span>
                         </div>
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/40">Amount</span>
                            <span className="text-xs font-bold text-gray-200 whitespace-nowrap">{s.amount}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="p-2.5 text-gray-700 hover:text-[#c2a878] transition-colors" onClick={(e) => e.preventDefault()}>
                               <Bookmark size={18} />
                            </button>
                            <ArrowRight size={18} className="text-gray-800 group-hover:text-white transition-colors" />
                         </div>
                      </div>

                   </div>
                </Link>
              ))
            ) : (
              <div className="py-32 text-center">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap size={40} className="text-gray-700" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-400 tracking-tight">No scholarships found.</h2>
              </div>
            )}
         </div>
      </main>
    </div>
  );
};

export default ScholarshipsPage;
