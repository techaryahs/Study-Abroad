"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

interface ServiceLayoutProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  accentClass?: string;
  serviceId?: string;
}

export default function ServiceLayout({ title, description, details, icon, accentClass = "accent-glow-gold", serviceId }: ServiceLayoutProps) {
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
        <Link href="/services" className="inline-flex items-center gap-4 text-[#C5A059] font-black uppercase tracking-[0.4em] text-[10px] hover:gap-6 transition-all duration-500 mb-12 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to expertise
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start mt-4 sm:mt-8">
          {/* Header & Description */}
          <motion.div variants={itemVariants} className="space-y-6 lg:sticky lg:top-32">
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-[#C5A059] flex items-center justify-center text-white shadow-2xl shadow-[#C5A059]/20 shrink-0 transform-gpu animate-float">
                <div className="scale-100 lg:scale-125">
                  {icon}
                </div>
              </div>
              
              <div className="space-y-1 lg:space-y-3">
                <span className="text-[#C5A059] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black text-[8px] sm:text-[9px]">Strategic Expertise</span>
                <h1 className="fd text-[22px] sm:text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase text-[#3C2A21] break-words">
                  {title.split(' ').slice(0, -1).join(' ')} <br className="hidden sm:block" />
                  <span className="gold-shimmer italic lowercase">{title.split(' ').slice(-1)}</span>
                </h1>
              </div>
            </div>

            <p className="text-[#000000] text-sm md:text-base font-normal leading-relaxed italic border-l border-[#C5A059]/20 pl-6 py-2">
              {description}
            </p>

            <div className="pt-6">
              <DiscussionSection serviceId={serviceId || "generic"} />
            </div>
          </motion.div>

          {/* Detailed Breakdown */}
          <div className="space-y-12">
            <motion.div 
                variants={itemVariants} 
                whileHover={{ 
                rotateX: 2,
                rotateY: -2,
                scale: 1.01
                }}
                style={{ perspective: 1000 }}
                className="glass-card p-8 md:p-12 space-y-8 border-[#C5A059]/10 transform-gpu transition-all duration-700 bg-white"
            >
                <h3 className="fd text-xl font-black uppercase tracking-[0.3em] border-b border-[#F1EDEA] pb-6 text-[#3C2A21]">Detailed Breakdown:</h3>
                <ul className="space-y-5">
                {details.map((detail, i) => (
                    <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 group/item"
                    >
                    <div className="w-3 h-[1px] bg-[#C5A059] group-hover/item:w-6 transition-all duration-500"></div>
                    <span className="text-[#000000] group-hover/item:text-[#C5A059] text-[13px] font-medium transition-colors uppercase tracking-[0.1em]">{detail}</span>
                    </motion.li>
                ))}
                </ul>

                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-[100px] -z-10 group-hover:bg-[#C5A059]/10 transition-colors pointer-events-none"></div>
            </motion.div>
          </div>

          {/* AddToCart Section */}
          <motion.div 
            variants={itemVariants}
            className="lg:sticky lg:top-32"
          >
            {serviceId && <AddToCart serviceId={serviceId} />}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}