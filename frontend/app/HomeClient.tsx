"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Compass, FileCheck2, PenTool, Sparkles } from "lucide-react";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import {
  GraduationCap,
  Building2,
  FileSignature,
  BadgeDollarSign,
  Plane,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const servicesRow = [
    {
      title: "Admission Guidance",
      icon: Building2,
      link: "/services/admission-guidance",
    },
    {
      title: "University Shortlisting",
      icon: GraduationCap,
      link: "/services/shortlisting",
    },
    {
      title: "SOP & LOR Support",
      icon: FileSignature,
      link: "/services/sop",
    },
    {
      title: "Scholarship Assistance",
      icon: BadgeDollarSign,
      link: "/services/scholarship",
    },
    {
      title: "Visa Guidance",
      icon: Plane,
      link: "/services/visa-guidance",
    },
    {
      title: "Profile Building",
      icon: TrendingUp,
      link: "/services/portfolio",
    },
  ];

  const destinations = [
    { name: "USA", code: "US", description: "Ivy League pathways & elite campuses" },
    { name: "UK", code: "GB", description: "Prestige, research, and global alumni" },
    { name: "Germany", code: "DE", description: "High-value STEM and innovation programs" },
    { name: "Australia", code: "AU", description: "Practical learning with global industry reach" },
    { name: "Canada", code: "CA", description: "Scholarship-friendly, student-first education" },
    { name: "Ireland", code: "IE", description: "Strong career outcomes and innovation hubs" },
  ];

  const featureTools = [
    {
      title: "AI SOP Generator",
      description: "Create a tailored, admissions-ready statement of purpose in minutes.",
      link: "/ai-services/sop-generator",
      icon: PenTool,
      accent: "from-[#2ca59d] to-[#0f4c5c]",
    },
    {
      title: "AI & Plagiarism Remover Tool",
      description: "Polish and humanize your drafts before you submit them.",
      link: "/ai_services/ai_plagrism_tool",
      icon: FileCheck2,
      accent: "from-[#d2a14a] to-[#8a5f16]",
    },
  ];

  const partnerMarks = [
    { name: "AdmitPilot", tag: "Predict your shortlist" },
    { name: "VisaFlow", tag: "Clear, guided support" },
    { name: "ScholarshipIQ", tag: "Smarter funding insight" },
    { name: "CampusCompass", tag: "Destination-first planning" },
  ];

  const statsRow = [
    { value: "1,500+", label: "Top Universities" },
    { value: "500+", label: "Elite Scholarships" },
    { value: "15+", label: "Global Destinations" },
    { value: "10,000+", label: "Premium Programs" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(44,165,157,0.16),_transparent_30%),linear-gradient(135deg,_#f8f4ea_0%,_#fcfbf7_100%)] pt-12 lg:pt-20 text-[#10324a] selection:bg-[#d2a14a]/20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.9),rgba(255,255,255,0.45))]" />
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/global-campus-hero.png"
            alt="Global campus background"
            fill
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f4ea]/90 via-transparent to-[#f8f4ea]/70" />
        <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-12 sm:px-8 lg:px-12">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 rounded-[36px] border border-[#10324a]/10 bg-white/80 p-6 shadow-[0_30px_90px_rgba(16,50,74,0.08)] backdrop-blur-xl xl:grid-cols-[1.1fr_0.9fr] xl:p-8"
        >
          <div className="max-w-2xl text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-[#0f4c5c]">
              <Sparkles size={14} /> Study Abroad, Reimagined
            </motion.div>
            <motion.h1 variants={itemVariants} className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.03em] text-[#D4A54A] sm:text-5xl lg:text-6xl">
              The World Is Your Campus.
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 max-w-xl text-lg leading-8 text-[#4b5b6a] sm:text-xl">
              Empowering students to learn, grow, and thrive on a global stage.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowCounsellingModal(true)}
                className="inline-flex items-center justify-center rounded-2xl bg-[#d2a14a] px-7 py-3 text-sm font-black uppercase tracking-[0.24em] text-[#16364b] shadow-[0_16px_40px_rgba(210,161,74,0.28)] transition-all hover:-translate-y-1 active:scale-95"
              >
                Talk to an Expert
              </button>
              <button
                onClick={() => {
                  const phone = (process.env.NEXT_PUBLIC_WTSP_PHONE || "+918657869659").replace(/\D/g, "");
                  window.open(`https://wa.me/${phone}`, "_blank");
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-[#10324a]/15 px-7 py-3 text-sm font-black uppercase tracking-[0.24em] text-[#10324a] transition-all hover:bg-[#10324a] hover:text-white"
              >
                WhatsApp Us
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-5 flex flex-wrap gap-3">
              {[
                "Personalized mentorship",
                "Scholarship strategy",
                "Visa-ready planning",
              ].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-[#10324a]/10 bg-[#f7fbfd] px-3 py-2 text-sm font-semibold text-[#4b5b6a]">
                  <CheckCircle2 size={15} className="text-[#2ca59d]" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="rounded-[32px] border border-[#10324a]/10 bg-[#10324a] p-5 text-white shadow-[0_20px_60px_rgba(16,50,74,0.18)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d2a14a]">Your next step</p>
                <h2 className="mt-2 text-2xl font-black">From profile to placement.</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <BrainCircuit size={24} className="text-[#d2a14a]" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {statsRow.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black text-[#f8f4ea]">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="mt-14 rounded-[32px] border border-[#10324a]/10 bg-white/80 p-8 shadow-[0_16px_50px_rgba(16,50,74,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#0f4c5c]">Popular destinations</p>
              <h3 className="text-2xl font-black text-[#10324a]">Study where ambition belongs</h3>
            </div>
            <Link href="/universities" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-[#2ca59d]">
              Explore all destinations <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {destinations.map((country) => (
              <div key={country.name} className="group flex items-center justify-between rounded-[24px] border border-[#10324a]/10 bg-[#f8fcfe] p-5 transition hover:-translate-y-1 hover:border-[#d2a14a]/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#10324a]/10 bg-white">
                    <Flag code={country.code} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#10324a]">{country.name}</p>
                    <p className="text-sm text-[#4b5b6a]">{country.description}</p>
                  </div>
                </div>
                <div className="rounded-full bg-[#2ca59d]/10 p-2 text-[#2ca59d]">
                  <Compass size={16} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {servicesRow.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.title}
                href={service.link}
                className="group rounded-[24px] border border-[#10324a]/10 bg-white/70 p-6 shadow-[0_12px_35px_rgba(16,50,74,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2ca59d]/15 to-[#d2a14a]/15 transition-all duration-300 group-hover:scale-110">
                  <Icon
                    size={28}
                    strokeWidth={2}
                    className="text-[#10324a]"
                  />
                </div>

                <h4 className="text-xl font-black text-[#10324a]">
                  {service.title}
                </h4>

                <p className="mt-3 text-base leading-7 text-[#4b5b6a]">
                  Support built around your study abroad goals.
                </p>
              </Link>
            );
          })}
        </section>
      </div>

      <BookCounsellingModal
        isOpen={showCounsellingModal}
        onClose={() => setShowCounsellingModal(false)}
      />
    </main>
  );
}