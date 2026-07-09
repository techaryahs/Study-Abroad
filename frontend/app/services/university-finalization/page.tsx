"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    Scale,
    MapPin,
    DollarSign,
    Briefcase,
    Sun,
    Search,
    Compass,
    GraduationCap,
    ArrowRight
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const finalizationFactors = [
    { title: "Strategic Location", desc: "Proximity to industry hubs, networking circles, and long-term career prospects.", icon: <MapPin size={24} /> },
    { title: "Financial Logic", desc: "Detailed ROI analysis factoring in tuition, living costs, and available scholarships.", icon: <DollarSign size={24} /> },
    { title: "Career Velocity", desc: "Evaluation of post-grad job placement rates and corporate reputation.", icon: <Briefcase size={24} /> },
    { title: "Research Pillars", desc: "Audit of lab facilities, faculty expertise, and publication opportunities.", icon: <GraduationCap size={24} /> },
    { title: "Lifestyle & Climate", desc: "Daily living environment, social culture, and regional adaptability.", icon: <Sun size={24} /> },
    { title: "Visa Framework", desc: "STEM extension eligibility and jurisdictional visa success probabilities.", icon: <Scale size={24} /> }
];

export default function UniversityFinalizationPage() {
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
                                Post-Admission Strategy
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                            The Ultimate <br /> Decisive Choice
                        </h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "Leverage deep-tier data analytics and years of expertise to finalize the one university that perfectly aligns with your career trajectory."
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group w-full sm:w-auto justify-center"
                            >
                                Finalize My Choice <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                                        <Compass className="text-[#2ca59d]" size={20} />
                                        <span className="text-[14px] font-bold text-[#10324a] tracking-widest uppercase">Decision Vault</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-[#d2a14a] animate-pulse" />
                                </div>
                                <div className="p-10 space-y-8 bg-white">
                                    <div className="space-y-4">
                                        <div className="p-6 bg-[#10324a] rounded-2xl shadow-[0_16px_40px_rgba(16,50,74,0.15)]">
                                            <p className="text-white font-serif italic text-sm leading-relaxed">
                                                "Securing multiple admits is a triumph; choosing the wrong one is a tragedy. We audit every metric so you don't have to guess."
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-[#f8f4ea]/60 border border-[#10324a]/10 rounded-xl space-y-1">
                                                <p className="text-[14px] font-bold text-[#2ca59d] uppercase tracking-widest">Admits Needed</p>
                                                <p className="text-[#10324a] font-bold text-lg">2 to 6+</p>
                                            </div>
                                            <div className="p-4 bg-[#f8f4ea]/60 border border-[#10324a]/10 rounded-xl space-y-1">
                                                <p className="text-[14px] font-bold text-[#2ca59d] uppercase tracking-widest">Audit Depth</p>
                                                <p className="text-[#10324a] font-bold text-lg">9+ Metrics</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            "Detailed ROI Projection",
                                            "Lifestyle Intelligence",
                                            "Job-Market Alignment",
                                            "Strategic One-Pick Finalization"
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
                            <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">The Importance of Choice</span>
                            <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Navigating the <br /> Admissions Crossroad</h2>
                        </div>
                        <div className="space-y-6 text-[#4b5b6a] font-medium leading-relaxed">
                            <p>
                                securing the admits is only the halfway mark. What comes next is an extremely critical decision that will influence your future in almost every possible way.
                            </p>
                            <p>
                                Should you pick the low-ranked university which offered a scholarship, or the costlier, prestige-intensive alternative? Is the difference in tuition worth the long-term job reputation?
                            </p>
                            <div className="p-8 bg-[#f8f4ea]/60 border-l-4 border-[#d2a14a] italic text-lg text-[#10324a] fd rounded-r-2xl">
                                "Depending on your circumstances, the right fit for you may not be the same as the right fit for someone else."
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#10324a] p-10 rounded-[32px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                            <div className="relative space-y-2">
                                <h3 className="fd text-3xl font-bold text-[#d2a14a]">Secure Your Choice</h3>
                                <p className="text-white/60 text-sm">Gain clarity with a detailed audit of every admit in your hand.</p>
                            </div>
                            <div className="relative">
                                <AddToCart serviceId="university-finalization" />
                            </div>
                            <div className="relative">
                                <DiscussionSection serviceId="university-finalization" />
                            </div>
                        </div>
                        <div className="p-8 glass-panel space-y-4">
                            <h4 className="text-xs font-bold text-[#2ca59d] uppercase tracking-[0.2em]">Legacy Note</h4>
                            <p className="text-xs text-[#4b5b6a] leading-relaxed font-medium">
                                If you are at the start of your journey and need shortlisting, please refer to the <Link href="/services/shortlisting" className="text-[#2ca59d] border-b border-[#2ca59d]/30 hover:border-[#2ca59d] transition-all">University Shortlisting Service</Link> instead.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AUDIT METRICS GRID ─────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Data Intelligence</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Primary Audit Pillars</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {finalizationFactors.map((feat, i) => (
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
                                <p className="text-[#4b5b6a] text-sm leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── REDESIGNED CALL TO ACTION ──────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#d2a14a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative w-20 h-20 rounded-full bg-[#10324a] flex items-center justify-center text-[#d2a14a] mb-4 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
                        <Zap size={40} />
                    </div>
                    <div className="relative space-y-4">
                        <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Ready for the One Pick?</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic max-w-2xl px-6">
                            For about 0.1% of what you will be paying your university, leverage years of expertise to ensure your future is built on the right foundation.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto relative"
                    >
                        Begin Expert Consult <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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