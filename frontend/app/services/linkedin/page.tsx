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
import ServiceCTA from "@/components/shared/ServiceCTA";
import DiscussionSection from "@/components/shared/DiscussionSection";

const profileFeatures = [
   { title: "Visual Identity", desc: "Premium profile picture selection and bespoke background cover architecting." },
   { title: "Narrative Strategy", desc: "Crafting the perfect headline and executive summary for high-end resonance." },
   { title: "Experience Optimization", desc: "In-depth positioning of career milestones, internships, and leadership roles." },
   { title: "Skills Analytics", desc: "Clinical selection of skills and strategic endorsements node setup." }
];

export default function LinkedInReviewPage() {
   return (
      <main className="min-h-screen pb-16" style={{ background: "#FDFBF7", color: "#3C2A21" }}>
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
         `}</style>

         {/* Hero Section */}
         <section className="relative px-6 md:px-16 pt-12 pb-24 overflow-hidden border-b border-[#F1EDEA]">
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
                        Professional Identity Protocol
                     </span>
                  </div>
                  <h1 className="fd text-3xl md:text-7xl font-bold leading-[0.95] text-[#2D2926] break-words">
                     Architect Your <br /> <span className="gold-shimmer">LinkedIn Presence</span>
                  </h1>
                  <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                     "Transition your digital persona from a static resume to a high-influence professional ecosystem designed for Tier-1 opportunities."
                  </p>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative group"
               >
                  <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-[#F1EDEA] shadow-2xl">
                     <img
                        src="/linkedin-hero.png"
                        alt="LinkedIn Premium Transformation"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/40 via-transparent to-transparent" />
                     <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldCheck className="text-[#C5A059]" size={20} />
                           <span className="text-[14px] font-bold text-white font-bold tracking-widest uppercase">Elite Audit node</span>
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
         <section className="py-24 px-6 md:px-16 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
               <div className="lg:w-3/5 space-y-20">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.4em] uppercase">The Vision</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight text-[#2D2926]">Strategic <br /> <span className="gold-shimmer">Personal Branding</span></h2>
                     </div>
                     <div className="space-y-6 text-[#6B5E51] font-medium leading-relaxed max-w-2xl text-lg">
                        <p>
                           Our LinkedIn Profile Boosting service is a clinical transformation of your professional narrative. We don't just "fix" sections; we architect a coherent ecosystem that resonates with hiring committees and high-level recruiters.
                        </p>
                        <p>
                           From keyword optimization for search algorithms to merit-based positioning in your summary, we ensure your profile reflects the caliber of institution you are applying to.
                        </p>
                     </div>
                  </div>

                  {/* Grid Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {profileFeatures.map((f, i) => (
                        <div key={i} className="p-8 rounded-[32px] border border-[#F1EDEA] bg-[#FDFBF7]/30 hover:border-[#C5A059]/30 transition-all group">
                           <h4 className="fd text-xl font-bold mb-3 text-[#2D2926]">{f.title}</h4>
                           <p className="text-xs leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{f.desc}</p>
                        </div>
                     ))}
                  </div>

                  {/* Public Consensus Section (Discussion) */}
                  <div className="space-y-12 pt-20 border-t border-[#F1EDEA]">
                     <div className="space-y-4">
                        <span className="text-[#C5A059] text-[14px] font-bold font-bold tracking-[0.4em] uppercase">Community Insights</span>
                        <h2 className="fd text-4xl font-bold text-[#2D2926]">Public Consensus</h2>
                     </div>
                     <div className="rounded-[40px] overflow-hidden border border-[#F1EDEA] bg-[#FDFBF7]/20 p-2">
                        <DiscussionSection serviceId="linkedin_optimization" />
                     </div>
                  </div>
               </div>

               {/* Action Sidebox */}
               <div className="lg:w-2/5 space-y-10 lg:sticky lg:top-32">
                  <div className="bg-[#2D2926] p-6 md:p-8 rounded-[32px] text-white space-y-8 shadow-2xl relative overflow-hidden group border border-[#C5A059]/20">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
                     <div className="space-y-2 relative z-10">
                        <p className="text-[#C5A059] text-[14px] font-bold font-bold uppercase tracking-widest">Pricing Protocol</p>
                        <h3 className="fd text-4xl font-bold italic">Bespoke Revamp</h3>
                     </div>
                     <div className="relative z-10 w-full">
                        <ServiceCTA serviceId="linkedin_optimization" />
                     </div>
                  </div>

                  {/* Trust Widget */}
                  <div className="bg-white border border-[#F1EDEA] p-10 rounded-[48px] shadow-sm space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#FDFBF7] flex items-center justify-center text-[14px] font-bold font-bold uppercase tracking-widest shadow-sm">
                                 {String.fromCharCode(64 + i)}
                              </div>
                           ))}
                        </div>
                        <span className="text-[14px] font-bold font-bold text-[#6B5E51] uppercase tracking-widest">99+ Profiles Revamped</span>
                     </div>
                     <p className="text-xs italic text-[#6B5E51] leading-relaxed opacity-70">
                        "The LinkedIn transformation was the key to my Google internship. Amazing transparency and strategy."
                     </p>
                  </div>
               </div>
            </div>
         </section>

         <FAQSection />
      </main>
   );
}
