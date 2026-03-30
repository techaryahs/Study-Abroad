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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="bg-dark-950 text-white px-8 md:px-20 py-40 min-h-screen relative overflow-hidden">
      {/* Dynamic Accent Glow */}
      <div className={`absolute top-0 right-0 ${accentClass} pointer-events-none opacity-50`}></div>
      <div className={`absolute bottom-0 left-0 ${accentClass} pointer-events-none opacity-20`}></div>

      <Link href="/services" className="group inline-flex items-center gap-4 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-gold-500 transition-all duration-300 mb-16">
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Back to Services
      </Link>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <motion.div variants={itemVariants} className="space-y-10">
            <div className="w-24 h-24 rounded-3xl bg-gold-500 flex items-center justify-center text-black shadow-3xl shadow-gold-500/30">
              {icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
              {title.split(' ').slice(0, -1).join(' ')} <span className="gradient-text-gold italic">{title.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-white/40 text-xl font-normal leading-relaxed">
              {description}
            </p>
            <div className="pt-8">
              <Link href="/contact" className="btn-gold !px-12 !py-5 text-[10px] font-black uppercase tracking-[0.3em]">
                Get Expert Guidance
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-12 md:p-16 space-y-10 border-gold-500/20">
            <h3 className="text-2xl font-black tracking-tight border-b border-white/5 pb-8 uppercase">Detailed Breakdown</h3>
            <ul className="space-y-4">
              {details.map((detail, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="luxury-list-item group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:scale-150 transition-transform"></div>
                  <span className="text-white/60 text-lg font-medium group-hover:text-white transition-colors">{detail}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
