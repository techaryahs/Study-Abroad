"use client";

import { motion, Variants } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Suspense } from "react";

function ContactContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState("");

  const handleEmail = () => {
    const subject = encodeURIComponent("Consulting Inquiry");
    const body = encodeURIComponent(`Phone: ${phone}\n\nInquiry:\n${inquiry}`);
    
    // Attempt default mail client
    window.location.href = `mailto:admissions@dralam.com?subject=${subject}&body=${body}`;
    
    // If browser doesn't lose focus to a Mail App after 600ms, assume failure and open Gmail Web
    setTimeout(() => {
        if (document.hasFocus()) {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=admissions@dralam.com&su=${subject}&body=${body}`, '_blank');
        }
    }, 600);
  };

  useEffect(() => {
    if (service) {
      setInquiry(`I am interested in the ${service.replace(/-/g, " ")} service. Specifically, I would like to discuss...`);
    }
  }, [service]);

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
    <main className="bg-dark-950 text-white min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gold-500/5 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 md:px-20 pt-24 pb-16 md:pt-32 md:pb-24 grid lg:grid-cols-2 gap-20 relative z-10">
        {/* LEFT CONTACT INFO */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[10px]">Get In Touch</span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.0] tracking-tight uppercase">
              Craft Your <br /> <span className="gradient-text-gold italic">Global Future</span>.
            </h1>
            <p className="text-white/30 text-base md:text-lg max-w-md leading-relaxed font-normal italic border-l border-gold-500/20 pl-6 py-2">
              Strategic mentorship for Ivy League and Tier-1 excellence. Our architects are ready to guide you.
            </p>
          </motion.div>

        <motion.div variants={itemVariants} className="space-y-8 pt-4">
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-700 shadow-xl">
              <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Direct Line</p>
              <p className="text-xl font-black text-white hover:text-gold-500 transition-colors">+91 89876 54321</p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-700 shadow-xl">
              <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Mentorship Portal</p>
              <p className="text-xl font-black text-white hover:text-gold-500 transition-colors">admissions@dralam.com</p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-700 shadow-xl">
              <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Global Hub</p>
              <p className="text-xl font-black text-white leading-tight">Excellence Tower, Mumbai</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

        {/* RIGHT CONTACT FORM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ 
            rotateX: 2,
            rotateY: -2
          }}
          style={{ perspective: 1000 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 md:p-10 space-y-5 bg-white/[0.01] border-gold-500/10 transform-gpu relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] -z-10 pointer-events-none"></div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-gold-500 transition-colors">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 focus:border-gold-500 outline-none transition-all duration-500 placeholder:text-white/5 text-sm" 
              placeholder="+1 (234) 567-8900" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-gold-500 transition-colors">Inquiry or Message</label>
            <textarea 
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 h-24 focus:border-gold-500 outline-none transition-all duration-500 resize-none placeholder:text-white/5 text-sm" 
              placeholder="How can we help you?" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="btn-gold w-full text-center py-3.5 rounded-lg text-[10px] uppercase tracking-[0.2em] font-black shadow-lg shadow-gold-500/5 hover:shadow-gold-500/20 active:scale-95 transition-all duration-500">
              Submit Query
            </button>

            <button 
              onClick={(e) => {
                e.preventDefault();
                handleEmail();
              }}
              className="btn-outline-gold flex items-center justify-center w-full h-full rounded-lg text-center py-3.5 text-[10px] uppercase tracking-[0.2em] font-black shadow-lg active:scale-95 transition-all duration-500"
            >
              Send via Email
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center font-black text-gold-500 tracking-widest uppercase">Loading Portal...</div>}>
      <ContactContent />
    </Suspense>
  );
}
