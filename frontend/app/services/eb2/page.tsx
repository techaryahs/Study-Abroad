"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Globe, 
    Award, 
    ShieldCheck, 
    UserCheck,
    ChevronRight,
    Play
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import AddToCart from "@/components/shared/AddToCart";

// --- Data ---
const timelineSteps = [
  {
    step: 1,
    title: "Profile Building",
    description: "Align your qualifications and experience with EB-2 NIW requirements.",
    duration: "6 Months",
  },
  {
    step: 2,
    title: "Petitioning",
    description: "Build an unbreakable petition with expert archival evidence and letters.",
    duration: "1–2 Months",
  },
  {
    step: 3,
    title: "Filing with USCIS",
    description: "Formally filing the I-140 petition with the Department of Homeland Security.",
    duration: "Immediate",
  },
  {
    step: 4,
    title: "I-140 Processing",
    description: "USCIS review of your professional merit and national importance.",
    duration: "45 Days (Premium) / 4-8 Months (Standard)",
  },
];

const successRates = [
  { label: "With 5 Papers", percent: 70 },
  { label: "With 6 Papers", percent: 76 },
  { label: "With 7 Papers", percent: 83 },
  { label: "With 8 Papers", percent: 94 },
];

const eligibilityCriteria = [
  { title: "Advanced Degree", desc: "Master's or higher, or Bachelor's + 5 years of experience." },
  { title: "Exceptional Ability", desc: "Proven expertise in sciences, arts, or business." },
  { title: "National Importance", desc: "Work that benefits the U.S. economy or culture." },
  { title: "Self-Petition", desc: "No employer sponsorship required (Wave PERM)." },
];

export default function EB2NIWPage() {
    return (
        <main
            className="min-h-screen text-[#10324a]"
            style={{
                background:
                    "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
            }}
        >
            <style jsx global>{`
                .gold-shimmer {
                    background: linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a);
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
            <section className="relative pt-24 pb-20 px-6 md:px-16 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(44,165,157,0.10) 0%, transparent 100%)" }}>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <Link 
                                href="/services" 
                                className="inline-flex items-center gap-2 text-[#d2a14a] font-black text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[11px] tracking-[0.2em] uppercase w-fit">
                                US Immigration Audit
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95]">
                            <span className="gold-shimmer">The Art of <br/> EB-2 NIW Visa</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-[#4b5b6a] border-l-4 border-[#d2a14a] pl-6 max-w-xl">
                            "Little known is the art of writing exactly what USCIS wants to see. A strong petition can be more impactful than credentials alone."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['Video Call', 'Audio Call', 'Tailored Strategy'].map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#2ca59d]/15 flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-[#2ca59d]" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#4b5b6a]">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-[500px]"
                    >
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative group">
                            <Image 
                                src="/eb2-hero.jpg" 
                                alt="EB-2 NIW Strategy" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/60 to-transparent" />
                            <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <section className="py-24 px-6 md:px-16 border-y border-[#10324a]/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
                    
                    {/* LEFT COLUMN: ABOUT & FEATURES */}
                    <div className="lg:col-span-3 space-y-24">
                        
                        {/* ABOUT */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Strategic Perspective</span>
                                <h2 className="text-4xl md:text-5xl font-black text-[#10324a]">About the <span className="gold-shimmer">National Interest Waiver</span></h2>
                            </div>
                            <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg">
                                <p>
                                    The EB-2 National Interest Waiver is an elite category for professionals who can prove that their work benefits the United States on a national level. Unlike standard employment-based visas, the NIW allows you to <strong className="text-[#10324a]">self-petition</strong> and bypass the labor certification process.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {eligibilityCriteria.map((item, i) => (
                                        <div key={i} className="p-6 bg-white/70 border border-[#10324a]/10 rounded-3xl hover:border-[#d2a14a]/40 hover:-translate-y-0.5 transition-all hover:shadow-xl group">
                                            <h4 className="text-xl font-black text-[#10324a] mb-2">{item.title}</h4>
                                            <p className="text-xs font-medium text-[#4b5b6a] opacity-80 group-hover:opacity-100">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="space-y-12">
                            <div className="space-y-2">
                                <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Path to Residency</span>
                                <h3 className="text-4xl font-black text-[#10324a]">Deployment Timeline</h3>
                            </div>
                            <div className="relative space-y-8">
                                <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d2a14a] to-transparent opacity-30" />
                                {timelineSteps.map((step, i) => (
                                    <motion.div 
                                        key={step.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="relative pl-14 group"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border border-[#d2a14a]/40 flex items-center justify-center font-black text-[#d2a14a] group-hover:bg-[#d2a14a] group-hover:text-[#10324a] transition-all z-10 text-xs">
                                            0{step.step}
                                        </div>
                                        <div className="bg-white/70 p-8 rounded-[32px] border border-[#10324a]/10 group-hover:border-[#d2a14a]/40 group-hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-2xl font-black text-[#10324a]">{step.title}</h4>
                                                <span className="text-[14px] font-bold font-bold text-[#d2a14a] tracking-widest uppercase pb-1 border-b border-[#d2a14a]/40">
                                                    {step.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-[#4b5b6a] leading-relaxed italic">{step.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* TRACK RECORD */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Metric of Excellence</span>
                                <h3 className="text-4xl font-black text-[#10324a]">Consulate Success Matrix</h3>
                                <p className="text-[#4b5b6a] italic text-sm">Based on 2024-2025 citation and publication audit data.</p>
                            </div>
                            <div className="bg-[#10324a] p-10 rounded-[40px] shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d2a14a]/15 blur-3xl rounded-full" />
                                <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#2ca59d]/10 blur-3xl rounded-full" />
                                <div className="space-y-8 relative z-10">
                                    {successRates.map((rate, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-white/70 font-black text-xs uppercase tracking-[0.2em]">{rate.label}</span>
                                                <span className="text-2xl font-black text-[#d2a14a]">{rate.percent}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${rate.percent}%` }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-[#d2a14a] to-[#f4d89e] rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COMMUNITY DISCUSSION */}
                        <div className="pt-20 border-t border-[#10324a]/10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Consensus & Feedback</span>
                                    <h3 className="text-4xl font-black text-[#10324a]">Candidate Discussion</h3>
                                </div>
                                <div className="bg-white/70 rounded-[40px] p-2 border border-[#10324a]/10 shadow-sm">
                                    <DiscussionSection serviceId="eb2-niw" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ACTION SIDEBAR */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40">
                            <AddToCart serviceId="eb2-niw" />
                            
                            {/* EXTRA HELP CARD */}
                            <div className="mt-8 p-10 bg-[#10324a] border border-white/10 rounded-[40px] space-y-6 text-white shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(210,161,74,0.15),transparent_50%)]" />
                                <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#d2a14a]/15 flex items-center justify-center text-[#d2a14a]">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="relative z-10 text-2xl font-black">Regulatory Assurance</h4>
                                <p className="relative z-10 text-xs font-medium text-white/60 italic leading-relaxed">
                                    "Our petitions are audited by senior consultants before final drafting to ensure 100% USCIS compliance."
                                </p>
                                <div className="relative z-10 pt-4 flex items-center gap-4 border-t border-white/10">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-[#d2a14a]/30">
                                        <Image src="/logo1.png" alt="Consultant" fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold font-bold text-white uppercase tracking-widest">Audit Team</p>
                                        <p className="text-[13px] font-bold text-[#d2a14a] font-bold uppercase tracking-widest">United States Division</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}