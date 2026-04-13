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
                                US Immigration Audit
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            The Art of <br/> <span className="gold-shimmer italic">EB-2 NIW Visa</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#6B5E51] border-l-4 border-[#C5A059] pl-6 max-w-xl">
                            "Little known is the art of writing exactly what USCIS wants to see. A strong petition can be more impactful than credentials alone."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['Video Call', 'Audio Call', 'Tailored Strategy'].map((feature) => (
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
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group">
                            <Image 
                                src="/eb2-hero.jpg" 
                                alt="EB-2 NIW Strategy" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
                            <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform group">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <section className="py-24 px-6 md:px-16 border-y border-[#F1EDEA]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
                    
                    {/* LEFT COLUMN: ABOUT & FEATURES */}
                    <div className="lg:col-span-3 space-y-24">
                        
                        {/* ABOUT */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Strategic Perspective</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">About the <span className="gold-shimmer">National Interest Waiver</span></h2>
                            </div>
                            <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg">
                                <p>
                                    The EB-2 National Interest Waiver is an elite category for professionals who can prove that their work benefits the United States on a national level. Unlike standard employment-based visas, the NIW allows you to <strong className="text-[#3C2A21]">self-petition</strong> and bypass the labor certification process.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {eligibilityCriteria.map((item, i) => (
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
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Path to Residency</span>
                                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Deployment Timeline</h3>
                            </div>
                            <div className="relative space-y-8">
                                <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C5A059] to-transparent opacity-20" />
                                {timelineSteps.map((step, i) => (
                                    <motion.div 
                                        key={step.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="relative pl-14 group"
                                    >
                                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center font-bold text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all z-10 text-xs">
                                            0{step.step}
                                        </div>
                                        <div className="bg-[#FDFBF7] p-8 rounded-[32px] border border-[#F1EDEA] group-hover:border-[#C5A059]/20 group-hover:shadow-2xl transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="fd text-2xl font-bold text-[#3C2A21]">{step.title}</h4>
                                                <span className="text-[10px] font-bold text-[#C5A059] tracking-widest uppercase pb-1 border-b border-[#C5A059]/30">
                                                    {step.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-[#6B5E51] leading-relaxed italic">{step.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* TRACK RECORD */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Metric of Excellence</span>
                                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Consulate Success Matrix</h3>
                                <p className="text-[#6B5E51] italic text-sm">Based on 2024-2025 citation and publication audit data.</p>
                            </div>
                            <div className="bg-[#3C2A21] p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl rounded-full" />
                                <div className="space-y-8 relative z-10">
                                    {successRates.map((rate, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[#E6D5B8] font-bold text-xs uppercase tracking-[0.2em]">{rate.label}</span>
                                                <span className="fd text-2xl font-bold text-[#C5A059]">{rate.percent}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${rate.percent}%` }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#E6D5B8] rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COMMUNITY DISCUSSION */}
                        <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Consensus & Feedback</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Candidate Discussion</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
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
                            <div className="mt-8 p-10 bg-white border border-[#F1EDEA] rounded-[40px] space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="fd text-2xl font-bold text-[#3C2A21]">Regulatory Assurance</h4>
                                <p className="text-xs font-medium text-[#6B5E51] italic leading-relaxed">
                                    "Our petitions are audited by senior consultants before final drafting to ensure 100% USCIS compliance."
                                </p>
                                <div className="pt-4 flex items-center gap-4 border-t border-[#F1EDEA]">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-[#C5A059]/20">
                                        <Image src="/logo1.png" alt="Consultant" fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#3C2A21] uppercase tracking-widest">Audit Team</p>
                                        <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest">United States Division</p>
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