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
            background: #FFFFFF;
            border: 1px solid rgba(16,50,74,0.1);
            border-radius: 24px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
             align-items: center;
             gap: 10px;
             cursor: pointer;
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
      <section className="relative z-10 pt-10 pb-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start glass-panel p-6 sm:p-10">
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
              <span className="inline-block px-5 py-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 text-[#0f4c5c] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                Financial Opportunity Node
              </span>
            </div>
            <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
              Premium <br /> Scholarship Help
            </h1>
            <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
              "Funding your education should not be a matter of luck. We turn it into a clinical strategy through merit positioning and global dataset mapping."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-white rounded-[32px] border border-[#10324a]/10 p-2 overflow-hidden shadow-[0_20px_60px_rgba(16,50,74,0.12)] group">
              <div className="relative aspect-[4/3] w-full rounded-[28px] overflow-hidden">
                <Image
                  src="/scholarship-hero.png"
                  alt="Elite Scholarship Advisory"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-[#d2a14a]" size={20} />
                    <span className="text-[14px] font-bold text-white tracking-widest uppercase">Verified Funding Path</span>
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
      <section className="relative z-10 py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start glass-panel p-6 sm:p-10">

          {/* LEFT COLUMN: STRATEGIC NARRATIVE (3/5) */}
          <div className="lg:col-span-3 space-y-16 text-[#4b5b6a]">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Funding Command</span>
                <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Strategic <br /> Capital Acquisition</h2>
              </div>

              <div className="space-y-6 font-medium leading-relaxed max-w-2xl text-lg">
                <p>
                  Securing a scholarship is about demonstrating value. Our Scholarship Help service focuses on clinical merit positioning, ensuring your academic gaps are addressed and your strengths are amplified.
                </p>
                <p>
                  From identifying untapped state grants to crafting compelling scholarship essays and prepping for high-stakes interviews, we provide the ultimate edge in university funding.
                </p>
                <div className="p-8 bg-[#f8f4ea]/60 border-l-4 border-[#d2a14a] italic text-xl text-[#10324a] fd rounded-r-2xl shadow-sm">
                  "Most students miss scholarships because they don't know they exist. We ensure you see everything."
                </div>
              </div>
            </div>

            {/* Grid Features */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[#0f4c5c] text-[14px] font-bold tracking-[0.2em] uppercase">Guidance Framework</span>
                <h3 className="fd text-3xl font-bold text-[#10324a]">Core Advisory Nodes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feat, i) => (
                  <div key={i} className="feature-pill p-8 flex flex-col gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d] border border-[#10324a]/10">
                      {feat.icon}
                    </div>
                    <div className="space-y-2">
                      <h4 className="fd text-xl font-bold text-[#10324a]">{feat.title}</h4>
                      <p className="text-xs leading-relaxed font-medium opacity-70">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Consensus */}
            <div className="space-y-8 pt-10 border-t border-[#10324a]/10">
              <div className="space-y-2">
                <span className="text-[#0f4c5c] text-[14px] font-bold tracking-[0.2em] uppercase">Public Consensus</span>
                <h3 className="fd text-3xl font-bold text-[#10324a]">Community Insights</h3>
              </div>
              <div className="bg-[#f8f4ea]/40 rounded-[32px] p-2 border border-[#10324a]/10">
                <DiscussionSection serviceId="scholarship-help" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION SIDEBAR (2/5) */}
          <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-40">
            <div className="bg-[#10324a] p-10 rounded-[32px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
              <div className="space-y-2 relative z-10">
                <h3 className="fd text-3xl font-bold text-[#d2a14a]">Secure Your Grant</h3>
                <p className="text-white/60 text-[14px] font-black uppercase tracking-widest">Elite Advisory Protocol.</p>
              </div>
              <div className="relative z-10 w-full">
                <AddToCart serviceId="scholarship-help" />
              </div>
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