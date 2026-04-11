"use client";

import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import DiscussionSection from "@/components/shared/DiscussionSection";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Star,
  Zap,
  PenTool,
  Maximize2,
  FileText
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const sopFeatures = [
  { title: "Zero-Beta Scratch", desc: "Constructing your narrative from the ground up—no templates, no genericisms.", icon: <ShieldCheck size={24} /> },
  { title: "Iterative Strategy", desc: "Unlimited revisions to ensure the logic achieves Tier-1 institutional standards.", icon: <Zap size={24} /> },
  { title: "Institutional Logic", desc: "Tailoring every sentence to alumni expectations and specific departmental culture.", icon: <Star size={24} /> },
  { title: "Elite Craftsmanship", desc: "Drafted by Ivy League graduates who understand the psychology of admits.", icon: <PenTool size={24} /> }
];

export default function SOPPage() {
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
                Primary Manuscript Node
              </span>
            </div>
            <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
              Elite <br /> <span className="gold-shimmer lowercase">SOP Drafting</span>
            </h1>
            <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
              "Our Ivy League graduates architect every sentence from Scratch. Secure a narrative that resonates with the world's most elite admissions authorities."
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-gold shadow-2xl group w-full sm:w-auto justify-center"
              >
                Begin Manuscript Audit <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative pt-10"
          >
            <div className="glass-panel p-2 overflow-hidden shadow-2xl group">
              <div className="relative aspect-[4/3] w-full rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                <Image
                  src="/sop-hero.png"
                  alt="SOP Drafting Mastery"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-[#C5A059]" size={20} />
                    <span className="text-[10px] text-white font-bold tracking-widest uppercase">Harvard-Stanford Protocol</span>
                  </div>
                  <p className="text-white font-serif italic text-sm leading-relaxed">
                    "We don't just write essays; we engineer institutional acceptance through clinical storytelling."
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
                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Narrative Command</span>
                <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">The Master <br /> <span className="gold-shimmer">Manuscript Architecture</span></h2>
              </div>

              <div className="space-y-6 font-medium leading-relaxed max-w-2xl text-lg">
                <p>
                  A Statement of Purpose (SOP) is more than an essay; it is your intellectual fingerprint. Our Ivy League experts ensure every manuscript is synthesized from scratch, capturing your unique value proposition with surgical precision.
                </p>
                <p>
                  We translate your academic and professional trajectory into a high-resonance narrative that addresses the specific psychology of admissions committees at Tier-1 institutions.
                </p>
                <div className="p-8 bg-[#FDFBF7] border-l-4 border-[#C5A059] italic text-xl text-[#3C2A21] fd rounded-r-2xl shadow-sm">
                  "Your admit is decided in the first three paragraphs. We make them undeniable."
                </div>
              </div>
            </div>

            {/* 2. Tactical Pillars Grid */}
            <div className="space-y-10">
              <div className="space-y-2">
                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.2em] uppercase">Drafting Framework</span>
                <h3 className="fd text-3xl font-bold text-[#3C2A21]">Core Service Nodes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sopFeatures.map((feat, i) => (
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

            {/* 3. Community Consensus */}
            <div className="space-y-10 pt-10 border-t border-[#F1EDEA]">
              <div className="space-y-2">
                <span className="text-[#C5A059] text-[10px] font-bold tracking-[0.2em] uppercase tracking-widest">Public Consensus</span>
                <h3 className="fd text-3xl font-bold text-[#3C2A21]">Community Insights</h3>
              </div>
              <div className="bg-[#FDFBF7]/50 rounded-[40px] p-2 border border-[#F1EDEA]">
                <DiscussionSection serviceId="sop" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION SIDEBAR (2/5) */}
          <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-40">
            <div className="bg-[#3C2A21] p-10 rounded-[40px] text-white space-y-8 shadow-2xl relative overflow-hidden group border border-[#C5A059]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-all duration-1000" />
              <div className="space-y-2 relative z-10">
                <h3 className="fd text-3xl font-bold">Secure Your Manuscript</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Zero-Beta Scratch Protocol.</p>
              </div>
              <div className="relative z-10 w-full">
                <AddToCart serviceId="sop" />
              </div>
            </div>

            <div className="p-10 glass-panel space-y-6 relative overflow-hidden transition-all hover:bg-[#C5A059]/05 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/05 blur-2xl rounded-full group-hover:scale-150 transition-transform" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shadow-inner">
                  <Star size={24} />
                </div>
                <h4 className="fd text-2xl font-bold text-[#3C2A21]">Strategic Review</h4>
              </div>
              <p className="text-sm text-[#3C2A21]/70 leading-relaxed font-medium lowercase italic relative z-10 border-l-2 border-[#C5A059]/20 pl-6">
                "Every manuscript is unique and verified through elite-tier detection nodes."
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <FAQSection />
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white relative overflow-hidden md:px-16 border-t border-[#F1EDEA]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto glass-panel p-10 md:p-20 flex flex-col items-center text-center space-y-10 relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-[#3C2A21] flex items-center justify-center text-[#C5A059] mb-4 shadow-2xl">
            <Maximize2 size={40} />
          </div>
          <div className="space-y-4">
            <h4 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">Craft the <span className="gold-shimmer">Perfect Narrative</span></h4>
            <p className="text-[#6B5E51] text-lg font-medium italic max-w-2xl px-6">
              Secure your future with a manuscript architected by the world's most elite admissions experts.
            </p>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="btn-gold shadow-2xl group w-full sm:w-auto px-12"
          >
            Book Talent Scan <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-2 text-[10px] text-[#C5A059] font-black tracking-widest uppercase opacity-40">
            <Zap size={12} /> Ivy League Manuscript Protocol
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
