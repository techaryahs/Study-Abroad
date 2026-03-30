"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
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
      icon: "🎓"
    },
    {
      title: "Strategic Mentorship",
      desc: "We don't just process applications; we mentor students to build profiles that elite universities crave.",
      icon: "🤝"
    },
    {
      title: "Global Reach",
      desc: "Our deep-rooted networks span across the USA, UK, Germany, and other top-tier academic hubs.",
      icon: "🌍"
    }
  ];

  return (
    <main className="bg-dark-950 text-white min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-8 md:px-20 py-32 border-b border-white/5 overflow-hidden">
        {/* BACKGROUND AMBIENT GLOW */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 blur-[180px] -z-10 rounded-full animate-pulse"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="md:w-1/2 space-y-10"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <span className="text-gold-400 uppercase tracking-[0.5em] font-bold text-xs px-6 py-2 border border-gold-500/20 rounded-full bg-gold-500/5 backdrop-blur-sm">
                About Dr. Alam Admissions
              </span>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.95]">
                Architecting <span className="gradient-text-gold italic">Global Careers</span>.
              </h1>
              <p className="text-white/40 text-lg md:text-xl max-w-xl leading-relaxed font-normal">
                At Dr. Alam Admissions, we believe education is more than a degree – it's a transformative leap. We provide the mentorship you need to land your dream university.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-8">
              <Link href="/contact" className="btn-gold px-10">Start Your Journey</Link>
              <Link href="/services" className="btn-outline-gold px-12">View Expertise</Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative group"
          >
            <div className="absolute -inset-8 bg-gold-500/10 blur-[100px] rounded-full scale-95 group-hover:scale-105 transition-all duration-1000"></div>
            <div className="relative w-full aspect-square md:h-[540px] rounded-[3rem] overflow-hidden border border-white/10 glass-card p-0">
              <Image
                src="/about-hero.png"
                alt="Academic Excellence Symbolic"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 border-b border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          {stats.map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="text-center group border-r border-white/5 last:border-0 pr-6">
              <div className="text-5xl md:text-7xl font-black text-white group-hover:text-gold-500 transition-colors duration-500 tracking-tighter">
                {item.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 pt-4 group-hover:text-gold-500/50 transition-colors">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-32 px-8 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 glass-card p-16 border border-white/5 relative group bg-white/[0.01]"
          >
            <div className="text-gold-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-px bg-gold-500/30"></span> Our Vision
            </div>
            <h2 className="text-4xl font-black leading-tight">Unlocking Global Potential</h2>
            <p className="text-white/40 leading-relaxed text-lg font-normal">
              We bridge the gap between local talent and world-class opportunities. Our vision is a world where every deserving student has access to top-tier global research and learning hubs, regardless of their location.
            </p>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/5 -z-10 blur-[100px] group-hover:bg-gold-500/10 transition-colors duration-1000"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 glass-card p-16 border border-white/5 relative group bg-white/[0.01]"
          >
            <div className="text-gold-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-px bg-gold-500/30"></span> Our Mission
            </div>
            <h2 className="text-4xl font-black leading-tight">Precision Admissions Guidance</h2>
            <p className="text-white/40 leading-relaxed text-lg font-normal">
              Our mission is to empower students through personalized admission strategies, AI-driven shortlisting, and meticulous mentorship, ensuring success at Ivy League and prestigious global universities.
            </p>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/5 -z-10 blur-[100px] group-hover:bg-gold-500/10 transition-colors duration-1000"></div>
          </motion.div>
        </div>
      </section>

      {/* ================= EXPERTISE / WHY DR ALAM ================= */}
      <section className="py-32 px-8 md:px-20 bg-dark-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black">Why Strategic Mentorship <br /><span className="gradient-text-gold italic">Wins Admissions?</span></h2>
            <p className="text-white/30 text-lg md:text-xl">Consultancy is about paperwork. Mentorship is about finding your place among the best.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            {expertises.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center space-y-8 group p-12 glass-card border border-white/5 hover:border-gold-500/30 transition-all cursor-default">
                <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-4xl mx-auto group-hover:scale-110 transition-all group-hover:bg-gold-500 group-hover:text-black group-hover:shadow-[0_0_50px_rgba(194,168,120,0.3)] duration-700 shadow-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-gold-500 transition-colors">{item.title}</h3>
                <p className="text-white/30 text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-48 px-8 md:px-20 text-center relative overflow-hidden bg-dark-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold-500/5 blur-[200px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto space-y-16 relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-black leading-tight italic gradient-text-gold uppercase tracking-tighter">
            READY TO ARCHITECT <br />YOUR GLOBAL FUTURE?
          </h2>
          <p className="text-white/30 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Don't leave your dreams to chance. Partner with academics who know the path through original mentorship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
            <Link href="/contact" className="btn-gold px-16 py-6 text-xl">Book Evaluation</Link>
            <Link href="https://wa.me/918987654321" target="_blank" className="btn-outline-gold px-16 py-6 text-xl">Talk via WhatsApp</Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
