"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen
} from "lucide-react";

const resourceCategories = [
  {
    id: "scholarships",
    title: "Global Scholarships",
    description: "Access our audited repository of international funding opportunities and merit-based grants.",
    icon: <GraduationCap size={28} />,
    href: "/resources/scholarships",
    badge: "Audited",
    stat: "500+ Programs"
  },
  {
    id: "research-groups",
    title: "Research Clusters",
    description: "Synchronize with Principal Investigators and collaborative scholars across global institutions.",
    icon: <Users size={28} />,
    href: "/resources/research-groups",
    badge: "Active",
    stat: "120+ Clusters"
  },
  {
    id: "eb1a-toolkit",
    title: "EB-1A Evaluation",
    description: "Strategic benchmarks for Extraordinary Ability visa candidates and high-impact researchers.",
    icon: <Briefcase size={28} />,
    href: "/resources/eb1a-toolkit",
    badge: "Premium",
    stat: "Visa Protocol"
  },
  {
    id: "loan-support",
    title: "Capital Support",
    description: "Optimized education financing and institutional loan frameworks for international students.",
    icon: <DollarSign size={28} />,
    href: "/resources/education-loans",
    badge: "Financial",
    stat: "Preferred Rates"
  },
  {
    id: "reviews",
    title: "Institutional Reviews",
    description: "Verified academic critiques and peer evaluations of global university systems.",
    icon: <Star size={28} />,
    href: "/resources/reviews",
    badge: "Verified",
    stat: "Student Voices"
  },
  {
    id: "paper-services",
    title: "Scholarly Publishing",
    description: "End-to-end support for high-fidelity research paper development and journal submission.",
    icon: <BookOpen size={28} />,
    href: "/services/research-paper",
    badge: "Scholarly",
    stat: "IEEE/Scopus"
  }
];

export default function ResourcesLandingPage() {
  return (
    <main className="min-h-screen pb-32" style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}>
      
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

        .resource-card {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 32px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .resource-card:hover {
          transform: translateY(-12px);
          border-color: rgba(197,160,89, 0.4);
          box-shadow: 0 40px 80px rgba(197,160,89, 0.08);
        }

        .icon-box {
          background: rgba(197,160,89, 0.05);
          color: #C5A059;
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .resource-card:hover .icon-box {
          background: #C5A059;
          color: #FFFFFF;
          transform: scale(1.1);
        }
      `}</style>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden text-center" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.08) 0%, transparent 100%)" }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-5 py-1.5 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[10px] tracking-[0.3em] uppercase mb-4 shadow-sm">
              Academic Resource Protocol
            </span>
            <h1 className="fd text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-[#2D2926] tracking-tight leading-[0.95]">
              Scholarly <span className="gold-shimmer">Success Hub</span>
            </h1>
            <p className="text-[#6B5E51] text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed italic">
              Empowering global scholars through premium data sets, institutional liaisons, and strategic fiscal support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── RESOURCES GRID ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="fd text-4xl md:text-5xl font-bold text-[#2D2926]">Core Infrastructure</h2>
            <p className="text-[#6B5E51] text-lg font-medium">Verified instruments for academic and professional advancement</p>
          </div>
          <div className="flex items-center gap-6 border border-[rgba(197,160,89,0.15)] bg-white px-8 py-4 rounded-3xl shadow-sm">
             <div className="flex flex-col border-r border-[#F1EDEA] pr-6">
                <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest">Global Reach</span>
                <span className="text-xl font-bold text-[#2D2926]">150+ Countries</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest">Active Users</span>
                <span className="text-xl font-bold text-[#2D2926]">12k+ Scholars</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resourceCategories.map((category, idx) => (
            <Link key={idx} href={category.href}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="resource-card p-10 flex flex-col gap-8 h-full relative overflow-hidden"
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(197,160,89,0.02)] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                
                <div className="flex items-start justify-between">
                  <div className="icon-box">
                    {category.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-[#C5A059] border border-[rgba(197,160,89,0.2)] px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 shadow-sm">
                      {category.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#A8A29E] uppercase">
                      {category.stat}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="fd text-3xl font-bold text-[#2D2926] leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#6B5E51] leading-relaxed font-medium">
                    {category.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center text-[#C5A059] font-bold text-[10px] tracking-widest uppercase gap-3">
                  Access Portal <ArrowRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST & SECURITY ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-[#F1EDEA] mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="fd text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Institutional <br/> <span className="gold-shimmer">Integrity Protocols</span></h2>
            <div className="space-y-8">
               <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full bg-[#2D2926] flex items-center justify-center text-[#C5A059] shrink-0 shadow-lg">
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-[#2D2926] text-lg uppercase tracking-tight">Verified Verification</h4>
                    <p className="text-[#6B5E51] text-sm font-medium leading-relaxed mt-1">Multi-tier audit system ensuring that every scholarship and researcher cluster profile is 100% authentic.</p>
                 </div>
               </div>
               <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full bg-[#2D2926] flex items-center justify-center text-[#C5A059] shrink-0 shadow-lg">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-[#2D2926] text-lg uppercase tracking-tight">Real-Time Synchronization</h4>
                    <p className="text-[#6B5E51] text-sm font-medium leading-relaxed mt-1">Immediate data updates on deadlines, membership vacancies, and funding cycles across the GCC network.</p>
                 </div>
               </div>
            </div>
          </div>
          <div className="relative">
             <div className="bg-[#2D2926] p-12 lg:p-16 rounded-[60px] relative overflow-hidden text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #C5A059 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 space-y-8">
                  <h3 className="fd text-3xl font-bold leading-tight">Need a Bespoke <br/>Resource Portfolio?</h3>
                  <p className="text-[#A8A29E] text-lg font-medium leading-relaxed">Our advisors can curate a specific selection of resources tailored to your unique academic profile and visa strategy.</p>
                  <Link href="/contact" className="inline-block bg-[#C5A059] text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-[#2D2926] transition-all shadow-2xl tracking-widest uppercase text-xs">
                     Secure Advisory
                  </Link>
                </div>
             </div>
             {/* Floating decorative elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[rgba(197,160,89,0.15)] rounded-full blur-[80px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
