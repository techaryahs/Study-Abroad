"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Flag from "react-world-flags";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function UniversitiesPage() {
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const destinations = [
    { name: "Germany", code: "DE", slug: "germany", count: "Institutes of Excellence", popular: true },
    { name: "Singapore", code: "SG", slug: "singapore", count: "Global Tech Hub", popular: true },
    { name: "New Zealand", code: "NZ", slug: "new-zealand", count: "World-Class Research", popular: true },
    { name: "USA", code: "US", slug: "usa", count: "Ivy League & Beyond", popular: false },
    { name: "United Kingdom", code: "GB", slug: "united-kingdom", count: "Heritage of Learning", popular: false },
    { name: "Canada", code: "CA", slug: "canada", count: "Innovation & Quality", popular: false },
    { name: "Australia", code: "AU", slug: "australia", count: "Excellence in Outback", popular: false },
    { name: "France", code: "FR", slug: "france", count: "Legacy of Knowledge", popular: false },
    { name: "Ireland", code: "IE", slug: "ireland", count: "The Emerald Isle", popular: false },
  ];

  return (
    <div className="min-h-screen text-[#2D2926] transition-colors duration-300" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .fd { font-family: 'Cormorant Garamond', serif; }

        .gold-shimmer {
          background: linear-gradient(90deg, #C5A059, #E6D5B8, #C5A059, #D4AF37, #C5A059);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .destination-card {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .destination-card:hover {
          transform: translateY(-8px);
          border-color: rgba(197,160,89, 0.45);
          box-shadow: 0 20px 40px rgba(197,160,89, 0.1);
        }

        .featured-badge {
          background: #C5A059;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 14px;
          border-radius: 0 24px 0 16px;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.08) 0%, transparent 100%)" }}>
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-xs tracking-[0.2em] uppercase mb-6 shadow-sm">
              Global Education Index
            </span>
            <h1 className="fd text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95] text-[#2D2926]">
              World-Class <span className="gold-shimmer">Destinations</span>
            </h1>
            <p className="text-[#6B5E51] text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              Curated selection of the world's most prestigious academic hubs. Explore certified benchmarks and institutional rankings.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-10 max-w-3xl mx-auto"
          >
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Locate a country or specific institution..." 
                className="w-full bg-[#FFFFFF] border border-[rgba(197,160,89,0.25)] rounded-2xl py-5 pl-7 pr-40 text-[#2D2926] shadow-xl focus:outline-none focus:ring-4 focus:ring-[rgba(197,160,89,0.1)] transition-all font-medium text-lg placeholder:text-[#A8A29E]"
              />
              <button className="absolute right-2 bg-[#2D2926] text-[#FFFFFF] px-10 py-3.5 rounded-xl font-bold hover:bg-[#C5A059] transition-all shadow-lg text-sm tracking-wide">
                EXPLORE NOW
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="px-6 md:px-16 py-24 max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
          <div>
            <h2 className="fd text-3xl md:text-5xl font-bold text-[#2D2926]">Geographic Catalogue</h2>
            <p className="text-[#6B5E51] text-lg mt-3 font-medium">Select a territory to access verified institutional performance metrics</p>
          </div>
          <div className="flex gap-4">
             {["All", "Popular", "Recently Updated"].map((filter, i) => (
               <button key={i} className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border ${i === 0 ? "bg-[#2D2926] text-white border-[#2D2926]" : "border-[rgba(197,160,89,0.3)] text-[#6B5E51]"}`}>
                 {filter}
               </button>
             ))}
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {destinations.map((dest) => (
            <Link key={dest.code} href={`/universities/by-country/${dest.slug}`}>
              <motion.div 
                variants={itemVariants}
                className="destination-card group relative p-8 cursor-pointer"
              >
                {dest.popular && (
                  <div className="absolute top-0 right-0 featured-badge">
                    Featured Tier
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-16 relative overflow-hidden rounded-xl shadow-lg border-2 border-[#FDFBF7] group-hover:scale-110 transition-transform duration-500">
                    <Flag code={dest.code} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="fd font-bold text-3xl text-[#2D2926] group-hover:text-[#C5A059] transition-colors leading-tight">
                      {dest.name}
                    </h3>
                    <span className="text-sm font-bold text-[#C5A059] tracking-widest uppercase block">
                      {dest.count}
                    </span>
                  </div>
                  
                  <div className="pt-4 flex items-center text-[#6B5E51] font-bold text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    VIEW CATALOGUE <span className="ml-2 text-lg">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* CTA section */}
      <section className="px-6 md:px-16 py-32 mt-20 bg-[#2D2926] text-white text-center relative overflow-hidden rounded-[40px] mx-6 mb-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #C5A059 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(197,160,89,0.15)] text-[#C5A059] font-bold text-[10px] tracking-[0.3em] uppercase mb-4 border border-[rgba(197,160,89,0.2)]">
            Consultancy Services
          </span>
          <h2 className="fd text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">Strategic Academic <br/><span className="gold-shimmer">Planning</span></h2>
          <p className="text-[#A8A29E] text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            Connect with our global advisors to architect a bespoke institutional roadmap tailored to your professional trajectory.
          </p>
          <div className="pt-8">
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="inline-block bg-[#C5A059] text-white font-bold px-12 py-5 rounded-2xl shadow-2xl hover:bg-white hover:text-[#2D2926] transition-all text-sm tracking-widest uppercase cursor-pointer"
            >
              Schedule Your Briefing
            </button>
          </div>
        </div>
      </section>

      <BookCounsellingModal
        isOpen={showCounsellingModal}
        onClose={() => setShowCounsellingModal(false)}
      />
    </div>
  );
}
