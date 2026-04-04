'use client';

import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import DiscussionSection from "@/components/shared/DiscussionSection";
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown, 
  Info, 
  GraduationCap, 
  Search,
  Plus,
  Minus,
  Video,
  Award,
  Star,
  Globe,
  Zap,
  Briefcase,
  PenTool
} from "lucide-react";

export default function SOPPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 110, 
        damping: 18, 
        duration: 0.6 
      } 
    }
  };

  return (
    <main className="min-h-screen bg-dark-950 text-white font-base selection:bg-gold-500/20 relative overflow-hidden">
      
      {/* ── BACKGROUND AMBIENT GLOWS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/2 left-0 w-[300px] h-[300px] bg-gold-500/5 blur-[150px] rounded-full" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 px-8 md:px-20 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:w-1/2 space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[9px] bg-gold-500/5 px-4 py-1.5 rounded-full border border-gold-500/10 inline-block">
                Master Manuscript Protocol
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] uppercase italic tracking-tight">
                SOP & ESSAY <br />
                <span className="gradient-text-gold block mt-1">DRAFTING node</span>
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants} className="max-w-xl">
              <p className="text-base md:text-lg text-white/40 leading-relaxed font-medium italic border-l-2 border-gold-500/20 pl-6 lowercase">
                Our Ivy League graduates draft every essay from <span className="text-white font-black">Zero-Beta Scratch</span>, ensuring a narrative that resonates with the world's most elite admissions authorities.
              </p>
            </motion.div>



            <DiscussionSection serviceId="sop" />
            <div className="pt-2 pl-2">
              <Link href="/checkout?service=sop" className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:text-gold-500 transition-colors border-b border-transparent hover:border-gold-500/20 pb-1 italic">
                Start Settlement Node
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/3] w-full group">
               <div className="absolute inset-0 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />
               <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-gold-500/30 transition-all duration-1000 shadow-2xl">
                 <Image 
                   src="/sop-hero.png" 
                   alt="SOP realistic drafting"
                   fill
                   className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-2000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE MATRIX (SMALL CARDS) ── */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 border-y border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
               <h2 className="text-2xl md:text-3xl font-black uppercase italic gradient-text-gold">Narrative Architecture</h2>
               <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] max-w-2xl mx-auto font-black italic uppercase">Boutique Drafting Nodes for Global Ambition</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
               {[
                 { t: "100% Original Protocol", icon: <ShieldCheck size={22} />, d: "Every word is synthesized from scratch by an Ivy League expert." },
                 { t: "Iterative Refinement", icon: <Zap size={22} />, d: "Unlimited strategic revisions until the narrative reaches the global Tier-1 mark." },
                 { t: "Custom Logic Synthesis", icon: <Star size={22} />, d: "Tailoring every sentence to institutional requirements and alumni expectations." }
               ].map((card, i) => (
                 <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-8 space-y-6 flex flex-col items-center text-center border border-white/5 hover:border-gold-500/20 group transition-all duration-700">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black transition-all">
                       {card.icon}
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-[14px] font-black uppercase italic tracking-widest">{card.t}</h4>
                       <p className="text-white/20 text-[11px] font-medium leading-relaxed italic">{card.d}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

        <div className="max-w-md mx-auto py-12 relative z-10">
            <AddToCart serviceId="sop" />
        </div>

      {/* ── FAQ (COMPACT) ── */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 overflow-hidden relative z-10 border-y border-white/5">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
               <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[8px] italic uppercase">Intellectual Query Node</span>
               <h2 className="text-2xl md:text-3xl font-black uppercase italic gradient-text-gold">Frequently Asked</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {[
                 {
                   q: "Who drafts my documents?",
                   a: "Our graduates from institutions like Harvard, Yale, and Stanford architect every sentence for high-end resonance."
                 },
                 {
                   q: "Is plagiarism checked?",
                   a: "Zero-Beta Scratch protocol. Every manuscript is unique and verified through elite-tier detection nodes."
                 },
                 {
                   q: "What is the turnaround cycle?",
                   a: "The standard refined draft cycle is 7-10 business days per institutional node."
                 }
               ].map((faq, i) => (
                 <div key={i} className="glass-card !p-0 border border-white/5 overflow-hidden group hover:border-gold-500/20 transition-all duration-700">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-6 py-4 flex items-center justify-between gap-6 text-left"
                    >
                       <span className="text-[12px] font-black uppercase tracking-widest italic text-white/50 group-hover:text-white transition-colors">{faq.q}</span>
                       <div className="w-5 h-5 rounded-full border border-white/5 flex items-center justify-center text-gold-500 flex-shrink-0">
                          {openFaq === i ? <Minus size={8} /> : <Plus size={8} />}
                       </div>
                    </button>
                    <motion.div 
                       initial={false}
                       animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                       className="overflow-hidden"
                    >
                       <div className="px-6 pb-4 pt-1">
                          <p className="text-white/20 text-[11px] leading-relaxed italic border-l border-gold-500/10 pl-6 lowercase">{faq.a}</p>
                       </div>
                    </motion.div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-8 md:px-20 text-center bg-dark-950 relative overflow-hidden z-20">
         <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase gradient-text-gold">
               CRAFT THE <br />PERFECT NARRATIVE.
            </h2>
            <p className="text-white/20 text-sm max-w-2xl mx-auto italic font-normal pt-4 uppercase tracking-tighter">
               Secure your future with a manuscript architected by the world's most elite admissions experts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
               <Link href="/contact?service=sop" className="px-10 py-4 btn-gold text-[11px] w-full sm:w-auto text-center tracking-widest uppercase">
                  Book Talent Scan
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
