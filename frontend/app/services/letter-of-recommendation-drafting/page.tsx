"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    History,
    Users,
    Globe,
    Scale,
    ShieldCheck,
    ArrowRight,
    MessageSquare,
    PenTool,
    BookOpenCheck,
    Quote
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const lorFeatures = [
    { title: "Standard Audit", desc: "Mapping your LORs against international recommender standards.", icon: <CheckCircle2 size={24} /> },
    { title: "Strategic Selection", desc: "Advisory on choosing the optimal mix of academic and professional confirmors.", icon: <Users size={24} /> },
    { title: "Dynamic Storytelling", desc: "Avoiding generic praise to focus on high-impact professional narratives.", icon: <PenTool size={24} /> },
    { title: "Profile Alignment", desc: "Ensuring LORs complement your SOP and technical achievements.", icon: <BookOpenCheck size={24} /> }
];

export default function LORDraftingPage() {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <main className="min-h-screen pb-16" style={{ background: "#FDFBF7", color: "#3C2A21", fontFamily: "'DM Sans', sans-serif" }}>

            <style>{`
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

                .glass-panel {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.15);
                  border-radius: 32px;
                  box-shadow: 0 40px 100px rgba(197,160,89, 0.05);
                }

                .feature-pill {
                  background: white;
                  border: 1px solid rgba(197,160,89, 0.1);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .feature-pill:hover {
                  border-color: #C5A059;
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(197,160,89, 0.08);
                }

                .btn-gold {
                   background: #C5A059;
                   color: white;
                   padding: 18px 30px;
                   border-radius: 18px;
                   font-weight: 700;
                   text-transform: uppercase;
                   letter-spacing: 0.1em;
                   font-size: 11px;
                   transition: all 0.3s ease;
                   display: inline-flex;
                   alignItems: center;
                   gap: 10px;
                }
                .btn-gold:hover {
                   background: #3C2A21;
                   transform: translateY(-2px);
                   box-shadow: 0 10px 20px rgba(197,160,89, 0.2);
                }
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative pt-10 pb-24 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.1) 0%, transparent 100%)" }}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 pt-6"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                                Third-Party Validation Audit
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
                            The Art of <br /> <span className="gold-shimmer">LOR Drafting</span>
                        </h1>
                        <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "Little known is the art of writing exactly what the admissions committee wants to see. A strong LOR can be more impactful than your SOP."
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group w-full sm:w-auto justify-center"
                            >
                                Begin LOR Strategy <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative pt-6"
                    >
                        <div className="glass-panel p-2 overflow-hidden shadow-2xl group">
                            <div className="relative aspect-square w-full rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                                <Image
                                    src="/lor-drafting-hero.png"
                                    alt="LOR Drafting Mastery"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/40 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Quote className="text-[#C5A059]" size={20} />
                                        <span className="text-[10px] text-white font-bold tracking-widest uppercase">Credential Audit</span>
                                    </div>
                                    <p className="text-white font-serif italic text-sm leading-relaxed">
                                        "We bridge the gap between academic genericism and strategic institutional resonance."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── OVERVIEW SECTION ───────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-20 items-start">

                    {/* LEFT COLUMN: STRATEGIC INSIGHTS */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="space-y-4">
                            <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Narrative Command</span>
                            <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Why LORs Are Your <br /> <span className="gold-shimmer">Most Potent Weapon</span></h2>
                        </div>

                        <div className="space-y-6 text-[#6B5E51] font-medium leading-relaxed max-w-2xl text-lg">
                            <p>
                                Letters of Recommendation (LORs) undeniably hold the most importance in your application. However, most LORs are generic, wasting the only chance you had at winning the committee's clinical support.
                            </p>
                            <p>
                                Think about it: Would an admissions officer put faith in a random applicant, or rather believe a professor or industry leader they follow? It's that simple.
                            </p>
                            <div className="p-8 bg-[#FDFBF7] border-l-4 border-[#C5A059] italic text-xl text-[#3C2A21] fd">
                                "Generic LORs are a load of crap. No one cares if you were 'the best student.' They care about your unique contribution logic."
                            </div>
                            <p>
                                This service includes strategic recommendations on who you should select as your confirmors, tailored specifically to your profile, target degree, and professional network.
                            </p>
                        </div>

                        {/* INTEGRATED PILLARS */}
                        <div className="space-y-8 pt-10 border-t border-[#F1EDEA]">
                            <div className="space-y-2">
                                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.2em] uppercase">Drafting Framework</span>
                                <h3 className="fd text-3xl font-bold text-[#3C2A21]">Strategic LOR Pillars</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lorFeatures.map((feat, i) => (
                                    <div key={i} className="feature-pill p-6 flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] flex items-center justify-center text-[#C5A059] flex-shrink-0 border border-[#C5A059]/10">
                                            {feat.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="fd text-lg font-bold text-[#3C2A21]">{feat.title}</h4>
                                            <p className="text-[#6B5E51] text-xs leading-relaxed font-medium">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INTEGRATED DISCUSSION */}
                        <div className="pt-10 border-t border-[#F1EDEA]">
                            <DiscussionSection serviceId="letter-of-recommendation-drafting" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ACTION & SIDEBAR */}
                    <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-32">
                        <div className="bg-[#3C2A21] p-10 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="space-y-2">
                                <h3 className="fd text-3xl font-bold">Secure Your Admit</h3>
                                <p className="text-white/40 text-sm italic font-medium">Bespoke drafting for international standards.</p>
                            </div>
                            <AddToCart serviceId="lor-drafting" />
                        </div>

                        <div className="p-10 glass-panel space-y-6">
                            <div className="flex items-center gap-4">
                                <ShieldCheck size={28} className="text-[#C5A059]" />
                                <h4 className="fd text-2xl font-bold text-[#3C2A21]">Influence Audit</h4>
                            </div>
                            <p className="text-sm text-[#3C2A21]/60 leading-relaxed font-medium">
                                We analyze your potential recommenders to determine who provides the highest ROI for your specific target universities.
                            </p>
                        </div>

                        <div className="p-8 glass-panel space-y-6 transition-all hover:border-[#C5A059]/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                                    <MessageSquare size={20} />
                                </div>
                                <h4 className="fd text-xl font-bold text-[#3C2A21]">Confirmor Consult</h4>
                            </div>
                            <p className="text-xs text-[#3C2A21]/60 font-medium leading-relaxed">
                                Not sure who to ask? Connect with our team to map out your recommendation strategy before drafting begins.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[10px] tracking-widest uppercase hover:gap-3 transition-all">
                                Message now <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-16 flex flex-col items-center text-center space-y-10 relative z-10"
                >
                    <div className="w-20 h-20 rounded-full bg-[#3C2A21] flex items-center justify-center text-[#C5A059] mb-4 shadow-2xl">
                        <PenTool size={40} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="fd text-4xl font-bold text-[#3C2A21]">Stop Writing Generic LORs</h4>
                        <p className="text-[#6B5E51] text-lg font-medium italic max-w-2xl px-6">
                            Secure the committee's faith with third-party validation that actually impacts their decision.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto"
                    >
                        Begin LOR Strategy <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 text-[10px] text-[#C5A059] font-black tracking-widest uppercase opacity-40">
                        <Zap size={12} /> Ivy League Standards Certified
                    </div>
                </motion.div>
            </section>

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}