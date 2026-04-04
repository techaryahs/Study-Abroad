"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

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

  const images = [
    "/sirbgggg.png",
    "/sirbgg.png",
    "/sirbggg.png",
    "/sirbgggg.png",
    "/sirbgg.png",
    "/sirbggg.png",
  ];

  return (
    <main className="relative min-h-screen bg-[#05070F] text-white overflow-hidden pt-16">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky / Universe dark overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1a2747_0%,#040712_70%)] z-0"></div>

        {/* University Background Image Layer */}
        <div className="absolute inset-0 z-10 mix-blend-luminosity opacity-40">
          <Image
            src="/universityy.png"
            alt="University Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlays to darken the bottom and left edges of the University Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040712] via-transparent to-transparent z-10 w-full h-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#040712] via-transparent to-transparent z-10 w-full h-full"></div>

        {/* Gold Glow behind the person */}
        <div className="absolute right-[-10%] top-[20%] w-[700px] h-[700px] bg-[#d4af37]/30 blur-[150px] rounded-full z-10"></div>

        {/* Curved Golden Divider (simulated with radial element) */}
        <div className="absolute top-[48%] left-[-10%] w-[120%] h-[300px] bg-transparent border-t border-[#d4af37]/50 rounded-[50%] shadow-[0_-10px_30px_rgba(212,175,55,0.15)] z-20"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 flex flex-col xl:flex-row gap-10 pt-10">

        {/* LEFT */}
        <div className="xl:w-3/5 space-y-12">

          {/* HERO TEXT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[3.8rem] leading-[1.1] font-semibold">
              Education Leader - Led Path to <br />
              <span className="bg-gradient-to-r from-[#f5e6c8] to-[#d4af37] bg-clip-text text-transparent font-bold">
                Ivy League &
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#f5e6c8] to-[#d4af37] bg-clip-text text-transparent font-bold">
                Top Global Universities
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-300 text-sm leading-relaxed">
              Personalized higher study guidance for USA, UK, Germany,
              Australia, Ireland, and Dubai — powered by AI-driven support.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4">
              <button
                onClick={() => setShowCounsellingModal(true)}
                className="bg-gradient-to-r from-[#e6c47a] to-[#caa24d] text-black px-6 py-3 rounded-md font-semibold shadow-lg hover:scale-105 transition"
              >
                Book Free Profile Evaluation
              </button>

              <button
                onClick={() => setShowCounsellingModal(true)}
                className="border border-[#d4af37]/40 px-6 py-3 rounded-md text-[#e6c47a] hover:bg-[#d4af37]/10 transition"
              >
                Talk to an Expert
              </button>
            </motion.div>
          </motion.div>

          {/* SERVICES */}
          <div>
            <h3 className="text-xl mb-4 font-semibold">Why Students Trust Us</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {servicesRow.map((s, i) => (
                <Link key={i} href={s.link}>
                  <div className="bg-[#f8f5ef] p-4 rounded-xl text-center shadow-lg border-b-4 border-[#caa24d] hover:scale-105 transition">
                    <div className="w-12 h-12 mx-auto mb-2 bg-[#0c1324] text-[#d4af37] flex items-center justify-center rounded-lg">
                      {s.icon}
                    </div>
                    <p className="text-black text-xs font-semibold">{s.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FLAGS */}
          <div>
            <h3 className="text-xl mb-4 font-semibold">Top Destinations</h3>

            <div className="flex justify-between max-w-[600px] relative">
              <div className="absolute top-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

              {flagsRow.map((f, i) => (
                <div key={i} className="flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37]">
                    <Flag code={f.code} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs mt-1">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="flex gap-10 pt-6">
            {statsRow.map((stat, i) => (
              <div key={i}>
                <h2 className="text-[#d4af37] text-2xl font-bold">{stat.value}</h2>
                <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="bg-gradient-to-r from-[#e6c47a] to-[#caa24d] text-black px-8 py-3 rounded-md font-bold"
            >
              Book Now
            </button>

            <a
              href="https://wa.me/918987654321"
              target="_blank"
              className="border px-8 py-3 rounded-md"
            >
              Whatsapp Us
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="xl:w-2/5 flex flex-col items-center relative z-20 pb-16">

          {/* IMAGE */}
          <div className="relative w-full max-w-[450px] h-[550px] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl">

            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              speed={800}
              className="w-full h-full"
            >
              {images.map((src, i) => (
                <SwiperSlide key={i} className="h-full">
                  <div className="w-full h-full">
                    <Image
                      src={src}
                      alt={`Dr Alam ${i}`}
                      width={450}
                      height={550}
                      className="object-cover w-full h-full"
                      priority={i === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DREAMS */}
          <div className="mt-6 bg-[#f8f5ef] text-black p-4 rounded-xl grid grid-cols-4 gap-3 shadow-xl w-full max-w-[450px]">
            {dreams.map((d, i) => (
              <div key={i} className="text-center">
                <Flag code={d.code} className="w-6 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold">{d.name}</p>
                <p className="text-sm font-bold">{d.stat}</p>
                <p className="text-[9px] text-gray-500">{d.sub}</p>
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