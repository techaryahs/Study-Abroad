"use client";

import Link from "next/link";
import { Video, Phone } from "lucide-react";

interface DiscussionSectionProps {
  serviceId: string;
}

const CoreNodes = [
  { 
    icon: <Video size={18} fill="currentColor" strokeWidth={0} />, 
    color: "#EA4335", 
    label: "Video Call" 
  },
  { 
    icon: <Phone size={18} fill="currentColor" strokeWidth={0} />, 
    color: "#4285F4", 
    label: "Audio Call" 
  },
  { 
    icon: (
      <svg viewBox="0 0 448 512" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.3-14.5-27.3-32.3-30.5-37.9-3.2-5.5-.4-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.3-1.4-2.2-5.1-3.3-10.6-6.3z"/>
      </svg>
    ), 
    color: "#25D366", 
    label: "Text Support" 
  }
];

export default function DiscussionSection({ serviceId }: DiscussionSectionProps) {
  return (
    <div className="space-y-10 pt-4">
      {/* Core Nodes Header */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500/40 italic">
          Includes Core Nodes:
        </p>
        <div className="flex flex-wrap gap-10">
          {CoreNodes.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div 
                className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-all shadow-sm" 
                style={{ color: item.color }}
              >
                {item.icon}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-gold-500 transition-colors uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-6 pt-2 items-center">
        <Link 
          href={`/contact?service=${serviceId}`}
          className="btn-gold px-10 py-4 text-[11px] font-black tracking-[0.2em] w-full sm:w-auto text-center !rounded-[1.5rem] uppercase"
        >
          Discuss Your Case
        </Link>
      </div>
    </div>
  );
}
