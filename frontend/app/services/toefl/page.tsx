"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle,
    Zap,
    ShieldCheck,
    Star,
    ArrowRight,
    BookOpen,
    Trophy,
    Target,
    Activity
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const consultationSteps = [
    { title: "Mock Evaluation", desc: "Begin with a comprehensive mock test to establish your baseline protocol." },
    { title: "Deep-Dive Audit", desc: "A precision call with screen share to evaluate specific linguistic friction points." },
    { title: "Dynamic Architecture", desc: "Deployment of a bespoke preparation plan or focused coaching sessions." }
];

const scores = [
    { label: "Reading", val: "29/30" },
    { label: "Listening", val: "30/30" },
    { label: "Speaking", val: "30/30" },
    { label: "Writing", val: "30/30" }
];

export default function ToeflHelpPage() {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <main
            className="relative min-h-screen overflow-hidden pb-32 text-[#10324a]"
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
                                Linguistic Excellence Protocol
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                            Bespoke <br /> TOEFL Coaching
                        </h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "Gateways to financial aid and assistantships open for those who master the 110+ threshold. Learn from a 119/120 mentor."
                        </p>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group"
                            >
                                Begin Coaching <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                                <div className="bg-[#f8f4ea] px-6 py-4 flex items-center justify-between border-b border-[#10324a]/10">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="text-[#2ca59d]" size={20} />
                                        <span className="text-[14px] font-bold text-[#10324a] tracking-widest uppercase">Benchmark Scorecard</span>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse" />
                                </div>
                                <div className="p-10 space-y-8 bg-white">
                                    <div className="text-center space-y-2">
                                        <span className="text-[14px] font-bold text-[#2ca59d] tracking-[0.2em] uppercase">Mentor Score</span>
                                        <div className="fd text-6xl font-bold text-[#D4A54A]">119<span className="text-2xl text-[#10324a]/20">/120</span></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {scores.map((s) => (
                                            <div key={s.label} className="bg-[#f8f4ea]/60 p-4 rounded-2xl border border-[#10324a]/10 flex justify-between items-center">
                                                <span className="text-[14px] font-bold text-[#10324a]/40 uppercase tracking-widest">{s.label}</span>
                                                <span className="text-[#2ca59d] font-black text-xs">{s.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-[#10324a] rounded-2xl space-y-2">
                                        <p className="text-white/60 text-[14px] font-bold uppercase tracking-[0.2em]">Strategy Insight</p>
                                        <p className="text-white font-serif italic text-xs leading-relaxed">
                                            "We target high-yield weaknesses through surgical mock evaluation, ensuring 110+ result within 15 days of prep."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d2a14a]/10 blur-3xl rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Methodology</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Precision Prep-Architecture</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Rapid Calibration", desc: "Evaluate your status and deploy a custom 2-to-15 day high-intensity roadmap.", icon: <Target size={24} /> },
                            { title: "Material Intelligence", desc: "Access the most optimal resources tailored to your specific friction points.", icon: <BookOpen size={24} /> },
                            { title: "Avoid Ramifications", desc: "Ensure entry into top-tier programs without the burden of remedial English courses.", icon: <ShieldCheck size={24} /> }
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="feature-pill p-8 space-y-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d]">
                                    {feat.icon}
                                </div>
                                <h3 className="fd text-2xl font-bold text-[#10324a]">{feat.title}</h3>
                                <p className="text-[#4b5b6a] text-sm leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-[#f8f4ea]/60 border border-[#10324a]/10 rounded-[24px] p-10 text-center space-y-6 max-w-4xl mx-auto">
                        <Activity className="mx-auto text-[#2ca59d]" size={32} />
                        <h3 className="fd text-3xl font-bold italic text-[#10324a]">Institutional Grade results</h3>
                        <p className="text-[#4b5b6a] text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
                            "A top-tier TOEFL score not only guarantees admission but often serves as the deciding factor for prestigious Teaching Assistantships."
                        </p>
                    </div>
                </div>
            </section>

            {/* ── THE PROCESS ────────────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">The Workflow</span>
                                <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Pathway to <br /> 110+ Benchmarking</h2>
                            </div>

                            <div className="space-y-8">
                                {consultationSteps.map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <span className="text-4xl font-bold text-[#d2a14a]/25 group-hover:text-[#d2a14a] transition-colors">0{i + 1}</span>
                                        <div className="space-y-2">
                                            <h4 className="fd text-xl font-bold text-[#10324a]">{item.title}</h4>
                                            <p className="text-[#4b5b6a] text-sm font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative pt-10 lg:pt-0">
                            <div className="rounded-[32px] p-10 sm:p-12 bg-[#10324a] text-white border border-white/10 space-y-10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                                <div className="relative flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#d2a14a] flex items-center justify-center text-[#16364b]">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="fd text-2xl font-bold text-[#d2a14a]">Secure Your Bench</h3>
                                        <p className="text-white/60 text-[14px] font-bold uppercase tracking-widest">Global Standards Applied</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <AddToCart serviceId="toefl" />
                                </div>
                                <div className="relative flex flex-col gap-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3 text-white/70 text-xs">
                                        <Star size={14} className="text-[#d2a14a]" />
                                        <span>Bespoke 1-on-1 coaching</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/70 text-xs">
                                        <Activity size={14} className="text-[#d2a14a]" />
                                        <span>Mock-Based evaluation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="glass-panel p-6 sm:p-10">
                    <FAQSection />
                </div>
            </div>

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d2a14a]/10 blur-3xl rounded-full -mr-32 -mt-32" />

                    <div className="relative space-y-4">
                        <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Ready to Secure Your Score?</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic">Discover how we can architect a 110+ strategy for your specific timeline.</p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group relative"
                    >
                        Begin Coaching Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </section>

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}