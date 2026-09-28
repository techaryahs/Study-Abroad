"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import DiscussionSection from "@/components/shared/DiscussionSection";
import ServiceCTA from "@/components/shared/ServiceCTA";

interface ServiceLayoutProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  accentClass?: string;
  serviceId?: string;
}

export default function ServiceLayout({ title, description, details, icon, serviceId }: ServiceLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 110,
        damping: 18,
        duration: 0.8
      } 
    },
  };

  return (
    <main className="bg-[#FDFBF7] text-[#3C2A21] min-h-screen relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          .fd { font-family: 'Cormorant Garamond', serif; }
          
          .gold-shimmer {
            background: linear-gradient(90deg, #C5A059, #E6D5B8, #C5A059, #D4AF37, #C5A059);
            background-size: 300% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 4s linear infinite;
          }

          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          
          .glass-card {
            background: white;
            border: 1px solid rgba(197,160,89, 0.1);
            border-radius: 32px;
            box-shadow: 0 40px 100px rgba(197,160,89, 0.05);
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .btn-gold {
             background: #C5A059;
             color: white;
             padding: 16px 32px;
             border-radius: 14px;
             font-weight: 700;
             text-transform: uppercase;
             letter-spacing: 0.1em;
             font-size: 11px;
             transition: all 0.3s ease;
             display: inline-flex;
             alignItems: center;
             gap: 10px;
          }
      `}</style>
      
      {/* Background ambient light */}
      <div className="absolute top-0 right-30 w-[1000px] h-[1000px] bg-[#C5A059]/5 blur-[250px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-screen-2xl mx-auto px-8 md:px-20 pt-12 pb-16 md:pt-16 md:pb-24 relative z-10"
      >
        <Link href="/services" className="inline-flex items-center gap-4 text-[#C5A059] font-black uppercase tracking-[0.4em] text-[14px] font-bold hover:gap-6 transition-all duration-500 mb-12 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to expertise
        </Link>

        {/* Two-column hero composition: content | details + access card, shared top */}
        <div className="mt-4 grid grid-cols-1 items-start gap-10 sm:mt-8 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — narrative */}
          <motion.div variants={itemVariants} className="space-y-6 lg:col-span-7">
            <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-start lg:gap-8">
              <div className="flex h-12 w-12 shrink-0 transform-gpu animate-float items-center justify-center rounded-xl bg-[#C5A059] text-white shadow-2xl shadow-[#C5A059]/20 lg:h-16 lg:w-16 lg:rounded-2xl">
                <div className="scale-100 lg:scale-125">
                  {icon}
                </div>
              </div>
              
              <div className="space-y-1 lg:space-y-3">
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#C5A059] sm:text-[13px] sm:tracking-[0.5em]">Strategic Expertise</span>
                <h1 className="fd break-words text-[22px] font-black uppercase leading-tight tracking-tight text-[#3C2A21] sm:text-3xl md:text-5xl">
                  {title.split(' ').slice(0, -1).join(' ')} <br className="hidden sm:block" />
                  <span className="gold-shimmer italic lowercase">{title.split(' ').slice(-1)}</span>
                </h1>
              </div>
            </div>

            <p className="border-l border-[#C5A059]/20 py-2 pl-6 text-sm font-normal italic leading-relaxed text-[#6B5E51] md:text-base">
              {description}
            </p>

            <div className="pt-2">
              <DiscussionSection serviceId={serviceId || "generic"} />
            </div>
          </motion.div>

          {/* RIGHT — breakdown + membership card, top-aligned with left */}
          <div className="w-full max-w-[420px] justify-self-center space-y-8 lg:col-span-5 lg:max-w-none lg:justify-self-stretch lg:sticky lg:top-28">
            <motion.div 
                variants={itemVariants} 
                whileHover={{ 
                rotateX: 2,
                rotateY: -2,
                scale: 1.01
                }}
                style={{ perspective: 1000 }}
                className="glass-card relative transform-gpu space-y-8 border-[#C5A059]/10 bg-white p-8 transition-all duration-700 md:p-10"
            >
                <h3 className="fd border-b border-[#F1EDEA] pb-6 text-xl font-black uppercase tracking-[0.3em] text-[#3C2A21]">Detailed Breakdown:</h3>
                <ul className="space-y-5">
                {details.map((detail, i) => (
                    <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="group/item flex items-center gap-4"
                    >
                    <div className="h-[1px] w-3 bg-[#C5A059] transition-all duration-500 group-hover/item:w-6"></div>
                    <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#6B5E51] transition-colors group-hover/item:text-[#C5A059]">{detail}</span>
                    </motion.li>
                ))}
                </ul>

                <div className="pointer-events-none absolute right-0 top-0 -z-10 h-64 w-64 bg-[#C5A059]/5 blur-[100px] transition-colors group-hover:bg-[#C5A059]/10"></div>
            </motion.div>

            {/* Membership entitlement CTA — serviceId must match backend Service.serviceId */}
            <motion.div variants={itemVariants} className="w-full">
              {serviceId ? <ServiceCTA serviceId={serviceId} /> : null}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
