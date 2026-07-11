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
import ServiceCTA from "@/components/shared/ServiceCTA";

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
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
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
                                Canada Immigration Protocol
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            Canada <br/> <span className="gold-shimmer italic">Express Entry</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#6B5E51] border-l-4 border-[#C5A059] pl-6 max-w-xl">
                            "The world's most efficient point-based migration system. We decode the CRS matrix to secure your ITA."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['CRS Optimization', 'WES/ECA Support', 'ITA Strategy'].map((feature) => (
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
                        className="relative w-full max-w-[550px]"
                    >
                        <div className="aspect-[16/10] rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group">
                            <Image 
                                src="/Express-Entry.jpg" 
                                alt="Canada Express Entry" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe className="text-[#C5A059]" size={20} />
                                    <span className="text-[14px] font-bold text-white font-bold tracking-widest uppercase">Federal Skilled Worker Program</span>
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
            <section className="py-24 px-6 md:px-16 border-y border-[#F1EDEA]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-3 space-y-24">
                        
                        {/* ABOUT */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Strategic Matrix</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">What is <br/><span className="gold-shimmer">Express Entry?</span></h2>
                            </div>
                            <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg">
                                <p>
                                    Express Entry is the primary system used by the Canadian government to manage applications for permanent residence for skilled workers. It is not an immigration program itself, but an online system to manage the <strong className="text-[#3C2A21]">Federal Skilled Worker</strong>, <strong className="text-[#3C2A21]">Federal Skilled Trades</strong>, and <strong className="text-[#3C2A21]">Canadian Experience Class</strong>.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {advantages.map((item, i) => (
                                        <div key={i} className="p-6 bg-white border border-[#C5A059]/10 rounded-3xl hover:border-[#C5A059]/40 transition-all hover:shadow-xl group">
                                            <h4 className="fd text-xl font-bold text-[#3C2A21] mb-2">{item.title}</h4>
                                            <p className="text-xs font-medium opacity-70 group-hover:opacity-100">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="space-y-12">
                            <div className="space-y-2">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Deployment Sequence</span>
                                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Application Timeline</h3>
                            </div>
                            <div className="relative space-y-8">
                                <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C5A059] to-transparent opacity-20" />
                                {timeline.map((step, i) => (
                                    <motion.div 
                                        key={step.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="relative pl-14 group"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center font-bold text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all z-10 text-xs">
                                            {step.step}
                                        </div>
                                        <div className="bg-[#FDFBF7] p-8 rounded-[32px] border border-[#F1EDEA] group-hover:border-[#C5A059]/20 group-hover:shadow-2xl transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="fd text-2xl font-bold text-[#3C2A21]">{step.title}</h4>
                                                <span className="text-[14px] font-bold font-bold text-[#C5A059] tracking-widest uppercase pb-1 border-b border-[#C5A059]/30">
                                                    ⏱ {step.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-[#6B5E51] leading-relaxed italic">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Global Consensus</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Candidate Insights</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
                                    <DiscussionSection serviceId="express_entry" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <ServiceCTA serviceId="express_entry" />
                            
                            <div className="p-10 bg-[#3C2A21] rounded-[40px] text-white space-y-6 shadow-2xl border border-[#C5A059]/20">
                                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                                    <Scale size={24} />
                                </div>
                                <h4 className="fd text-2xl font-bold uppercase gold-shimmer tracking-widest">CRS Optimization</h4>
                                <p className="text-xs font-medium text-white/60 italic leading-relaxed">
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