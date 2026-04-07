"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Video,
    MessageSquare,
    Star,
    ShieldCheck,
    Zap,
    Users,
    Phone,
    ArrowLeft
} from "lucide-react";
import FAQSection, { defaultFaqs } from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

const visaFaqs = [...defaultFaqs];
visaFaqs.splice(5, 0, {
    question: "Is recording the mock interview video call session allowed?",
    answer: "You may not record the interview session done with our executives. This is done for the protection of the service offering from any misuse. The solutions we have developed over the years to train the applicants for the interview are proprietary and we prefer to impart the expertise only to the applicant who has opted into this service with us."
});

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
    {
        title: "Case-Specific Training",
        description: "Get unique answers to commonly asked questions based on your case.",
        icon: <Users className="w-4 h-4" />,
    },
    {
        title: "Video Call Session",
        description: "One-on-one call with visa experts through Google Meet. Emulate the real visa interview.",
        icon: <Video className="w-4 h-4" />,
    },
    {
        title: "Multiple Rounds of Testing",
        description: "Our visa experts conduct multiple rounds of tailored interviews to ensure your success.",
        icon: <Zap className="w-4 h-4" />,
    },
    {
        title: "Post Training Support",
        description: "Contact us on WhatsApp, and our visa experts will readily assist you even after your mock interview.",
        icon: <MessageSquare className="w-4 h-4" />,
    },
];

// ─── Components ──────────────────────────────────────────────────────────────

export default function VisaMockInterviewPage() {
    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-gold-500/30">
            <main className="flex flex-col">
                {/* ── HERO SECTION ── */}
                <section className="relative pt-12 pb-12 px-6 md:px-16 overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32" />

                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start relative z-10 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: '-50px' }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
                                <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.2em]">Premium Service</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight uppercase">
                                US Visa Mock <br />
                                <span className="gradient-text-gold">Interview</span>
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

                            <p className="text-white/70 text-base leading-relaxed max-w-md italic font-normal">
                                The final step to your US visa is a Visa interview with an officer from the US consulate.
                                Ace the interview with proven tricks and techniques.
                            </p>

                            <DiscussionSection serviceId="visa_mock_interview" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative mt-8 lg:mt-0"
                        >
                            <div className="relative w-full max-w-md ml-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-dark-900/40 group flex items-center justify-center p-4">
                                <img
                                    src="/visa-hero.png"
                                    alt="Visa Mock Interview"
                                    className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none relative z-10"
                                />

                                {/* Compact Badges */}
                                <div className="absolute z-30 top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2 shadow-xl scale-90 origin-top-right">
                                    <Star className="text-gold-500 w-4 h-4 fill-gold-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">4.9/5 Rating</p>
                                    </div>
                                </div>

                                <div className="absolute z-30 bottom-4 left-4 bg-gold-500 px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl scale-90 origin-bottom-left">
                                    <ShieldCheck className="text-black w-5 h-5" />
                                    <p className="text-[10px] font-black text-black uppercase tracking-tight">Verified Expert</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── ABOUT & BOOKING ── */}
                <section className="py-16 px-6 md:px-16 bg-dark-900/20">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2 space-y-12"
                        >
                            <div className="space-y-3">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-[1px] bg-gold-500" />
                                    About Service
                                </h2>
                                <p className="text-lg text-white/60 font-medium italic leading-relaxed max-w-xl">
                                    "The last step before your flight to the USA."
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {[
                                    "Visa officers reject 1 in 4 candidates. Precision is key.",
                                    "Failing means losing months of work and postponing plans.",
                                    "Expert assistance for all case types: rejections or first-timers."
                                ].map((text, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all shadow-md">
                                            {i === 0 ? <Users size={16} /> : i === 1 ? <Zap size={16} /> : <ShieldCheck size={16} />}
                                        </div>
                                        <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors italic leading-relaxed">
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {features.map((f, i) => (
                                    <div key={i} className="glass-card !p-6 !rounded-[2rem] space-y-4 hover:bg-gold-500 hover:text-black transition-all group shadow-lg border border-white/[0.03]">
                                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-black group-hover:text-gold-500 transition-all shadow-md">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-widest mb-1 transition-colors">{f.title}</h4>
                                            <p className="text-[11px] opacity-40 italic leading-snug group-hover:opacity-70">{f.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:sticky lg:top-24"
                        >
                            <AddToCart serviceId="visa_mock_interview" />
                        </motion.div>
                    </div>
                </section>

                {/* ── SUCCESS RATE ── */}
                <section className="relative py-20 px-6 md:px-16 overflow-hidden bg-dark-950 flex items-center min-h-[350px]">
                    <img
                        src="/visa-success-rate-bg.png"
                        alt="Success Rate"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/40 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto relative z-10 w-full space-y-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                            Our Success Rate
                        </h2>
                        <p className="text-white/70 text-lg md:text-xl max-w-xl italic font-semibold leading-relaxed drop-shadow-md">
                            Strategic approach helping thousands of candidates ace their visa interview every single year.
                        </p>
                        <div className="text-7xl md:text-9xl font-black gradient-text-gold leading-none tracking-tighter drop-shadow-2xl opacity-90">
                            98.7%
                        </div>

                    </motion.div>
                </section>

                <FAQSection faqs={visaFaqs} />
            </main>

            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 group">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all hidden md:block shadow-2xl">
                    Support
                </div>
                <button className="w-12 h-12 rounded-full bg-gold-500 text-dark-950 flex items-center justify-center shadow-4xl hover:scale-110 active:scale-95 transition-all group overflow-hidden border-2 border-dark-950/20">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <MessageSquare size={18} className="relative z-10" />
                </button>
            </div>
        </div>
    );
}
