"use client";

import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  const services = [
    { 
      title: "Admission Guidance", 
      slug: "admission-guidance",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20" />
        </svg>
      )
    },
    { 
      title: "University Shortlisting", 
      slug: "university-shortlisting",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      title: "SOP & LOR Support", 
      slug: "sop-lor-support",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      title: "Scholarship Assistance", 
      slug: "scholarship-assistance",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "Visa Guidance", 
      slug: "visa-guidance",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    { 
      title: "Profile Building", 
      slug: "profile-building",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
  ];

  const preferredCountries = [
    { name: "USA", code: "US" },
    { name: "UK", code: "GB" },
    { name: "Germany", code: "DE" },
    { name: "Australia", code: "AU" },
    { name: "Ireland", code: "IE" },
    { name: "Dubai", code: "AE" },
    { name: "Canada", code: "CA" },
  ];

  const stats = [
    { val: "15+", label: "Countries" },
    { val: "360+", label: "Universities" },
    { val: "1k+", label: "Students" },
    { val: "500+", label: "Admissions" },
    { 
      val: "5", 
      label: "User Rating",
      icon: (
        <svg className="w-6 h-6 text-gold-500 inline-block ml-2 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )
    },
  ];

  return (
    <main className="bg-dark-950 text-white relative overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[75vh] flex flex-col md:flex-row items-center px-8 md:px-20 pt-24 pb-16 md:pt-32 gap-10">
        {/* BACKGROUND IMAGE WITH BLUR */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-20 blur-[5px] scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/10 blur-[200px] rounded-full"
          ></motion.div>
        </div>

        {/* HERO CONTENT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="md:w-3/5 z-10 relative space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <span className="text-gold-500 uppercase tracking-[0.6em] font-black text-[10px] bg-gold-500/5 px-6 py-2 rounded-full border border-gold-500/20 backdrop-blur-3xl inline-block shadow-[0_0_20px_rgba(194,168,120,0.1)]">
              Dr. Alam Global Admissions
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] uppercase">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Architecting
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="gradient-text-gold italic block mt-2"
              >
                Global Careers
              </motion.span>
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-white/40 max-w-2xl leading-relaxed font-normal italic">
            Elite academic mentorship for the USA, UK, Germany, and beyond. 
            We turn potential into global prestige.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 items-center pt-4">
            <Link href="/contact" className="btn-gold px-8 py-4 text-xs">
              Evaluate My Profile
            </Link>

            <Link href="/services" className="btn-outline-gold px-8 py-4 text-xs">
              Our Expertise
            </Link>
          </motion.div>
        </motion.div>

        {/* HERO IMAGE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-2/5 z-10 relative flex justify-center md:justify-end items-center"
        >
          <div className="relative w-full aspect-square md:w-[550px] group">
            <div className="absolute inset-0 bg-gold-500/20 blur-[180px] rounded-full animate-pulse group-hover:bg-gold-500/30 duration-2000 transition-colors"></div>
            <Image
              src="/hero-main.png"
              alt="Dr. Alam Global Education"
              fill
              className="object-contain filter drop-shadow-[0_60px_120px_rgba(194,168,120,0.4)] relative z-10 animate-float"
            />
          </div>
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-32 px-8 md:px-20 relative bg-dark-900 border-y border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-4"
        >
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px] block">Expertise Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-none">
            Elite <span className="gradient-text-gold">Admissions</span> <br />Mentorship
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {services.map((service, i) => (
            <Link key={i} href={`/services/${service.slug}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  rotateX: 5,
                  rotateY: -5,
                  z: 50
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: 1000 }}
                className="glass-card flex flex-col items-start gap-8 group cursor-pointer hover:bg-gold-500 hover:text-black duration-700 h-full relative transform-gpu"
              >
                <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-3xl group-hover:bg-black group-hover:text-gold-500 transition-all duration-700 shadow-3xl">
                  {service.icon}
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] leading-none">{service.title}</h3>
                  <p className="text-white/30 group-hover:text-black/60 text-base font-medium leading-relaxed italic">Precise, strategic guidance for Ivy League and Global Tier-1 excellence.</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ================= COUNTRIES ================= */}
      <section className="py-32 px-8 md:px-20 bg-dark-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gold-500/5 blur-[180px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-6"
          >
            <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px]">Global Destinations</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none italic">Your <span className="gradient-text-gold underline decoration-gold-500/10 underline-offset-[10px] decoration-4">Future Hub</span>.</h2>
          </motion.div>
          <Link href="/countries" className="nav-link !text-gold-500 border-b-2 border-gold-500/30 pb-2 text-sm font-black hover:border-gold-500 hover:tracking-[0.4em] transition-all duration-700">
            Explore All Destinations
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-7 gap-6"
        >
          {preferredCountries.map((country, i) => (
            <Link key={i} href={`/countries/${country.name.toLowerCase()}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  rotateY: 10,
                  z: 20
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/[0.01] border border-white/10 p-8 rounded-[3rem] text-center hover:bg-gold-500 hover:text-black transition-all duration-700 group cursor-pointer flex flex-col items-center gap-6 shadow-4xl hover:shadow-gold-500/20 relative overflow-hidden transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-10 relative overflow-hidden rounded-lg shadow-2xl border border-white/10 group-hover:border-black/20 transition-all">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{country.name}</div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 border-y border-white/5 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-5 gap-12 text-center items-center"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              whileHover={{ scale: 1.1, rotateZ: 2 }}
              className="space-y-4 group"
            >
              <h3 className="text-3xl md:text-5xl font-black tracking-tight gradient-text-gold transition-transform duration-700">{stat.val}</h3>
              <p className="uppercase tracking-[0.3em] font-black text-[9px] text-white/20 group-hover:text-gold-500 transition-colors duration-700">{stat.label}</p>
              {stat.icon && (
                <div className="mt-2 opacity-20 group-hover:opacity-100 transition-all duration-700">{stat.icon}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-48 px-8 md:px-20 text-center bg-dark-950 relative overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold-500/5 blur-[300px] rounded-full pointer-events-none"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="space-y-10 relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-[1.0] gradient-text-gold">
            ARCHITECT <br />YOUR FUTURE.
          </h2>
          <p className="text-white/30 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed italic border-t border-white/5 pt-12">
            Partner with the academic elite. <br />
            Turn your global ambitions into reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center gap-6 pt-16 relative z-10"
        >
          <Link href="/contact" className="btn-gold px-12 py-5 text-base">
            Book Evaluation
          </Link>

          <Link href="/about" className="btn-outline-gold px-12 py-5 text-base hover:bg-gold-500 hover:text-black">
            Our Pedigree
          </Link>
        </motion.div>
      </section>
    </main>
  );
}