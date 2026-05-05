"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
   ArrowLeft,
   CheckCircle,
   Zap,
   ShieldCheck,
   Star,
   ArrowRight,
   PenTool,
   Search,
   Languages,
   FileText
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

const focalElements = [
   { title: "Compelling Intro", desc: "Crafting a high-impact opening that hooks the recruiter instantly." },
   { title: "Personalized Narrative", desc: "Bespoke description of your unique interest and value proposition." },
   { title: "Skill Alignment", desc: "Strategic mapping of top-tier skills relevant to the specific position." },
   { title: "Strategic Context", desc: "Expert explanation of industry switches or career pivots if required." },
   { title: "Goal Synchronization", desc: "Aligning your professional trajectory with organizational visions." },
   { title: "Elite Call to Action", desc: "Professional closing designed to prompt immediate interview response." }
];

export default function CoverLetterPage() {
   const [showBookingModal, setShowBookingModal] = useState(false);

   return (
      <main className="min-h-screen pb-32" style={{ background: "#FDFBF7", color: "#3C2A21", fontFamily: "'DM Sans', sans-serif" }}>

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
                  background: white;
                  border: 1px solid rgba(197,160,89, 0.1);
                  border-radius: 24px;
                  transition: all 0.4s ease;
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
         <section className="relative pt-10 pb-24 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.1) 0%, transparent 100%)" }}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8 pt-6"
               >
                  <div className="flex flex-col gap-4">
                     <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                     >
                        <ArrowLeft size={14} /> Back to Services
                     </Link>
                     <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                        Strategic Career Briefing
                     </span>
                  </div>
                  <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#3C2A21] break-words">
                     Architect Your <br /> <span className="gold-shimmer">Cover Letter</span>
                  </h1>
                  <p className="text-[#000000] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                     "Beyond a summary—your cover letter is a strategic asset designed to bridge your experience with institutional vision."
                  </p>
                  <div className="flex items-center gap-6">
                     <button
                        onClick={() => setShowBookingModal(true)}
                        className="btn-gold shadow-2xl group"
                     >
                        Begin Drafting Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative"
               >
                  <div className="glass-panel p-2 overflow-hidden shadow-2xl">
                     <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                        <div className="bg-[#F8F5F0] px-6 py-4 flex items-center justify-between border-b border-[#F1EDEA]">
                           <div className="flex items-center gap-3">
                              <FileText className="text-[#C5A059]" size={20} />
                              <span className="text-[10px] text-[#3C2A21] font-bold tracking-widest uppercase">Drafting Laboratory</span>
                           </div>
                           <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse" />
                        </div>
                        <div className="p-0 bg-transparent">
                           <video
                              src="/application1.mp4"
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-[350px] object-cover"
                           />
                        </div>
                        <div className="p-10 space-y-6">
                           <div className="p-6 bg-[#3C2A21] rounded-2xl space-y-4">
                              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">The Focal Point</p>
                              <p className="text-white font-serif italic text-base leading-relaxed">
                                 "We spotlight why you are the perfect fit, transforming a standard application into a narrative of inevitability."
                              </p>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-bold text-[#C5A059] tracking-widest uppercase">
                              <span>Verified Authenticity</span>
                              <span>Plagiarism-Free</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 blur-3xl rounded-full -z-10" />
               </motion.div>
            </div>
         </section>

         {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
         <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-20">
               <div className="text-center space-y-4">
                  <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Service Architecture</span>
                  <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">Elite Drafting <span className="gold-shimmer">Protocol</span></h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {focalElements.map((feat, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="feature-pill p-10 space-y-6"
                     >
                        <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] flex items-center justify-center text-[#C5A059]">
                           <CheckCircle size={24} />
                        </div>
                        <h3 className="fd text-2xl font-bold text-[#3C2A21]">{feat.title}</h3>
                        <p className="text-[#000000] text-sm leading-relaxed font-medium">{feat.desc}</p>
                     </motion.div>
                  ))}
               </div>

               <div className="glass-panel p-10 bg-[#F8F5F0] border-none text-center space-y-6 max-w-4xl mx-auto">
                  <ShieldCheck className="mx-auto text-[#C5A059]" size={32} />
                  <h3 className="fd text-3xl font-bold italic text-[#3C2A21]">Academic & Professional Rigor</h3>
                  <p className="text-[#000000] text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
                     "Every draft is cross-verified via Turnitin Instructor-level software and Grammarly Premium, ensuring flawless syntax and 100% original content."
                  </p>
               </div>
            </div>
         </section>

         {/* ── THE PROCESS ────────────────────────────────────────────────────── */}
         <section className="py-32 px-6" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(197,160,89, 0.05) 100%)" }}>
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Workflow</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#3C2A21]">From Input to <br /> <span className="gold-shimmer">Excellence</span></h2>
                     </div>

                     <div className="space-y-8">
                        {[
                           { step: "01", title: "Strategic Inputs", desc: "Submit your core experiences via our proprietary intelligence form." },
                           { step: "02", title: "Base Architecture", desc: "We craft a foundational draft written from scratch for your primary target role." },
                           { step: "03", title: "Niche Calibration", desc: "Optionally customize your draft for specific secondary job opportunities." }

                        ].map((item, i) => (
                           <div key={i} className="flex gap-6 group">
                              <span className="text-4xl font-bold text-[#C5A059]/20 group-hover:text-[#C5A059] transition-colors">{item.step}</span>
                              <div className="space-y-2">
                                 <h4 className="fd text-xl font-bold">{item.title}</h4>
                                 <p className="text-[#000000] text-sm font-medium">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="relative pt-10 lg:pt-0">
                     <div className="glass-panel p-12 bg-[#3C2A21] text-white border-none space-y-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-[#3C2A21]">
                              <Zap size={24} />
                           </div>
                           <div>
                              <h3 className="fd text-2xl font-bold">Secure Your Draft</h3>
                              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Global Standards Applied</p>
                           </div>
                        </div>
                        <AddToCart serviceId="cover-letter" />
                        <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                           <div className="flex items-center gap-3 text-white/60 text-xs">
                              <Star size={14} className="text-[#C5A059]" />
                              <span>Bespoke writing for Tier-1 firms</span>
                           </div>
                           <div className="flex items-center gap-3 text-white/60 text-xs">
                              <Search size={14} className="text-[#C5A059]" />
                              <span>ATS-Optimized Formatting</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <FAQSection />

         {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
         <section className="py-20 px-6">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="max-w-5xl mx-auto bg-white border border-[#C5A059]/20 rounded-[48px] p-16 flex flex-col items-center text-center space-y-10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-3xl rounded-full -mr-32 -mt-32" />

               <div className="space-y-4">
                  <h4 className="fd text-4xl font-bold text-[#3C2A21]">Ready to Lead Your Narrative?</h4>
                  <p className="text-[#6B5E51] text-lg font-medium italic">Transform your application into a powerful business case for your candidacy.</p>
               </div>

               <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-gold shadow-2xl group"
               >
                  Begin Drafting Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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