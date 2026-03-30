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
    <main className="bg-dark-950 text-white px-8 md:px-20 py-40 min-h-screen relative overflow-hidden">
      <div className={`absolute top-0 right-0 ${accentClass} pointer-events-none opacity-40`}></div>
      <div className={`absolute bottom-0 left-0 ${accentClass} pointer-events-none opacity-20`}></div>

      <Link href="/countries" className="group inline-flex items-center gap-4 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-gold-500 transition-all duration-300 mb-16 underline underline-offset-8">
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Back to Countries
      </Link>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Left Column: Vision */}
          <motion.div variants={itemVariants} className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-32 h-20 relative overflow-hidden rounded-2xl shadow-3xl border border-white/10">
                <Flag code={code} className="w-full h-full object-cover scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="text-gold-500 uppercase tracking-[0.4em] font-black text-xs">Destination Profile</span>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mt-2 gradient-text-gold">
                  {name}
                </h1>
              </div>
            </div>
            
            <p className="text-white/40 text-2xl font-normal leading-relaxed max-w-xl italic">
              "{description}"
            </p>

            {/* Essential Facts Grid */}
            <div className="grid grid-cols-2 gap-6 pt-10">
               {[
                 { label: "Intakes", value: essentials.intakes },
                 { label: "Post-Study Work", value: essentials.psw },
                 { label: "Living Costs", value: essentials.living },
                 { label: "Work Rights", value: essentials.work }
               ].map((fact, i) => (
                 <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2 hover:bg-gold-500/5 hover:border-gold-500/20 transition-all">
                    <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.1em]">{fact.label}</span>
                    <p className="text-sm font-bold text-white/80">{fact.value}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Column: Key Details */}
          <div className="space-y-10">
             <motion.div variants={itemVariants} className="glass-card p-12 md:p-16 space-y-10 border-gold-500/10">
                <h3 className="text-2xl font-black tracking-tight border-b border-white/5 pb-8 uppercase">Key Benefits</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="luxury-list-item group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                      <span className="text-white/60 text-lg font-medium group-hover:text-white transition-colors">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
             </motion.div>

             <motion.div variants={itemVariants} className="glass-card p-12 md:p-16 space-y-10 border-white/5 bg-white/[0.01]">
                <h3 className="text-2xl font-black tracking-tight border-b border-white/5 pb-8 uppercase">Top Institutions</h3>
                <div className="flex flex-wrap gap-4">
                  {universities.map((uni, i) => (
                    <span key={i} className="px-6 py-3 bg-white/5 rounded-full text-xs font-black uppercase tracking-[0.1em] text-white/50 hover:bg-gold-500 hover:text-black transition-all cursor-default">
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
