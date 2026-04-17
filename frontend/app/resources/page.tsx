"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Star,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const resourceCategories = [
  {
    id: "scholarships",
    title: "Global Scholarships",
    description:
      "Access our audited repository of international funding opportunities and merit-based grants across 150+ countries.",
    icon: <GraduationCap size={26} />,
    href: "/resources/scholarships",
    badge: "Audited",
    stat: "500+ Programs",
  },
  {
    id: "research-groups",
    title: "Research Clusters",
    description:
      "Synchronize with Principal Investigators and collaborative scholars across global institutions.",
    icon: <Users size={26} />,
    href: "/resources/research-groups",
    badge: "Active",
    stat: "120+ Clusters",
  },
  {
    id: "eb1a-toolkit",
    title: "EB-1A Toolkit",
    description:
      "Strategic benchmarks for Extraordinary Ability visa candidates and high-impact researchers.",
    icon: <Briefcase size={26} />,
    href: "/resources/eb1a-toolkit",
    badge: "Premium",
    stat: "Visa Protocol",
  },
  {
    id: "loan-support",
    title: "Education Loans",
    description:
      "Optimized education financing and institutional loan frameworks for international students.",
    icon: <DollarSign size={26} />,
    href: "/resources/education-loans",
    badge: "Financial",
    stat: "Preferred Rates",
  },
  {
    id: "reviews",
    title: "University Reviews",
    description:
      "Verified academic critiques and peer evaluations from real students across global universities.",
    icon: <Star size={26} />,
    href: "/resources/reviews",
    badge: "Verified",
    stat: "Student Voices",
  },
  {
    id: "paper-services",
    title: "Scholarly Publishing",
    description:
      "End-to-end support for high-fidelity research paper development and IEEE/Scopus journal submission.",
    icon: <BookOpen size={26} />,
    href: "/services/research-papers",
    badge: "Scholarly",
    stat: "IEEE / Scopus",
  },
];

export default function ResourcesPage() {
  return (
    <main
      className="min-h-screen pb-32"
      style={{
        background: "#FDFBF7",
        color: "#2D2926",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
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
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .resource-card {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89,0.15);
          border-radius: 28px;
          transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .resource-card:hover {
          transform: translateY(-10px);
          border-color: rgba(197,160,89,0.45);
          box-shadow: 0 32px 64px rgba(197,160,89,0.09);
        }

        .icon-ring {
          background: rgba(197,160,89,0.07);
          color: #C5A059;
          width: 60px; height: 60px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .resource-card:hover .icon-ring {
          background: #C5A059;
          color: #fff;
          transform: scale(1.08);
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative px-6 pt-32 pb-20 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <span className="inline-block px-5 py-1.5 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[14px] font-bold tracking-[0.3em] uppercase shadow-sm">
            Academic Resource Hub
          </span>
          <h1 className="fd text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#2D2926] tracking-tight leading-[0.95]">
            Scholar&apos;s <span className="gold-shimmer">Arsenal</span>
          </h1>
          <p className="text-[#6B5E51] text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to fund your education, build your research
            profile, and navigate international admissions — all in one place.
          </p>
        </motion.div>
      </section>

      {/* ── RESOURCES GRID ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-20">
        {/* Section header */}
        <div className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="fd text-4xl md:text-5xl font-bold text-[#2D2926]">
              All Resources
            </h2>
            <p className="text-[#6B5E51] text-base mt-2 font-medium">
              Verified tools and databases for every stage of your journey
            </p>
          </div>
          <div className="flex gap-6 bg-white border border-[rgba(197,160,89,0.15)] px-7 py-4 rounded-2xl shadow-sm">
            <div className="flex flex-col border-r border-[#F1EDEA] pr-6">
              <span className="text-[14px] font-bold font-bold text-[#A8A29E] uppercase tracking-widest">
                Countries
              </span>
              <span className="text-xl font-bold text-[#2D2926]">150+</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold font-bold text-[#A8A29E] uppercase tracking-widest">
                Active Users
              </span>
              <span className="text-xl font-bold text-[#2D2926]">12k+</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceCategories.map((category, idx) => (
            <Link key={category.id} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="resource-card p-9 flex flex-col gap-7 h-full relative overflow-hidden"
              >
                {/* subtle bg accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[rgba(197,160,89,0.03)] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <div className="icon-ring">{category.icon}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[13px] font-bold font-bold text-[#C5A059] border border-[rgba(197,160,89,0.25)] px-2.5 py-0.5 rounded-md uppercase tracking-widest">
                      {category.badge}
                    </span>
                    <span className="text-[14px] font-bold font-bold text-[#A8A29E] uppercase tracking-wide">
                      {category.stat}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2.5">
                  <h3 className="fd text-[1.75rem] font-bold text-[#2D2926] leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#6B5E51] leading-relaxed font-medium">
                    {category.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-3 flex items-center text-[#C5A059] font-bold text-[14px] font-bold tracking-widest uppercase gap-2">
                  Explore <ArrowRight size={13} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
