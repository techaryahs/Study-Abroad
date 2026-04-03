"use client";

import React from "react";
import { Search, Plus, ArrowRight } from "lucide-react";

interface YourGroupsProps {
  onCreateClick?: () => void;
}

export default function YourGroups({ onCreateClick }: YourGroupsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6 glass-card !p-12 border-none bg-white/[0.01]">
      <div className="relative">
        {/* Mock magnifying glass icon like in screenshot */}
        <div className="w-24 h-24 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-dashed border-[#c2a878]/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <Search className="w-16 h-16 text-[#c2a878]/30 stroke-[1.5px]" />
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#c2a878] rounded-full flex items-center justify-center text-black font-black text-xs shadow-lg">?</div>
        </div>
        {/* Small "rays" around the icon */}
        <div className="absolute -top-4 -right-4 w-4 h-4 text-[#c2a878]/40 opacity-50">✦</div>
        <div className="absolute -bottom-2 -left-4 w-3 h-3 text-[#c2a878]/40 opacity-50 rotate-45">✦</div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-black text-white/90 tracking-tight">No Groups Found!</h3>
        <p className="text-white/30 text-sm font-medium uppercase tracking-tighter">
          You can create a new group to begin
        </p>
      </div>
      
      {/* The specific Muted Gold Create Group Button */}
      <button 
        onClick={onCreateClick}
        className="bg-[#c2a878] hover:bg-[#d4af37] text-black font-black px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(194,168,120,0.2)] active:scale-95 uppercase text-[12px] tracking-tight"
      >
        Create Group <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
