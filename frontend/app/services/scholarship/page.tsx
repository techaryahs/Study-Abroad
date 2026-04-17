"use client";

import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DiscussionSection from "@/components/shared/DiscussionSection";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Zap,
  Award,
  GraduationCap,
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const features = [
  { title: "Financial Mapping", desc: "Identification of university, state, and private-funded scholarships.", icon: <Star size={24} /> },
  { title: "Merit Positioning", desc: "Drafting narratives that highlight your academic and personal excellence.", icon: <Award size={24} /> },
  { title: "Strategic Profile", desc: "Clinical profiling to meet specific donor and departmental criteria.", icon: <Zap size={24} /> },
  { title: "Global Opportunities", desc: "Access to international fellowship and grant databases.", icon: <GraduationCap size={24} /> }
];

export default function ScholarshipHelpPage() {
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
            background: #FFFFFF;
            border: 1px solid rgba(197,160,89, 0.1);
            border-radius: 24px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
             align-items: center;
             gap: 10px;
             cursor: pointer;
          }
          .btn-gold:hover {
             background: #3C2A21;
             transform: translateY(-2px);
             box-shadow: 0 10px 20px rgba(197,160,89, 0.2);
          }
      `}</style>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative pt-6 pb-20 px-6 overflow-hidden md:px-16" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.1) 0%, transparent 100%)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="pt-10 space-y-8"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
              >
                <ArrowLeft size={14} /> Back to Services
              </Link>
              <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                Financial Opportunity Node
              </span>
            </div>
            <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
              Premium <br /> <span className="gold-shimmer lowercase">Scholarship Help</span>
            </h1>
            <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
              "Funding your education should not be a matter of luck. We turn it into a clinical strategy through merit positioning and global dataset mapping."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative pt-10"
          >
            <div className="glass-panel p-2 overflow-hidden shadow-2xl group">
              <div className="relative aspect-[4/3] w-full rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                <Image
                  src="/scholarship-hero.png"
                  alt="Elite Scholarship Advisory"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-[#C5A059]" size={20} />
                    <span className="text-[14px] font-bold text-white font-bold tracking-widest uppercase">Verified Funding Path</span>
                  </div>
                  <p className="text-white font-serif italic text-sm leading-relaxed">
                    "We have secured over ₹5Cr in total scholarship funds for our candidates. Join the elite."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ARCHITECTURE ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white overflow-hidden md:px-16 border-y border-[#F1EDEA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 items-start relative">

          {/* LEFT COLUMN: STRATEGIC NARRATIVE (3/5) */}
          <div className="lg:col-span-3 space-y-20 text-[#6B5E51]">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Funding Command</span>
                <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Strategic <br /> <span className="gold-shimmer">Capital Acquisition</span></h2>
              </div>

              <div className="space-y-6 font-medium leading-relaxed max-w-2xl text-lg">
                <p>
                  Securing a scholarship is about demonstrating value. Our Scholarship Help service focuses on clinical merit positioning, ensuring your academic gaps are addressed and your strengths are amplified.
                </p>
                <p>
                  From identifying untapped state grants to crafting compelling scholarship essays and prepping for high-stakes interviews, we provide the ultimate edge in university funding.
                </p>
                <div className="p-8 bg-[#FDFBF7] border-l-4 border-[#C5A059] italic text-xl text-[#3C2A21] fd rounded-r-2xl shadow-sm">
                  "Most students miss scholarships because they don't know they exist. We ensure you see everything."
                </div>
              </div>
            </div>

            {/* Grid Features */}
            <div className="space-y-10">
              <div className="space-y-2">
                <span className="text-[#C5A059] text-[14px] font-bold font-bold tracking-[0.2em] uppercase">Guidance Framework</span>
                <h3 className="fd text-3xl font-bold text-[#3C2A21]">Core Advisory Nodes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feat, i) => (
                  <div key={i} className="feature-pill p-8 flex flex-col gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/10">
                      {feat.icon}
                    </div>
                    <div className="space-y-2">
                      <h4 className="fd text-xl font-bold text-[#3C2A21]">{feat.title}</h4>
                      <p className="text-xs leading-relaxed font-medium opacity-70">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Consensus */}
            <div className="space-y-10 pt-10 border-t border-[#F1EDEA]">
              <div className="space-y-2">
                <span className="text-[#C5A059] text-[14px] font-bold font-bold tracking-[0.2em] uppercase tracking-widest">Public Consensus</span>
                <h3 className="fd text-3xl font-bold text-[#3C2A21]">Community Insights</h3>
              </div>
              <div className="bg-[#FDFBF7]/50 rounded-[40px] p-2 border border-[#F1EDEA]">
                <DiscussionSection serviceId="scholarship-help" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION SIDEBAR (2/5) */}
          <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-40">
            <div className="bg-[#3C2A21] p-10 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden group border border-[#C5A059]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-all duration-1000" />
              <div className="space-y-2 relative z-10">
                <h3 className="fd text-3xl font-bold">Secure Your Grant</h3>
                <p className="text-white/40 text-[14px] font-bold font-black uppercase tracking-widest">Elite Advisory Protocol.</p>
              </div>
              <div className="relative z-10 w-full">
                <AddToCart serviceId="scholarship-help" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <FAQSection />
      </div>

      <BookCounsellingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

    </main>
  );
}