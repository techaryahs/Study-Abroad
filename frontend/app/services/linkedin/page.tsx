"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
   ArrowLeft,
   ShieldCheck,
   Star,
   ArrowRight
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

const profileFeatures = [
   { title: "Visual Identity", desc: "Premium profile picture selection and bespoke background cover architecting." },
   { title: "Narrative Strategy", desc: "Crafting the perfect headline and executive summary for high-end resonance." },
   { title: "Experience Optimization", desc: "In-depth positioning of career milestones, internships, and leadership roles." },
   { title: "Skills Analytics", desc: "Clinical selection of skills and strategic endorsements node setup." }
];

export default function LinkedInReviewPage() {
   return (
      <main
         className="relative min-h-screen overflow-hidden pb-16 text-[#10324a]"
         style={{
            background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
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
         `}</style>

         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
            <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
         </div>

         {/* Hero Section */}
         <section className="relative z-10 px-6 md:px-16 pt-10 pb-12">
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
                        Professional Identity Protocol
                     </span>
                  </div>
                  <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#D4A54A] break-words">
                     Architect Your <br /> LinkedIn Presence
                  </h1>
                  <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                     "Transition your digital persona from a static resume to a high-influence professional ecosystem designed for Tier-1 opportunities."
                  </p>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative group"
               >
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.12)]">
                     <img
                        src="/linkedin-hero.png"
                        alt="LinkedIn Premium Transformation"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/50 via-transparent to-transparent" />
                     <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldCheck className="text-[#d2a14a]" size={20} />
                           <span className="text-[14px] font-bold text-white tracking-widest uppercase">Elite Audit node</span>
                        </div>
                        <p className="text-white font-serif italic text-sm leading-relaxed">
                           "Your LinkedIn is your 24/7 recruiter. We make it speak the language of success."
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* Strategy Section */}
         <section className="relative z-10 py-10 px-6 md:px-16">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 glass-panel p-6 sm:p-10">
               <div className="lg:w-3/5 space-y-16">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <span className="text-[#0f4c5c] text-[11px] font-bold tracking-[0.4em] uppercase">The Vision</span>
                        <h2 className="fd text-3xl md:text-5xl font-bold leading-tight text-[#D4A54A]">Strategic <br /> Personal Branding</h2>
                     </div>
                     <div className="space-y-6 text-[#4b5b6a] font-medium leading-relaxed max-w-2xl text-lg">
                        <p>
                           Our LinkedIn Profile Boosting service is a clinical transformation of your professional narrative. We don't just "fix" sections; we architect a coherent ecosystem that resonates with hiring committees and high-level recruiters.
                        </p>
                        <p>
                           From keyword optimization for search algorithms to merit-based positioning in your summary, we ensure your profile reflects the caliber of institution you are applying to.
                        </p>
                     </div>
                  </div>

                  {/* Grid Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {profileFeatures.map((f, i) => (
                        <div key={i} className="p-8 rounded-[24px] border border-[#10324a]/10 bg-white/70 hover:border-[#d2a14a]/40 transition-all group">
                           <h4 className="fd text-xl font-bold mb-3 text-[#10324a]">{f.title}</h4>
                           <p className="text-xs leading-relaxed text-[#4b5b6a] opacity-70 group-hover:opacity-100 transition-opacity">{f.desc}</p>
                        </div>
                     ))}
                  </div>

                  {/* Public Consensus Section (Discussion) */}
                  <div className="space-y-8 pt-10 border-t border-[#10324a]/10">
                     <div className="space-y-3">
                        <span className="text-[#0f4c5c] text-[14px] font-bold tracking-[0.4em] uppercase">Community Insights</span>
                        <h2 className="fd text-3xl font-bold text-[#10324a]">Public Consensus</h2>
                     </div>
                     <div className="rounded-[32px] overflow-hidden border border-[#10324a]/10 bg-[#f8f4ea]/40 p-2">
                        <DiscussionSection serviceId="linkedin" />
                     </div>
                  </div>
               </div>

               {/* Action Sidebox */}
               <div className="lg:w-2/5 space-y-8 lg:sticky lg:top-32">
                  <div className="bg-[#10324a] p-6 md:p-8 rounded-[32px] text-white space-y-8 shadow-[0_20px_60px_rgba(16,50,74,0.18)] relative overflow-hidden group border border-white/10">
                     <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                     <div className="space-y-2 relative z-10">
                        <p className="text-[#d2a14a] text-[14px] font-bold uppercase tracking-widest">Pricing Protocol</p>
                        <h3 className="fd text-3xl sm:text-4xl font-bold italic">Bespoke Revamp</h3>
                     </div>
                     <div className="relative z-10 w-full">
                        <AddToCart serviceId="linkedin" />
                     </div>
                  </div>

                  {/* Trust Widget */}
                  <div className="bg-white/80 border border-[#10324a]/10 p-8 sm:p-10 rounded-[32px] shadow-[0_12px_35px_rgba(16,50,74,0.05)] space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#f8f4ea] flex items-center justify-center text-[14px] font-bold uppercase tracking-widest shadow-sm text-[#10324a]">
                                 {String.fromCharCode(64 + i)}
                              </div>
                           ))}
                        </div>
                        <span className="text-[14px] font-bold text-[#4b5b6a] uppercase tracking-widest">99+ Profiles Revamped</span>
                     </div>
                     <p className="text-xs italic text-[#4b5b6a] leading-relaxed opacity-80">
                        "The LinkedIn transformation was the key to my Google internship. Amazing transparency and strategy."
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
      </main>
   );
}