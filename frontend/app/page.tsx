"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
    <main className="relative min-h-screen bg-[#F8F6F1] text-[#675F5B] overflow-hidden pt-6 font-base selection:bg-[#D4A848]/10">

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
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 flex flex-col xl:flex-row gap-10 pt-4 pb-4">

        {/* LEFT */}
        <div className="xl:w-3/5 space-y-12">

          {/* HERO TEXT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.1] font-black tracking-tighter text-[#362B25]">
              Education Leader - Led Path to <br />
              <span className="text-[#D4A848]">
                Ivy League &
              </span>
              <br />
              <span className="text-[#D4A848]">
                Top Global Universities
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-[#675F5B] text-xs sm:text-sm leading-relaxed max-w-xl italic font-medium">
              Personalized higher study guidance for USA, UK, Germany,
              Australia, Ireland, and Dubai — powered by AI-driven support.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 pt-1">

              <button
                onClick={() => setShowCounsellingModal(true)}
                className="bg-[#D4A848] text-[#40332D] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all"
              >
                Talk to an Expert
              </button>
                         <button onClick={() => window.open('https://wa.me/918987654321', '_blank')}
              className="border-[1.5px] border-[#40332D] px-6 py-2.5 rounded-[0.8rem] text-[#40332D] text-xs sm:text-[13px] font-black uppercase tracking-widest hover:bg-[#D4A848] hover:text-[#40332D] transition-all"
            >
              Whatsapp Us
            </button>
            </motion.div>
          </motion.div>

          <div className="pt-4">
            <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-black text-[#D4A848]">Why Students Trust Us</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {servicesRow.map((s, i) => (
                <Link key={i} href={s.link}>
                  <div className="bg-[#40332D] p-5 rounded-2xl text-center shadow-[0_10px_30px_rgba(212,168,72,0.08)] border border-[#D4A848]/20 hover:border-[#D4A848]/60 hover:shadow-[0_10px_40px_rgba(212,168,72,0.15)] hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#D4A848]/10 text-[#D4A848] flex items-center justify-center rounded-xl border border-[#D4A848]/20">
                      {s.icon}
                    </div>
                    <p className="text-[#F8F6F1] text-[13px] font-semibold leading-tight">{s.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 text-center sm:text-left">
            <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-black text-[#D4A848]">Top Destinations</h3>

            <div className="flex justify-between max-w-[600px] relative">
              <div className="absolute top-5 left-0 right-0 h-[1px] bg-[#D4A848]/20"></div>

              {flagsRow.map((f, i) => (
                <div key={i} className="flex flex-col items-center z-10 w-full mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4A848] shadow-xl">
                    <Flag code={f.code} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-widest mt-2 text-[#362B25]/40">{f.name}</span>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* RIGHT */}
        <div className="xl:w-2/5 flex flex-col items-center relative z-20 pb-16">

          {/* IMAGE */}
          <div className="relative w-full max-w-[340px] h-[420px] rounded-[3rem] overflow-hidden border border-[#D4A848]/40 shadow-[0_20px_60px_-15px_rgba(212,168,72,0.4)] transition-all hover:shadow-[0_25px_65px_-10px_rgba(212,168,72,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#40332D] via-transparent to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden w-full h-[380px] sm:h-[400px] md:h-[420px]" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((src, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image
                      src={src}
                      alt={`Dr Alam ${i}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      quality={60}
                      className="object-cover object-top"
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DREAMS */}
          <div className="mt-6 bg-[#40332D] p-6 rounded-3xl grid grid-cols-4 gap-4 shadow-[0_10px_40px_rgba(212,168,72,0.12)] border border-[#D4A848]/20 w-full max-w-[450px]">
            {dreams.map((d, i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-5 mx-auto mb-2 rounded-sm overflow-hidden border border-[#D4A848]/20">
                  <Flag code={d.code} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-[#D4A848]">{d.name}</p>
                <p className="text-sm font-black text-[#F8F6F1]">{d.stat}</p>
                <p className="text-[8px] text-[#F8F6F1]/60 font-bold uppercase tracking-widest">{d.sub}</p>
              </div>
            ))}
          </div>

          {/* STATS ROW (Moved to Right Side) */}
          <div className="mt-8 w-full max-w-[450px] grid grid-cols-2 gap-y-8 gap-x-4 pl-2">
            {statsRow.map((stat, i) => (
              <div key={i} className="text-left">
                <h2 className="text-[#362B25] text-[2.5rem] leading-none font-black tracking-tighter drop-shadow-sm">{stat.value}</h2>
                <p className="text-[10px] text-[#675F5B]/60 font-black uppercase tracking-[0.25em] mt-2">{stat.label}</p>
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