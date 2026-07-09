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
import AddToCart from "@/components/shared/AddToCart";
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
        <main
            className="relative min-h-screen overflow-hidden pb-16 text-[#10324a]"
            style={{
                background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
                fontFamily: "'DM Sans', sans-serif"
            }}
        >

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                .fd { font-family: 'Cormorant Garamond', serif; }

                .glass-panel {
                  background: rgba(255,255,255,0.8);
                  border: 1px solid rgba(16,50,74,0.1);
                  border-radius: 32px;
                  box-shadow: 0 30px 90px rgba(16,50,74,0.08);
                  backdrop-filter: blur(20px);
                }

                .feature-pill {
                  background: white;
                  border: 1px solid rgba(16,50,74,0.1);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .feature-pill:hover {
                  border-color: #d2a14a;
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(210,161,74,0.12);
                }

                .btn-gold {
                   background: #d2a14a;
                   color: #16364b;
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
                   background: #10324a;
                   color: white;
                   transform: translateY(-2px);
                   box-shadow: 0 10px 20px rgba(16,50,74,0.2);
                }
            `}</style>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
                <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
            </div>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative z-10 pt-10 pb-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start glass-panel p-6 sm:p-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 pt-6"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-[#2ca59d] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-block px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                                Quantitative & Verbal Mastery
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                            Bespoke <br /> GRE Prep-Plan
                        </h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
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
                        <div className="bg-white rounded-[32px] border border-[#10324a]/10 p-2 overflow-hidden shadow-[0_20px_60px_rgba(16,50,74,0.12)]">
                            <div className="bg-white rounded-[28px] overflow-hidden">
                                <div className="bg-[#10324a] px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="text-[#d2a14a]" size={20} />
                                        <span className="text-[14px] font-bold text-white tracking-widest uppercase">Mentor Benchmark</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#d2a14a] uppercase tracking-widest">Global Top 1%</span>
                                </div>
                                <div className="p-10 space-y-8 bg-[#f8f4ea]/40">
                                    <div className="text-center space-y-1">
                                        <p className="text-[14px] font-bold text-[#10324a]/40 uppercase tracking-widest">Certified Score</p>
                                        <h2 className="fd text-6xl font-black text-[#D4A54A]">329 <span className="text-2xl text-[#10324a]/20">/340</span></h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 border-y border-[#10324a]/10 py-6">
                                        <div className="text-center space-y-1">
                                            <p className="text-[#10324a] font-bold text-lg">161</p>
                                            <p className="text-[12px] font-black text-[#2ca59d] uppercase tracking-widest">Verbal</p>
                                        </div>
                                        <div className="text-center space-y-1 border-x border-[#10324a]/10">
                                            <p className="text-[#10324a] font-bold text-lg">168</p>
                                            <p className="text-[12px] font-black text-[#2ca59d] uppercase tracking-widest">Quant</p>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[#10324a] font-bold text-lg">4.5</p>
                                            <p className="text-[12px] font-black text-[#2ca59d] uppercase tracking-widest">AWA</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            "Personalized Day-by-Day Schedule",
                                            "High-Yield Material Curation",
                                            "Weakness-Mapping Protocol",
                                            "One-on-One Performance Review"
                                        ].map((item) => (
                                            <div key={item} className="flex items-center gap-3 text-[#10324a] font-medium text-sm">
                                                <CheckCircle2 size={16} className="text-[#2ca59d]" />
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
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start glass-panel p-6 sm:p-10">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">The Intelligence Behind the Score</span>
                            <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Breaking the <br /> GRE Score Plateau</h2>
                        </div>
                        <div className="space-y-6 text-[#4b5b6a] font-medium leading-relaxed">
                            <p>
                                Struggling to cross the 325 threshold? Most students hit a plateau because they follow generic schedules. I decoded the exam with a 329 score and have spent years helping others achieve consistent top-tier results.
                            </p>
                            <p>
                                During our clinical session, we don't just 'study'; we audit your cognitive approach to problem-solving. We build your personalized preparation architecture right in front of you.
                            </p>
                        </div>
                        <div className="space-y-8 pl-6 border-l-2 border-[#d2a14a]/30">
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#10324a] text-[#d2a14a] flex items-center justify-center font-bold text-xs flex-shrink-0">01</div>
                                <div className="space-y-1">
                                    <h4 className="fd text-xl font-bold text-[#10324a]">Live Screen Share</h4>
                                    <p className="text-sm text-[#4b5b6a]">Interactive Zoom sessions to evaluate your mock test performance in real-time.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#10324a] text-[#d2a14a] flex items-center justify-center font-bold text-xs flex-shrink-0">02</div>
                                <div className="space-y-1">
                                    <h4 className="fd text-xl font-bold text-[#10324a]">Dynamic Scheduling</h4>
                                    <p className="text-sm text-[#4b5b6a]">Generation of a day-by-day task protocol customized for your weaker areas.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#10324a] p-10 rounded-[32px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                            <div className="relative space-y-2">
                                <h3 className="fd text-3xl font-bold text-[#d2a14a]">Secure Your Bench</h3>
                                <p className="text-white/60 text-sm">Join the clinical prep program today.</p>
                            </div>
                            <div className="relative">
                                <AddToCart serviceId="gre-prep" />
                            </div>
                            <div className="relative">
                                <DiscussionSection serviceId="gre-prep" />
                            </div>
                        </div>

                        <div className="glass-panel p-8 space-y-6 transition-all hover:border-[#d2a14a]/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#2ca59d]/10 flex items-center justify-center text-[#2ca59d]">
                                    <MessageSquare size={20} />
                                </div>
                                <h4 className="fd text-xl font-bold text-[#10324a]">Counsellor Connect</h4>
                            </div>
                            <p className="text-sm text-[#4b5b6a] font-medium leading-relaxed">
                                Not sure if you're ready for the deep dive? Connect with a team member to legacy-check your current progress.
                            </p>
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="inline-flex items-center gap-2 text-[#2ca59d] font-bold text-[10px] tracking-widest uppercase hover:gap-3 transition-all"
                            >
                                Message now <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COACHING PILLARS GRID ─────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Optimization Pillars</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">The GRE Clinical Protocol</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coachingPillars.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="feature-pill p-8 space-y-6"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d] border border-[#10324a]/10">
                                    {feat.icon}
                                </div>
                                <h3 className="fd text-2xl font-bold text-[#10324a]">{feat.title}</h3>
                                <p className="text-[#4b5b6a] text-xs leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#d2a14a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative w-20 h-20 rounded-full bg-[#10324a] flex items-center justify-center text-[#d2a14a] mb-4 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
                        <Brain size={40} />
                    </div>
                    <div className="relative space-y-4">
                        <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Decouple from Generic Prep</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic max-w-2xl px-6">
                            Join the elite session where we architect your GRE success based on clinical mock evaluations.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto relative"
                    >
                        Start Prep-Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </section>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="glass-panel p-6 sm:p-10">
                    <FAQSection />
                </div>
            </div>

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}