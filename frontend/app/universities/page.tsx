"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Flag from "react-world-flags";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";

export default function UniversitiesPage() {
  const { isPremium } = usePremiumStatus();
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
    <div
      className="min-h-screen text-[#10324a] transition-colors duration-300"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >

      <style>{`
        .gold-shimmer {
          background: linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a);
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
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(16,50,74,0.10);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(16,50,74,0.04);
        }

        .destination-card:hover {
          transform: translateY(-8px);
          border-color: rgba(210,161,74, 0.45);
          box-shadow: 0 20px 40px rgba(16,50,74, 0.08);
        }

        .featured-badge {
          background: #d2a14a;
          color: #10324a;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 14px;
          border-radius: 0 24px 0 16px;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(44,165,157,0.10) 0%, transparent 100%)" }}>
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[13px] tracking-[0.2em] uppercase mb-6 shadow-sm">
              Global Education Index
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6 leading-[0.95]">
              <span className="gold-shimmer">World-Class Destinations</span>
            </h1>
            <p className="text-[#4b5b6a] text-base sm:text-lg max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
              Explore our curated database of premium universities, meticulously categorized by country, state, programs, and advanced predictive metrics.
            </p>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">1,500+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Universities</p>
              </div>
              <div className="hidden sm:block w-[1px] bg-gradient-to-b from-transparent via-[#d2a14a]/40 to-transparent"></div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">10,000+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Programs</p>
              </div>
              <div className="hidden sm:block w-[1px] bg-gradient-to-b from-transparent via-[#d2a14a]/40 to-transparent"></div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#d2a14a]">15+</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4b5b6a] mt-1">Countries</p>
              </div>
            </div>
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
                className="w-full bg-white border border-[#10324a]/10 rounded-2xl py-5 pl-7 pr-40 text-[#10324a] shadow-[0_16px_40px_rgba(16,50,74,0.08)] focus:outline-none focus:ring-4 focus:ring-[#2ca59d]/15 focus:border-[#2ca59d]/50 transition-all font-medium text-lg placeholder:text-[#4b5b6a]/50"
              />
              <button className="absolute right-2 bg-[#10324a] text-white px-10 py-3.5 rounded-xl font-black hover:bg-[#d2a14a] hover:text-[#10324a] transition-all shadow-lg text-sm tracking-wide">
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
            <h2 className="text-3xl md:text-5xl font-black text-[#10324a]">Geographic Catalogue</h2>
            <p className="text-[#4b5b6a] text-lg mt-3 font-medium">Select a territory to access verified institutional performance metrics</p>
          </div>
          <div className="flex gap-4">
            {["All", "Popular", "Recently Updated"].map((filter, i) => (
              <button key={i} className={`px-6 py-2.5 rounded-full text-[12px] font-black tracking-wider uppercase border transition-all ${i === 0 ? "bg-[#10324a] text-white border-[#10324a]" : "border-[#10324a]/15 text-[#4b5b6a] hover:border-[#d2a14a]/40"}`}>
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
          {destinations.slice(0, 3).map((dest) => (
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
                  <div className="w-24 h-16 relative overflow-hidden rounded-xl shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-500">
                    <Flag code={dest.code} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-3xl text-[#10324a] group-hover:text-[#d2a14a] transition-colors leading-tight">
                      {dest.name}
                    </h3>
                    <span className="text-[13px] font-black text-[#0f4c5c] tracking-widest uppercase block">
                      {dest.count}
                    </span>
                  </div>

                  <div className="pt-4 flex items-center text-[#4b5b6a] font-black text-[12px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    VIEW CATALOGUE <span className="ml-2 text-lg">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {destinations.length > 3 && (
          <div className="mt-10">
            <PremiumLock isPremium={isPremium} title="Unlock 1,500+ Top Universities" description="Get premium access to explore detailed admission matrices, acceptance rates, and student demographics for over 1,500 world-class educational hubs.">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {destinations.slice(3).map((dest) => (
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
                        <div className="w-24 h-16 relative overflow-hidden rounded-xl shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-500">
                          <Flag code={dest.code} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-black text-3xl text-[#10324a] group-hover:text-[#d2a14a] transition-colors leading-tight">
                            {dest.name}
                          </h3>
                          <span className="text-[13px] font-black text-[#0f4c5c] tracking-widest uppercase block">
                            {dest.count}
                          </span>
                        </div>

                        <div className="pt-4 flex items-center text-[#4b5b6a] font-black text-[12px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          VIEW CATALOGUE <span className="ml-2 text-lg">→</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </PremiumLock>
          </div>
        )}
      </section>

      {/* CTA section */}
      <section className="px-6 md:px-16 py-32 mt-20 bg-[#10324a] text-white text-center relative overflow-hidden rounded-[40px] mx-6 mb-20 border border-white/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #d2a14a 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.14),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(44,165,157,0.12),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2ca59d]/15 text-[#7fd4cb] font-black text-[12px] tracking-[0.3em] uppercase mb-4 border border-[#2ca59d]/25">
            Consultancy Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            <span className="gold-shimmer">Strategic Academic Planning</span>
          </h2>
          <p className="text-white/70 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            Connect with our global advisors to architect a bespoke institutional roadmap tailored to your professional trajectory.
          </p>
          <div className="pt-8">
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="inline-block bg-[#d2a14a] text-[#10324a] font-black px-12 py-5 rounded-2xl shadow-[0_16px_40px_rgba(210,161,74,0.3)] hover:bg-white transition-all text-sm tracking-widest uppercase cursor-pointer"
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