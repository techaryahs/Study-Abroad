"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

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
    { title: "Admission Guidance", icon: "🏛️", link: "/services/admission-guidance" },
    { title: "University Shortlisting", icon: "📋", link: "/services/shortlisting" },
    { title: "SOP & LOR Support", icon: "✍️", link: "/services/sop" },
    { title: "Scholarship Assistance", icon: "🎓", link: "/services/scholarship-assistance" },
    { title: "Visa Guidance", icon: "🛂", link: "/services/visa-guidance" },
    { title: "Profile Building", icon: "📈", link: "/services/profile-building" },
  ];

  const flagsRow = [
    { name: "USA", code: "US" },
    { name: "UK", code: "GB" },
    { name: "Germany", code: "DE" },
    { name: "Australia", code: "AU" },
    { name: "Ireland", code: "IE" },
    { name: "Dubai", code: "AE" },
    { name: "Canada", code: "CA" },
  ];

  const statsRow = [
    { value: "1,500+", label: "Top Universities" },
    { value: "500+", label: "Elite Scholarships" },
    { value: "15+", label: "Global Destinations" },
    { value: "10,000+", label: "Premium Programs" },
  ];

  const dreams = [
    { code: "US", name: "USA", stat: "₹2Cr", sub: "Scholarship" },
    { code: "GB", name: "UK", stat: "Merit", sub: "Honors Awards" },
    { code: "DE", name: "GER", stat: "Full", sub: "Scholarship" },
    { code: "AU", name: "AUS", stat: "50%", sub: "Fee Waiver" },
  ];

  return (
    <main className="relative min-h-screen bg-[#F8F6F1] text-[#362B25] overflow-hidden pt-6 font-base selection:bg-[#D4A848]/10">

      {/* 🏙️ BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Elegant Horizontal Split matching Boutique theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F1] via-[#FDFBF7] to-[#F8F6F1] z-0"></div>

        {/* Global base to handle transparency if needed */}
        <div className="absolute inset-0 bg-[#F8F6F1]/50 z-0"></div>

        {/* University Background Image Layer */}
        <div className="absolute inset-0 z-10 mix-blend-multiply opacity-40">
          <Image
            src="/universityy.png"
            alt="University Background"
            fill
            sizes="100vw"
            quality={60}
            className="object-cover object-center grayscale"
            priority
          />
        </div>

        {/* Gradient overlays to soften the edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F1] via-transparent to-transparent z-10 w-full h-full opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F1]/80 via-transparent to-transparent z-10 w-full h-full"></div>

        {/* Gold Glow behind the person */}
        <div className="absolute right-[-10%] top-[20%] w-[700px] h-[700px] bg-[#D4A848]/5 blur-[150px] rounded-full z-10"></div>

        {/* Curved Golden Divider */}
        <div className="absolute top-[48%] left-[-10%] w-[120%] h-[300px] bg-transparent border-t border-[#D4A848]/10 rounded-[50%] shadow-[0_-10px_30px_rgba(179,152,94,0.05)] z-20"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-16 flex flex-col items-center text-center gap-16 pt-4 pb-24">

        {/* HERO TEXT */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 flex flex-col items-center w-full">
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-[3.5rem] leading-[1.15] font-black tracking-tight text-[#362B25]">
            Education Leader<br /> Led Path to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4A848] to-[#9c782b]">
              Ivy League & Top Global Universities
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-[#362B25] text-sm sm:text-base leading-relaxed max-w-2xl italic font-semibold">
            Personalized higher study guidance for USA, UK, Germany,
            Australia, Ireland, and Dubai — powered by AI-driven support.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center">
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="bg-[#D4A848] text-[#40332D] px-8 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-center w-full sm:w-auto"
            >
              Talk to an Expert
            </button>
            <button onClick={() => {
              const phone = (process.env.NEXT_PUBLIC_WTSP_PHONE || "+918657869659").replace(/\D/g, '');
              window.open(`https://wa.me/${phone}`, '_blank');
            }}
              className="border-[1.5px] border-[#40332D] px-8 py-3 rounded-xl text-[#40332D] text-xs md:text-[13px] font-black uppercase tracking-widest hover:bg-[#D4A848] hover:text-[#40332D] transition-all text-center w-full sm:w-auto"
            >
              Whatsapp Us
            </button>
          </motion.div>
        </motion.div>

        {/* WHY STUDENTS TRUST US */}
        <div className="w-full pt-8 flex flex-col items-center">
          <h3 className="text-sm uppercase tracking-[0.25em] mb-10 font-black text-[#362B25] text-center">Why Students Trust Us</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {servicesRow.map((s, i) => (
              <Link key={i} href={s.link}>
                <div className="bg-[#40332D] p-6 rounded-[24px] text-center shadow-[0_10px_30px_rgba(212,168,72,0.08)] border border-[#D4A848]/20 hover:border-[#D4A848]/60 hover:shadow-[0_10px_40px_rgba(212,168,72,0.15)] hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#D4A848]/10 text-[#D4A848] flex items-center justify-center rounded-2xl border border-[#D4A848]/20 text-xl">
                    {s.icon}
                  </div>
                  <p className="text-[#F8F6F1] text-sm font-bold leading-tight">{s.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* DREAMS - Centered */}
        <div className="bg-[#40332D] p-6 md:p-8 rounded-[2rem] grid grid-cols-2 md:grid-cols-4 gap-6 shadow-[0_10px_40px_rgba(212,168,72,0.12)] border border-[#D4A848]/20 w-full max-w-4xl mt-8">
          {dreams.map((d, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-6 mx-auto mb-3 rounded-[3px] overflow-hidden border border-[#D4A848]/20">
                <Flag code={d.code} className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#D4A848]">{d.name}</p>
              <p className="text-lg font-black text-[#F8F6F1]">{d.stat}</p>
              <p className="text-[9px] text-[#F8F6F1]/60 font-bold uppercase tracking-widest mt-1">{d.sub}</p>
            </div>
          ))}
        </div>

        {/* STATS ROW */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center mt-4">
          {statsRow.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <h2 className="text-[#362B25] text-4xl leading-none font-black tracking-tighter drop-shadow-sm">{stat.value}</h2>
              <p className="text-[10px] text-[#362B25]/80 font-black uppercase tracking-[0.25em] mt-3">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TOP DESTINATIONS */}
        <div className="w-full pt-10 flex flex-col items-center">
          <h3 className="text-sm uppercase tracking-[0.25em] mb-10 font-black text-[#362B25] text-center">Top Destinations</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 relative w-full max-w-4xl">
            <div className="absolute top-6 left-10 right-10 h-[1px] bg-[#D4A848]/20 hidden sm:block"></div>
            {flagsRow.map((f, i) => (
              <div key={i} className="flex flex-col items-center z-10 shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4A848] shadow-xl bg-white">
                  <Flag code={f.code} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-3 text-[#362B25] text-center">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL */}
      <BookCounsellingModal
        isOpen={showCounsellingModal}
        onClose={() => setShowCounsellingModal(false)}
      />
    </main>
  );
}