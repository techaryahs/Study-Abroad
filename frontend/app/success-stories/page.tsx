"use client";

import { motion, Variants } from "framer-motion";

export default function SuccessStoriesPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const stories = [
    { name: "Rahul S.", uni: "Stanford University", achievement: "Full Scholarship for MS in CS", year: "2024" },
    { name: "Priya K.", uni: "University of Oxford", achievement: "MBA Admission with 50% Grant", year: "2023" },
    { name: "Aditi M.", uni: "National University of Singapore", achievement: "Ph.D. in Data Science", year: "2024" },
  ];

  return (
    <main className="bg-dark-950 text-white px-8 md:px-20 py-40 min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 blur-[180px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-24 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Inspiration</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">Global Success <br /><span className="gradient-text-gold italic">Stories</span></h1>
          <p className="text-white/30 text-xl max-w-2xl mx-auto font-normal">
            Over 500+ students have successfully secured admissions in top universities worldwide with our academic mentorship.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-10"
        >
          {stories.map((story, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -12 }}
              className="glass-card flex flex-col items-center gap-10 group cursor-default bg-white/[0.01]"
            >
               <div className="w-28 h-28 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 text-4xl font-black group-hover:bg-gold-500 group-hover:text-black transition-all duration-700 shadow-2xl">
                  {story.name[0]}
               </div>
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">{story.name}</h3>
                  <p className="text-gold-500 font-bold uppercase tracking-widest text-xs">{story.uni}</p>
                  <p className="text-base text-white/30 font-medium leading-relaxed">{story.achievement}</p>
                  <div className="pt-6">
                    <span className="bg-white/[0.03] text-white/50 border border-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Class of {story.year}</span>
                  </div>
               </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
