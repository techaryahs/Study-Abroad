"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function PersonalHistoryStatementPage() {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(44,165,157,0.16),_transparent_30%),linear-gradient(135deg,_#f8f4ea_0%,_#fcfbf7_100%)] pb-16 text-[#10324a] selection:bg-[#d2a14a]/20">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
                <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 sm:px-8 lg:px-12">

                {/* ── HERO SECTION ────────────────────────────────────────────────── */}
                <section className="rounded-[36px] border border-[#10324a]/10 bg-white/80 p-6 shadow-[0_30px_90px_rgba(16,50,74,0.08)] backdrop-blur-xl sm:p-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl space-y-6"
                    >
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-[#2ca59d] font-black text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Services
                        </Link>

                        <div className="inline-flex items-center gap-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-[#0f4c5c]">
                            <Sparkles size={14} /> Diversity Advantage
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black leading-[0.98] tracking-[-0.03em] text-[#D4A54A] uppercase">
                            Personal History<br />Statement
                        </h1>

                        <p className="max-w-xl text-lg leading-8 text-[#4b5b6a] font-medium">
                            The <span className="font-black text-[#10324a]">Personal History Statement</span> (also known as a <span className="font-black text-[#10324a]">Diversity Statement</span>) reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.
                        </p>

                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#d2a14a] px-7 py-3 text-sm font-black uppercase tracking-[0.24em] text-[#16364b] shadow-[0_16px_40px_rgba(210,161,74,0.28)] transition-all hover:-translate-y-1 active:scale-95 group"
                        >
                            Begin Narrative Consult
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <DiscussionSection serviceId="personal-history-statement" />
                    </motion.div>
                </section>

                {/* ── ABOUT + SIDEBAR ─────────────────────────────────────────────── */}
                <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 rounded-[32px] border border-[#10324a]/10 bg-white/80 p-6 sm:p-10 shadow-[0_16px_50px_rgba(16,50,74,0.06)] space-y-8">
                        <div className="space-y-3">
                            <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.32em] uppercase">The Diversity Advantage</span>
                            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-[#10324a]">
                                About This <span className="text-[#d2a14a]">Service</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg font-medium">
                            <p>
                                While a lot of universities are not interested in knowing about your past, a few prestigious institutions like <span className="font-black text-[#10324a]">The University of California</span> specifically require a Personal History Statement. Our main aim is to help you stand out by crafting a story that is unique to you and your profile.
                            </p>

                            <p>
                                It is important to focus on the <span className="font-black text-[#10324a] italic">social, economic, familial, financial and cultural barriers</span> that you faced during your life. We help highlight your ability to overcome challenges and turn them into strengths.
                            </p>

                            <div className="rounded-[24px] border border-white/10 bg-[#10324a] p-8 text-white shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.12),transparent_60%)]" />
                                <p className="relative font-black text-xl italic leading-snug text-[#f8f4ea]">
                                    "This draft, when done right, has proved to be one of the biggest game-changers, both in fetching admits and securing significant funding."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="w-full">
                            <AddToCart serviceId="history-draft" />
                        </div>

                        <div className="rounded-[24px] border border-[#10324a]/10 bg-white/80 p-6 sm:p-8 shadow-[0_12px_35px_rgba(16,50,74,0.05)] space-y-3">
                            <div className="inline-flex items-center gap-2 text-[#2ca59d]">
                                <ShieldCheck size={16} />
                                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Clinical Protocol</h4>
                            </div>
                            <p className="text-xs text-[#4b5b6a] leading-relaxed font-medium">
                                Our narrative experts audit your diversity markers to ensure every challenge is framed as an institutional value.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="relative z-10 mt-14">
                <FAQSection />
            </div>

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}