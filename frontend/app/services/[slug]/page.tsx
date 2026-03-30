"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

const servicesData: Record<string, {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}> = {
  "admission-guidance": {
    title: "Admission Guidance",
    description: "Personalized advice from experts to help you apply for the best universities based on your profile and career goals.",
    details: [
      "Profile evaluation and gap analysis",
      "One-on-one expert mentorship",
      "University application strategy",
      "Admission interview preparation",
      "Enrollment and deposit assistance"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    )
  },
  "university-shortlisting": {
    title: "University Shortlisting",
    description: "Our data-driven process shortlists universities that maximize your chances of acceptance and offer the best programs.",
    details: [
      "Data-backed success probability",
      "Country and city comparison",
      "Tuition vs. ROI analysis",
      "Alumni networking insights",
      "Application deadlines tracking"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
      </svg>
    )
  },
  "sop-lor-support": {
    title: "SOP & LOR Support",
    description: "Assistance in writing compelling Statement of Purpose and Letters of Recommendation to impact the admissions committee.",
    details: [
      "Creative storytelling workshop",
      "Structural and grammatical polishing",
      "Unique value proposition drafting",
      "Plagiarism checks",
      "Multiple iteration support"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414" />
      </svg>
    )
  },
  "scholarship-assistance": {
    title: "Scholarship Assistance",
    description: "Guidance in identifying and applying for scholarships, grants, and bursaries to reduce the financial burden of education.",
    details: [
      "Global scholarship database access",
      "Merit-based application support",
      "Financial need documentation",
      "External grant identification",
      "Essay writing for scholarships"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" />
      </svg>
    )
  },
  "visa-guidance": {
    title: "Visa Guidance",
    description: "Complete support for the visa application process, document checklist, and interview preparation for successful outcomes.",
    details: [
      "Country-specific document checklist",
      "Mock visa interviews",
      "Financial proof documentation",
      "Sponsorship advisory",
      "Visa rejection appeal support"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    )
  },
  "profile-building": {
    title: "Profile Building",
    description: "Strategies to enhance your profile with research papers, internships, and certifications before applying for Ivy League universities.",
    details: [
      "Research paper publication help",
      "Internship placement advisory",
      "Certification recommendation",
      "Extra-curricular portfolio building",
      "Skill gap identification"
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];

  if (!service) return notFound();

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
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-gold-500/5 blur-[250px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10"
      >
        <Link href="/services" className="inline-flex items-center gap-4 text-gold-500 font-black uppercase tracking-[0.4em] text-[10px] hover:gap-6 transition-all duration-500 mb-12 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to expertise
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-20 h-20 rounded-2xl bg-gold-500 flex items-center justify-center text-black shadow-3xl shadow-gold-500/20 transform-gpu animate-float">
              <div className="scale-75 uppercase">
                {service.icon}
              </div>
            </div>
            
            <div className="space-y-4">
              <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px]">Service Expertise</span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
                {service.title.split(' ').slice(0, -1).join(' ')} <br />
                <span className="gradient-text-gold italic">{service.title.split(' ').slice(-1)}</span>
              </h1>
            </div>

            <p className="text-white/30 text-base md:text-lg font-normal leading-relaxed italic border-l-2 border-gold-500/20 pl-8 py-4">
              {service.description}
            </p>

            <div className="pt-8">
              <Link href="/contact" className="btn-gold !px-12 !py-5 text-[11px] font-black uppercase tracking-[0.3em]">
                Secure Mentorship
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ 
              rotateX: 3,
              rotateY: -3,
              scale: 1.01
            }}
            style={{ perspective: 1000 }}
            className="glass-card p-10 md:p-16 space-y-10 border-gold-500/10 transform-gpu transition-all duration-700 bg-white/[0.01]"
          >
            <h3 className="text-xl font-black uppercase tracking-[0.3em] border-b border-white/5 pb-8">Strategic Coverage:</h3>
            <ul className="space-y-6">
              {service.details.map((detail, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-6 group/item"
                >
                  <div className="w-4 h-[1px] bg-gold-500 group-hover/item:w-8 transition-all"></div>
                  <span className="text-white/40 group-hover/item:text-gold-500 text-sm md:text-base font-medium transition-colors uppercase tracking-widest">{detail}</span>
                </motion.li>
              ))}
            </ul>

            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] -z-10 group-hover:bg-gold-500/10 transition-colors pointer-events-none"></div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
