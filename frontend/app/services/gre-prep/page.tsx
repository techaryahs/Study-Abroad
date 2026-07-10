"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    Trophy,
    Target,
    BookOpen,
    Users,
    ArrowRight,
    Search,
    Brain,
    Calendar,
    MessageSquare
} from "lucide-react";
import FAQSection from "./FAQSection";
import ServiceCTA from "@/components/shared/ServiceCTA";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const coachingPillars = [
    { title: "Mock Evaluation", desc: "Diagnostic audit of your current verbal and quantitative proficiency markers.", icon: <Search size={24} /> },
    { title: "Material Intelligence", desc: "Curation of high-yield resources specifically selected for your weaknesses.", icon: <BookOpen size={24} /> },
    { title: "Strategic Roadmap", desc: "Creation of a day-by-day protocol to maximize score in minimum time.", icon: <Calendar size={24} /> },
    { title: "Tactical Execution", desc: "One-on-one deep dives into specific question logic and timing strategy.", icon: <Target size={24} /> }
];

export default function GrePrepPage() {
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
                                Quantitative & Verbal Mastery
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
                            Bespoke <br /> <span className="gold-shimmer">GRE Prep-Plan</span>
                        </h1>
                        <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "The secret to a 330+ score is NOT hard work; it's clinical strategy. Join the ranks of thousands who decoded the GRE with us."
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group w-full sm:w-auto justify-center"
                            >
                                Begin Coaching Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="glass-panel p-2 overflow-hidden shadow-2xl">
                            <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                                <div className="bg-[#3C2A21] px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="text-[#C5A059]" size={20} />
                                        <span className="text-[14px] font-bold text-white font-bold tracking-widest uppercase">Mentor Benchmark</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#C5A059] font-bold uppercase tracking-widest">Global Top 1%</span>
                                </div>
                                <div className="p-10 space-y-8 bg-[#FDFBF7]">
                                    <div className="text-center space-y-1">
                                        <p className="text-[14px] font-bold text-[#3C2A21]/40 font-bold uppercase tracking-widest">Certified Score</p>
                                        <h2 className="fd text-6xl font-black text-[#C5A059]">329 <span className="text-2xl text-[#3C2A21]/20">/340</span></h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 border-y border-[#F1EDEA] py-6">
                                        <div className="text-center space-y-1">
                                            <p className="text-[#3C2A21] font-bold text-lg">161</p>
                                            <p className="text-[12px] font-black text-[#C5A059] font-bold uppercase tracking-widest">Verbal</p>
                                        </div>
                                        <div className="text-center space-y-1 border-x border-[#F1EDEA]">
                                            <p className="text-[#3C2A21] font-bold text-lg">168</p>
                                            <p className="text-[12px] font-black text-[#C5A059] font-bold uppercase tracking-widest">Quant</p>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[#3C2A21] font-bold text-lg">4.5</p>
                                            <p className="text-[12px] font-black text-[#C5A059] font-bold uppercase tracking-widest">AWA</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            "Personalized Day-by-Day Schedule",
                                            "High-Yield Material Curation",
                                            "Weakness-Mapping Protocol",
                                            "One-on-One Performance Review"
                                        ].map((item) => (
                                            <div key={item} className="flex items-center gap-3 text-[#3C2A21] font-medium text-sm">
                                                <CheckCircle2 size={16} className="text-[#C5A059]" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── ABOUT SECTION ──────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Intelligence Behind the Score</span>
                            <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Breaking the <br /> <span className="gold-shimmer">GRE Score Plateau</span></h2>
                        </div>
                        <div className="space-y-6 text-[#6B5E51] font-medium leading-relaxed">
                            <p>
                                Struggling to cross the 325 threshold? Most students hit a plateau because they follow generic schedules. I decoded the exam with a 329 score and have spent years helping others achieve consistent top-tier results.
                            </p>
                            <p>
                                During our clinical session, we don't just 'study'; we audit your cognitive approach to problem-solving. We build your personalized preparation architecture right in front of you.
                            </p>
                        </div>
                        <div className="space-y-8 pl-6 border-l-2 border-[#C5A059]/20">
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#3C2A21] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">01</div>
                                <div className="space-y-1">
                                    <h4 className="fd text-xl font-bold text-[#3C2A21]">Live Screen Share</h4>
                                    <p className="text-sm text-[#6B5E51]">Interactive Zoom sessions to evaluate your mock test performance in real-time.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#3C2A21] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">02</div>
                                <div className="space-y-1">
                                    <h4 className="fd text-xl font-bold text-[#3C2A21]">Dynamic Scheduling</h4>
                                    <p className="text-sm text-[#6B5E51]">Generation of a day-by-day task protocol customized for your weaker areas.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#3C2A21] p-10 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="space-y-2">
                                <h3 className="fd text-3xl font-bold">Secure Your Bench</h3>
                                <p className="text-white/40 text-sm">Join the clinical prep program today.</p>
                            </div>
                            <ServiceCTA serviceId="gre_prep" />
                            <DiscussionSection serviceId="gre_prep" />
                        </div>

                        <div className="glass-panel p-8 space-y-6 transition-all hover:border-[#C5A059]/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                                    <MessageSquare size={20} />
                                </div>
                                <h4 className="fd text-xl font-bold text-[#3C2A21]">Counsellor Connect</h4>
                            </div>
                            <p className="text-sm text-[#3C2A21]/60 font-medium leading-relaxed">
                                Not sure if you're ready for the deep dive? Connect with a team member to legacy-check your current progress.
                            </p>
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[10px] tracking-widest uppercase hover:gap-3 transition-all"
                            >
                                Message now <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COACHING PILLARS GRID ─────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Optimization Pillars</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">The <span className="gold-shimmer">GRE Clinical Protocol</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coachingPillars.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="feature-pill p-10 space-y-6"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/10">
                                    {feat.icon}
                                </div>
                                <h3 className="fd text-2xl font-bold text-[#3C2A21]">{feat.title}</h3>
                                <p className="text-[#6B5E51] text-xs leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-16 flex flex-col items-center text-center space-y-10 relative z-10"
                >
                    <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-4">
                        <Brain size={40} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="fd text-4xl font-bold text-[#3C2A21]">Decouple from Generic Prep</h4>
                        <p className="text-[#6B5E51] text-lg font-medium italic max-w-2xl px-6">
                            Join the elite session where we architect your GRE success based on clinical mock evaluations.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto"
                    >
                        Start Prep-Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </section>

            <FAQSection />

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}