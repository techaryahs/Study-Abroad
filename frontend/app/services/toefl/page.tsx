"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Video, 
    MessageSquare,
    Search
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";

const consultationSteps = [
    "You take a mock test.",
    "We do a phone call + screen share session where we evaluate your test and how to best help you.",
    "In case you prefer building a plan, we build your exact step-by-step prep-plan and explain it to you during the session itself. In case you prefer a coaching session, we coach you on the reading, writing, listening, and speaking sections of the test as per your needs."
];

export default function ToeflHelpPage() {
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
                            TOEFL PREP-PLAN <br />
                            <span className="gradient-text-gold">BUILDING/COACHING SESSION</span>
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
                            TOEFL scores are your gateway to financial aid and teaching assistantships. Learn how I scored a <strong className="text-white">119/120</strong> and YOU can too.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <h3 className="text-[15px] font-medium text-white/90">Includes:</h3>
                            <div className="flex gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#1e2a4f] flex items-center justify-center text-indigo-300 shadow-lg border border-white/5">
                                        <Video size={20} fill="currentColor" className="text-indigo-200" />
                                    </div>
                                    <span className="text-xs text-white/70">Video call</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#1c3f2d] flex items-center justify-center text-green-400 shadow-lg border border-white/5">
                                        <MessageSquare size={20} fill="currentColor" className="text-green-300" />
                                    </div>
                                    <span className="text-xs text-white/70">Text Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link 
                                href="/contact" 
                                className="inline-block border border-gold-500 text-gold-500 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gold-500 hover:text-black hover:shadow-lg hover:shadow-gold-500/20 text-center"
                            >
                                Discuss Your Case
                            </Link>
                            <div className="text-xs text-white/50 max-w-[130px] leading-tight">
                                Have questions about this service? Let's chat.
                            </div>
                        </div>
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
                                src="/toefl-hero.png"
                                alt="TOEFL Prep"
                                className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 relative z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent pointer-events-none z-20" />
                            
                            <div className="relative p-6 mt-auto z-30 w-full">
                                <div className="bg-dark-950/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl mt-4">
                                    <p className="text-white/90 text-[15px] font-medium font-serif italic leading-relaxed text-center drop-shadow-md">
                                        "If prepared right, the TOEFL is extremely easy and you will have no trouble in scoring over 110."
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

                        <div className="space-y-2">
                            <h3 className="font-bold text-white text-[15px]">My Scores:</h3>
                            <ul className="text-[15px] font-bold text-white/80 list-none space-y-1">
                                <li>Reading: <span className="font-normal text-white/60">29/30</span></li>
                                <li>Listening: <span className="font-normal text-white/60">30/30</span></li>
                                <li>Speaking: <span className="font-normal text-white/60">30/30</span></li>
                                <li>Writing: <span className="font-normal text-white/60">30/30</span></li>
                            </ul>
                        </div>

                        <div className="grid gap-6">
                            <p className="text-[15px] text-white/80 leading-relaxed font-normal">
                                While the TOEFL exam can seem overly simplistic at times, I can assure you it is not. If you have a very limited time, ranging from about 2 days to 15 days for preparation, you can have us work with you personally to build a schedule for you that suits your needs and increases your scores by targeting the areas you need to work on the most. I will personally work with you by evaluating your weaknesses through sample questions and then creating your schedule and recommending the most optimal material in your case. Our team will also help you in garnering the relevant material wherever possible.
                            </p>
                            <p className="text-[15px] text-white/80 leading-relaxed font-normal">
                                A great TOEFL score can not only help you by getting you into some of the top schools but it can also contribute towards your chances in fetching a Teaching Assistantship. In case you fail to get a great score, the ramifications include either being rejected from the university of your choice or being forced into taking other English language tests at the university for which very few resources are available as compared to the TOEFL. Let us improve your score instead and make sure you never face another English language test. If prepared right, the TOEFL is extremely easy and you will have no trouble in scoring over 110.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h3 className="text-[15px] font-bold text-white">The consultation is performed as follows:</h3>
                            <ul className="list-disc space-y-3 pl-6 text-[15px] text-white/80 leading-relaxed">
                                {consultationSteps.map((step, idx) => (
                                    <li key={idx}>
                                        {step}
                                    </li>
                                ))}
                            </ul>
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
                            <AddToCart serviceId="toefl" />

                        <Link href="/contact" className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] shadow-md flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer block">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                <MessageSquare size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white/90 text-sm">Discuss Your Case</h4>
                                <p className="text-xs text-white/50 font-normal mt-0.5">Have questions about this service? Let's chat.</p>
                            </div>
                        </Link>
                    </motion.div>

                </div>
            </section>

            {/* ── FAQS ── */}
            <FAQSection />

            {/* ── FOOTER CTA ── */}
            <section className="px-6 md:px-16 pb-20">
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
                            <h4 className="font-black text-xl mb-1 uppercase tracking-tight">Speak with a Consultant</h4>
                            <p className="text-white/40 text-xs font-medium italic">Discover how we can tailor our strategies to your specific profile.</p>
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
