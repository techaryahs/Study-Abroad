"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    CheckCircle2, 
    Code2, 
    ShieldCheck, 
    Rocket,
    Server,
    Layout,
    Database,
    PhoneCall
} from "lucide-react";
import DiscussionSection from "@/components/shared/DiscussionSection";
import AddToCart from "@/components/shared/AddToCart";

const features = [
  { title: "Bespoke Design", desc: "A personalized website designed to match your professional narrative.", icon: <Layout size={20} /> },
  { title: "Managed AWS Hosting", desc: "Fully managed AWS EC2 instance — no technical setup required.", icon: <Server size={20} /> },
  { title: "Dynamic Logic", desc: "No cheap static sites. Database-driven logic for contact & engagement.", icon: <Database size={20} /> },
  { title: "Expert Content", desc: "Technical content management specialists working on your copy.", icon: <Code2 size={20} /> },
];

export default function PortfolioPage() {
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
            <section className="relative pt-24 pb-20 px-6 md:px-16 overflow-hidden bg-gradient-to-b from-[#C5A059]/10 to-transparent text-center lg:text-left">
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
                            <span className="inline-block px-5 py-2 rounded-full border border-[#C5A059]/30 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase w-fit mx-auto lg:mx-0">
                                Professional Identity Forge
                            </span>
                        </div>
                        <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21]">
                            Portfolio <br/> <span className="gold-shimmer italic">Building & Mgmt</span>
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#000000] border-l-4 border-[#C5A059] pl-6 max-w-xl mx-auto lg:mx-0">
                            "Highlight the best parts of your profile and shine to employers, universities, and clients worldwide."
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                            {['Managed AWS', 'Bespoke UI', 'Contact API'].map((feature) => (
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full max-w-[550px]"
                    >
                        <div className="aspect-[16/10] rounded-[40px] overflow-hidden border border-[#C5A059]/20 shadow-2xl relative group">
                            <Image 
                                src="/Portfolio Building.jpg" 
                                alt="Portfolio Building" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/40 to-transparent" />
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
                                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Digital Distinction</span>
                                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">More than a <span className="gold-shimmer italic">Website</span></h2>
                            </div>
                            <div className="space-y-6 text-[#000000] leading-relaxed text-lg">
                                <p>
                                    A portfolio website replaces your business card. It makes it easy for anyone with internet access to view your skills, projects, and demos. We build high-end, responsive portals using <strong className="text-[#3C2A21]">full-stack architecture</strong>, ensuring you aren't limited by static templates.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                    {features.map((feature, i) => (
                                        <div key={i} className="p-8 bg-white border border-[#F1EDEA] rounded-[32px] hover:border-[#C5A059]/30 transition-all hover:shadow-2xl group space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#3C2A21]">{feature.title}</h4>
                                            <p className="text-xs font-medium text-[#000000] italic">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-20 border-t border-[#F1EDEA]">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">User Consensus</span>
                                    <h3 className="fd text-4xl font-bold text-[#3C2A21]">Strategy Chat</h3>
                                </div>
                                <div className="bg-white rounded-[40px] p-2 border border-[#F1EDEA] shadow-sm">
                                    <DiscussionSection serviceId="portfolio-building" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <AddToCart serviceId="portfolio-building" />
                            
                            <div className="p-10 bg-[#3C2A21] rounded-[40px] text-white space-y-6 shadow-2xl border border-[#C5A059]/20 text-center">
                                <Rocket size={40} className="mx-auto text-[#C5A059] mb-4" />
                                <h4 className="fd text-2xl font-bold uppercase gold-shimmer tracking-widest leading-tight">Elevate Your Presence</h4>
                                <p className="text-xs font-medium text-white/50 italic leading-relaxed">
                                    "We found that 94% of top leaders from Harvard, Stanford, and Google own a personal portfolio website."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}