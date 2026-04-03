"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface ServiceLayoutProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  accentClass?: string;
}

export default function ServiceLayout({ title, description, details, icon, accentClass = "accent-glow-gold" }: ServiceLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 110,
        damping: 18,
        duration: 0.8
      } 
    },
  };

  return (
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <Link href="/services" className="inline-flex items-center gap-4 text-gold-500 font-black uppercase tracking-[0.4em] text-[10px] hover:gap-6 transition-all duration-500 mb-12 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to expertise
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center text-black shadow-2xl shadow-gold-500/20 transform-gpu animate-float">
              <div className="scale-60">
                {icon}
              </div>
            </div>
            
            <div className="space-y-3">
              <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[9px]">Strategic Expertise</span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">
                {title.split(' ').slice(0, -1).join(' ')} <br />
                <span className="gradient-text-gold italic">{title.split(' ').slice(-1)}</span>
              </h1>
            </div>

            <p className="text-white/30 text-sm md:text-base font-normal leading-relaxed italic border-l border-gold-500/10 pl-6 py-2">
              {description}
            </p>

            <div className="pt-6">
              <Link href="/contact" className="btn-gold !px-10 !py-4 text-[10px] font-black uppercase tracking-[0.3em]">
                Secure Mentorship
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ 
              rotateX: 2,
              rotateY: -2,
              scale: 1.01
            }}
            style={{ perspective: 1000 }}
            className="glass-card p-8 md:p-12 space-y-8 border-gold-500/10 transform-gpu transition-all duration-700 bg-white/[0.01]"
          >
            <h3 className="text-lg font-black uppercase tracking-[0.3em] border-b border-white/5 pb-6">Detailed Breakdown:</h3>
            <ul className="space-y-5">
              {details.map((detail, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 group/item"
                >
                  <div className="w-3 h-[1px] bg-gold-500 group-hover/item:w-6 transition-all duration-500"></div>
                  <span className="text-white/50 group-hover/item:text-gold-500 text-[13px] font-medium transition-colors uppercase tracking-[0.1em]">{detail}</span>
                </motion.li>
              ))}
            </ul>

            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] -z-10 group-hover:bg-gold-500/10 transition-colors pointer-events-none"></div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
