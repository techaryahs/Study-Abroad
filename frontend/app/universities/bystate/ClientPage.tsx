"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, Filter, X } from 'lucide-react';
import UniversityCard from '../by-country/UniversityCard';

export default function ClientPage({ states, byState }: any) {
  const searchParams = useSearchParams();
  const queryState = searchParams?.get('state');
  const router = useRouter();

  // Find a case-insensitive match for the initial state from query, or default.
  const matchedState = queryState
    ? states.find((s: string) => s.toLowerCase() === queryState.toLowerCase())
    : null;

  const [selectedState, setSelectedState] = useState(matchedState || states[0] || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Instantly reflect active state changes if the URL gets updated externally
  useEffect(() => {
    if (queryState) {
      const found = states.find((s: string) => s.toLowerCase() === queryState.toLowerCase());
      if (found) setSelectedState(found);
    }
  }, [queryState, states]);

  const handleStateClick = (st: string) => {
    setSelectedState(st);
    setIsFilterOpen(false); // Close on selection (Mobile)
    // Optionally update URL so sharing works
    router.replace(`/universities/bystate?state=${encodeURIComponent(st)}`, { scroll: false });
  };

  const unis = byState[selectedState] || [];

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-16 py-[120px] page-container" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .card-shell {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .state-btn {
          text-align: left;
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          transition: all 0.2s;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .state-btn:hover { background: #fdfaf5; color: #C5A059; }
        .state-btn.active { 
          background: #F8F5F0; 
          color: #C5A059; 
          font-weight: 800; 
          border: 1px solid rgba(197,160,89, 0.2); 
        }
        .badge-count {
            background: white;
            border: 1px solid rgba(197,160,89, 0.2);
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11px;
            color: #C5A059;
            font-weight: 800;
        }
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
                padding: 100px 24px 40px !important;
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
                Premier Institutions in <span style={{ color: "#C5A059", display: "inline-block" }}>{selectedState}</span>
                </h1>
                <p className="text-[#6B5E51] font-medium text-lg max-w-2xl section-desc">
                Explore the top-ranked universities, their specialized branches, and admission insights strictly within the state of {selectedState}.
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
                    <Filter size={18} className="text-[#C5A059]" />
                    <span>Filter & Regions</span>
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
            
            {/* PARAMETERS PANEL (Copied from Country Page) */}
            <div className="card-shell">
                <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[#2D2926] tracking-tight uppercase text-sm">Parameters</h2>
                <span className="text-xs text-[#6B5E51] cursor-pointer hover:text-[#C5A059] font-bold">
                    Reset All
                </span>
                </div>

                <div className="space-y-4 text-sm text-[#6B5E51] font-medium">
                <div className="border-b border-[#F1EDEA] pb-3 flex justify-between">Admission Selectivity <span>▾</span></div>
                <div className="border-b border-[#F1EDEA] pb-3 flex justify-between">Institutional Investment <span>▾</span></div>
                <div className="border-b border-[#F1EDEA] pb-3 flex justify-between">Geographic Distribution <span>▾</span></div>
                <div className="pt-1 flex justify-between">Advanced Metrics <span>▾</span></div>
                </div>
            </div>

            {/* STATE SELECTOR */}
            <div className="card-shell max-h-[400px] overflow-y-auto cs-scroll">
                <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-[#2D2926] tracking-tight uppercase text-xs">Browse Regions</h2>
                </div>

                <div className="space-y-2 text-sm text-[#6B5E51]">
                {states.map((st: string) => (
                    <button 
                    key={st}
                    className={`state-btn ${selectedState === st ? 'active' : ''}`}
                    onClick={() => handleStateClick(st)}
                    >
                    <span className="truncate pr-2">{st}</span>
                    <span className="badge-count">{byState[st].length}</span>
                    </button>
                ))}
                </div>
            </div>
          </div>

          {/* INSTITUTIONAL LIST */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {unis.length > 0 ? unis.map((uni: any) => (
              <UniversityCard key={uni.slug} uni={uni} />
            )) : (
              <div className="text-center py-20 text-[#6B5E51] font-medium text-lg">
                No advanced institutions formally documented strictly within {selectedState} yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
