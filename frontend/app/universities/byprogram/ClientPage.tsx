"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, Filter, X, ChevronRight, BookOpen } from 'lucide-react';
import UniversityCard from '../by-country/UniversityCard';

export default function ClientPage({ categories, byProgram, allPrograms }: any) {
  const searchParams = useSearchParams();
  const queryProg = searchParams?.get('program');
  const router = useRouter();

  // Find initial program
  const initialProg = queryProg && allPrograms.includes(queryProg) ? queryProg : allPrograms[0];
      
  const [selectedProgram, setSelectedProgram] = useState(initialProg || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(
    Object.keys(categories).find(cat => categories[cat].includes(selectedProgram)) || null
  );

  useEffect(() => {
    if (queryProg && allPrograms.includes(queryProg)) {
        setSelectedProgram(queryProg);
        const cat = Object.keys(categories).find(c => categories[c].includes(queryProg));
        if (cat) setOpenCategory(cat);
    }
  }, [queryProg, allPrograms, categories]);

  const handleProgramClick = (prog: string) => {
    setSelectedProgram(prog);
    setIsFilterOpen(false);
    router.replace(`/universities/byprogram?program=${encodeURIComponent(prog)}`, { scroll: false });
  };

  const unis = byProgram[selectedProgram] || [];

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-16 py-[60px] page-container" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .card-shell {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .prog-btn {
          text-align: left;
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          transition: all 0.2s;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .prog-btn:hover { background: #fdfaf5; color: #C5A059; }
        .prog-btn.active { 
          background: #F8F5F0; 
          color: #C5A059; 
          font-weight: 700; 
          border: 1px solid rgba(197,160,89, 0.2); 
        }
        .badge-count {
            background: white;
            border: 1px solid rgba(197,160,89, 0.1);
            padding: 1px 6px;
            border-radius: 6px;
            font-size: 10px;
            color: #C5A059;
            font-weight: 700;
        }
        .cs-scroll::-webkit-scrollbar { width: 4px; }
        .cs-scroll::-webkit-scrollbar-thumb { background: rgba(197,160,89, 0.2); border-radius: 10px; }
        
        @media (max-width: 640px) {
            .page-container { padding: 80px 12px 40px !important; }
            .main-title { font-size: 28px !important; margin-bottom: 8px !important; }
            .section-desc { font-size: 14px !important; margin-bottom: 24px !important; }
            .card-shell { padding: 16px !important; border-radius: 16px !important; }
            .top-filters { gap: 6px !important; overflow-x: auto; padding-bottom: 8px; }
            .top-filters button { padding: 6px 12px !important; font-size: 10px !important; }
            .sidebar-stack { 
                display: ${isFilterOpen ? 'flex' : 'none'} !important; 
                position: fixed !important;
                top: 0; left: 0; width: 100%; height: 100%;
                background: #FDFBF7;
                z-index: 1000;
                padding: 100px 20px 40px !important;
                overflow-y: auto;
            }
            .mobile-filter-close { display: block !important; }
        }
        .mobile-filter-close { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* TITLE SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <h1 className="fd text-4xl md:text-6xl font-bold text-[#2D2926] mb-4 tracking-tighter main-title">
                Excellence in <span style={{ color: "#C5A059", display: "inline-block" }}>{selectedProgram}</span>
                </h1>
                <p className="text-[#6B5E51] font-medium text-lg max-w-2xl section-desc">
                Curated selection of global institutions offering premier degrees in {selectedProgram}, categorized by academic rigor and performance.
                </p>
            </div>
            
            {/* ABOVE FILTERS */}
            <div className="flex gap-4 shrink-0 top-filters">
                {["All", "Popular", "Recently Updated"].map((filter, i) => (
                    <button key={i} className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border ${i === 0 ? "bg-[#2D2926] text-white border-[#2D2926]" : "border-[rgba(197,160,89,0.3)] text-[#6B5E51] bg-white"}`}>
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden mb-6">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border border-[rgba(197,160,89,0.2)] rounded-2xl shadow-sm text-[#2D2926] font-bold"
            >
                <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-[#C5A059]" />
                    <span>Browse Programs</span>
                </div>
                <ChevronDown size={20} className={`text-[#C5A059] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-24 sidebar-stack">
            {/* Close button for mobile drawer */}
            <button 
                onClick={() => setIsFilterOpen(false)}
                className="mobile-filter-close absolute top-8 right-8 p-3 bg-white rounded-full shadow-lg border border-[#F1EDEA]"
            >
                <X size={24} />
            </button>

            {/* CATEGORIZED PROGRAM SELECTOR */}
            <div className="card-shell max-h-[calc(100vh-140px)] overflow-y-auto cs-scroll">
                <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[#2D2926] tracking-tight uppercase text-xs">Categories</h2>
                </div>

                <div className="space-y-6">
                  {Object.keys(categories).map(catName => (
                    <div key={catName} className="space-y-1">
                      <button 
                        onClick={() => setOpenCategory(openCategory === catName ? null : catName)}
                        className="w-full flex items-center justify-between text-xs font-bold text-[#C5A059] uppercase tracking-widest px-1 py-2 border-b border-[#F1EDEA] hover:bg-[#FDFBF7]"
                      >
                        {catName}
                        {openCategory === catName ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      
                      {openCategory === catName && (
                        <div className="pt-3 pl-1 space-y-2">
                          {categories[catName].map((prog: string) => (
                            <button 
                              key={prog}
                              className={`prog-btn ${selectedProgram === prog ? 'active' : ''}`}
                              onClick={() => handleProgramClick(prog)}
                            >
                              <span className="truncate pr-2">{prog}</span>
                              <span className="badge-count">{byProgram[prog].length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* INSTITUTIONAL LIST */}
          <div className="lg:col-span-3 space-y-12 sm:space-y-16">
            {unis.length > 0 ? unis.map((uni: any) => (
              <UniversityCard key={uni.slug} uni={uni} />
            )) : (
              <div className="text-center py-20 text-[#6B5E51] font-medium text-lg">
                No advanced institutions formally documented strictly for "{selectedProgram}" yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
