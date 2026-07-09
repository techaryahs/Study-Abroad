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
import AddToCart from "@/components/shared/AddToCart";
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
                                Academic Integrity Protocol
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                            Precision <br /> Plagiarism Check
                        </h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
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
                        <div className="bg-white rounded-[32px] border border-[#10324a]/10 p-2 overflow-hidden shadow-[0_20px_60px_rgba(16,50,74,0.12)]">
                            <div className="bg-white rounded-[28px] overflow-hidden">
                                <div className="bg-[#f8f4ea] px-6 py-4 flex items-center justify-between border-b border-[#10324a]/10">
                                    <div className="flex items-center gap-3">
                                        <FileSearch className="text-[#2ca59d]" size={20} />
                                        <span className="text-[14px] font-bold text-[#10324a] tracking-widest uppercase">System Status</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-bold text-[#22c55e]">LIVE AUDIT ENABLED</span>
                                        <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                                    </div>
                                </div>
                                <div className="p-10 space-y-8 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[14px] font-bold text-[#10324a]/40 uppercase tracking-widest">Protocol Type</p>
                                            <p className="text-[#10324a] font-bold text-lg">Turnitin Instructor-Grade</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[#2ca59d]/10 border border-[#2ca59d]/20 flex items-center justify-center text-[#2ca59d]">
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
                                            <div key={item} className="flex items-center gap-3 text-[#10324a] font-medium text-sm">
                                                <CheckCircle2 size={16} className="text-[#2ca59d]" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-[#10324a] rounded-2xl">
                                        <p className="text-white font-serif italic text-xs leading-relaxed">
                                            "Universities, journals, and top-tier recruiters utilize the same high-level logic we provide. Be certain before you submit."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#d2a14a]/10 blur-3xl rounded-full -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* ── SAMPLE OUTPUT VISUALIZATION ───────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Visual Evidence</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Full-Spectrum Audit Insights</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        {/* THE DOCUMENT */}
                        <div className="lg:col-span-3 bg-white rounded-[24px] border border-[#10324a]/10 p-8 shadow-sm overflow-hidden">
                            <h3 className="text-xs font-bold text-[#10324a]/40 uppercase tracking-widest mb-6">Annotated Manuscript Sample</h3>
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
                                    <span className="bg-[#E5F1FF] px-1 border-b-2 border-blue-200 uppercase font-sans font-bold text-[11px] tracking-widest text-[#10324a]">
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
                        <div className="lg:col-span-2 rounded-[24px] overflow-hidden border border-[#10324a]/10 shadow-sm">
                            <div className="bg-[#10324a] px-6 py-4 flex items-center justify-between">
                                <span className="text-white text-[14px] font-bold tracking-widest uppercase">Match Overview</span>
                                <AlertCircle size={14} className="text-[#d2a14a]" />
                            </div>
                            <div className="p-8 space-y-8 bg-white">
                                <div className="text-center space-y-1">
                                    <div className="text-5xl font-black text-[#D4A54A]">76%</div>
                                    <p className="text-[14px] font-bold text-[#10324a]/40 uppercase tracking-widest">Similarity Index</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { s: "www.immigrationworld.com", p: "46%", c: "text-[#d2a14a]" },
                                        { s: "www.aussizzgroup.com", p: "18%", c: "text-red-400" },
                                        { s: "students.unimelb.edu.au", p: "5%", c: "text-blue-400" },
                                        { s: "admitcard.com", p: "2%", c: "" },
                                        { s: "blueskyconsultants.com", p: "2%", c: "" }
                                    ].map((match, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs border-b border-[#10324a]/10 pb-3">
                                            <span className={`font-semibold truncate max-w-[180px] ${match.c || "text-[#10324a]"}`}>{i + 1} {match.s}</span>
                                            <span className="font-bold text-[#2ca59d]">{match.p}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 text-[14px] font-bold uppercase tracking-widest text-white bg-[#10324a] rounded-xl hover:bg-[#d2a14a] hover:text-[#16364b] transition-colors">
                                    Request Plagiarism Removal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
                    <div className="text-center space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Intelligence</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Unrivaled Detection Logic</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>
            </section>

            {/* ── WORKFLOW SECTION ────────────────────────────────────────────────── */}
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">The Protocol</span>
                            <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Strategic <br /> Clearance Path</h2>
                        </div>

                        <div className="space-y-8">
                            {processSteps.map((item, i) => (
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

                    <div className="space-y-8">
                        <div className="bg-[#10324a] p-10 rounded-[32px] text-white space-y-6 shadow-[0_20px_60px_rgba(16,50,74,0.18)] border border-white/10">
                            <div className="flex items-center gap-4">
                                <Zap className="text-[#d2a14a]" size={28} />
                                <h3 className="fd text-2xl font-bold text-[#d2a14a]">Secure Your Bench</h3>
                            </div>
                            <AddToCart serviceId="plagiarism-check" />
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
                        <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Ready for Institutional Verification?</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic">Ensure your academic future with the gold standard of integrity auditing.</p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group relative"
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