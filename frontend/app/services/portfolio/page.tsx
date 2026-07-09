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
            <section className="relative z-10 pt-12 pb-12 px-6 md:px-16 text-center lg:text-left">
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
                            <span className="inline-block px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-bold text-[11px] tracking-[0.2em] uppercase w-fit mx-auto lg:mx-0">
                                Professional Identity Forge
                            </span>
                        </div>
                        <h1 className="fd text-4xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A]">
                            Portfolio <br/> Building & Mgmt
                        </h1>
                        <p className="fd text-xl md:text-2xl font-medium leading-relaxed italic text-[#4b5b6a] border-l-4 border-[#d2a14a] pl-6 max-w-xl mx-auto lg:mx-0">
                            "Highlight the best parts of your profile and shine to employers, universities, and clients worldwide."
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                            {['Managed AWS', 'Bespoke UI', 'Contact API'].map((feature) => (
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full max-w-[550px]"
                    >
                        <div className="aspect-[16/10] rounded-[32px] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.12)] relative group">
                            <Image 
                                src="/Portfolio Building.jpg" 
                                alt="Portfolio Building" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/50 to-transparent" />
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
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Digital Distinction</span>
                                <h2 className="fd text-3xl md:text-5xl font-bold text-[#D4A54A]">More than a Website</h2>
                            </div>
                            <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg">
                                <p>
                                    A portfolio website replaces your business card. It makes it easy for anyone with internet access to view your skills, projects, and demos. We build high-end, responsive portals using <strong className="text-[#10324a]">full-stack architecture</strong>, ensuring you aren't limited by static templates.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                    {features.map((feature, i) => (
                                        <div key={i} className="p-8 bg-white border border-[#10324a]/10 rounded-[24px] hover:border-[#d2a14a]/40 transition-all hover:shadow-xl group space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d] group-hover:scale-110 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <h4 className="fd text-xl font-bold text-[#10324a]">{feature.title}</h4>
                                            <p className="text-xs font-medium text-[#4b5b6a] opacity-70 italic">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                         {/* COMMUNITY DISCUSSION */}
                         <div className="pt-10 border-t border-[#10324a]/10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">User Consensus</span>
                                    <h3 className="fd text-3xl font-bold text-[#10324a]">Strategy Chat</h3>
                                </div>
                                <div className="bg-white rounded-[32px] p-2 border border-[#10324a]/10 shadow-sm">
                                    <DiscussionSection serviceId="portfolio-building" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 relative">
                        <div className="lg:sticky lg:top-40 space-y-8">
                            <AddToCart serviceId="portfolio-building" />
                            
                            <div className="p-8 sm:p-10 bg-[#10324a] rounded-[32px] text-white space-y-6 shadow-[0_20px_60px_rgba(16,50,74,0.18)] border border-white/10 text-center relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                                <Rocket size={40} className="relative mx-auto text-[#d2a14a] mb-4" />
                                <h4 className="relative fd text-2xl font-bold uppercase text-[#d2a14a] tracking-widest leading-tight">Elevate Your Presence</h4>
                                <p className="relative text-xs font-medium text-white/70 italic leading-relaxed">
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