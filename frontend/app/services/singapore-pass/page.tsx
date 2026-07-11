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
    Briefcase,
    Gem,
    Users
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import ServiceCTA from "@/components/shared/ServiceCTA";

const onePassAdvantages = [
  { title: "No Sponsorship Needed", desc: "Eligibility based on fixed monthly salary of SGD 30,000 or achievements." },
  { title: "Career Flexibility", desc: "Change employers or launch multiple companies without needing a new pass." },
  { title: "Family Friendly", desc: "Spouses can work on a Letter of Consent and dependents join easily." },
  { title: "5-Year Renewable", desc: "Long-term residency with simple renewal protocols." },
];

const eligibilityTracks = [
  { title: "Salary Track", desc: "Earned fixed monthly salary ≥ S$30,000 in the last 12 months." },
  { title: "Achiever Track", desc: "Outstanding accomplishments in arts, sports, academia, or research." },
];

export default function SingaporeOnePassPage() {
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
                                Singapore Premier Visa
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            Singapore <br/> <span className="gold-shimmer italic">ONE Pass</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#6B5E51] border-l-4 border-[#C5A059] pl-6 max-w-xl">
                            "The Overseas Networks & Expertise Pass for top achievers. Precision guidance for Singapore's most exclusive work pass."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['MOM Audit', 'Profile Elevation', 'Family Strategy'].map((feature) => (
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
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group bg-[#3C2A21]">
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
                                <Gem size={80} className="text-[#C5A059]" />
                                <h3 className="fd text-3xl font-bold text-[#E6D5B8]">Premier Talent<br/>Deployment</h3>
                                <div className="h-px w-20 bg-[#C5A059]" />
                                <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">Singapore Division</p>
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
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Strategic Network</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">About the <span className="gold-shimmer italic">ONE Pass</span></h2>
                            </div>
                            <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg">
                                <p>
                                    Designed to attract "big-thinkers," the ONE Pass gives applicants the freedom to change jobs without reapplying, launch companies, and bring their family along. It is Singapore's response to the global hunt for top-tier professional talent.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                    {onePassAdvantages.map((adv, i) => (
                                        <div key={i} className="p-8 bg-white border border-[#F1EDEA] rounded-[32px] hover:border-[#C5A059]/30 transition-all hover:shadow-2xl group space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                                                <Briefcase size={22} />
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#3C2A21]">{adv.title}</h4>
                                            <p className="text-[14px] font-bold font-medium opacity-60 italic">{adv.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ELIGIBILITY */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">MOM Standards</span>
                                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Eligibility Tracks</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {eligibilityTracks.map((track, i) => (
                                    <div key={i} className="bg-white p-10 rounded-[40px] border border-[#F1EDEA] space-y-4 relative group hover:border-[#C5A059]/20 transition-all">
                                        <h4 className="fd text-2xl font-bold text-[#3C2A21]">{track.title}</h4>
                                        <p className="text-sm font-medium text-[#6B5E51] italic leading-relaxed">{track.desc}</p>
                                        <div className="pt-4 flex items-center gap-2 text-[#C5A059] font-bold text-[14px] font-bold uppercase tracking-widest">
                                            <span>Learn Requirements</span> <Zap size={10} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Expert Consensus</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Singapore Strategy Chat</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
                                    <DiscussionSection serviceId="singapore_one_pass" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <ServiceCTA serviceId="singapore_one_pass" />
                            
                            <div className="p-10 bg-[#3C2A21] rounded-[40px] text-white space-y-6 shadow-2xl border border-[#C5A059]/20 text-center relative overflow-hidden group">
                                <Users size={40} className="mx-auto text-[#C5A059] mb-4" />
                                <h4 className="fd text-2xl font-bold uppercase gold-shimmer tracking-widest leading-tight">Global Connectivity</h4>
                                <p className="text-xs font-medium text-white/50 italic leading-relaxed">
                                    "We align your achievements with MOM and partner agencies MCCY, MOE, and NRF for holistic review."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}