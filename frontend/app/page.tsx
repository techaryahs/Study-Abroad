"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

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
    { value: "15+", label: "Countries" },
    { value: "360+", label: "Top Universities" },
    { value: "1000+", label: "Admits Received" },
    { value: "500+", label: "Tier 1 Institutes" },
  ];

  const dreams = [
    { code: "US", name: "USA", stat: "₹2Cr", sub: "Scholarship" },
    { code: "GB", name: "UK", stat: "Merit", sub: "Honors Awards" },
    { code: "DE", name: "GER", stat: "Full", sub: "Scholarship" },
    { code: "AU", name: "AUS", stat: "50%", sub: "Fee Waiver" },
  ];

  const images = ["/sir2.jpeg", "/sirbgggg.png", "/sirbgg.png", "/sirbggg.png", "/sir2.jpeg"];

  return (
    <main className="relative min-h-screen bg-[#3E2723] text-gold-200 overflow-hidden pt-16">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky / Universe dark overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#4E342E_0%,#0A0505_70%)] z-0"></div>

        {/* University Background Image Layer */}
        <div className="absolute inset-0 z-10 mix-blend-luminosity opacity-40">
          <Image
            src="/universityy.png"
            alt="University Background"
            fill
            sizes="100vw"
            quality={60}
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlays to darken the bottom and left edges of the University Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0505] via-transparent to-transparent z-10 w-full h-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0505] via-transparent to-transparent z-10 w-full h-full"></div>

        {/* Gold Glow behind the person */}
        <div className="absolute right-[-10%] top-[20%] w-[700px] h-[700px] bg-gold-500/10 blur-[150px] rounded-full z-10"></div>

        {/* Curved Golden Divider (simulated with radial element) */}
        <div className="absolute top-[48%] left-[-10%] w-[120%] h-[300px] bg-transparent border-t border-gold-500/20 rounded-[50%] shadow-[0_-10px_30px_rgba(194,168,120,0.15)] z-20"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 flex flex-col xl:flex-row gap-10 pt-10">

        {/* LEFT */}
        <div className="xl:w-3/5 space-y-12">

          {/* HERO TEXT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.1] font-black tracking-tighter">
              Education Leader - Led Path to <br />
              <span className="gradient-text-gold">
                Ivy League &
              </span>
              <br />
              <span className="gradient-text-gold">
                Top Global Universities
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gold-200/60 text-sm leading-relaxed max-w-xl">
              Personalized higher study guidance for USA, UK, Germany,
              Australia, Ireland, and Dubai — powered by AI-driven support.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4">
              <button
                onClick={() => setShowCounsellingModal(true)}
                className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-[#3E2723] px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(194,168,120,0.25)] hover:scale-105 active:scale-95 transition-all"
              >
                Book Free Evaluation
              </button>

              <button
                onClick={() => setShowCounsellingModal(true)}
                className="border border-gold-500/30 px-6 py-3 rounded-xl text-gold-500 font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-all backdrop-blur-sm"
              >
                Talk to an Expert
              </button>
            </motion.div>
          </motion.div>

          <div className="pt-4">
            <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-black text-gold-500">Why Students Trust Us</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {servicesRow.map((s, i) => (
                <Link key={i} href={s.link}>
                  <div className="bg-gradient-to-br from-[#4E342E]/80 to-[#2D1B19]/50 p-5 rounded-2xl text-center shadow-xl border border-white/5 hover:border-gold-500/30 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gold-500/10 text-gold-500 flex items-center justify-center rounded-xl border border-gold-500/20">
                      {s.icon}
                    </div>
                    <p className="text-gold-100 text-[13px] font-semibold leading-tight">{s.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <h3 className="text-sm uppercase tracking-[0.2em] mb-4 font-black text-gold-500">Top Destinations</h3>

            <div className="flex justify-between max-w-[600px] relative">
              <div className="absolute top-5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

              {flagsRow.map((f, i) => (
                <div key={i} className="flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500/50 shadow-[0_0_15px_rgba(194,168,120,0.3)]">
                    <Flag code={f.code} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-widest mt-2 text-gold-200/60">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="flex gap-10 pt-6">
            {statsRow.map((stat, i) => (
              <div key={i}>
                <h2 className="text-gold-500 text-3xl font-black tracking-tighter">{stat.value}</h2>
                <p className="text-[10px] text-gold-200/40 font-black uppercase tracking-[0.2em] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-[#3E2723] px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Book Now
            </button>

            <a
              href="https://wa.me/918987654321"
              target="_blank"
              className="border border-gold-500/30 px-8 py-3 rounded-xl text-gold-500 font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-all backdrop-blur-sm"
            >
              Whatsapp Us
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="xl:w-2/5 flex flex-col items-center relative z-20 pb-16">

          {/* IMAGE */}
          <div className="relative w-full max-w-[450px] h-[550px] rounded-[3rem] overflow-hidden border border-gold-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0505] via-transparent to-transparent z-10" />

            <div className="overflow-hidden w-full h-[400px] sm:h-[450px] md:h-[550px]" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((src, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image
                      src={src}
                      alt={`Dr Alam ${i}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      quality={60}
                      className="object-cover"
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DREAMS */}
          <div className="mt-6 bg-gradient-to-br from-[#4E342E] to-[#2D1B19] p-6 rounded-3xl grid grid-cols-4 gap-4 shadow-2xl border border-gold-500/10 w-full max-w-[450px]">
            {dreams.map((d, i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-5 mx-auto mb-2 rounded-sm overflow-hidden border border-white/10">
                  <Flag code={d.code} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gold-500">{d.name}</p>
                <p className="text-sm font-black text-gold-100">{d.stat}</p>
                <p className="text-[8px] text-ivory/30 font-bold uppercase tracking-widest">{d.sub}</p>
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