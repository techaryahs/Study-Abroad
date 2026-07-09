"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  PhoneCall,
  ShieldCheck,
  Flag,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Info,
  Banknote,
  Globe2,
  Building2,
  Coins
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

// ─── Data ────────────────────────────────────────────────────────────────────

const ROADMAP_STEPS = [
  {
    id: 1,
    title: "Kickstart Your Journey",
    description: "Submit your basic academic and financial profile to begin the assessment.",
    icon: <Compass className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Connect with a Counselor",
    description: "Expert consultation to understand your specific funding needs and eligibility.",
    icon: <PhoneCall className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Get Personalized Lender Choices",
    description: "Get matched with trusted lenders, curated by our professionals for your profile.",
    icon: <ShieldCheck className="w-6 h-6" />,
    active: true
  },
  {
    id: 4,
    title: "Mark the Milestone",
    description: "Smooth documentation support and final disbursement to your university.",
    icon: <Flag className="w-6 h-6" />,
  }
];

const LENDER_COMPARISON = [
  {
    category: "PSB",
    icon: <Building2 className="w-5 h-5" />,
    maxAmount: "Up to ₹2 Crore",
    interestRate: "9.25% - 11.30%",
    collateral: "No (Up to 50 Lakh)",
    tenure: "15 years",
    processingFee: "₹10,000"
  },
  {
    category: "Private Banks",
    icon: <Building2 className="w-5 h-5 text-blue-600" />,
    maxAmount: "Up to ₹2 Crore",
    interestRate: "9.50% - 13.50%",
    collateral: "No (Up to 1 Crore)",
    tenure: "15 years",
    processingFee: "0.50% - 1%"
  },
  {
    category: "NBFCs",
    icon: <Coins className="w-5 h-5 text-orange-500" />,
    maxAmount: "Up to ₹1.5 Crore",
    interestRate: "10% - 14%",
    collateral: "No (Up to 75 Lakh)",
    tenure: "15 years",
    processingFee: "1% - 2%"
  },
  {
    category: "International Lenders",
    icon: <Globe2 className="w-5 h-5 text-green-600" />,
    maxAmount: "Up to $200,000",
    interestRate: "10.5% - 14%",
    collateral: "No",
    tenure: "15 years",
    processingFee: "1% - 5%"
  }
];

const PARTNER_HIGHLIGHTS = [
  {
    bank: "SBI",
    logo: "/sbi-logo.png", // Placeholder or from user? User screenshot showed SBI
    type: "PSB",
    maxLoan: "Up to ₹3 Cr",
    interestRate: "9.15% - 10.15%",
    processingTime: "15 - 20 Days",
    processingFee: "₹10,000",
    loanType: "Collateral & Non - Collateral"
  },
  {
    bank: "Union Bank",
    logo: "/union-bank-logo.png",
    type: "PSB",
    maxLoan: "Up to ₹1.5 Cr",
    interestRate: "9.20% - 10.50%",
    processingTime: "12 - 18 Days",
    processingFee: "Up to ₹20,000",
    loanType: "Collateral"
  }
];

