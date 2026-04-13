"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Globe,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Search,
  CheckCircle2,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DiscussionSection from "@/components/shared/DiscussionSection";
import FAQSection from "@/components/shared/FAQSection";

export default function UniPredictPage() {
  const [percentage, setPercentage] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [country, setCountry] = useState("USA");
  const [degree, setDegree] = useState("Master's");
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!percentage && !cgpa) return;
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#675F5B] font-base selection:bg-[#D4A848]/20 relative overflow-hidden">
      
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          .fd { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-20 pb-32 px-8 md:px-20 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">AI-Engineered Predictions</span>
              <h1 className="fd text-4xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] uppercase">
                Uni<span className="text-[#D4A848]">Predict</span> <br /> 2.0
              </h1>
            </div>
            <p className="text-[#6B5E51] text-lg font-medium leading-relaxed max-w-xl">
              Identify your admission probability with clinical precision. Our engine maps your profile against 50,000+ historical admission data points.
            </p>
            
            {/* Tool Card */}
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-[#D4A848]/10 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/5 rounded-bl-full -z-10" />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]">Avg. Percentage (%)</label>
                    <input 
                      type="number" 
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full bg-[#FDFBF7] border border-[#D4A848]/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#D4A848] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]">Undergrad CGPA</label>
                    <input 
                      type="number" 
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.5"
                      className="w-full bg-[#FDFBF7] border border-[#D4A848]/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#D4A848] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]">Target Country</label>
                    <select 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#D4A848]/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#D4A848] transition-all"
                    >
                      <option>USA</option>
                      <option>Germany</option>
                      <option>Canada</option>
                      <option>UK</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]">Degree Type</label>
                    <select 
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#D4A848]/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#D4A848] transition-all"
                    >
                      <option>Bachelor's</option>
                      <option>Master's</option>
                      <option>PhD</option>
                    </select>
                  </div>
               </div>

               <button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-[#3C2A21] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#D4A848] transition-all shadow-xl disabled:opacity-50"
               >
                 {isCalculating ? "Calculating Odds..." : "Run Analysis →"}
               </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl border-2 border-white">
              <Image 
                src="/unipredict-hero.png" 
                alt="AI Analysis" 
                fill 
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ & DISCUSSION ── */}
      <FAQSection />

      <section className="py-24 px-8 md:px-20 bg-white border-t border-[#F1EDEA]">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-4">
                <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Community</span>
                <h2 className="fd text-4xl md:text-5xl font-bold text-[#3C2A21]">Public Consensus</h2>
            </div>
            <div className="bg-[#FDFBF7]/50 rounded-[40px] p-2 border border-[#F1EDEA]">
              <DiscussionSection serviceId="unipredict" />
            </div>
        </div>
      </section>

      {/* ── RESULT MODAL ── */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
              className="absolute inset-0 bg-[#3C2A21]/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden relative shadow-2xl p-10 md:p-14 text-center space-y-10 border border-[#D4A848]/20"
            >
              <div className="w-24 h-24 rounded-full bg-[#D4A848]/20 flex items-center justify-center text-[#D4A848] mx-auto animate-pulse">
                <Sparkles size={48} />
              </div>
              <div className="space-y-3">
                <h3 className="fd text-4xl font-bold text-[#3C2A21]">Analysis Complete</h3>
                <p className="text-[#6B5E51] font-medium">Your profile shows high resonance with top-tier institutions.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#D4A848]/10 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]/60">Success Odds</span>
                  <p className="text-4xl font-black text-[#3C2A21]">84<span className="text-xl">%</span></p>
                </div>
                <div className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#D4A848]/10 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4A848]/60">Tier Level</span>
                  <p className="text-4xl font-black text-[#D4A848]">A+</p>
                </div>
              </div>

              <div className="p-8 bg-[#3C2A21] rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-bl-full" />
                <div className="text-left space-y-1 relative z-10">
                  <h4 className="font-bold text-lg">Next Strategic Step</h4>
                  <p className="text-white/50 text-[11px] font-medium tracking-wide uppercase">Consult with a profile architect.</p>
                </div>
                {/* Result box instructions usually lead to discussion too */}
                <div className="relative z-10">
                   <p className="text-white/40 text-[9px] uppercase tracking-widest font-black">Scroll to Discussion Below</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
