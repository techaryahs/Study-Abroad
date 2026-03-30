"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const services = [
  { 
    title: "Admission Guidance", 
    slug: "admission-guidance",
    description: "Personalized advice from experts to help you apply for the best universities based on your profile and career goals.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20" />
      </svg>
    )
  },
  { 
    title: "University Shortlisting", 
    slug: "university-shortlisting",
    description: "Our data-driven process shortlists universities that maximize your chances of acceptance and offer the best programs.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    title: "SOP & LOR Support", 
    slug: "sop-lor-support",
    description: "Assistance in writing compelling Statement of Purpose and Letters of Recommendation to impact the admissions committee.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    title: "Scholarship Assistance", 
    slug: "scholarship-assistance",
    description: "Guidance in identifying and applying for scholarships, grants, and bursaries to reduce the financial burden of education.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    title: "Visa Guidance", 
    slug: "visa-guidance",
    description: "Complete support for the visa application process, document checklist, and interview preparation for successful outcomes.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    )
  },
  { 
    title: "Profile Building", 
    slug: "profile-building",
    description: "Strategies to enhance your profile with research papers, internships, and certifications before applying for Ivy League universities.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function ServicesPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-500/5 blur-[200px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-20 space-y-6">
          <span className="text-gold-500 uppercase tracking-[0.4em] font-black text-[10px]">What We Offer</span>
          <h1 className="text-2xl md:text-4xl font-black leading-[1.1]">Our Core <span className="gradient-text-gold italic">Services</span></h1>
          <p className="text-white/30 text-base max-w-2xl mx-auto font-normal italic">
            Precision, strategic guidance for Ivy League and Global Tier-1 excellence.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -10,
                rotateX: 5,
                rotateY: -5,
                z: 40
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1000 }}
              className="glass-card flex flex-col justify-between group cursor-default h-full transform-gpu"
            >
               <div className="space-y-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-gold-500 transition-colors uppercase">{service.title}</h3>
                  <p className="text-white/30 text-base leading-relaxed font-medium">{service.description}</p>
               </div>
               <div className="pt-12">
                  <Link href={`/services/${service.slug}`} className="btn-gold block text-center w-full px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-gold-500/20 active:scale-95 transition-all duration-500">
                    Get Details
                  </Link>
               </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}