"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    FileText,
    Layout,
    Briefcase,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Eye,
    Maximize2
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const resumeFeatures = [
    { title: "Concise Architecture", desc: "Scientific one-page formatting optimized for the 10-second recruiter audit.", icon: <Layout size={24} /> },
    { title: "ATS Optimization", desc: "Strategic keyword integration to bypass automated screening filters.", icon: <ShieldCheck size={24} /> },
    { title: "Impact Quantification", desc: "Transforming job duties into measurable achievements to demonstrate value.", icon: <TrendingUp size={24} /> },
    { title: "International Standards", desc: "Formatting protocols tailored for US, UK, EU, and Australian institutions.", icon: <Briefcase size={24} /> }
];

export default function ResumeDraftingPage() {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <main
            className="min-h-screen pb-16"
            style={{
                background:
                    "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
                color: "#10324a",
            }}
        >

            <style>{`
                .gold-shimmer {
                  background: linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a);
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
                  background: rgba(255,255,255,0.85);
                  border: 1px solid rgba(16,50,74,0.10);
                  border-radius: 32px;
                  box-shadow: 0 30px 90px rgba(16,50,74,0.08);
                }

                .feature-pill {
                  background: rgba(255,255,255,0.7);
                  border: 1px solid rgba(16,50,74,0.10);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .feature-pill:hover {
                  border-color: rgba(210,161,74,0.5);
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(16,50,74,0.08);
                }

                .btn-gold {
                   background: #d2a14a;
                   color: #10324a;
                   padding: 18px 30px;
                   border-radius: 18px;
                   font-weight: 800;
                   text-transform: uppercase;
                   letter-spacing: 0.1em;
                   font-size: 11px;
                   transition: all 0.3s ease;
                   display: inline-flex;
                   align-items: center;
                   gap: 10px;
                   box-shadow: 0 16px 40px rgba(210,161,74,0.28);
                }
                .btn-gold:hover {
                   background: #10324a;
                   color: #fff;
                   transform: translateY(-2px);
                   box-shadow: 0 16px 40px rgba(16,50,74,0.2);
                }
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section
                className="relative pt-10 pb-24 px-6 overflow-hidden"
                style={{ background: "linear-gradient(180deg, rgba(44,165,157,0.10) 0%, transparent 100%)" }}
            >
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
                                className="inline-flex items-center gap-2 text-[#d2a14a] font-black text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[11px] tracking-[0.2em] uppercase w-fit">
                                Professional Identity Forge
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-7xl font-black uppercase leading-[0.95] break-words">
    <span className="gold-shimmer">Bespoke <br /> Resume Drafting</span>
</h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "Recruiters look at a resume for less than 10 seconds. We architect your professional profile to bridge the gap between application and interview."
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold group w-full sm:w-auto justify-center"
                            >
                                Begin Draft Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="glass-panel p-2 overflow-hidden">
                            <div className="bg-white rounded-[28px] overflow-hidden border border-[#10324a]/8">
                                <div className="bg-[#f7fbfd] px-6 py-4 flex items-center justify-between border-b border-[#10324a]/8">
                                    <div className="flex items-center gap-3">
                                        <Eye className="text-[#d2a14a]" size={18} />
                                        <span className="text-[14px] font-black text-[#10324a] tracking-widest uppercase">Visual Proof</span>
                                    </div>
                                    <Maximize2 className="text-[#d2a14a]/40" size={14} />
                                </div>
                                <div className="p-4 bg-white">
                                    <Image
                                        src="/sample-resume.avif"
                                        alt="Sample Resume"
                                        width={400}
                                        height={500}
                                        className="w-full h-auto rounded-xl hover:scale-[1.02] transition-transform duration-700 cursor-zoom-in"
                                    />
                                </div>
                                <div className="p-6 bg-[#10324a] text-white flex gap-4 items-center">
                                    <div className="p-3 bg-[#d2a14a]/20 rounded-xl text-[#d2a14a]">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black tracking-wide">+18% Success Factor</p>
                                        <p className="text-[12px] font-black text-white/50 uppercase tracking-widest">Admits & Scholarships ROI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── OVERVIEW SECTION ───────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white/40 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Strategic Architecture</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-[#10324a]">The Science of the <span className="gold-shimmer">Subject-Matter Expert</span></h2>
                        </div>
                        <div className="space-y-6 text-[#4b5b6a] font-medium leading-relaxed">
                            <p>
                                While your SOP tells your story, your resume proves your value. It must be an eye-catching, one-page surgical instrument that communicates your professional impact in seconds.
                            </p>
                            <p>
                                We specialize in transforming generic lists of duties into high-impact achievement narratives. Our expert drafts are optimized for international standards, ensuring you resonate with admission committees and corporate recruiters alike.
                            </p>
                            <div className="p-8 bg-white/70 border-l-4 border-[#d2a14a] italic text-lg text-[#10324a] rounded-r-2xl shadow-sm">
                                "Our conciseness, organization, and pertinence sets you apart from any other applicant you compete with."
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#10324a] p-10 rounded-[40px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d2a14a]/15 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black">Forge Your Profile</h3>
                                <p className="text-white/50 text-sm">Elevate your professional identity today.</p>
                            </div>
                            <AddToCart serviceId="resume-drafting" />
                            <DiscussionSection serviceId="resume-drafting" />
                        </div>

                        <div className="p-8 glass-panel space-y-4">
                            <h4 className="text-xs font-black text-[#d2a14a] uppercase tracking-[0.2em]">Clinical Audit</h4>
                            <p className="text-xs text-[#4b5b6a] leading-relaxed font-medium">
                                Every resume we draft undergoes a rigorous quality protocol, ensuring that every word serves a strategic purpose in your admission or employment journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Elite Protocols</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-[#10324a]">Strategic <span className="gold-shimmer">Drafting Pillars</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resumeFeatures.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="feature-pill p-10 space-y-6"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2ca59d]/15 to-[#d2a14a]/15 flex items-center justify-center text-[#10324a]">
                                    {feat.icon}
                                </div>
                                <h3 className="text-2xl font-black text-[#10324a]">{feat.title}</h3>
                                <p className="text-[#4b5b6a] text-xs leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white/40 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#10324a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-16 flex flex-col items-center text-center space-y-10 relative z-10"
                >
                    <div className="w-20 h-20 rounded-full bg-[#d2a14a]/10 flex items-center justify-center text-[#d2a14a] mb-4">
                        <FileText size={40} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-4xl font-black text-[#10324a]">Ready for a Stellar Draft?</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic max-w-2xl px-6">
                            Invest in a tool that secures more than just attention—it secures your future at the world's most prestigious institutions.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold group w-full sm:w-auto"
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