"use client";

import React from "react";
import { Search, Plus, ArrowRight } from "lucide-react";

interface YourGroupsProps {
  onCreateClick?: () => void;
}

export default function YourGroups({ onCreateClick }: YourGroupsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-8 bg-white border border-[rgba(197,160,89,0.15)] rounded-[40px] px-12 shadow-sm">
      <div className="relative">
        <div className="w-28 h-28 relative flex items-center justify-center">
            <div className="absolute inset-0 border-[3px] border-dashed border-[rgba(197,160,89,0.2)] rounded-full animate-[spin_20s_linear_infinite]" />
            <Search className="w-16 h-16 text-[#C5A059] opacity-40 stroke-[1.5px]" />
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#2D2926] rounded-full flex items-center justify-center text-[#C5A059] font-bold text-xs shadow-lg">?</div>
        </div>
        <div className="absolute -top-4 -right-4 w-4 h-4 text-[#C5A059] opacity-50">✦</div>
        <div className="absolute -bottom-2 -left-4 w-3 h-3 text-[#C5A059] opacity-50 rotate-45">✦</div>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="fd text-3xl font-bold text-[#2D2926] tracking-tight">No Active Collaborations Identified</h3>
        <p className="text-[#6B5E51] text-sm font-medium uppercase tracking-[0.1em]">
          Initiate a new research cluster to begin your journey.
        </p>
      </div>
      
      <button 
        onClick={onCreateClick}
        className="bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-xl active:scale-95 uppercase text-[11px] tracking-widest"
      >
        Initiate Cluster <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
