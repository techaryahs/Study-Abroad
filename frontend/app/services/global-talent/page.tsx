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
import AddToCart from "@/components/shared/AddToCart";

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
        <main
            className="relative min-h-screen overflow-hidden text-[#10324a] font-dm-sans"
            style={{
                background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
            }}
        >
             <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                .fd { font-family: 'Cormorant Garamond', serif; }

                .glass-panel {
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(16,50,74,0.1);
                    border-radius: 32px;
                    box-shadow: 0 30px 90px rgba(16,50,74,0.08);
                    backdrop-filter: blur(20px);
                }
            `}</style>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
                <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative z-10 pt-12 pb-12 px-6 md:px-16">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 glass-panel p-6 sm:p-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <Link 
                                href="/services" 
                                className="inline-flex items-center gap-2 text-[#2ca59d] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-block px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-bold text-[11px] tracking-[0.2em] uppercase">
                                United Kingdom Elite Visa
                            </span>
                        </div>
                        <h1 className="fd text-4xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A]">
                            UK <br/> Global Talent
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#4b5b6a] border-l-4 border-[#d2a14a] pl-6 max-w-xl">
                            "The ultimate visa for world-class innovators. We bridge the gap between your achievements and Home Office recognition."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['Endorsement Audit', 'Portfolio Drafting', 'PR Strategy'].map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#2ca59d]/15 flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-[#2ca59d]" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#4b5b6a]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-[500px]"
                    >
                        <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative group bg-[#10324a]">
                           <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                           <div className="relative absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
                                <Globe size={80} className="text-[#d2a14a] animate-pulse" />
                                <h3 className="fd text-3xl font-bold text-[#f8f4ea]">Global Potential<br/>Recognized</h3>
                                <div className="h-px w-20 bg-[#d2a14a]" />
                                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.3em]">United Kingdom</p>
                           </div>
                        </div>
                    </motion.div>
                </div>
            </section>

             {/* --- MAIN CONTENT --- */}
             <section className="relative z-10 py-10 px-6 md:px-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 glass-panel p-6 sm:p-10">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-3 space-y-16">
                        
                        {/* ABOUT */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Elite Distinction</span>
                                <h2 className="fd text-3xl md:text-5xl font-bold text-[#D4A54A]">What is the Global Talent Visa?</h2>
                            </div>
                            <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg">
                                <p>
                                    The Global Talent Visa is for individuals who are leaders, or potential leaders, in the fields of academia or research, arts and culture, or digital technology. This visa offers unprecedented flexibility, allowing you to work, switch jobs, or become an entrepreneur without Home Office restrictions.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                    {routes.map((route) => (
                                        <div key={route.id} className="p-8 bg-white border border-[#10324a]/10 rounded-[24px] hover:border-[#d2a14a]/40 transition-all hover:shadow-xl group text-center space-y-4">
                                            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d] group-hover:scale-110 transition-transform">
                                                {route.icon}
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#10324a]">{route.label}</h4>
                                            <p className="text-[14px] font-medium text-[#4b5b6a] opacity-70 italic">{route.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ADVANTAGES */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Privileges de Elite</span>
                                <h3 className="fd text-3xl font-bold text-[#D4A54A]">Unmatched Benefits</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {advantages.map((item, i) => (
                                    <div key={i} className="flex gap-5 p-4 items-start">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#d2a14a] flex items-center justify-center text-[#16364b] font-bold text-[14px] flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="fd text-xl font-bold text-[#10324a]">{item.title}</h4>
                                            <p className="text-sm font-medium text-[#4b5b6a] italic">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMMUNITY DISCUSSION */}
                        <div className="pt-10 border-t border-[#10324a]/10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Peer Validation</span>
                                    <h3 className="fd text-3xl font-bold text-[#10324a]">Global Insights</h3>
                                </div>
                                <div className="bg-white rounded-[32px] p-2 border border-[#10324a]/10 shadow-sm">
                                    <DiscussionSection serviceId="global-talent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <AddToCart serviceId="global-talent" />
                            
                            <div className="p-8 sm:p-10 bg-[#10324a] rounded-[32px] text-white space-y-6 shadow-[0_20px_60px_rgba(16,50,74,0.18)] border border-white/10 relative overflow-hidden group">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                                <div className="relative w-12 h-12 rounded-2xl bg-[#d2a14a]/20 flex items-center justify-center text-[#d2a14a]">
                                    <Zap size={24} />
                                </div>
                                <h4 className="relative fd text-2xl font-bold uppercase text-[#d2a14a] tracking-widest">Endorsement Prep</h4>
                                <p className="relative text-xs font-medium text-white/70 italic leading-relaxed">
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