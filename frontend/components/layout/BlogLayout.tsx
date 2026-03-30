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

export default function BlogLayout({ title, category, date, readTime, content, image, accentClass = "accent-glow-gold", author = "Dr. Alam" }: BlogLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden pb-48">
      {/* Background ambient light */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/10 blur-[200px] -z-10 rounded-full opacity-40`}></div>
      <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 blur-[200px] -z-10 rounded-full"></div>

      {/* NAVIGATION BACK */}
      <div className="max-w-6xl mx-auto px-8 md:px-12 pt-40 pb-12">
        <Link href="/blogs" className="nav-link group !text-gold-500/60 hover:!text-gold-500">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Insights
        </Link>
      </div>

      {/* BLOG HEADER */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-8 md:px-12 space-y-20"
      >
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex flex-wrap items-center gap-10">
            <span className="text-gold-500 font-black uppercase tracking-[0.6em] text-[9px] bg-gold-500/5 border border-gold-500/20 px-8 py-2.5 rounded-full backdrop-blur-md italic shadow-2xl">{category}</span>
            <div className="h-px w-16 bg-white/10 hidden md:block"></div>
            <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">{date} • {readTime} READ</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] uppercase italic gradient-text-gold drop-shadow-2xl">
            {title}
          </h1>
          <div className="flex items-center gap-8 pt-6 border-t border-white/5 max-w-fit">
             <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-gold-500/20">A</div>
             <div>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em]">Authored By</p>
                <p className="text-lg font-black text-white group-hover:text-gold-500 transition-colors uppercase tracking-[0.2em]">{author}</p>
             </div>
          </div>
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div variants={itemVariants} className="relative w-full aspect-[21/9] rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-dark-900 group">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[6s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent"></div>
        </motion.div>

        {/* CONTENT AREA GRID */}
        <div className="grid lg:grid-cols-12 gap-24 relative">
          {/* MAIN CONTENT */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-20 pt-8">
            <div className="prose prose-invert prose-2xl max-w-none text-white/50 leading-relaxed font-medium selection:bg-gold-500/30">
              {content}
            </div>
          </motion.div>

          {/* SIDEBAR CTA */}
          <aside className="hidden lg:block lg:col-span-4 space-y-12 sticky top-32 h-fit">
             <motion.div variants={itemVariants} className="glass-card !p-12 border-gold-500/10 space-y-10 group/card">
                <h3 className="text-3xl font-black uppercase tracking-tight italic gradient-text-gold">Private Mentorship</h3>
                <p className="text-white/40 text-base leading-relaxed font-normal">Our guidance is led by established academic principals with first-hand experience in global education systems.</p>
                <div className="pt-4 border-t border-white/5">
                   <Link href="/contact" className="btn-gold !w-full !px-0">Book Evaluation</Link>
                </div>
             </motion.div>

             <motion.div variants={itemVariants} className="p-12 border border-white/5 rounded-[3rem] space-y-8 bg-white/[0.01]">
                <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] mb-4">Inside Insights</p>
                <ul className="space-y-6">
                   {["Core Authority", "Success Roadmap", "Expert Commentary", "Global Network"].map((item) => (
                      <li key={item} className="nav-link !text-white/40 hover:!text-gold-500 cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40"></div> {item}
                      </li>
                   ))}
                </ul>
             </motion.div>
          </aside>
        </div>

        {/* FINAL CTA AREA */}
        <motion.div variants={itemVariants} className="glass-card !p-20 text-center space-y-12 bg-dark-900 border-gold-500/20 shadow-[0_0_100px_rgba(194,168,120,0.15)] !mt-48 overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full"></div>
           <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter gradient-text-gold">Ready for Excellence?</h3>
           <p className="text-white/30 text-2xl max-w-3xl mx-auto font-normal leading-relaxed">Don't leave your Ivy League dreams to chance. Partner with academics who know the path through original mentorship.</p>
           <div className="pt-10 flex flex-col md:flex-row justify-center gap-10">
              <Link href="/contact" className="btn-gold !px-20 !py-7 text-sm">Start Your Journey</Link>
              <Link href="/services" className="btn-outline-gold !px-20 !py-7 text-sm">Our Expertise</Link>
           </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
