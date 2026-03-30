"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Flag from "react-world-flags";

const countries = [
  { name: "USA", code: "US", description: "World-class Ivy League universities and high ROI." },
  { name: "UK", code: "GB", description: "Centuries of academic tradition and research excellence." },
  { name: "Germany", code: "DE", description: "Zero tuition fees in public universities and precision engineering." },
  { name: "Australia", code: "AU", description: "Vibrant living and top-tier group of eight universities." },
  { name: "Ireland", code: "IE", description: "Europe's tech hub with excellent post-study work visa." },
  { name: "Dubai", code: "AE", description: "Emerging global hub for business and hospitality." },
  { name: "Canada", code: "CA", description: "Student-friendly policies and high-quality lifestyle." },
  { name: "France", code: "FR", description: "Top-tier business schools and rich cultural heritage." },
  { name: "New Zealand", code: "NZ", description: "Safe environment and world-class research facilities." },
  { name: "Singapore", code: "SG", description: "Asian education hub with global industry connections." },
  { name: "Poland", code: "PL", description: "Affordable quality education in the heart of Europe." },
  { name: "Spain", code: "ES", description: "Rich cultural experience with world-renowned universities." },
  { name: "Netherlands", code: "NL", description: "Innovative education system and strong international focus." },
  { name: "Italy", code: "IT", description: "Historical excellence in art, design, and architecture." }
];

export default function CountriesPage() {
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
        className="max-w-[1400px] mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-24 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Global Destinations</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">Top Countries for <br /><span className="gradient-text-gold italic">Overseas Education</span></h1>
          <p className="text-white/30 text-xl max-w-2xl mx-auto font-normal">
            Explore the best study destinations across the globe and find the perfect match for your career goals.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {countries.map((country, i) => (
            <Link 
              key={i} 
              href={`/countries/${country.name.toLowerCase()}`}
              className="block"
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="glass-card flex flex-col items-center gap-8 group hover:bg-gold-500 hover:text-black transition-all duration-700 bg-white/[0.01]"
              >
                <div className="w-28 h-18 relative overflow-hidden rounded-[1rem] shadow-2xl border border-white/5 group-hover:border-black/10 transition-all duration-500">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <div className="text-3xl font-black uppercase tracking-tighter group-hover:tracking-wider transition-all duration-500">{country.name}</div>
                <p className="text-sm text-center leading-relaxed font-medium opacity-40 group-hover:opacity-100 transition-opacity">
                  {country.description}
                </p>
                <div className="pt-6">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] border-b border-gold-500/30 group-hover:border-black/40 transition-colors">Learn More</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
