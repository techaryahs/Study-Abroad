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
                                Post-Admission Strategy
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
                            The Ultimate <br /> <span className="gold-shimmer">Decisive Choice</span>
                        </h1>
                        <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
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
                        <div className="glass-panel p-2 overflow-hidden shadow-2xl">
                            <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                                <div className="bg-[#F8F5F0] px-6 py-4 flex items-center justify-between border-b border-[#F1EDEA]">
                                    <div className="flex items-center gap-3">
                                        <Compass className="text-[#C5A059]" size={20} />
                                        <span className="text-[10px] text-[#3C2A21] font-bold tracking-widest uppercase">Decision Vault</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                                </div>
                                <div className="p-10 space-y-8 bg-[#FDFBF7]">
                                    <div className="space-y-4">
                                        <div className="p-6 bg-[#3C2A21] rounded-2xl shadow-xl">
                                            <p className="text-white font-serif italic text-sm leading-relaxed">
                                                "Securing multiple admits is a triumph; choosing the wrong one is a tragedy. We audit every metric so you don't have to guess."
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white border border-[#C5A059]/10 rounded-xl space-y-1">
                                                <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">Admits Needed</p>
                                                <p className="text-[#3C2A21] font-bold text-lg">2 to 6+</p>
                                            </div>
                                            <div className="p-4 bg-white border border-[#C5A059]/10 rounded-xl space-y-1">
                                                <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">Audit Depth</p>
                                                <p className="text-[#3C2A21] font-bold text-lg">9+ Metrics</p>
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
                            <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Importance of Choice</span>
                            <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Navigating the <br /> <span className="gold-shimmer">Admissions Crossroad</span></h2>
                        </div>
                        <div className="space-y-6 text-[#6B5E51] font-medium leading-relaxed">
                            <p>
                                securing the admits is only the halfway mark. What comes next is an extremely critical decision that will influence your future in almost every possible way.
                            </p>
                            <p>
                                Should you pick the low-ranked university which offered a scholarship, or the costlier, prestige-intensive alternative? Is the difference in tuition worth the long-term job reputation?
                            </p>
                            <div className="p-8 bg-[#FDFBF7] border-l-4 border-[#C5A059] italic text-lg text-[#3C2A21] fd">
                                "Depending on your circumstances, the right fit for you may not be the same as the right fit for someone else."
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#3C2A21] p-10 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="space-y-4">
                                <h3 className="fd text-3xl font-bold">Secure Your Choice</h3>
                                <p className="text-white/60 text-sm">Gain clarity with a detailed audit of every admit in your hand.</p>
                            </div>
                            <AddToCart serviceId="university-finalization" />
                            <DiscussionSection serviceId="university-finalization" />
                        </div>
                        <div className="p-8 glass-panel space-y-4">
                            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em]">Legacy Note</h4>
                            <p className="text-xs text-[#3C2A21]/60 leading-relaxed font-medium">
                                If you are at the start of your journey and need shortlisting, please refer to the <Link href="/services/shortlisting" className="text-[#C5A059] border-b border-[#C5A059]/20 hover:border-[#C5A059] transition-all">University Shortlisting Service</Link> instead.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AUDIT METRICS GRID ─────────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Data Intelligence</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Primary Audit <span className="gold-shimmer">Pillars</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {finalizationFactors.map((feat, i) => (
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
                                <p className="text-[#6B5E51] text-sm leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── REDESIGNED CALL TO ACTION ──────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-16 flex flex-col items-center text-center space-y-10 relative z-10"
                >
                    <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] mb-4">
                        <Zap size={40} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="fd text-4xl font-bold text-[#3C2A21]">Ready for the One Pick?</h4>
                        <p className="text-[#6B5E51] text-lg font-medium italic max-w-2xl px-6">
                            For about 0.1% of what you will be paying your university, leverage years of expertise to ensure your future is built on the right foundation.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto"
                    >
                        Begin Expert Consult <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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