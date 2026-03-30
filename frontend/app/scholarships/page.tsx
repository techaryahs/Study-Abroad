"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const scholarships = [
  { title: "Fulbright Scholarship", coverage: "Full Tuition + Living Expenses", region: "USA" },
  { title: "Commonwealth Scholarship", coverage: "Full Tuition + Travel + Stipend", region: "UK" },
  { title: "DAAD Scholarship", coverage: "Tuition Exemption + Stipend", region: "Germany" },
  { title: "Erasmus Mundus", coverage: "Full Coverage for Masters", region: "Europe" },
];

export default function ScholarshipsPage() {
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
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[200px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-20 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.4em] font-black text-[10px]">Financial Empowerment</span>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.1]">Elite Global <br /><span className="gradient-text-gold italic">Scholarships</span></h1>
          <p className="text-white/30 text-base max-w-2xl mx-auto font-normal italic">
            Precision strategies to secure up to 100% funding for Ivy League and Tier-1 excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {scholarships.map((scholarship, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -10,
                rotateX: 5,
                rotateY: -5,
                z: 40
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1000 }}
              className="glass-card flex flex-col justify-between group cursor-default h-full transform-gpu bg-white/[0.01] hover:bg-gold-500 hover:text-black duration-700"
            >
               <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gold-500 group-hover:text-black font-black uppercase tracking-[0.3em] transition-colors">{scholarship.region}</span>
                    <svg className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:scale-105 transition-transform origin-left">{scholarship.title}</h3>
                  <p className="text-white/30 group-hover:text-black/60 text-base leading-relaxed font-medium italic transition-colors leading-relaxed">
                    Coverage: <span className="text-white group-hover:text-black font-black transition-colors">{scholarship.coverage}</span>
                  </p>
               </div>
               <div className="pt-12">
                  <button className="btn-outline-gold w-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-black group-hover:text-gold-500 group-hover:border-black transition-all duration-500">
                    Secure Eligibility
                  </button>
               </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <p className="text-white/20 text-xs italic">
            Looking for niche funding? <br /> 
            <Link href="/contact" className="text-gold-500 underline underline-offset-4 font-black hover:tracking-[0.2em] transition-all">Connect with our Financial Architects</Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}