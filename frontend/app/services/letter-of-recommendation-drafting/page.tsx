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
                                Third-Party Validation Audit
                            </span>
                        </div>
                        <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                            The Art of <br /> LOR Drafting
                        </h1>
                        <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
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
                        <div className="bg-white rounded-[32px] border border-[#10324a]/10 p-2 overflow-hidden shadow-[0_20px_60px_rgba(16,50,74,0.12)] group">
                            <div className="relative aspect-square w-full rounded-[28px] overflow-hidden">
                                <Image
                                    src="/lor-drafting-hero.png"
                                    alt="LOR Drafting Mastery"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/50 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Quote className="text-[#d2a14a]" size={20} />
                                        <span className="text-[14px] font-bold text-white tracking-widest uppercase">Credential Audit</span>
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
            <section className="relative z-10 py-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start glass-panel p-6 sm:p-10">

                    {/* LEFT COLUMN: STRATEGIC INSIGHTS */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="space-y-4">
                            <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Narrative Command</span>
                            <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Why LORs Are Your <br /> Most Potent Weapon</h2>
                        </div>

                        <div className="space-y-6 text-[#4b5b6a] font-medium leading-relaxed max-w-2xl text-lg">
                            <p>
                                Letters of Recommendation (LORs) undeniably hold the most importance in your application. However, most LORs are generic, wasting the only chance you had at winning the committee's clinical support.
                            </p>
                            <p>
                                Think about it: Would an admissions officer put faith in a random applicant, or rather believe a professor or industry leader they follow? It's that simple.
                            </p>
                            <div className="p-8 bg-[#f8f4ea]/60 border-l-4 border-[#d2a14a] italic text-xl text-[#10324a] fd rounded-r-2xl">
                                "Generic LORs are a load of crap. No one cares if you were 'the best student.' They care about your unique contribution logic."
                            </div>
                            <p>
                                This service includes strategic recommendations on who you should select as your confirmors, tailored specifically to your profile, target degree, and professional network.
                            </p>
                        </div>

                        {/* INTEGRATED PILLARS */}
                        <div className="space-y-8 pt-10 border-t border-[#10324a]/10">
                            <div className="space-y-2">
                                <span className="text-[#0f4c5c] text-[14px] font-bold tracking-[0.2em] uppercase">Drafting Framework</span>
                                <h3 className="fd text-3xl font-bold text-[#10324a]">Strategic LOR Pillars</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lorFeatures.map((feat, i) => (
                                    <div key={i} className="feature-pill p-6 flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d] flex-shrink-0 border border-[#10324a]/10">
                                            {feat.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="fd text-lg font-bold text-[#10324a]">{feat.title}</h4>
                                            <p className="text-[#4b5b6a] text-xs leading-relaxed font-medium">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INTEGRATED DISCUSSION */}
                        <div className="pt-10 border-t border-[#10324a]/10">
                            <DiscussionSection serviceId="letter-of-recommendation-drafting" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ACTION & SIDEBAR */}
                    <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-32">
                        <div className="bg-[#10324a] p-10 rounded-[32px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                            <div className="relative space-y-2">
                                <h3 className="fd text-3xl font-bold text-[#d2a14a]">Secure Your Admit</h3>
                                <p className="text-white/60 text-sm italic font-medium">Bespoke drafting for international standards.</p>
                            </div>
                            <div className="relative">
                                <AddToCart serviceId="lor-drafting" />
                            </div>
                        </div>

                        <div className="p-8 sm:p-10 glass-panel space-y-6">
                            <div className="flex items-center gap-4">
                                <ShieldCheck size={28} className="text-[#2ca59d]" />
                                <h4 className="fd text-2xl font-bold text-[#10324a]">Influence Audit</h4>
                            </div>
                            <p className="text-sm text-[#4b5b6a] leading-relaxed font-medium">
                                We analyze your potential recommenders to determine who provides the highest ROI for your specific target universities.
                            </p>
                        </div>

                        <div className="p-8 glass-panel space-y-6 transition-all hover:border-[#d2a14a]/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#2ca59d]/10 flex items-center justify-center text-[#2ca59d]">
                                    <MessageSquare size={20} />
                                </div>
                                <h4 className="fd text-xl font-bold text-[#10324a]">Confirmor Consult</h4>
                            </div>
                            <p className="text-xs text-[#4b5b6a] font-medium leading-relaxed">
                                Not sure who to ask? Connect with our team to map out your recommendation strategy before drafting begins.
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

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="glass-panel p-6 sm:p-10">
                    <FAQSection />
                </div>
            </div>

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="relative z-10 py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto glass-panel p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#d2a14a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative w-20 h-20 rounded-full bg-[#10324a] flex items-center justify-center text-[#d2a14a] mb-4 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
                        <PenTool size={40} />
                    </div>
                    <div className="relative space-y-4">
                        <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Stop Writing Generic LORs</h4>
                        <p className="text-[#4b5b6a] text-lg font-medium italic max-w-2xl px-6">
                            Secure the committee's faith with third-party validation that actually impacts their decision.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group w-full sm:w-auto relative"
                    >
                        Begin LOR Strategy <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="relative flex items-center gap-2 text-[14px] font-bold text-[#0f4c5c] tracking-widest uppercase opacity-60">
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