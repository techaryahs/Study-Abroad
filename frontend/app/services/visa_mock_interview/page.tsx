"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  MessageSquare,
  Star,
  ShieldCheck,
  Zap,
  Users,
  Phone,
  ArrowLeft
} from "lucide-react";
import FAQSection, { defaultFaqs } from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

const visaFaqs = [...defaultFaqs];
visaFaqs.splice(5, 0, {
  question: "Is recording the mock interview video call session allowed?",
  answer: "You may not record the interview session done with our executives. This is done for the protection of the service offering from any misuse. The solutions we have developed over the years to train the applicants for the interview are proprietary and we prefer to impart the expertise only to the applicant who has opted into this service with us."
});

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    title: "Case-Specific Training",
    description: "Get unique answers to commonly asked questions based on your case.",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "Video Call Session",
    description: "One-on-one call with visa experts through Google Meet. Emulate the real visa interview.",
    icon: <Video className="w-4 h-4" />,
  },
  {
    title: "Multiple Rounds of Testing",
    description: "Our visa experts conduct multiple rounds of tailored interviews to ensure your success.",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    title: "Post Training Support",
    description: "Contact us on WhatsApp, and our visa experts will readily assist you even after your mock interview.",
    icon: <MessageSquare className="w-4 h-4" />,
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

export default function VisaMockInterviewPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(44,165,157,0.16),_transparent_30%),linear-gradient(135deg,_#f8f4ea_0%,_#fcfbf7_100%)] text-[#4b5b6a] font-base selection:bg-[#d2a14a]/20">

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
        <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
      </div>

      <main className="relative z-10 flex flex-col">
        {/* ── HERO SECTION ── */}
        <section className="relative pt-12 pb-12 px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="space-y-6 rounded-[36px] border border-[#10324a]/10 bg-white/80 p-6 sm:p-10 shadow-[0_30px_90px_rgba(16,50,74,0.08)] backdrop-blur-xl"
            >
              <div className="inline-flex items-center gap-2 bg-[#2ca59d]/10 border border-[#2ca59d]/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#2ca59d] rounded-full animate-pulse" />
                <span className="text-[#0f4c5c] text-[14px] font-black uppercase tracking-[0.2em]">Premium Service</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight uppercase text-[#D4A54A] break-words">
                US Visa Mock <br />
                Interview
              </h1>
              <div className="pb-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-[#4b5b6a]/60 hover:text-[#2ca59d] transition-colors group relative z-20"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Back to Services</span>
                </Link>
              </div>

              <p className="text-[#4b5b6a] text-base leading-relaxed max-w-md italic font-normal">
                The final step to your US visa is a Visa interview with an officer from the US consulate.
                Ace the interview with proven tricks and techniques.
              </p>

              <DiscussionSection serviceId="visa_mock_interview" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative w-full max-w-md ml-auto rounded-[32px] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] bg-[#10324a] group flex items-center justify-center p-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.12),transparent_60%)]" />
                <img
                  src="/visa-hero.png"
                  alt="Visa Mock Interview"
                  className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none relative z-10"
                />

                {/* Compact Badges */}
                <div className="absolute z-30 top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2 shadow-xl scale-90 origin-top-right">
                  <Star className="text-[#d2a14a] w-4 h-4 fill-[#d2a14a]" />
                  <div>
                    <p className="text-[14px] font-black text-white uppercase tracking-widest">4.9/5 Rating</p>
                  </div>
                </div>

                <div className="absolute z-30 bottom-4 left-4 bg-[#d2a14a] px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl scale-90 origin-bottom-left">
                  <ShieldCheck className="text-[#16364b] w-5 h-5" />
                  <p className="text-[14px] font-black text-[#16364b] uppercase tracking-tight">Verified Expert</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT & BOOKING ── */}
        <section className="py-10 px-6 md:px-16">
          <div className="max-w-6xl mx-auto rounded-[32px] border border-[#10324a]/10 bg-white/70 p-6 sm:p-10 shadow-[0_16px_50px_rgba(16,50,74,0.06)] grid lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-12"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-[#D4A54A]">
                  <div className="w-10 h-[1px] bg-[#d2a14a]" />
                  About Service
                </h2>
                <p className="text-lg text-[#4b5b6a]/70 font-medium italic leading-relaxed max-w-xl">
                  "The last step before your flight to the USA."
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Visa officers reject 1 in 4 candidates. Precision is key.",
                  "Failing means losing months of work and postponing plans.",
                  "Expert assistance for all case types: rejections or first-timers."
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[#10324a] border border-white/10 group shadow-[0_16px_40px_rgba(16,50,74,0.15)]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#d2a14a]/10 flex items-center justify-center text-[#d2a14a] group-hover:bg-[#d2a14a] group-hover:text-[#16364b] transition-all shadow-md">
                      {i === 0 ? <Users size={16} /> : i === 1 ? <Zap size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors italic leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="bg-[#10324a] p-6 rounded-[2rem] space-y-4 hover:bg-[#d2a14a] transition-all group shadow-[0_16px_40px_rgba(16,50,74,0.15)] border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-[#d2a14a]/10 border border-white/5 flex items-center justify-center text-[#d2a14a] group-hover:bg-[#16364b] group-hover:text-[#d2a14a] transition-all shadow-md">
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1 transition-colors text-[#d2a14a] group-hover:text-[#16364b]">{f.title}</h4>
                      <p className="text-[11px] text-white/50 italic leading-snug group-hover:text-[#16364b]/70">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <AddToCart serviceId="visa_mock_interview" />
            </motion.div>
          </div>
        </section>

        {/* ── SUCCESS RATE ── */}
        <section className="px-6 md:px-16 pb-10">
          <div className="relative max-w-6xl mx-auto rounded-[32px] overflow-hidden bg-[#10324a] border border-white/10 shadow-[0_20px_60px_rgba(16,50,74,0.18)] py-20 px-6 md:px-16 flex items-center min-h-[300px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(210,161,74,0.12),transparent_50%)]" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Our Success Rate
              </h2>
              <p className="text-white/70 text-lg md:text-xl max-w-xl italic font-semibold leading-relaxed">
                Strategic approach helping thousands of candidates ace their visa interview every single year.
              </p>
              <div className="text-7xl md:text-9xl font-black text-[#d2a14a] leading-none tracking-tighter opacity-90">
                98.7%
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 md:px-16 pb-16">
          <div className="max-w-4xl mx-auto rounded-[32px] border border-[#10324a]/10 bg-white/70 p-6 sm:p-10 shadow-[0_16px_50px_rgba(16,50,74,0.06)]">
            <FAQSection faqs={visaFaqs} />
          </div>
        </section>
      </main>
    </div>
  );
}