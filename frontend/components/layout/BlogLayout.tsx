"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BlogLayoutProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
  image: string;
  accentClass?: string;
  author?: string;
}

export default function BlogLayout({ title, category, date, readTime, content, image, accentClass = "accent-glow-gold", author = "Global Counselling Center" }: BlogLayoutProps) {
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
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden pb-24">
      {/* Background ambient light */}
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

      {/* NAVIGATION BACK */}
      <div className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-8 md:pt-32">
        <Link href="/blogs" className="inline-flex items-center gap-4 text-gold-500 font-black uppercase tracking-[0.4em] text-[10px] hover:gap-6 transition-all duration-500 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to expertise insights
        </Link>
      </div>

      {/* BLOG HEADER */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 space-y-12"
      >
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-gold-500 font-black uppercase tracking-[0.5em] text-[10px] bg-gold-500/5 border border-gold-500/20 px-6 py-2 rounded-full backdrop-blur-md italic shadow-2xl">{category}</span>
            <div className="h-px w-12 bg-white/10 hidden md:block"></div>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">{date} • {readTime} READ</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] uppercase italic gradient-text-gold drop-shadow-2xl max-w-4xl">
            {title}
          </h1>
          <div className="flex items-center gap-6 pt-6 border-t border-white/5 max-w-fit">
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center font-black text-black text-xl shadow-xl shadow-gold-500/20 transform-gpu animate-float">A</div>
            <div>
              <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.4em]">Authored By</p>
              <p className="text-base font-black text-white group-hover:text-gold-500 transition-colors uppercase tracking-[0.2em]">{author}</p>
            </div>
          </div>
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div variants={itemVariants} className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-[#d4af37]/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-dark-900 group transform-gpu">
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[6s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent"></div>
        </motion.div>

        {/* CONTENT AREA GRID */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-12 gap-16 relative"
        >
          {/* MAIN CONTENT */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-12">
            <div className="prose prose-invert prose-lg max-w-none text-white/50 leading-relaxed font-medium selection:bg-gold-500/30">
              {content}
            </div>
          </motion.div>

          {/* SIDEBAR CTA */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-32 h-fit">
            <motion.div
              variants={itemVariants}
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
              style={{ perspective: 1000 }}
              className="glass-card !p-10 border-gold-500/10 space-y-8 group/card transform-gpu transition-all duration-700 bg-white/[0.01]"
            >
              <h3 className="text-xl font-black uppercase tracking-tight italic gradient-text-gold">Private Mentorship</h3>
              <p className="text-white/30 text-sm leading-relaxed font-normal italic">Our guidance is led by established academic principals with first-hand experience in global education systems.</p>
              <div className="pt-6 border-t border-white/5">
                <Link href="/contact" className="btn-gold !w-full py-4 text-[11px]">Secure Evaluation</Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-10 border border-white/5 rounded-3xl space-y-6 bg-white/[0.01]">
              <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.4em]">Inside Insights</p>
              <ul className="space-y-4">
                {["Core Authority", "Success Roadmap", "Expert Commentary", "Global Network"].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-white/50 hover:text-gold-500 cursor-pointer transition-colors text-[11px] uppercase font-black tracking-widest">
                    <div className="w-1 h-1 rounded-full bg-gold-500"></div> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </motion.div>

        {/* FINAL CTA AREA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          whileHover={{ rotateX: 1, rotateY: -1 }}
          style={{ perspective: 1000 }}
          className="glass-card !p-12 md:p-16 text-center space-y-8 bg-dark-900 border-gold-500/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] !mt-32 overflow-hidden transform-gpu"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter gradient-text-gold">Ready for Excellence?</h3>
          <p className="text-white/30 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed italic border-t border-white/5 pt-8">Don't leave your Ivy League dreams to chance. Partner with academics who know the path through original mentorship.</p>
          <div className="pt-8 flex flex-col md:flex-row justify-center gap-6">
            <Link href="/contact" className="btn-gold px-12 py-4 text-[13px]">Start Your Journey</Link>
            <Link href="/services" className="btn-outline-gold px-12 py-4 text-[13px]">Our Expertise</Link>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
