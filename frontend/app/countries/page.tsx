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
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-[1440px] mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-20 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px]">Strategic Hubs</span>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.1]">The Global <br /><span className="gradient-text-gold italic">Network</span></h1>
          <p className="text-white/30 text-base max-w-2xl mx-auto font-normal italic">
            Architecting admissions in major academic hubs across Ivy League and Global Tier-1 destinations.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {countries.map((country, i) => (
            <Link 
              key={i} 
              href={`/countries/${country.name.toLowerCase()}`}
              className="block h-full outline-none"
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -12,
                  rotateX: 6,
                  rotateY: -6,
                  z: 50
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: 1000 }}
                className="glass-card h-full flex flex-col items-center text-center gap-10 group bg-white/[0.01] hover:bg-gold-500 hover:text-black transition-all duration-700 transform-gpu relative overflow-hidden"
              >
                {/* 3D GLOW EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="w-24 h-16 relative overflow-hidden rounded-xl shadow-2xl border border-white/5 group-hover:border-black/20 transition-all duration-700 scale-100 group-hover:scale-110">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight transition-all duration-500">{country.name}</h3>
                  <p className="text-white/20 group-hover:text-black/60 text-xs leading-relaxed font-medium transition-colors italic px-4">
                    {country.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 group-hover:border-black/10 w-full">
                  <span className="text-[9px] uppercase font-black tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-all">Explore Hub</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
