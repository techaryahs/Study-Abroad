"use client";

import { motion, Variants } from "framer-motion";

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
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Financial Assistance</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">Top Global <span className="gradient-text-gold italic">Scholarships</span></h1>
          <p className="text-white/30 text-xl max-w-2xl mx-auto font-normal">
            We help students find and apply for scholarships that cover up to 100% of their education costs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {scholarships.map((scholarship, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="glass-card flex flex-col justify-between group cursor-default"
            >
               <div className="space-y-6">
                  <span className="text-[10px] text-gold-500 font-black uppercase tracking-[0.3em]">{scholarship.region}</span>
                  <h3 className="text-3xl font-black tracking-tight">{scholarship.title}</h3>
                  <p className="text-white/30 text-base leading-relaxed font-medium">{scholarship.coverage}</p>
               </div>
               <div className="pt-12">
                  <button className="btn-outline-gold w-full text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                    Explore Details
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}