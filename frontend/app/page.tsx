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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  const services = [
    { title: "Admission Guidance", icon: "🎓", slug: "admission-guidance" },
    { title: "University Shortlisting", icon: "🏢", slug: "university-shortlisting" },
    { title: "SOP & LOR Support", icon: "📝", slug: "sop-lor-support" },
    { title: "Scholarship Assistance", icon: "💰", slug: "scholarship-assistance" },
    { title: "Visa Guidance", icon: "✈️", slug: "visa-guidance" },
    { title: "Profile Building", icon: "⭐", slug: "profile-building" },
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
    { val: "5★", label: "User Rating" },
  ];

  return (
    <main className="bg-dark-950 text-white relative overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center px-8 md:px-20 pt-48 md:pt-24 gap-20">
        {/* BACKGROUND IMAGE WITH BLUR */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-20 blur-[3px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/10 blur-[200px] rounded-full"></div>
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
            <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px] bg-gold-500/5 px-6 py-2 rounded-full border border-gold-500/20 backdrop-blur-md inline-block">
              Dr. Alam Global Admissions
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight uppercase">
              Architecting <br />
              <span className="gradient-text-gold italic">Global Careers</span>.
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed font-normal italic">
            Elite academic mentorship for the USA, UK, Germany, and beyond. 
            We turn potential into global prestige.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 items-center pt-8">
            <Link href="/contact" className="btn-gold !px-12">
              Evaluate My Profile
            </Link>

            <Link href="/services" className="btn-outline-gold !px-12">
              Our Expertise
            </Link>
          </motion.div>
        </motion.div>

        {/* HERO IMAGE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="md:w-2/5 z-10 relative flex justify-center md:justify-end items-center"
        >
          <div className="relative w-full aspect-square md:w-[600px] group">
            <div className="absolute inset-0 bg-gold-500/10 blur-[150px] rounded-full animate-pulse group-hover:bg-gold-500/20 duration-1000"></div>
            <Image
              src="/hero-main.png"
              alt="Dr. Alam Global Education"
              fill
              className="object-contain filter drop-shadow-[0_40px_100px_rgba(194,168,120,0.3)] relative z-10 animate-float"
            />
          </div>
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-48 px-8 md:px-20 relative bg-dark-900 border-y border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32 space-y-6"
        >
          <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Expertise</span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
            Elite <span className="gradient-text-gold">Admissions</span> Mentorship
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {services.map((service, i) => (
            <Link key={i} href={`/services/${service.slug}`}>
              <motion.div
                variants={itemVariants}
                className="glass-card flex flex-col items-start gap-10 group cursor-pointer hover:bg-gold-500 hover:text-black duration-700"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-3xl group-hover:bg-black group-hover:text-gold-500 transition-all duration-700 shadow-2xl">
                  {service.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-widest">{service.title}</h3>
                  <p className="text-white/30 group-hover:text-black/60 text-sm font-medium">Strategic guidance for global success.</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ================= COUNTRIES ================= */}
      <section className="py-48 px-8 md:px-20 bg-dark-950">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-8"
          >
            <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Global Destinations</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Your <span className="gradient-text-gold italic underline decoration-gold-500/20 underline-offset-[16px]">Future Hub</span>.</h2>
          </motion.div>
          <Link href="/countries" className="nav-link !text-gold-500 border-b border-gold-500/30 pb-2">
            Explore All Destinations
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8"
        >
          {preferredCountries.map((country, i) => (
            <Link key={i} href={`/countries/${country.name.toLowerCase()}`}>
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] text-center hover:bg-gold-500 hover:text-black transition-all duration-700 group cursor-pointer flex flex-col items-center gap-8 shadow-3xl hover:shadow-gold-500/20"
              >
                <div className="w-16 h-10 relative overflow-hidden rounded-lg shadow-2xl border border-white/10">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-black uppercase tracking-[0.2em]">{country.name}</div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-32 px-8 md:px-20 bg-dark-900 border-y border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-5 gap-16 text-center items-center"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="space-y-4">
              <h3 className="text-6xl md:text-8xl font-black tracking-tighter gradient-text-gold">{stat.val}</h3>
              <p className="uppercase tracking-[0.5em] font-black text-[10px] text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-64 px-8 md:px-20 text-center space-y-16 bg-dark-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-10 relative z-10"
        >
          <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter gradient-text-gold">
            READY TO ARCHITECT <br />YOUR FUTURE?
          </h2>
          <p className="text-white/30 text-xl md:text-3xl max-w-4xl mx-auto font-normal leading-relaxed italic">
            Don't leave your global dreams to chance. Partner with the academic elite.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center gap-12 pt-12 relative z-10"
        >
          <Link href="/contact" className="btn-gold !px-20 !py-8 text-xl">
            Book Evaluation
          </Link>

          <Link href="/about" className="btn-outline-gold !px-20 !py-8 text-xl">
            Our Pedigree
          </Link>
        </motion.div>
      </section>
    </main>
  );
}