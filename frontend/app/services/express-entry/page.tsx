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
    ShieldCheck, 
    MapPin,
    Zap,
    Scale
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import AddToCart from "@/components/shared/AddToCart";

// --- Data ---
const CRS_MAX_POINTS = 1200;

const advantages = [
  { title: "No Job Offer Needed", desc: "You can apply and be invited without a valid Canadian job offer." },
  { title: "Fast-Track Processing", desc: "Typically processed within 6 months after the official invitation." },
  { title: "Point-Based Selection", desc: "Selection based on CRS scores — age, education, and language skills." },
  { title: "Permanent Residency", desc: "Direct pathway to Canada PR for you and your family." },
];

const timeline = [
  { step: "01", title: "Credential Assessment", duration: "1–2 Months", desc: "ECA reports for your education from WES or other designated bodies." },
  { step: "02", title: "Language Proficiency", duration: "1 Month", desc: "Achieving CLB 9 or higher in IELTS/CELPIP for maximum CRS points." },
  { step: "03", title: "Profile Creation", duration: "Immediate", desc: "Entering the Express Entry pool with your calculated CRS score." },
  { step: "04", title: "ITA & Submission", duration: "6 Months", desc: "Receiving Invitation to Apply and submitting final e-APR docs." },
];

export default function ExpressEntryPage() {
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
                                Canada Immigration Protocol
                            </span>
                        </div>
                        <h1 className="fd text-4xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A]">
                            Canada <br/> Express Entry
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#4b5b6a] border-l-4 border-[#d2a14a] pl-6 max-w-xl">
                            "The world's most efficient point-based migration system. We decode the CRS matrix to secure your ITA."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['CRS Optimization', 'WES/ECA Support', 'ITA Strategy'].map((feature) => (
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
                        className="relative w-full max-w-[550px]"
                    >
                        <div className="aspect-[16/10] rounded-[32px] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.12)] relative group">
                            <Image 
                                src="/Express-Entry.jpg" 
                                alt="Canada Express Entry" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe className="text-[#d2a14a]" size={20} />
                                    <span className="text-[14px] font-bold text-white tracking-widest uppercase">Federal Skilled Worker Program</span>
                                </div>
                                <p className="text-white font-serif italic text-sm leading-relaxed">
                                    "Navigating the IRCC thresholds with surgical precision."
                                </p>
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
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Strategic Matrix</span>
                                <h2 className="fd text-3xl md:text-5xl font-bold text-[#D4A54A]">What is <br/>Express Entry?</h2>
                            </div>
                            <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg">
                                <p>
                                    Express Entry is the primary system used by the Canadian government to manage applications for permanent residence for skilled workers. It is not an immigration program itself, but an online system to manage the <strong className="text-[#10324a]">Federal Skilled Worker</strong>, <strong className="text-[#10324a]">Federal Skilled Trades</strong>, and <strong className="text-[#10324a]">Canadian Experience Class</strong>.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {advantages.map((item, i) => (
                                        <div key={i} className="p-6 bg-white border border-[#10324a]/10 rounded-[24px] hover:border-[#d2a14a]/40 transition-all hover:shadow-lg group">
                                            <h4 className="fd text-xl font-bold text-[#10324a] mb-2">{item.title}</h4>
                                            <p className="text-xs font-medium text-[#4b5b6a] opacity-70 group-hover:opacity-100">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Deployment Sequence</span>
                                <h3 className="fd text-3xl font-bold text-[#D4A54A]">Application Timeline</h3>
                            </div>
                            <div className="relative space-y-8">
                                <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d2a14a] to-transparent opacity-30" />
                                {timeline.map((step, i) => (
                                    <motion.div 
                                        key={step.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="relative pl-14 group"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border border-[#d2a14a]/30 flex items-center justify-center font-bold text-[#2ca59d] group-hover:bg-[#d2a14a] group-hover:text-[#16364b] transition-all z-10 text-xs">
                                            {step.step}
                                        </div>
                                        <div className="bg-white/70 p-8 rounded-[24px] border border-[#10324a]/10 group-hover:border-[#d2a14a]/30 group-hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="fd text-2xl font-bold text-[#10324a]">{step.title}</h4>
                                                <span className="text-[14px] font-bold text-[#2ca59d] tracking-widest uppercase pb-1 border-b border-[#2ca59d]/30">
                                                    ⏱ {step.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-[#4b5b6a] leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-10 border-t border-[#10324a]/10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Global Consensus</span>
                                    <h3 className="fd text-3xl font-bold text-[#10324a]">Candidate Insights</h3>
                                </div>
                                <div className="bg-white rounded-[32px] p-2 border border-[#10324a]/10 shadow-sm">
                                    <DiscussionSection serviceId="express-entry" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <AddToCart serviceId="express-entry" />
                            
                            <div className="p-8 sm:p-10 bg-[#10324a] rounded-[32px] text-white space-y-6 shadow-[0_20px_60px_rgba(16,50,74,0.18)] border border-white/10 relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                                <div className="relative w-12 h-12 rounded-2xl bg-[#d2a14a]/20 flex items-center justify-center text-[#d2a14a]">
                                    <Scale size={24} />
                                </div>
                                <h4 className="relative fd text-2xl font-bold uppercase text-[#d2a14a] tracking-widest">CRS Optimization</h4>
                                <p className="relative text-xs font-medium text-white/70 italic leading-relaxed">
                                    "A difference of 10 points can mean 10,000 ranks in the Express Entry pool. We ensure every possible point is calculated."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}