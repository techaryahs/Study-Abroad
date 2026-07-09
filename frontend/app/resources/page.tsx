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
      className="min-h-screen pb-32 text-[#10324a]"
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
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .resource-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(16,50,74,0.10);
          border-radius: 28px;
          transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 20px rgba(16,50,74,0.04);
        }
        .resource-card:hover {
          transform: translateY(-10px);
          border-color: rgba(210,161,74,0.45);
          box-shadow: 0 32px 64px rgba(16,50,74,0.08);
        }

        .icon-ring {
          background: linear-gradient(135deg, rgba(44,165,157,0.15), rgba(210,161,74,0.15));
          color: #10324a;
          width: 60px; height: 60px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .resource-card:hover .icon-ring {
          background: #d2a14a;
          color: #10324a;
          transform: scale(1.08);
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative px-6 pt-12 pb-20 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(44,165,157,0.10) 0%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[12px] tracking-[0.3em] uppercase shadow-sm">
            Academic Resource Hub
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95]">
            <span className="gold-shimmer">Scholar&apos;s Arsenal</span>
          </h1>
          <p className="text-[#4b5b6a] text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
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
            <h2 className="text-4xl md:text-5xl font-black text-[#10324a]">
              All Resources
            </h2>
            <p className="text-[#4b5b6a] text-base mt-2 font-medium">
              Verified tools and databases for every stage of your journey
            </p>
          </div>
          <div className="flex gap-6 rounded-2xl border border-white/10 bg-[#10324a] px-7 py-4 shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
            <div className="flex flex-col border-r border-white/10 pr-6">
              <span className="text-[12px] font-black text-white/50 uppercase tracking-widest">
                Countries
              </span>
              <span className="text-xl font-black text-[#d2a14a]">150+</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-white/50 uppercase tracking-widest">
                Active Users
              </span>
              <span className="text-xl font-black text-[#d2a14a]">12k+</span>
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
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#d2a14a]/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <div className="icon-ring">{category.icon}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-black text-[#0f4c5c] border border-[#2ca59d]/25 bg-[#2ca59d]/5 px-2.5 py-0.5 rounded-md uppercase tracking-widest">
                      {category.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#4b5b6a]/70 uppercase tracking-wide">
                      {category.stat}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2.5">
                  <h3 className="text-[1.75rem] font-black text-[#10324a] leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#4b5b6a] leading-relaxed font-medium">
                    {category.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-3 flex items-center text-[#d2a14a] font-black text-[12px] tracking-widest uppercase gap-2">
                  Explore <ArrowRight size={15} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}