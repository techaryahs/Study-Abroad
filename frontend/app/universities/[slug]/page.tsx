"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, MapPin, Globe, BookOpen, Users, Star, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function UniversityDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  
  // Format the slug to a more readable name
  const universityName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      <section className="relative pt-24 pb-12 px-6 md:px-16 max-w-7xl mx-auto">
        <Link href="/universities" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Universities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Top Rated
                </span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  4.8 (2.5k Reviews)
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                {universityName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Main Campus, Global City
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  www.{slug}.edu
                </span>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border border-gray-200 dark:border-white/5 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4">About the University</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {universityName} is a world-renowned institution dedicated to excellence in teaching, research, and innovation. 
                With a rich history of academic success and a vibrant international community, our university offers students 
                a unique environment to grow personally and professionally.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">15k+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">#42</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">World Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">94%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Employability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">120+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Programs</div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <h3 className="font-bold text-lg">Top Courses</h3>
                </div>
                <ul className="space-y-3">
                  {['Computer Science', 'Business Administration', 'Data Science', 'Mechanical Engineering'].map((course) => (
                    <li key={course} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-500" />
                  <h3 className="font-bold text-lg">Campus Life</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Experience a diverse and inclusive campus culture with over 100 student clubs, sports facilities, 
                  and modern accommodation options.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 sticky top-28"
            >
              <GraduationCap className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">Interested in {universityName}?</h3>
              <p className="text-blue-100 mb-8 font-medium">
                Our experts will guide you through the entire application process, scholarship search, and visa guidance.
              </p>
              <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                Apply Now
              </button>
              <p className="text-center text-blue-200 text-xs mt-4">
                Free initial consultation available
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
