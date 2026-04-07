"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Video, 
    MessageSquare,
    CheckCircle
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

const profileFeatures = [
    "Profile picture and background Cover building",
    "The perfect headline and summary",
    "In-detail previous positions (both jobs and internships)",
    "Licences, Certifications, and Volunteering positions",
    "Endorsements and Recommendations",
    "Projects, Honors, Publications, and Tests",
    "Recommended Profile settings revamping to maximize opportunities"
];

export default function LinkedinProfilePage() {
    return (
        <main className="min-h-screen bg-dark-950 text-white selection:bg-gold-500/30 font-base overflow-x-hidden">
            {/* ── HERO SECTION ── */}
            <section className="relative px-6 md:px-16 pt-12 pb-12 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start relative z-10 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight uppercase">
                            LINKEDIN PROFILE <br />
                            <span className="gradient-text-gold">BOOSTING</span>
                        </h1>
                        <div className="pb-2">
                            <Link 
                                href="/services" 
                                className="inline-flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors group relative z-20"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest leading-none">Back to Services</span>
                            </Link>
                        </div>
                        
                        <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-8">
                            Revamp your LinkedIn profile from 0 to 99. The outcomes include better admits, job opportunities, placements, and a bigger network.
                        </p>
                        
                        <DiscussionSection serviceId="linkedin" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative mt-8 lg:mt-0"
                    >
                        <div className="relative w-full max-w-md ml-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-dark-900/40 group flex flex-col items-center justify-center p-4">
                            <img
                                src="/linkedin-hero.png"
                                alt="LinkedIn Profile Boosting"
                                className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 relative z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent pointer-events-none z-20" />
                            
                            <div className="relative p-6 mt-auto z-30 w-full">
                                <div className="bg-dark-950/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl mt-4">
                                    <p className="text-white/90 text-[15px] font-medium font-serif italic leading-relaxed text-center drop-shadow-md">
                                        "Your LinkedIn profile is the modern-day résumé. Making a powerful first impression is absolutely non-negotiable."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTENT GRID ── */}
            <section className="py-16 px-6 md:px-16 bg-dark-900/20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
                    
                    {/* Main Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 space-y-10"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-medium text-white flex items-center gap-3">
                                About Service
                            </h2>
                            <div className="w-32 h-0.5 bg-gold-500" />
                        </div>

                        <div className="grid gap-6">
                            <p className="text-[15px] text-white/60 leading-relaxed font-normal">
                                While you are looking for better admits from universities, better job opportunities in the market, networking opportunities, or funding for a new startup, all of it starts with LinkedIn. Your LinkedIn profile is much more than your Résumé, and that's also why you have a link to your LinkedIn profile on your Résumé. Now, it is time to revamp your profile and upscale your professional life.
                            </p>
                        </div>

                        <div className="space-y-6 pt-2">
                            <h3 className="text-[17px] font-bold text-white/80 uppercase tracking-wider">Here's the parts of your profile we help you with:</h3>
                            <ul className="grid gap-4">
                                {profileFeatures.map((feature, idx) => (
                                    <li key={idx} className="group flex items-start gap-5 p-5 pr-8 rounded-2xl bg-gradient-to-r from-dark-900/40 to-transparent border border-gold-500/30 hover:border-gold-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:bg-gold-500/5 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500/20 group-hover:bg-gold-500 transition-colors" />
                                        <div className="shrink-0 mt-0.5 bg-dark-950 border border-gold-500/20 shadow-inner p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <CheckCircle className="w-5 h-5 text-gold-500 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all" />
                                        </div>
                                        <p className="text-[15px] text-white/70 leading-relaxed font-medium group-hover:text-white/90 transition-colors">
                                            {feature}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-gold-500/5 border border-gold-500/10 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/50" />
                            <p className="text-[15px] text-white/60 leading-relaxed italic">
                                <strong className="text-gold-500 not-italic mr-2 font-black uppercase text-xs tracking-widest">The best part?</strong>
                                All of this is done over a one-on-one Zoom session, so you will never need to worry about any communication gap between you and your dedicated LinkedIn profile revamping manager. Enroll today, and witness the secrets to a stunning LinkedIn Profile applied right in front of you.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pricing Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-24 h-max"
                    >
                            <AddToCart serviceId="linkedin" />
                    </motion.div>

                </div>
            </section>

            <FAQSection />

            {/* ── FOOTER CTA ── */}
            <section className="px-6 md:px-16 pb-20 mt-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto bg-gradient-to-r from-dark-900 to-dark-950 border border-gold-500/20 rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-3xl rounded-full" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/20 bg-dark-800 flex items-center justify-center text-3xl shadow-xl grayscale hover:grayscale-0 transition-all">
                           👤
                        </div>
                        <div>
                            <h4 className="font-black text-xl mb-1 uppercase tracking-tight">Ready to boost your profile?</h4>
                            <p className="text-white/40 text-xs font-medium italic">Discover how we can tailor our strategies to your specific career.</p>
                        </div>
                    </div>
                    <button className="whitespace-nowrap px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-gold-500 transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.2em] relative z-10 shadow-2xl">
                        <Link href="/contact">Message Now &rarr;</Link>
                    </button>
                </motion.div>
            </section>
        </main>
    );
}
