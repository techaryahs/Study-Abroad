"use client";

import React from "react";
import { Info, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

const infoCards = [
  {
    title: "Strategic Academic Advantage",
    description: "Collaborative research significantly amplifies your profile for elite Master's, PhD, and specialized visa programs. It validates your intellectual authority.",
    icon: <Info className="w-5 h-5 text-[#C5A059]" />,
  },
  {
    title: "Protocol for Collaboration",
    description: "Upon cluster entry, you can synchronize with the lead investigator via the secure liaison link to begin high-fidelity paper drafting.",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
  },
  {
    title: "Institutional Security",
    description: "Every participant undergoes rigorous verification. We maintain the highest standards of integrity and data transparency across all collaborations.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Direct Advisory",
    description: "Our dedicated support team is available around the clock to assist you in identifying the optimal research cluster for your specific goals.",
    icon: <HelpCircle className="w-5 h-5 text-[#C5A059]" />,
  }
];

export default function KnowMore({ onBookingClick }: { onBookingClick?: () => void }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4 max-w-2xl">
        <h2 className="fd text-3xl md:text-4xl font-bold text-[#2D2926] tracking-tight">Institutional Research Insights</h2>
        <p className="text-[#6B5E51] text-sm leading-relaxed font-medium uppercase tracking-[0.1em]">
          Participating in research clusters is a cornerstone of professional academic development. Secure your legacy through collaborative publishing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoCards.map((card, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[30px] flex flex-col gap-4 border border-[rgba(197,160,89,0.1)] hover:border-[#C5A059] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[rgba(197,160,89,0.05)] flex items-center justify-center text-[#C5A059]">
              {card.icon}
            </div>
            <h3 className="fd text-xl font-bold text-[#2D2926]">{card.title}</h3>
            <p className="text-[#6B5E51] text-xs leading-relaxed font-medium opacity-80">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#2D2926] p-12 rounded-[40px] flex flex-col items-center text-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #C5A059 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h3 className="fd text-3xl font-bold text-white leading-tight">Complex Inquiries?</h3>
          <p className="text-[#A8A29E] text-xs max-w-sm font-medium uppercase tracking-[0.1em] text-center leading-loose">Our advisors are equipped to guide you through the intricacies of international research paradigms.</p>
        </div>
        <button
          onClick={onBookingClick}
          className="relative z-10 bg-[#C5A059] text-white hover:bg-white hover:text-[#2D2926] px-10 py-4 text-[10px] font-bold rounded-xl border border-transparent transition-all uppercase tracking-widest"
        >
          Speak With a Specialist
        </button>
      </div>
    </div>
  );
}
