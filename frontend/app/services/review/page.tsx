"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    CheckCircle2, 
    Search,
    BookOpen,
    FileText,
    ShieldCheck,
    Award
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import AddToCart from "@/components/shared/AddToCart";

const reviewFeatures = [
  { title: "Profile Evaluation", desc: "Expert assessment of your academic and professional standing.", icon: <Search size={22} /> },
  { title: "SOP & LOR Audit", desc: "Unlimited reviews for your Statement of Purpose and Letters of Rec.", icon: <FileText size={22} /> },
  { title: "Uni Shortlisting", desc: "Identification of ambitious, target, and safe universities.", icon: <Award size={22} /> },
  { title: "Portal Review", desc: "Consistency check for your final university application portals.", icon: <BookOpen size={22} /> },
];

export default function ApplicationReviewPage() {
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
                                Expert Application Audit
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            Application <br/> <span className="gold-shimmer italic">Review Protocol</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#6B5E51] border-l-4 border-[#C5A059] pl-6 max-w-xl">
                            "Leverage years of consulting expertise to elevate every document that defines your application journey."
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            {['Unlimited Edits', 'Portal Audit', 'Expert Logic'].map((feature) => (
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
                        <div className="aspect-square rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group">
                            <Image 
                                src="/complet-appl.jpg" 
                                alt="Application Review" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
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
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Expert Lens</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">About the <span className="gold-shimmer italic">Review Service</span></h2>
                            </div>
                            <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg">
                                <p>
                                    While most choose our drafting service, this review protocol is designed for those who have ready material but seek <strong className="text-[#3C2A21]">decisive validation</strong> from industry experts. We evaluate your profile, shortlist optimal universities, and provide unlimited feedback on your narratives.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                    {reviewFeatures.map((feature, i) => (
                                        <div key={i} className="p-8 bg-white border border-[#F1EDEA] rounded-[32px] hover:border-[#C5A059]/30 transition-all hover:shadow-2xl group space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#3C2A21]">{feature.title}</h4>
                                            <p className="text-xs font-medium opacity-60 italic">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Community Feedback</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Review Insights</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
                                    <DiscussionSection serviceId="application-review" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <AddToCart serviceId="application-review" />
                            
                            <div className="p-10 bg-[#3C2A21] rounded-[40px] text-white space-y-6 shadow-2xl border border-[#C5A059]/20 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/20 blur-3xl rounded-full" />
                                <h4 className="fd text-2xl font-bold uppercase gold-shimmer tracking-widest leading-tight">Decisive Audit</h4>
                                <p className="text-xs font-medium text-white/50 italic leading-relaxed">
                                    "We identify the consistent factors that lead to rejections and rectify them before you hit submit."
                                </p>
                                <div className="pt-4 flex items-center justify-center gap-4 border-t border-white/10">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-[#C5A059]/20">
                                        <Image src="/logo1.png" alt="Consultant" fill className="object-cover" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Expert Board</p>
                                        <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest">Decisive Reviews</p>
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