"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Flag from "react-world-flags";

export default function UniversitiesPage() {
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
    { name: "Germany", code: "DE", slug: "germany", count: "300+ Universities", popular: true },
    { name: "Singapore", code: "SG", slug: "singapore", count: "Top Rated", popular: true },
    { name: "New Zealand", code: "NZ", slug: "new-zealand", count: "Premium Quality", popular: true },
    { name: "USA", code: "US", slug: "usa", count: "4000+ Universities", popular: false },
    { name: "United Kingdom", code: "GB", slug: "united-kingdom", count: "150+ Universities", popular: false },
    { name: "Canada", code: "CA", slug: "canada", count: "100+ Universities", popular: false },
    { name: "Australia", code: "AU", slug: "australia", count: "40+ Universities", popular: false },
    { name: "France", code: "FR", slug: "france", count: "80+ Universities", popular: false },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Search & Hero Section */}
      <section className="relative px-6 md:px-16 pt-24 pb-16 overflow-hidden">
        {/* Background glow for dark mode */}
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase mb-4 shadow-sm border border-blue-200 dark:border-blue-800">
              Global Destinations
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Explore Top <span className="text-blue-600 dark:text-blue-400">Universities</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover the best universities around the world, browse by country, and find the perfect academic fit for your future.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-8 max-w-2xl mx-auto"
          >
            <div className="relative flex items-center group">
              <svg className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search for countries or universities..." 
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
              />
              <button className="absolute right-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="px-6 md:px-16 py-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold">Browse by Country</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select a destination to view verified university data</p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {destinations.map((dest) => (
            <Link key={dest.code} href={`/universities/by-country/${dest.slug}`}>
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white dark:bg-[#1f2937] rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden"
              >
                {dest.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                    Featured
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-14 relative overflow-hidden rounded-lg shadow-md border border-gray-100 dark:border-gray-800 group-hover:border-blue-400 transition-colors">
                    <Flag code={dest.code} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {dest.name}
                    </h3>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 block">
                      {dest.count}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Feature section for motivation */}
      <section className="px-6 md:px-16 py-20 mt-10 bg-blue-600 dark:bg-blue-900 border-t border-t-blue-500 dark:border-t-blue-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Need help choosing?</h2>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Our expert counselors can help you shortlist universities based on your profile, budget, and career choices.
          </p>
          <div className="pt-6">
            <Link href="/contact" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100 hover:scale-105 transition-all">
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
