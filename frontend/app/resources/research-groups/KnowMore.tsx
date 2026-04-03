"use client";

import React from "react";
import { Info, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

const infoCards = [
  {
    title: "Why join a research group?",
    description: "Collaborating on research papers enhances your profile for Master's, PhD, and Visa applications like O-1 and EB-1. It demonstrates your expertise and commitment to your field.",
    icon: <Info className="w-5 h-5 text-[#c2a878]" />,
  },
  {
    title: "How to collaborate?",
    description: "Once you join a group, you can coordinate with the author via their profile or our internal messaging system to start drafting your research paper.",
    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  },
  {
    title: "Is it secure?",
    description: "We ensure all users are verified. We prioritize transparency and security in all research collaborations initiated on our platform.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
  },
  {
    title: "Need help?",
    description: "If you have any questions about research groups or need help finding the right match, our support team is available 24/7 via the chat widget.",
    icon: <HelpCircle className="w-5 h-5 text-[#c2a878]" />,
  }
];

export default function KnowMore() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 max-w-2xl">
        <h2 className="text-xl font-black gradient-text-gold tracking-tight lowercase">Know More About Research Groups</h2>
        <p className="text-white/30 text-[11px] leading-relaxed font-medium uppercase tracking-tighter">
          Research groups are a perfect way to build your academic profile. Whether you are aiming for top-tier universities or looking to qualify for talent-based visas, research papers are an invaluable asset.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((card, idx) => (
          <div key={idx} className="glass-card !p-6 flex flex-col gap-3 border-l-2 border-l-[#c2a878]/30 hover:border-l-[#c2a878] transition-all">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#c2a878]">
              {card.icon}
            </div>
            <h3 className="text-sm font-black tracking-tight">{card.title}</h3>
            <p className="text-white/20 text-[10px] leading-relaxed font-medium uppercase tracking-tighter">
              {card.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="glass-card !p-8 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-[#c2a878]/5 to-transparent border-[#c2a878]/10">
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-black tracking-tight">Still have questions?</h3>
            <p className="text-white/20 text-[10px] max-w-xs font-medium uppercase tracking-tighter text-center">Our experts are here to guide you through the process of research paper publishing.</p>
        </div>
        <Link href="/contact">
          <button className="btn-outline-gold !px-8 !py-3 !text-[10px] !font-black !rounded-xl !border-white/5 hover:!border-[#c2a878]/30 mt-2 hover:scale-[1.02] transition-transform">Contact Support Now</button>
        </Link>
      </div>
    </div>
  );
}
