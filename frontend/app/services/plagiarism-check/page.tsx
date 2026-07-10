"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ShieldCheck,
    Zap,
    Search,
    FileSearch,
    Star,
    ArrowRight,
    Play,
    Activity,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import ServiceCTA from "@/components/shared/ServiceCTA";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const processSteps = [
    { title: "Acquisition", desc: "Purchase the service and receive an automated verification protocol email." },
    { title: "Draft Submission", desc: "Send your SOP, LOR, or Research Paper for instructor-level analysis." },
    { title: "Surgical Audit", desc: "We deploy Turnitin-grade logic to identify plagiarism percentage and sources." },
    { title: "Full Clearance", desc: "Receive your comprehensive report with actionable fixed-grammar options." }
];

export default function PlagiarismCheckPage() {
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
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
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
                                Academic Integrity Protocol
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
                            Precision <br /> <span className="gold-shimmer">Plagiarism Check</span>
                        </h1>
                        <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                            "Undisputedly, plagiarism is the greatest single cause of institutional rejection. We deploy Turnitin-grade logic to secure your future."
                        </p>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group"
                            >
                                Start Integrity Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                                        <FileSearch className="text-[#C5A059]" size={20} />
                                        <span className="text-[14px] font-bold text-[#3C2A21] font-bold tracking-widest uppercase">System Status</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-bold text-[#22c55e] font-bold">LIVE AUDIT ENABLED</span>
                                        <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                                    </div>
                                </div>
                                <div className="p-10 space-y-8 bg-[#FDFBF7]">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[14px] font-bold text-[#3C2A21]/40 font-bold uppercase tracking-widest">Protocol Type</p>
                                            <p className="text-[#3C2A21] font-bold text-lg">Turnitin Instructor-Grade</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                                            <ShieldCheck size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            "SOPs & LORs",
                                            "Research Manuscripts",
                                            "Academic Assignments",
                                            "Thesis Drafts"
                                        ].map((item) => (
                                            <div key={item} className="flex items-center gap-3 text-[#3C2A21] font-medium text-sm">
                                                <CheckCircle2 size={16} className="text-[#C5A059]" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-[#3C2A21] rounded-2xl">
                                        <p className="text-white font-serif italic text-xs leading-relaxed">
                                            "Universities, journals, and top-tier recruiters utilize the same high-level logic we provide. Be certain before you submit."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#C5A059]/10 blur-3xl rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* ── SAMPLE OUTPUT VISUALIZATION ───────────────────────────────────── */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Visual Evidence</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Full-Spectrum <span className="gold-shimmer">Audit Insights</span></h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        {/* THE DOCUMENT */}
                        <div className="lg:col-span-3 glass-panel p-8 bg-white overflow-hidden">
                            <h3 className="text-xs font-bold text-[#3C2A21]/40 uppercase tracking-widest mb-6">Annotated Manuscript Sample</h3>
                            <div className="space-y-6 font-serif text-[15px] leading-relaxed text-[#555] italic">
                                <p>
                                    <span className="bg-[#FFE5E5] px-1 border-b-2 border-red-200">
                                        ...the candidate must provide comprehensive evidence of their welfare arrangements in accordance with internal protocols.
                                    </span>
                                </p>
                                <p>
                                    Health and Character Requirements: All applicants applying for this specific subclass must be of exceptional character and maintain good health as per...
                                </p>
                                <p>
                                    <span className="bg-[#E5F1FF] px-1 border-b-2 border-blue-200 uppercase font-sans font-bold text-[11px] tracking-widest text-[#3C2A21]">
                                        Empirical Verification: The Temporary Graduate Visa infrastructure allows for students to pursue part-time work alongside their core...
                                    </span>
                                </p>
                                <p>
                                    <span className="bg-[#FFE5E5] px-1 border-b-2 border-red-200">
                                        In the present global situation, the authorities are welcoming to grant specific clearances to students who meet the following...
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* MATCH OVERVIEW */}
                        <div className="lg:col-span-2 glass-panel overflow-hidden border-none shadow-xl">
                            <div className="bg-[#3C2A21] px-6 py-4 flex items-center justify-between">
                                <span className="text-white text-[14px] font-bold font-bold tracking-widest uppercase">Match Overview</span>
                                <AlertCircle size={14} className="text-[#C5A059]" />
                            </div>
                            <div className="p-8 space-y-8 bg-[#FDFBF7]">
                                <div className="text-center space-y-1">
                                    <div className="text-5xl font-black text-[#C5A059]">76%</div>
                                    <p className="text-[14px] font-bold text-[#3C2A21]/40 font-bold uppercase tracking-widest">Similarity Index</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { s: "www.immigrationworld.com", p: "46%", c: "text-[rgba(197,160,89,1)]" },
                                        { s: "www.aussizzgroup.com", p: "18%", c: "text-red-400" },
                                        { s: "students.unimelb.edu.au", p: "5%", c: "text-blue-400" },
                                        { s: "admitcard.com", p: "2%", c: "" },
                                        { s: "blueskyconsultants.com", p: "2%", c: "" }
                                    ].map((match, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs border-b border-[#F1EDEA] pb-3">
                                            <span className={`font-semibold truncate max-w-[180px] ${match.c || "text-[#3C2A21]"}`}>{i + 1} {match.s}</span>
                                            <span className="font-bold text-[#C5A059]">{match.p}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 text-[14px] font-bold font-bold uppercase tracking-widest text-white bg-[#3C2A21] rounded-xl hover:bg-[#C5A059] transition-colors">
                                    Request Plagiarism Removal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Intelligence</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Unrivaled <span className="gold-shimmer">Detection Logic</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Similarity Mapping", desc: "Identify exact percentage indices and specific parts of text arising from external sources.", icon: <Activity size={24} /> },
                            { title: "Source Verification", desc: "Surgical detailing of original sources, linking your text directly to its origin for quick fixing.", icon: <ArrowRight size={24} /> },
                            { title: "Instructor-Level Tech", desc: "We utilize Turnitin Instructor-level software, the same standard used by universities and journals.", icon: <ShieldCheck size={24} /> }
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="feature-pill p-10 space-y-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] flex items-center justify-center text-[#C5A059]">
                                    {feat.icon}
                                </div>
                                <h3 className="fd text-2xl font-bold text-[#3C2A21]">{feat.title}</h3>
                                <p className="text-[#6B5E51] text-sm leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW SECTION ────────────────────────────────────────────────── */}
            <section className="py-20 px-6" style={{ background: "linear-gradient(rgba(197,160,89, 0.05), transparent)" }}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Protocol</span>
                            <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Strategic <br /> <span className="gold-shimmer">Clearance Path</span></h2>
                        </div>

                        <div className="space-y-8">
                            {processSteps.map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <span className="text-4xl font-bold text-[#C5A059]/20 group-hover:text-[#C5A059] transition-colors">0{i + 1}</span>
                                    <div className="space-y-2">
                                        <h4 className="fd text-xl font-bold text-[#3C2A21]">{item.title}</h4>
                                        <p className="text-[#6B5E51] text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#3C2A21] p-10 rounded-[32px] text-white space-y-6 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <Zap className="text-[#C5A059]" size={28} />
                                <h3 className="fd text-2xl font-bold">Secure Your Bench</h3>
                            </div>
                            <ServiceCTA serviceId="ai_humanizer" />
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto bg-white border border-[#C5A059]/20 rounded-[48px] p-16 flex flex-col items-center text-center space-y-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-3xl rounded-full -mr-32 -mt-32" />

                    <div className="space-y-4">
                        <h4 className="fd text-4xl font-bold text-[#3C2A21]">Ready for Institutional Verification?</h4>
                        <p className="text-[#6B5E51] text-lg font-medium italic">Ensure your academic future with the gold standard of integrity auditing.</p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group"
                    >
                        Start Integrity Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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