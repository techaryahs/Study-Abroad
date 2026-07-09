"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function CanadaSOPPage() {
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
                   align-items: center;
                   gap: 10px;
                }
                .btn-gold:hover {
                   background: #10324a;
                   color: white;
                   transform: translateY(-2px);
                }
            `}</style>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
                <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
            </div>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative z-10 pt-10 pb-12 px-6 md:px-16">
                <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-10">

                    {/* CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-[#2ca59d] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <h1 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A] uppercase break-words">
                                Canada Visa SOP / <br /> Letter of Explanation
                            </h1>
                        </div>

                        <p className="text-lg text-[#4b5b6a] leading-relaxed italic max-w-xl font-medium">
                            Over 1000 students have been issued study permits with us. With our expertise in the most common reasons for rejection, we can help you ensure success.
                        </p>

                        <div className="pt-4">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold shadow-2xl group"
                            >
                                Begin Narrative Consult <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <DiscussionSection serviceId="canada-sop" />
                    </motion.div>
                </div>
            </section>

            {/* ── ABOUT + SIDEBAR ────────────────────────────────────────────────── */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start glass-panel p-6 sm:p-10">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-3">
                            <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Canadian Study Permit</span>
                            <h2 className="fd text-2xl sm:text-3xl font-bold leading-tight text-[#D4A54A]">About This Service</h2>
                        </div>

                        <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg font-medium">
                            <p>
                                Applying for a Canadian Study Permit requires a highly specific approach. The <span className="font-black text-[#10324a]">Statement of Purpose (SOP)</span>, often referred to as a <span className="font-black text-[#10324a]">Letter of Explanation (LOE)</span>, is arguably the most critical component of your visa application.
                            </p>

                            <p>
                                Unlike university admissions SOPs, a Canada Visa SOP must explicitly address the immigration officer's concerns: your ties to your home country, financial stability, study plan coherence, and the precise reasons for choosing Canada over your home country.
                            </p>

                            <div className="rounded-[24px] border border-white/10 bg-[#10324a] p-8 text-white shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.12),transparent_60%)]" />
                                <p className="relative font-bold fd text-xl italic leading-snug text-[#f8f4ea]">
                                    "A generic SOP is the leading cause of Canadian visa refusals. A meticulously drafted LOE turns potential red flags into a compelling narrative of intent."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="w-full">
                            <AddToCart serviceId="canada-sop" />
                        </div>

                        <div className="p-6 sm:p-8 bg-white/80 border border-[#10324a]/10 rounded-[24px] shadow-[0_12px_35px_rgba(16,50,74,0.05)] space-y-3">
                            <h4 className="text-xs font-black text-[#2ca59d] uppercase tracking-[0.2em]">IRCC Protocol</h4>
                            <p className="text-xs text-[#4b5b6a] leading-relaxed font-medium">
                                Our experts structure your LOE strictly adhering to IRCC guidelines, addressing common refusal reasons (like Section 216(1)) proactively.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-16">
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