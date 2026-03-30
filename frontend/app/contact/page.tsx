"use client";

import { motion, Variants } from "framer-motion";

export default function ContactPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="bg-dark-950 text-white px-8 md:px-20 py-40 min-h-screen relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 relative z-10">
        {/* LEFT CONTACT INFO */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-16"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-xs">Get In Touch</span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">
              Let's Craft Your <br /> <span className="gradient-text-gold italic">Global Future</span>.
            </h1>
            <p className="text-white/30 text-xl max-w-md leading-relaxed font-normal">
              Have questions about your study abroad journey? Our experts are here to guide you every step of the way.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-10 pt-8">
            <div className="flex items-center gap-8 group">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Call Us</p>
                <p className="text-2xl font-black text-white hover:text-gold-500 transition-colors tracking-tight">+91 89876 54321</p>
              </div>
            </div>

            <div className="flex items-center gap-8 group">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Email Us</p>
                <p className="text-2xl font-black text-white hover:text-gold-500 transition-colors tracking-tight">admissions@dralam.com</p>
              </div>
            </div>

            <div className="flex items-center gap-8 group">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Location</p>
                <p className="text-2xl font-black text-white tracking-tight leading-tight">Excellence Tower, <br />Mumbai, India</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT CONTACT FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-card p-12 md:p-16 space-y-10 bg-white/[0.01]"
        >
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/60">First Name</label>
              <input type="text" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all duration-500 placeholder:text-white/10" placeholder="John" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/60">Last Name</label>
              <input type="text" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all duration-500 placeholder:text-white/10" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/60">Email Address</label>
            <input type="email" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all duration-500 placeholder:text-white/10" placeholder="john@example.com" />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500/60">Your Inquiry</label>
            <textarea className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-6 h-40 focus:border-gold-500 outline-none transition-all duration-500 resize-none placeholder:text-white/10" placeholder="How can we help you?"></textarea>
          </div>

          <button className="btn-gold w-full text-center py-5 text-lg shadow-2xl shadow-gold-500/10 hover:shadow-gold-500/30">
            Send Message
          </button>
        </motion.div>
      </div>
    </main>
  );
}
