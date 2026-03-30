"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const blogs = [
  { 
    title: "Top 10 Scholarships in USA", 
    date: "June 20, 2024", 
    slug: "top-10-scholarships-usa",
    excerpt: "Maximize your chances of getting a full ride for your higher education in the USA." 
  },
  { 
    title: "Ivy League Admission Secrets", 
    date: "May 15, 2024", 
    slug: "ivy-league-admission-secrets",
    excerpt: "How to craft a unique profile that stands out to top-tier university admissions." 
  },
  { 
    title: "Working in Germany Post-Study", 
    date: "April 10, 2024", 
    slug: "working-in-germany-post-study",
    excerpt: "Learn about the work visa rules and job market opportunities for international students in Germany." 
  },
];

export default function BlogsPage() {
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
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[200px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-24 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Insights</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">Our Global <span className="gradient-text-gold italic">Insights</span></h1>
          <p className="text-white/30 text-xl max-w-2xl mx-auto font-normal">
            Read the latest updates and expert tips on how to prepare for your international education journey.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {blogs.map((blog, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card flex flex-col justify-between group cursor-default"
            >
               <div className="space-y-6">
                  <span className="text-[10px] text-gold-500 font-black uppercase tracking-[0.3em]">{blog.date}</span>
                  <h3 className="text-3xl font-black leading-tight group-hover:text-gold-500 transition-colors tracking-tight uppercase">{blog.title}</h3>
                  <p className="text-white/30 text-base leading-relaxed font-medium">{blog.excerpt}</p>
               </div>
               <div className="pt-12">
                  <Link href={`/blogs/${blog.slug}`} className="btn-outline-gold inline-block w-full text-center py-4 text-[10px] uppercase font-black tracking-[0.3em] transition-all">
                    Read Full Article
                  </Link>
               </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}