const BENEFITS = [
  {
    title: "We Advocate for You",
    desc: "We work for you, not the banks, helping you choose from lenders that truly fit your background and goals.",
  },
  {
    title: "Smart Interest Rates",
    desc: "Access exclusive student offers and negotiated rates that you won't find on public lender pages.",
  },
  {
    title: "Transparent Process",
    desc: "From start to finish, we make it easy, with no consultation fees, no jargon, just straightforward guidance.",
  }
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function EducationLoanPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <main
      className="min-h-screen text-[#10324a] selection:bg-[#d2a14a]/20 overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >

      <style>{`
        .gold-shimmer {
          background: linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── ROADMAP SECTION ── */}
      <section className="px-6 md:px-14 lg:px-20 pt-20 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                From Application to Approval – <br />
                <span className="gold-shimmer">Your Roadmap to Success</span>
              </h1>
              <p className="text-[#4b5b6a] text-lg font-medium max-w-lg">
                A step-by-step guide to how we help you get the best education loan for studying abroad.
              </p>
            </div>

            <div className="space-y-6 relative ml-4">
              {/* Connector Line */}
              <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-[#10324a]/10 z-0" />

              {ROADMAP_STEPS.map((step) => (
                <div key={step.id} className="relative z-10 flex gap-6 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${step.active ? 'bg-[#d2a14a] shadow-lg shadow-[#d2a14a]/25' : 'bg-white border-2 border-[#10324a]/15'}`}>
                    {step.active && <CheckCircle2 className="w-4 h-4 text-[#10324a]" />}
                  </div>
                  <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${step.active ? 'bg-white/80 border border-[#d2a14a]/30 shadow-sm' : 'hover:bg-white/60 hover:shadow-md'}`}>
                    <div className={`${step.active ? 'text-[#d2a14a]' : 'text-[#4b5b6a]'}`}>
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-lg text-[#10324a]">{step.title}</h3>
                      {step.active && <p className="text-sm text-[#d2a14a] font-medium">{step.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-[#10324a] text-[#d2a14a] px-8 py-4 rounded-xl font-black text-sm tracking-widest uppercase hover:bg-[#d2a14a] hover:text-[#10324a] transition-all shadow-xl flex items-center gap-2 group"
            >
              Check loan eligibility <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="bg-[#2ca59d]/10 rounded-[40px] p-8 md:p-16 relative overflow-hidden aspect-square flex items-center justify-center border border-[#2ca59d]/15">
              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 rounded-full blur-3xl" />

              {/* Card Placeholder (matches screenshot) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl border border-[#10324a]/10 w-full max-w-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-[14px] font-bold font-bold">AXIS</div>
                    <span className="font-bold text-sm text-[#10324a]">AXIS BANK</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-[#4b5b6a]/60 font-bold uppercase">Tenure</span>
                    <span className="text-xs font-bold text-[#d2a14a]">14 Years ▾</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs py-2 border-b border-[#10324a]/8">
                    <span className="text-[#4b5b6a] font-medium">Max. Loan Amount</span>
                    <span className="text-[#10324a] font-bold">Up to 7.5 lakhs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-2 border-b border-[#10324a]/8">
                    <span className="text-[#4b5b6a] font-medium">Interest Rate (%)</span>
                    <span className="text-[#10324a] font-bold">11.50% - 12.25%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#4b5b6a] text-xs font-medium">Monthly EMI</span>
                    <span className="text-[#10324a] font-black text-lg">₹1,73,969</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON SECTION ── */}
      <section id="comparison" className="px-6 md:px-14 lg:px-20 py-24 bg-white/40 border-y border-[#10324a]/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#10324a]">
              Discover Funding Options, and <br />
              <span className="gold-shimmer">Begin Your Journey with Ease</span>
            </h2>
          </div>

          <div className="overflow-x-auto no-scrollbar pb-6">
            <table className="w-full text-left border-separate border-spacing-x-4 border-spacing-y-0">
              <thead>
                <tr>
                  <th className="py-6 px-4"></th>
                  {LENDER_COMPARISON.map((col) => (
                    <th key={col.category} className="py-6 px-8 text-center bg-white/80 rounded-t-3xl border-x border-t border-[#10324a]/10 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                          {col.icon}
                        </div>
                        <span className="text-lg font-black text-[#10324a]">{col.category}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {[
                  { label: "Maximum Loan amount", key: "maxAmount" },
                  { label: "Interest Rate", key: "interestRate" },
                  { label: "Collateral Required*", key: "collateral", highlight: true },
                  { label: "Repayment Tenure", key: "tenure" },
                  { label: "Processing Fee", key: "processingFee", highlight: true }
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-6 px-4 text-sm font-bold text-[#4b5b6a] border-b border-[#10324a]/8">{row.label}</td>
                    {LENDER_COMPARISON.map((col) => (
                      <td key={col.category} className={`py-6 px-4 text-center border-b border-[#10324a]/8 border-x border-[#10324a]/5 ${row.highlight ? 'bg-[#d2a14a]/8' : 'bg-white/70'}`}>
                        <span className={`text-sm font-bold ${row.highlight ? 'text-[#d2a14a]' : 'text-[#10324a]'}`}>
                          {col[row.key as keyof typeof col]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => scrollToSection('partners')}
                className="text-[#d2a14a] font-black text-sm tracking-widest uppercase border-b-2 border-[#d2a14a] pb-1 hover:text-[#10324a] hover:border-[#10324a] transition-all"
              >
                View All
              </button>
            </div>
            <p className="text-[14px] font-bold text-[#4b5b6a]/60 italic text-center mt-4">
              *Actual loan terms may vary based on individual profile and lender assessment.
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTNERS LOGO STRIP ── */}
      <section className="px-6 md:px-14 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60">
          <div className="text-center font-black text-2xl tracking-tighter text-[#10324a]">AXIS BANK</div>
          <div className="text-center font-black text-2xl tracking-tighter text-[#10324a] italic">Credila</div>
          <div className="text-center font-black text-2xl tracking-tighter text-[#10324a]">pnb</div>
          <div className="text-center font-black text-2xl tracking-tighter text-[#10324a]">IDFC FIRST <br /><span className="text-[14px] font-bold tracking-widest uppercase">Bank</span></div>
          <div className="text-center font-black text-2xl tracking-tighter text-[#10324a] text-blue-500">Prodigy <br /><span className="text-[14px] font-bold tracking-normal text-[#4b5b6a]">Finance</span></div>
        </div>
      </section>

      {/* ── PARTNERS HIGHLIGHTS ── */}
      <section id="partners" className="px-6 md:px-14 lg:px-20 py-24 bg-[#10324a] relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d2a14a] opacity-[0.10] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2ca59d] opacity-[0.10] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-5xl lg:text-7xl font-black text-white">Our <br /><span className="gold-shimmer">Partners</span></h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Explore our curated network of trusted global lenders offering exclusive terms for our students.
            </p>
            <button 
              onClick={() => scrollToSection('why-choose')}
              className="bg-[#d2a14a] text-[#10324a] px-10 py-5 rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl group flex items-center gap-2"
            >
              Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-3 flex gap-6 overflow-x-auto no-scrollbar pb-10">
            {PARTNER_HIGHLIGHTS.map((p, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-white rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-6 py-2 bg-[#d2a14a]/15 text-[#d2a14a] text-[14px] font-bold font-black tracking-widest uppercase rounded-bl-3xl">
                  {p.type}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f7fbfd] flex items-center justify-center border border-[#d2a14a]/20 font-black text-[#d2a14a]">
                    {p.bank[0]}
                  </div>
                  <h3 className="text-2xl font-black text-[#10324a] tracking-tight">{p.bank}</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[14px] font-bold font-bold text-[#4b5b6a]/60 uppercase tracking-widest mb-1">Maximum Loan</p>
                    <p className="text-sm font-black text-[#10324a]">{p.maxLoan}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold font-bold text-[#4b5b6a]/60 uppercase tracking-widest mb-1">Interest Rate</p>
                    <p className="text-sm font-black text-[#10324a]">{p.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold font-bold text-[#4b5b6a]/60 uppercase tracking-widest mb-1">Processing time</p>
                    <p className="text-sm font-black text-[#10324a]">{p.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold font-bold text-[#4b5b6a]/60 uppercase tracking-widest mb-1">Processing fee</p>
                    <p className="text-sm font-black text-[#10324a]">{p.processingFee}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#10324a]/8">
                  <p className="text-[14px] font-bold font-bold text-[#4b5b6a]/60 uppercase tracking-widest mb-1">Loan Type</p>
                  <p className="text-sm font-black text-[#10324a]">{p.loanType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why-choose" className="px-6 md:px-14 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#d2a14a] rounded-[48px] rotate-3 -translate-x-2 translate-y-2 opacity-10" />
            <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden border-8 border-white shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000"
                alt="Education Advisor"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/40 to-transparent" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-[#10324a] leading-tight">
              Why choose <span className="bg-[#10324a] text-[#d2a14a] px-4 py-1 rounded-xl inline-block -rotate-1">EduLeaderGlobal</span>?
            </h2>
            <p className="text-[#4b5b6a] text-base font-medium leading-relaxed">
              At our core, we prioritize financial inclusivity by offering unbiased guidance so every student can get access to world-class education.
            </p>

            <div className="space-y-8">
              {BENEFITS.map((b, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-[#d2a14a]/15 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#d2a14a] transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#d2a14a] group-hover:text-[#10324a] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-[#10324a] text-xl tracking-tight">{b.title}:</h4>
                    <p className="text-[#4b5b6a] font-medium leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-[#10324a] text-[#d2a14a] px-10 py-5 rounded-xl font-black text-sm tracking-[0.2em] uppercase hover:bg-[#d2a14a] hover:text-[#10324a] transition-all shadow-xl"
            >
              Get loan options →
            </button>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ── */}
      <section className="px-6 md:px-14 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto bg-[#10324a] rounded-[40px] p-10 md:p-16 text-center space-y-8 shadow-[0_30px_80px_rgba(16,50,74,0.2)] relative overflow-hidden border border-white/10">
          {/* Subtle geometric pattern / glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d2a14a] opacity-[0.08] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2ca59d] opacity-[0.10] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Ready to fund your <br />
              <span className="gold-shimmer">study abroad dream?</span>
            </h2>
            <p className="text-white/60 text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Our expert advisors are standing by to architect your financial roadmap to global success.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-[#d2a14a] text-[#10324a] px-12 py-6 rounded-2xl font-black text-xs tracking-[0.25em] uppercase hover:bg-white transition-all shadow-2xl flex items-center gap-3 group"
            >
              Book Premium Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('comparison')}
              className="border-2 border-white/15 text-white px-12 py-6 rounded-2xl font-black text-xs tracking-[0.25em] uppercase hover:border-[#d2a14a] hover:bg-white/5 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <BookCounsellingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />


    </main>
  );
}