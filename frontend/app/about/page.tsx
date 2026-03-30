"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
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

  const stats = [
    { label: "Partner Universities", value: "360+" },
    { label: "Successful Admissions", value: "500+" },
    { label: "Years of Expertise", value: "15+" },
    { label: "Student Success Rate", value: "98%" }
  ];

  const expertises = [
    {
      title: "Academic Pedigree",
      desc: "Our guidance is led by established academic principals with first-hand experience in global education systems.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20" />
        </svg>
      )
    },
    {
      title: "Strategic Mentorship",
      desc: "We don't just process applications; we mentor students to build profiles that elite universities crave.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Global Reach",
      desc: "Our deep-rooted networks span across the USA, UK, Germany, and other top-tier academic hubs.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-8 md:px-20 pt-24 pb-20 md:pt-32 md:pb-24 border-b border-white/5 overflow-hidden">
        {/* BACKGROUND AMBIENT GLOW */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[200px] -z-10 rounded-full"
        ></motion.div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-30">
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:w-3/5 space-y-10"
          >
            <div className="space-y-6">
              <span className="text-gold-400 uppercase tracking-[0.4em] font-black text-[10px] px-6 py-2 border border-gold-500/20 rounded-full bg-gold-500/5 backdrop-blur-3xl shadow-[0_0_30px_rgba(194,168,120,0.1)] inline-block">
                Our Elite Pedigree
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] uppercase text-white !opacity-100 !visible">
                Architecting <br />
                <span className="gradient-text-gold italic block mt-2">Global Careers</span>
              </h1>
              <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed font-normal italic !opacity-100 !visible">
                At Dr. Alam Admissions, we believe education is a transformative leap. We turn raw potential into global prestige.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/contact" className="btn-gold px-10 py-4 text-xs tracking-[0.2em]">Start Your Journey</Link>
              <Link href="/services" className="btn-outline-gold px-10 py-4 text-xs tracking-[0.2em]">View Expertise</Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="md:w-2/5 relative group"
          >
            <div className="absolute -inset-16 bg-gold-500/15 blur-[150px] rounded-full scale-95 group-hover:scale-105 transition-all duration-2000 pointer-events-none"></div>
            <div className="relative w-full aspect-square md:h-[550px] rounded-[4rem] overflow-hidden border border-white/10 glass-card p-0 shadow-4xl hover:shadow-gold-500/30 transition-all duration-1000">
              <Image
                src="/about-hero.png"
                alt="Academic Excellence Symbolic"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-2000 opacity-60 animate-float"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 px-8 md:px-20 bg-dark-900 border-b border-white/5 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-24"
        >
          {stats.map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="text-center group pr-6">
              <div className="text-3xl md:text-5xl font-black text-white group-hover:text-gold-500 transition-all duration-1000 tracking-tight group-hover:scale-110">
                {item.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 pt-6 group-hover:text-gold-500/50 transition-all cursor-default text-center">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-20 px-8 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: 3,
              rotateY: -3,
              z: 30
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ perspective: 1000 }}
            className="space-y-6 glass-card p-10 md:p-12 border border-white/10 relative group bg-white/[0.01] hover:bg-gold-500 hover:text-black duration-700 transform-gpu"
          >
            <div className="text-gold-500 group-hover:text-black font-black uppercase tracking-[0.4em] text-[9px] mb-4 flex items-center gap-4 transition-colors">
              <span className="w-12 h-[1px] bg-current opacity-30"></span> Our Vision
            </div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase italic">Unlocking <br />Global Potential</h2>
            <p className="text-white/40 group-hover:text-black/60 leading-relaxed text-base font-normal italic transition-colors">
              We bridge the gap between local talent and world-class opportunities. Our vision is a world where every deserving student has access to top-tier global learning hubs.
            </p>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/10 -z-10 blur-[100px] group-hover:bg-black/20 transition-colors duration-1000"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: 3,
              rotateY: 3,
              z: 30
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true }}
            style={{ perspective: 1000 }}
            className="space-y-6 glass-card p-10 md:p-12 border border-white/10 relative group bg-white/[0.01] hover:bg-gold-500 hover:text-black duration-700 transform-gpu"
          >
            <div className="text-gold-500 group-hover:text-black font-black uppercase tracking-[0.4em] text-[9px] mb-4 flex items-center gap-4 transition-colors">
              <span className="w-12 h-[1px] bg-current opacity-30"></span> Our Mission
            </div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase italic">Precision <br />Admissions</h2>
            <p className="text-white/40 group-hover:text-black/60 leading-relaxed text-base font-normal italic transition-colors">
              Our mission is to empower students through personalized admission strategies and meticulous mentorship, ensuring success at Ivy League and global institutions.
            </p>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/10 -z-10 blur-[100px] group-hover:bg-black/20 transition-colors duration-1000"></div>
          </motion.div>
        </div>
      </section>

      {/* ================= EXPERTISE / WHY DR ALAM ================= */}
      <section className="py-24 px-8 md:px-20 bg-dark-900/50 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-6"
          >
            <span className="text-gold-500 uppercase tracking-[0.4em] font-black text-[9px]">The Strategic Edge</span>
            <h2 className="text-3xl md:text-5xl font-black leading-none uppercase">Why Strategic Mentorship <br /><span className="gradient-text-gold italic">Wins Admissions?</span></h2>
            <p className="text-white/30 text-base md:text-lg italic font-normal">Consultancy is about paperwork. Mentorship is about architectural prestige.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {expertises.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 border border-white/5 bg-white/[0.01] hover:bg-gold-500/5 transition-all duration-700 backdrop-blur-3xl group">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-2 group-hover:text-gold-500 transition-colors">{item.title}</h3>
                <p className="text-white/20 text-xs leading-relaxed italic font-medium group-hover:text-white/40 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 px-8 md:px-20 text-center relative overflow-hidden bg-dark-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-12 relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-black leading-[1.0] italic gradient-text-gold uppercase">
            READY TO ARCHITECT <br />YOUR GLOBAL FUTURE?
          </h2>
          <p className="text-white/30 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed italic font-normal border-t border-white/5 pt-12">
            Don't leave your dreams to chance. Partner with academics who know the path through original mentorship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6">
            <Link href="/contact" className="btn-gold px-12 py-5 text-base">Book Evaluation</Link>
            <Link href="https://wa.me/918987654321" target="_blank" className="btn-outline-gold px-12 py-5 text-base hover:bg-gold-500 hover:text-black">Talk via WhatsApp</Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
