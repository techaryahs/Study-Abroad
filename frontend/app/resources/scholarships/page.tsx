"use client";

import React, { useState } from "react";
import { Search, Filter, Bookmark, Calendar, DollarSign, ArrowRight, GraduationCap, Atom, Beaker, BookOpen } from "lucide-react";


interface Scholarship {
  id: string;
  title: string;
  sponsor: string;
  deadline: string;
  amount: string;
  category: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "1",
    title: "SEG Foundation Scholarship",
    sponsor: "Society of Exploration Geophysicists Education Foundation",
    deadline: "Mar 01, 2026",
    amount: "$500 - $3,000 USD",
    category: "Geophysics",
  },
  {
    id: "2",
    title: "Hope for Healing",
    sponsor: "FHE Health",
    deadline: "Jan 15, 2026",
    amount: "$5,000",
    category: "Medical",
  },
  {
    id: "3",
    title: "Business Studies Scholarship Program",
    sponsor: "Valuewalk",
    deadline: "May 01, 2026",
    amount: "$2,000",
    category: "Business",
  },
  {
    id: "4",
    title: "International Scholarship for Excellence",
    sponsor: "Monash University",
    deadline: "Variable",
    amount: "Variable",
    category: "General",
  },
  {
    id: "5",
    title: "KTH Joint Programme Scholarship",
    sponsor: "KTH Royal Institute of Technology",
    deadline: "Jan 15, 2026",
    amount: "Approx. €15,000",
    category: "Engineering",
  },
  {
    id: "6",
    title: "KTH India Scholarship",
    sponsor: "KTH Royal Institute of Technology",
    deadline: "Jan 15, 2026",
    amount: "Approx. €30,000",
    category: "Engineering",
  },
  {
    id: "7",
    title: "WUIC Excellence Tuition Fee Waiver",
    sponsor: "Walailak University International College",
    deadline: "Apr 24, 2026",
    amount: "US $35,000",
    category: "Undergraduate",
  },
];

const ScholarshipsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredScholarships = SCHOLARSHIPS.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All Categories", ...Array.from(new Set(SCHOLARSHIPS.map(s => s.category)))];

  return (
    <div className="min-h-screen bg-[#05070a] text-white">  
      
      {/* Hero Header */}
      <section className="relative pt-20 pb-4 overflow-hidden bg-gradient-to-b from-[#c2a878]/10 to-transparent">
         {/* Background Illustrations (Simulated) */}
         <div className="absolute top-10 left-10 w-32 h-32 opacity-10 border-2 border-[#c2a878] rounded-full rotate-45" />
         <div className="absolute bottom-10 right-10 w-48 h-48 opacity-10 border-2 border-[#c2a878] rounded-[3rem] -rotate-12" />
         
         {/* Academic Floating Elements (Stickers/Emojis) */}
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
            
            {/* Search Bar Container */}
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
         
         {/* Tabs / Filters Summary */}
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

         {/* Scholarship List */}
         <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((s, idx) => (
                <div key={s.id} className={`group px-8 md:px-12 py-8 transition-all duration-300 hover:bg-white/[0.02] ${idx !== filteredScholarships.length - 1 ? 'border-b border-white/5' : ''}`}>
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Title & Info */}
                      <div className="flex-1 min-w-0">
                         <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#c2a878] transition-colors mb-1 truncate">{s.title}</h3>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sponsor: <span className="text-gray-400 font-medium">{s.sponsor}</span></p>
                      </div>

                      {/* Metrics & Actions */}
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
                            <button className="p-2.5 text-gray-700 hover:text-[#c2a878] transition-colors">
                               <Bookmark size={18} />
                            </button>
                            <button className="p-2.5 text-gray-800 hover:text-white transition-colors">
                               <ArrowRight size={18} />
                            </button>
                         </div>
                      </div>

                   </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap size={40} className="text-gray-700" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-400 tracking-tight">No scholarships found matching your nodes.</h2>
                 <p className="text-[10px] uppercase font-black tracking-widest text-gray-700 mt-2">Try adjusting your spectral filters</p>
              </div>
            )}
         </div>

         {/* Floating Newsletter / CTA */}
         <div className="mt-24 p-12 bg-gradient-to-r from-[#c2a878]/20 to-transparent border border-[#c2a878]/20 rounded-[4rem] text-center">
            <h4 className="text-3xl font-black uppercase italic font-serif mb-4 italic">Never Missing a Chance</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c2a878] mb-8">Subscribe to receive targeted scholarship alerts directly to your neural feed.</p>
            <div className="max-w-md mx-auto flex gap-3 p-2 bg-black/40 rounded-full border border-white/5">
                <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent px-6 text-[10px] font-black uppercase outline-none" />
                <button className="px-8 py-3 bg-[#c2a878] text-black rounded-full font-black text-[9px] uppercase tracking-widest">Connect</button>
            </div>
         </div>
      </main>
    </div>
  );
};

export default ScholarshipsPage;
