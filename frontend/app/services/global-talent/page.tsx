"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    CheckCircle2, 
    Globe, 
    Award, 
    Zap,
    Cpu,
    Microscope,
    Palette
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import ServiceCTA from "@/components/shared/ServiceCTA";

const routes = [
  { id: "tech", label: "Digital Technology", icon: <Cpu />, desc: "Leaders in software development, AI, and digital infrastructure." },
  { id: "research", label: "Academia & Research", icon: <Microscope />, desc: "Scientists and scholars pushing the boundaries of knowledge." },
  { id: "arts", label: "Arts & Culture", icon: <Palette />, desc: "Musicians, designers, and creatives with international recognition." },
];

const advantages = [
  { title: "Up to 5 Year Visa", desc: "No minimum salary requirement or English language test." },
  { title: "No Sponsorship", desc: "You are not tied to a single employer/company." },
  { title: "Fast-Track Residency", desc: "Pathway to Indefinite Leave to Remain (ILR) in 3 years." },
  { title: "Family Extension", desc: "Partners and children can work and study freely in the UK." },
];

export default function GlobalTalentPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#3C2A21] font-dm-sans">
             <style jsx global>{`
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
            `}</style>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-20 px-6 md:px-16 overflow-hidden bg-gradient-to-b from-[#C5A059]/10 to-transparent">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <Link 
                                href="/services" 
                                className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-block px-5 py-2 rounded-full border border-[#C5A059]/30 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase">
                                United Kingdom Elite Visa
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            UK <br/> <span className="gold-shimmer italic">Global Talent</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#6B5E51] border-l-4 border-[#C5A059] pl-6 max-w-xl">
                            "The ultimate visa for world-class innovators. We bridge the gap between your achievements and Home Office recognition."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['Endorsement Audit', 'Portfolio Drafting', 'PR Strategy'].map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-[#C5A059]" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B5E51]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-[500px]"
                    >
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group bg-[#3C2A21]">
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
                                <Globe size={80} className="text-[#C5A059] animate-pulse" />
                                <h3 className="fd text-3xl font-bold text-[#E6D5B8]">Global Potential<br/>Recognized</h3>
                                <div className="h-px w-20 bg-[#C5A059]" />
                                <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">United Kingdom</p>
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21] to-transparent opacity-60" />
                        </div>
                    </motion.div>
                </div>
            </section>

             {/* --- MAIN CONTENT --- */}
             <section className="py-24 px-6 md:px-16 border-y border-[#F1EDEA]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-3 space-y-24">
                        
                        {/* ABOUT */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Elite Distinction</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">What is the <span className="gold-shimmer italic">Global Talent Visa?</span></h2>
                            </div>
                            <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg">
                                <p>
                                    The Global Talent Visa is for individuals who are leaders, or potential leaders, in the fields of academia or research, arts and culture, or digital technology. This visa offers unprecedented flexibility, allowing you to work, switch jobs, or become an entrepreneur without Home Office restrictions.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                                    {routes.map((route) => (
                                        <div key={route.id} className="p-8 bg-white border border-[#F1EDEA] rounded-[32px] hover:border-[#C5A059]/30 transition-all hover:shadow-2xl group text-center space-y-4">
                                            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                                                {route.icon}
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#3C2A21]">{route.label}</h4>
                                            <p className="text-[14px] font-bold font-medium opacity-60 italic">{route.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ADVANTAGES */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Privileges de Elite</span>
                                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Unmatched Benefits</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {advantages.map((item, i) => (
                                    <div key={i} className="flex gap-5 p-4 items-start">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-bold text-[14px] font-bold flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="fd text-xl font-bold text-[#3C2A21]">{item.title}</h4>
                                            <p className="text-sm font-medium text-[#6B5E51] italic">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMMUNITY DISCUSSION */}
                        <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Peer Validation</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Global Insights</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
                                    <DiscussionSection serviceId="global_talent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <ServiceCTA serviceId="global_talent" />
                            
                            <div className="p-10 bg-[#3C2A21] rounded-[40px] text-white space-y-6 shadow-2xl border border-[#C5A059]/20 relative overflow-hidden group">
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C5A059]/20 blur-3xl rounded-full" />
                                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                                    <Zap size={24} />
                                </div>
                                <h4 className="fd text-2xl font-bold uppercase gold-shimmer tracking-widest">Endorsement Prep</h4>
                                <p className="text-xs font-medium text-white/50 italic leading-relaxed">
                                    "The endorsement is the most critical hurdle. We audit your portfolio against Tech Nation, BFI, and Royal Society standards."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}