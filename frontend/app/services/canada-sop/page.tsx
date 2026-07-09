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
        <main className="min-h-screen pb-16 bg-[#FDFBF7] text-[#3C2A21]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

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
                   align-items: center;
                   gap: 10px;
                }
                .btn-gold:hover {
                   background: #3C2A21;
                   transform: translateY(-2px);
                }
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative pt-10 pb-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.1) 0%, transparent 100%)" }}>
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
                                className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                            >
                                <ArrowLeft size={14} /> Back to Services
                            </Link>
                            <h1 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#3C2A21] uppercase break-words">
                                Canada Visa SOP / <br /> <span className="gold-shimmer">Letter of Explanation</span>
                            </h1>
                        </div>

                        <p className="text-lg text-[#6B5E51] leading-relaxed italic max-w-xl font-medium">
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
            <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-4">
                            <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Canadian Study Permit</span>
                            <h2 className="fd text-3xl font-bold leading-tight text-[#3C2A21]">About This <span className="gold-shimmer">Service</span></h2>
                        </div>

                        <div className="space-y-6 text-[#6B5E51] leading-relaxed text-lg font-medium">
                            <p>
                                Applying for a Canadian Study Permit requires a highly specific approach. The <span className="font-semibold text-[#3C2A21]">Statement of Purpose (SOP)</span>, often referred to as a <span className="font-semibold text-[#3C2A21]">Letter of Explanation (LOE)</span>, is arguably the most critical component of your visa application.
                            </p>

                            <p>
                                Unlike university admissions SOPs, a Canada Visa SOP must explicitly address the immigration officer's concerns: your ties to your home country, financial stability, study plan coherence, and the precise reasons for choosing Canada over your home country.
                            </p>

                            <div className="bg-[#3C2A21] text-white p-8 rounded-3xl shadow-xl border-l-8 border-[#C5A059]">
                                <p className="font-bold fd text-xl italic leading-snug">
                                    "A generic SOP is the leading cause of Canadian visa refusals. A meticulously drafted LOE turns potential red flags into a compelling narrative of intent."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="w-full">
                            {/* <AddToCart serviceId="canada-sop" /> */}
                        </div>

                        <div className="p-8 bg-white border border-[#C5A059]/10 rounded-[32px] shadow-lg space-y-4">
                            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.2em]">IRCC Protocol</h4>
                            <p className="text-xs text-[#3C2A21]/60 leading-relaxed font-medium">
                                Our experts structure your LOE strictly adhering to IRCC guidelines, addressing common refusal reasons (like Section 216(1)) proactively.
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
