"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Flag from "react-world-flags";

interface CountryLayoutProps {
  name: string;
  code: string;
  description: string;
  benefits: string[];
  universities: string[];
  essentials: {
    intakes: string;
    psw: string;
    living: string;
    work: string;
  };
  accentClass?: string;
}

export default function CountryLayout({ name, code, description, benefits, universities, essentials, accentClass = "accent-glow-gold" }: CountryLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <Link href="/countries" className="inline-flex items-center gap-4 text-gold-500 font-black uppercase tracking-[0.4em] text-[10px] hover:gap-6 transition-all duration-500 mb-12 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to destinations
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Column: Vision */}
          <motion.div variants={itemVariants} className="space-y-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-16 relative overflow-hidden rounded-xl shadow-2xl border border-white/10 group-hover:border-gold-500/30 transition-all duration-700 transform-gpu animate-float">
                <Flag code={code} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[9px]">Destination Profile</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mt-2 gradient-text-gold">
                  {name}
                </h1>
              </div>
            </div>
            
            <p className="text-white/30 text-base md:text-lg font-normal leading-relaxed max-w-xl italic border-l-2 border-gold-500/10 pl-8 py-4">
              {description}
            </p>

            {/* Essential Facts Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
               {[
                 { label: "Intakes", value: essentials.intakes },
                 { label: "Post-Study Work", value: essentials.psw },
                 { label: "Living Costs", value: essentials.living },
                 { label: "Work Rights", value: essentials.work }
               ].map((fact, i) => (
                 <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-gold-500/5 hover:border-gold-500/10 transition-all group">
                    <span className="text-[9px] text-white/20 group-hover:text-gold-500 uppercase font-black tracking-[0.2em] transition-colors">{fact.label}</span>
                    <p className="text-[13px] font-bold text-white transition-colors">{fact.value}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Column: Key Details */}
          <div className="space-y-8">
             <motion.div 
               variants={itemVariants} 
               whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
               style={{ perspective: 1000 }}
               className="glass-card p-10 md:p-14 space-y-8 border-gold-500/10 transform-gpu transition-all duration-700 bg-white/[0.01]"
             >
                <h3 className="text-xl font-black uppercase tracking-[0.3em] border-b border-white/5 pb-6">Key Benefits:</h3>
                <ul className="space-y-5">
                  {benefits.map((benefit, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-6 group/item"
                    >
                      <div className="w-4 h-[1px] bg-gold-500 group-hover/item:w-8 transition-all"></div>
                      <span className="text-white/40 group-hover/item:text-gold-500 text-sm font-medium transition-colors uppercase tracking-[0.1em]">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
             </motion.div>

             <motion.div 
               variants={itemVariants} 
               whileHover={{ rotateX: 2, rotateY: 2, scale: 1.01 }}
               style={{ perspective: 1000 }}
               className="glass-card p-10 md:p-12 space-y-8 border-white/5 bg-white/[0.01] transform-gpu"
             >
                <h3 className="text-xl font-black uppercase tracking-[0.3em] border-b border-white/5 pb-6">Top Institutions:</h3>
                <div className="flex flex-wrap gap-3">
                  {universities.map((uni, i) => (
                    <span key={i} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-white/30 hover:bg-gold-500 hover:text-black transition-all cursor-default translate-gpu hover:scale-105">
                      {uni}
                    </span>
                  ))}
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
