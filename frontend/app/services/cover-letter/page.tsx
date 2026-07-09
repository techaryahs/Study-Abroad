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
      <main
         className="relative min-h-screen overflow-hidden pb-32 text-[#10324a]"
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
                        Strategic Career Briefing
                     </span>
                  </div>
                  <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                     Architect Your <br /> Cover Letter
                  </h1>
                  <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
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
                  <div className="bg-white rounded-[32px] border border-[#10324a]/10 p-2 overflow-hidden shadow-[0_20px_60px_rgba(16,50,74,0.12)]">
                     <div className="bg-white rounded-[28px] overflow-hidden">
                        <div className="bg-[#f8f4ea] px-6 py-4 flex items-center justify-between border-b border-[#10324a]/10">
                           <div className="flex items-center gap-3">
                              <FileText className="text-[#2ca59d]" size={20} />
                              <span className="text-[14px] font-bold text-[#10324a] tracking-widest uppercase">Drafting Laboratory</span>
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
                           <div className="p-6 bg-[#10324a] rounded-2xl space-y-4">
                              <p className="text-white/60 text-[14px] font-bold uppercase tracking-[0.2em]">The Focal Point</p>
                              <p className="text-white font-serif italic text-base leading-relaxed">
                                 "We spotlight why you are the perfect fit, transforming a standard application into a narrative of inevitability."
                              </p>
                           </div>
                           <div className="flex justify-between items-center text-[14px] font-bold text-[#2ca59d] tracking-widest uppercase">
                              <span>Verified Authenticity</span>
                              <span>Plagiarism-Free</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d2a14a]/10 blur-3xl rounded-full -z-10" />
               </motion.div>
            </div>
         </section>

         {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
         <section className="relative z-10 py-10 px-6">
            <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10 space-y-14">
               <div className="text-center space-y-4">
                  <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">Service Architecture</span>
                  <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Elite Drafting Protocol</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {focalElements.map((feat, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="feature-pill p-8 space-y-6"
                     >
                        <div className="w-12 h-12 rounded-xl bg-[#f8f4ea] flex items-center justify-center text-[#2ca59d]">
                           <CheckCircle size={24} />
                        </div>
                        <h3 className="fd text-2xl font-bold text-[#10324a]">{feat.title}</h3>
                        <p className="text-[#4b5b6a] text-sm leading-relaxed font-medium">{feat.desc}</p>
                     </motion.div>
                  ))}
               </div>

               <div className="bg-[#f8f4ea]/60 border border-[#10324a]/10 rounded-[24px] p-10 text-center space-y-6 max-w-4xl mx-auto">
                  <ShieldCheck className="mx-auto text-[#2ca59d]" size={32} />
                  <h3 className="fd text-3xl font-bold italic text-[#10324a]">Academic & Professional Rigor</h3>
                  <p className="text-[#4b5b6a] text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
                     "Every draft is cross-verified via Turnitin Instructor-level software and Grammarly Premium, ensuring flawless syntax and 100% original content."
                  </p>
               </div>
            </div>
         </section>

         {/* ── THE PROCESS ────────────────────────────────────────────────────── */}
         <section className="relative z-10 py-10 px-6">
            <div className="max-w-7xl mx-auto glass-panel p-6 sm:p-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.3em] uppercase">The Workflow</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">From Input to <br /> Excellence</h2>
                     </div>

                     <div className="space-y-8">
                        {[
                           { step: "01", title: "Strategic Inputs", desc: "Submit your core experiences via our proprietary intelligence form." },
                           { step: "02", title: "Base Architecture", desc: "We craft a foundational draft written from scratch for your primary target role." },
                           { step: "03", title: "Niche Calibration", desc: "Optionally customize your draft for specific secondary job opportunities." }
                        ].map((item, i) => (
                           <div key={i} className="flex gap-6 group">
                              <span className="text-4xl font-bold text-[#d2a14a]/25 group-hover:text-[#d2a14a] transition-colors">{item.step}</span>
                              <div className="space-y-2">
                                 <h4 className="fd text-xl font-bold text-[#10324a]">{item.title}</h4>
                                 <p className="text-[#4b5b6a] text-sm font-medium">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="relative pt-10 lg:pt-0">
                     <div className="rounded-[32px] p-10 sm:p-12 bg-[#10324a] text-white border border-white/10 space-y-10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                        <div className="relative flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-[#d2a14a] flex items-center justify-center text-[#16364b]">
                              <Zap size={24} />
                           </div>
                           <div>
                              <h3 className="fd text-2xl font-bold text-[#d2a14a]">Secure Your Draft</h3>
                              <p className="text-white/60 text-[14px] font-bold uppercase tracking-widest">Global Standards Applied</p>
                           </div>
                        </div>
                        <div className="relative">
                           <AddToCart serviceId="cover-letter" />
                        </div>
                        <div className="relative flex flex-col gap-4 pt-4 border-t border-white/10">
                           <div className="flex items-center gap-3 text-white/70 text-xs">
                              <Star size={14} className="text-[#d2a14a]" />
                              <span>Bespoke writing for Tier-1 firms</span>
                           </div>
                           <div className="flex items-center gap-3 text-white/70 text-xs">
                              <Search size={14} className="text-[#d2a14a]" />
                              <span>ATS-Optimized Formatting</span>
                           </div>
                        </div>
                     </div>
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
         <section className="relative z-10 py-10 px-6">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="max-w-5xl mx-auto glass-panel p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#d2a14a]/10 blur-3xl rounded-full -mr-32 -mt-32" />

               <div className="relative space-y-4">
                  <h4 className="fd text-3xl sm:text-4xl font-bold text-[#D4A54A]">Ready to Lead Your Narrative?</h4>
                  <p className="text-[#4b5b6a] text-lg font-medium italic">Transform your application into a powerful business case for your candidacy.</p>
               </div>

               <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-gold shadow-2xl group relative"
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