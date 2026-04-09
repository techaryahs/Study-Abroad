'use client';

import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import DiscussionSection from "@/components/shared/DiscussionSection";
import FAQSection from "@/components/shared/FAQSection";
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Info,
  GraduationCap,
  Search,
  Plus,
  Minus,
  Video,
  Award,
  Star,
  Globe,
  Zap,
  Briefcase,
  Target,
  Scale
} from "lucide-react";

export default function ShortlistingPage() {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 18,
        duration: 0.6
      }
    }
  };

  const logos = [
    { name: "UPenn", src: "https://www.google.com/s2/favicons?domain=upenn.edu&sz=128" },
    { name: "Columbia", src: "https://www.google.com/s2/favicons?domain=columbia.edu&sz=128" },
    { name: "Harvard", src: "https://www.google.com/s2/favicons?domain=harvard.edu&sz=128" },
    { name: "Stanford", src: "https://www.google.com/s2/favicons?domain=stanford.edu&sz=128" },
    { name: "Yale", src: "https://www.google.com/s2/favicons?domain=yale.edu&sz=128" },
    { name: "MIT", src: "https://www.google.com/s2/favicons?domain=mit.edu&sz=128" }
  ];

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#675F5B] font-base selection:bg-[#D4A848]/20 relative overflow-hidden">

      {/* ── BACKGROUND AMBIENT GLOWS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4A848]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/2 left-0 w-[300px] h-[300px] bg-[#D4A848]/5 blur-[150px] rounded-full" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 px-8 md:px-20 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:w-1/2 space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] uppercase tracking-tight text-[#362B25] break-words">
                PROFILE EVALUATION & <br />
                <span className="text-[#D4A848]" > UNIVERSITY SHORTLISTING</span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 max-w-xl text-[#675F5B]/80 leading-relaxed font-medium">
              <p>
                More than <span className="font-bold text-[#362B25]">75%</span> of applicants blindly apply to universities <span className="font-bold text-[#362B25]">without</span> analyzing historical profile data.
              </p>
              <p>
                Our admission experts architect data-backed, tailored university portfolios optimized for elite acceptances, maximum funding, and seamless visa approvals.
              </p>
            </motion.div>

            <DiscussionSection serviceId="shortlisting" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/3] w-full group">
              <div className="absolute inset-0 bg-[#D4A848]/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-[#D4A848]/10 group-hover:border-[#D4A848]/30 transition-all duration-1000 shadow-2xl">
                <Image
                  src="/shortlisting-hero.png"
                  alt="Shortlisting realistic campus"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-2000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4A848]/10 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT SERVICE & WIDGET ── */}
      <section className="py-24 px-8 md:px-20 bg-[#F8F6F1] border-y border-[#D4A848]/10 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#362B25]">About Service</h2>
            <div className="w-16 h-[2px] bg-[#D4A848]" />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Main Info Column */}
            <div className="lg:w-2/3 space-y-8">
              {[
                {
                  t: "Personalized Curation",
                  icon: <Target size={24} className="text-[#D4A848]" />,
                  d: [
                    "We factor in your exact constraints—from geographical preferences and budget limitations to standardized testing waivers.",
                    "We craft a highly customized university portfolio that precisely mirrors your academic ambitions and personal criteria."
                  ]
                },
                {
                  t: "Funding-Optimized Mapping",
                  icon: <Award size={24} className="text-[#D4A848]" />,
                  d: [
                    "We analyze extensive historical data from recent admission cycles to identify institutions where candidates with your exact profile successfully secured grants and scholarships."
                  ]
                },
                {
                  t: "Outcome & Career Forecasting",
                  icon: <Briefcase size={24} className="text-[#D4A848]" />,
                  d: [
                    "By examining thousands of historical admission outcomes, we construct high-probability models determining where you are most likely to be accepted.",
                    "We heavily weigh post-graduation ROI, targeting universities known for robust alumni networks and premier job placement rates."
                  ]
                },
                {
                  t: "Independent & Objective Guidance",
                  icon: <Scale size={24} className="text-[#D4A848]" />,
                  d: [
                    "Low-ranking tier-3 institutions drastically increase the risk of visa denials, employment struggles, and severe financial setbacks for families.",
                    "We operate entirely independently. Our advisors will never steer you toward low-tier, commission-based partner universities.",
                    "We ensure you target the most prestigious universities within your reach to guarantee a world-class education and secure visa success."
                  ]
                }
              ].map((section, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-[#D4A848]/20 items-center justify-center shadow-sm group-hover:-translate-y-1 transition-all">
                    {section.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[17px] font-bold text-[#362B25] flex items-center gap-2">
                      <span className="sm:hidden w-8 h-8 flex items-center justify-center">{section.icon}</span>
                      {section.t}
                    </h3>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-[#675F5B] leading-relaxed text-[13px]">
                      {section.d.map((point, j) => (
                        <li key={j}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Widget Column */}
            <div className="lg:w-1/3 w-full sticky top-24">
              <AddToCart serviceId="shortlisting" />
            </div>
          </div>

          <div className="pt-16 space-y-10 border-t border-[#D4A848]/10 max-w-5xl">
            <h3 className="text-2xl font-bold text-[#362B25]">Our Signature Consultation Protocol</h3>
            <ul className="space-y-8 text-[15px] text-[#675F5B] leading-relaxed list-disc list-outside ml-6">
              <li><span className="font-bold text-[#362B25]">Deep Profile Audit:</span> We begin by meticulously evaluating your academic history, test scores, and extracurriculars to uncover your maximum potential.</li>
              <li><span className="font-bold text-[#362B25]">Aligning Your Vision:</span> You define the parameters. Share your ideal number of universities alongside any strict geographical, financial, or ranking requirements.</li>
              <li><span className="font-bold text-[#362B25]">Strategic Portfolio Construction:</span> Merging your parameters with our historical data analytics, we architect a tailored matrix of 'Reach', 'Target', and 'Safety' institutions designed for comprehensive security.</li>
              <li><span className="font-bold text-[#362B25]">Expert Review & Refinement:</span> Once your preliminary portfolio is built, you will collaborate 1-on-1 with your advisor to fine-tune and finalize every target destination.</li>
            </ul>
            <div className="pt-4">
              <p className="text-[15px] text-[#675F5B] bg-[#FFFFFF] p-6 rounded-2xl border border-[#D4A848]/20 shadow-sm relative overflow-hidden">
                <span className="absolute top-0 left-0 w-2 h-full bg-[#D4A848]" />
                <span className="font-bold text-[#362B25]">Zero-Commission Guarantee:</span> We maintain a strict zero-commission policy with universities. Your shortlist is purely driven by objective data and merit, completely protecting you from biased tier-3 institutional placements.
              </p>
            </div>
          </div>

        </div>
      </section>
      <FAQSection />
    </main>
  );
}
