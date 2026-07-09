"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    History
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function PersonalHistoryStatementPage() {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <main
            className="min-h-screen pb-16 text-[#10324a]"
            style={{
                background:
                    "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
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
                className="relative pt-10 pb-24 px-6 md:px-16"
                style={{ background: "linear-gradient(180deg, rgba(44,165,157,0.10) 0%, transparent 100%)" }}
            >
                <div className="max-w-4xl mx-auto flex flex-col gap-10 items-start">

                    {/* CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="pt-6 space-y-8"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-[#d2a14a] font-black text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase break-words">
                                <span className="gold-shimmer">Personal History <br /> Statement</span>
                            </h1>
                        </div>

                        <p className="text-lg text-[#4b5b6a] leading-relaxed italic max-w-xl font-medium">
                            The <span className="font-semibold text-[#10324a]">Personal History Statement</span> (also known as a <span className="font-semibold text-[#10324a]">Diversity Statement</span>) reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.
                        </p>

                        <div className="pt-4">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="btn-gold group"
                            >
                                Begin Narrative Consult <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <DiscussionSection serviceId="personal-history-statement" />
                    </motion.div>
                </div>
            </section>

            {/* ── ABOUT + SIDEBAR ────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-4">
                            <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">The Diversity Advantage</span>
                            <h2 className="text-3xl font-black leading-tight text-[#10324a]">About This <span className="gold-shimmer">Service</span></h2>
                        </div>

                        <div className="space-y-6 text-[#4b5b6a] leading-relaxed text-lg font-medium">
                            <p>
                                While a lot of universities are not interested in knowing about your past, a few prestigious institutions like <span className="font-semibold text-[#10324a]">The University of California</span> specifically require a Personal History Statement. Our main aim is to help you stand out by crafting a story that is unique to you and your profile.
                            </p>

                            <p>
                                It is important to focus on the <span className="font-semibold text-[#10324a] italic">social, economic, familial, financial and cultural barriers</span> that you faced during your life. We help highlight your ability to overcome challenges and turn them into strengths.
                            </p>

                            <div className="bg-[#10324a] text-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(16,50,74,0.18)] border-l-8 border-[#d2a14a]">
                                <p className="font-black text-xl italic leading-snug">
                                    "This draft, when done right, has proved to be one of the biggest game-changers, both in fetching admits and securing significant funding."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="w-full">
                            <AddToCart serviceId="history-draft" />
                        </div>

                        <div className="p-8 bg-white/80 border border-[#10324a]/10 rounded-[32px] shadow-[0_16px_50px_rgba(16,50,74,0.06)] space-y-4">
                            <h4 className="text-xs font-black text-[#d2a14a] uppercase tracking-[0.2em]">Clinical Protocol</h4>
                            <p className="text-xs text-[#4b5b6a] leading-relaxed font-medium">
                                Our narrative experts audit your diversity markers to ensure every challenge is framed as an institutional value.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            <BookCounsellingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />

        </main>
    );
}