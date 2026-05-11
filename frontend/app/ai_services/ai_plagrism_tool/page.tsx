"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
   Wand2,
   ShieldCheck,
   ChevronDown,
   CheckCircle2,
   Cpu,
   Zap,
   FileCheck,
   Search,
   BookOpen,
   ArrowRight
} from "lucide-react";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function AIHumanizerPage() {
   const [input, setInput] = useState("");
   const [output, setOutput] = useState("");
   const [level, setLevel] = useState("Max");
   const [loading, setLoading] = useState(false);
   const [faqOpen, setFaqOpen] = useState<number | null>(0);
   const [currency, setCurrency] = useState("INR");
   const [checkoutPlan, setCheckoutPlan] = useState<{ actual: number; discounted: number; title: string } | null>(null);
   const [isBookingOpen, setIsBookingOpen] = useState(false);
   const router = useRouter();

   const handleRewrite = () => {
      if (!input.trim()) return;
      setLoading(true);
      setOutput("");
      setTimeout(() => {
         setOutput("This is your humanized output. Our advanced rewriting engine has transformed your AI-generated content into natural, human-sounding prose. The meaning and intent remain fully intact while all detectable AI patterns have been removed, ensuring your writing passes even the most rigorous detection tools.");
         setLoading(false);
      }, 1800);
   };

   const detectors = [
      { name: "Turnitin", icon: "🌐" },
      { name: "GPTZero", icon: "💎" },
      { name: "Originality.ai", icon: "📜" },
      { name: "Grammarly", icon: "🖋️" },
      { name: "Copyleaks", icon: "🔍" },
      { name: "Quillbot", icon: "🤖" },
   ];

   const plans = [
      {
         name: "Scholar", price: 999, original: 2000,
         features: ["20,000 words /mo", "Light & Medium levels", "Grammar boost", "Standard support"],
      },
      {
         name: "Academic", price: 2999, original: 5000, highlight: true, badge: "RECOMMENDED",
         features: ["100,000 words /mo", "All humanize levels", "Plagiarism bypass", "Priority support"],
      },
      {
         name: "Researcher", price: 12999, original: 20000,
         features: ["Unlimited words", "API Access", "Team collaboration", "Dedicated Manager"],
      },
   ];

   const faqs = [
      { q: "How does this tool bypass AI detection?", a: "Our tool rewrites content using advanced high-fidelity paraphrasing that replicates natural human variations in syntax and vocabulary." },
      { q: "Will the meaning of my text change?", a: "No. Our system is engineered to preserve semantic integrity - the core meaning and academic rigor of your work remain untouched." },
      { q: "Is my data safe and confidential?", a: "Absolutely. We employ zero-retention protocols. Your data is processed in-memory and permanently erased immediately after generation." }
   ];

   return (
      <main className="min-h-screen pb-32" style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}>

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

                .editor-container {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.15);
                  border-radius: 32px;
                  box-shadow: 0 40px 100px rgba(197,160,89, 0.05);
                }

                .feature-pill {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.1);
                  border-radius: 20px;
                  transition: all 0.3s ease;
                }

                .feature-pill:hover {
                  border-color: #C5A059;
                  transform: scale(1.02);
                }

                .textarea-luxury {
                  background: #FAFAFA;
                  border: 1px solid #F1EDEA;
                  border-radius: 20px;
                  font-family: 'DM Sans', sans-serif;
                  transition: all 0.3s ease;
                }

                .textarea-luxury:focus {
                  border-color: #C5A059;
                  background: #FFFFFF;
                  outline: none;
                }

                .pricing-card {
                  background: white;
                  border: 1px solid rgba(197,160,89, 0.15);
                  border-radius: 32px;
                  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .pricing-card.featured {
                  background: #2D2926;
                  color: white;
                  border-color: #2D2926;
                }

                .detector-circle {
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  background: #FAFAFA;
                  border: 1px solid rgba(197,160,89, 0.1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 24px;
                }
            `}</style>

         {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
         <section className="relative pt-12 pb-20 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.08) 0%, transparent 100%)" }}>
            <div className="max-w-5xl mx-auto text-center space-y-8">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
               >
                  <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase mb-8">
                     Linguistic Integrity Protocol
                  </span>
                  <h1 className="fd text-5xl md:text-7xl font-bold leading-[1.1] text-[#2D2926]">
                     AI Remover & <span className="gold-shimmer">Bypass Tool</span>
                  </h1>
                  <p className="text-[#6B5E51] text-lg md:text-xl font-medium max-w-2xl mx-auto italic mt-6">
                     "Refine and humanize your academic drafts to ensure maximum credibility and zero detection flagging."
                  </p>
               </motion.div>

               {/* Unified Editor UI */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="editor-container p-4 md:p-6"
               >
                  <div className="flex flex-col md:flex-row gap-6">
                     {/* Input Area */}
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[14px] font-bold font-bold uppercase tracking-widest text-[#C5A059]">Source Draft</span>
                           <span className="text-[14px] font-bold text-[#A8A29E] font-medium">{input.length} characters</span>
                        </div>
                        <textarea
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           placeholder="Paste your content here to begin humanization..."
                           className="textarea-luxury w-full p-6 min-h-[220px] text-base leading-relaxed text-[#2D2926]"
                        />
                     </div>

                     {/* Controls & Output (Horizontal on mobile, small width on desktop) */}
                     <div className="md:w-72 flex flex-col gap-4">
                        <div className="bg-[#FAFAFA] rounded-[24px] p-5 border border-[#F1EDEA] space-y-4">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D2926]">Humanize Intensity</p>
                           <div className="grid grid-cols-1 gap-2">
                              {["Light", "Medium", "Max"].map((l) => (
                                 <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all border ${level === l ? 'bg-[#2D2926] text-white border-[#2D2926]' : 'bg-white text-[#6B5E51] border-[#F1EDEA] hover:border-[#C5A059]'}`}
                                 >
                                    {l}
                                 </button>
                              ))}
                           </div>
                           <button
                              onClick={handleRewrite}
                              disabled={loading}
                              className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                           >
                              {loading ? "PROCESSING..." : <><Zap size={14} fill="white" /> TRANSFORM</>}
                           </button>
                        </div>

                        <div className="flex-1 bg-[rgba(197,160,89,0.03)] border border-dashed border-[#C5A059]/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center">
                           {!output && !loading && (
                              <div className="space-y-4 opacity-40">
                                 <BookOpen size={32} className="mx-auto text-[#C5A059]" />
                                 <p className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059]">Output Pending</p>
                              </div>
                           )}
                           {loading && (
                              <div className="space-y-4">
                                 <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
                                 <p className="text-[11px] font-bold text-[#C5A059]">ANALYZING SYLLABLES...</p>
                              </div>
                           )}
                           {output && !loading && (
                              <motion.div
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 className="text-left space-y-4"
                              >
                                 <p className="text-[14px] font-bold font-bold uppercase tracking-widest text-[#2D2926]">Refined Content</p>
                                 <p className="text-sm leading-relaxed text-[#6B5E51] font-medium italic">"{output}"</p>
                              </motion.div>
                           )}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* ── DETECTORS SECTION ───────────────────────────────────────────────── */}
         <section className="bg-white border-y border-[#F1EDEA] py-12">
            <div className="max-w-7xl mx-auto px-6">
               <p className="text-center text-[14px] font-bold font-bold uppercase tracking-[0.3em] text-[#A8A29E] mb-10">Verification Protocols Bypassed</p>
               <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                  {detectors.map((d) => (
                     <div key={d.name} className="flex flex-col items-center gap-4 group cursor-default">
                        <div className="detector-circle group-hover:border-[#C5A059] transition-all">
                           {d.icon}
                        </div>
                        <span className="text-[14px] font-bold font-bold text-[#6B5E51] tracking-widest uppercase">{d.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── PERFORMANCE SECTION ─────────────────────────────────────────────── */}
         <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="fd text-4xl md:text-5xl font-bold leading-tight">Audited for <br /> <span className="gold-shimmer">Academic Zero-Detection</span></h2>
               <p className="text-[#6B5E51] text-lg font-medium leading-relaxed">
                  Our humanizer uses state-of-the-art linguistic modeling to replicate human burstiness and perplexity markers that AI detectors use for classification.
               </p>
               <div className="space-y-6">
                  {[
                     { label: "Predictability Reduction", val: "99.2%" },
                     { label: "Semantic Mirroring", val: "100.0%" },
                     { label: "Detection Success Rate", val: "98.6%" }
                  ].map((item, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-[#2D2926]">
                           <span>{item.label}</span>
                           <span>{item.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#F1EDEA] rounded-full overflow-hidden">
                           <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: item.val }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                              className="h-full bg-[#C5A059]"
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                  { icon: <ShieldCheck />, title: "Zero-Log", desc: "No data is stored post-generation" },
                  { icon: <Cpu />, title: "Live Engine", desc: "Neural networks update every 6 hours" },
                  { icon: <Zap />, title: "Instant", desc: "10k words processed in < 3 seconds" },
                  { icon: <FileCheck />, title: "Certified", desc: "Passes Turnitin & Copyleaks" }
               ].map((feat, i) => (
                  <div key={i} className="feature-pill p-8 space-y-4">
                     <div className="text-[#C5A059]">{feat.icon}</div>
                     <h4 className="font-bold text-sm uppercase tracking-tight text-[#2D2926]">{feat.title}</h4>
                     <p className="text-xs text-[#6B5E51] leading-relaxed font-medium">{feat.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* ── PRICING SECTION ─────────────────────────────────────────────────── */}
         <section className="py-24 px-6 bg-[#2D2926] text-white">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-20 space-y-4">
                  <h2 className="fd text-4xl md:text-5xl font-bold">Linguistic <span className="gold-shimmer">Access Tiers</span></h2>
                  <p className="text-[#A8A29E] text-lg font-medium">Select a protocol that aligns with your research volume</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {plans.map((plan, i) => (
                     <div key={i} className={`pricing-card p-12 flex flex-col text-[#2D2926] ${plan.highlight ? 'shadow-[0_40px_100px_rgba(197,160,89,0.2)] scale-105' : ''}`}>
                        {plan.badge && (
                           <span className="self-start text-[13px] font-bold font-bold bg-[#C5A059] text-white px-3 py-1 rounded-full mb-6 tracking-widest">{plan.badge}</span>
                        )}
                        <h3 className="fd text-3xl font-bold mb-4">{plan.name}</h3>
                        <div className="flex items-baseline gap-2 mb-8">
                           <span className="text-4xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                           <span className="text-sm text-[#A8A29E] line-through">₹{plan.original.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="space-y-4 mb-10 flex-1">
                           {plan.features.map((f, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm font-medium text-[#6B5E51]">
                                 <CheckCircle2 size={16} className="text-[#C5A059] shrink-0" /> {f}
                              </div>
                           ))}
                        </div>
                        <button
                           onClick={() => setCheckoutPlan({ actual: plan.original, discounted: plan.price, title: plan.name })}
                           className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-lg ${plan.highlight ? 'bg-[#C5A059] text-white hover:brightness-110' : 'border-2 border-[#F1EDEA] text-[#2D2926] hover:border-[#C5A059]'}`}
                        >
                           Secure License
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── FAQ SECTION ────────────────────────────────────────────────────── */}
         <section className="max-w-3xl mx-auto px-6 py-32 space-y-12">
            <div className="text-center space-y-4">
               <h2 className="fd text-4xl font-bold text-[#2D2926] italic underline decoration-[#C5A059]/30 underline-offset-8">Common Inquiries</h2>
            </div>

            <div className="divide-y divide-[#F1EDEA]">
               {faqs.map((faq, i) => (
                  <div key={i} className="py-8">
                     <button
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        className="w-full flex items-center justify-between text-left group"
                     >
                        <span className="font-bold text-lg text-[#2D2926] group-hover:text-[#C5A059] transition-colors uppercase tracking-tight">{faq.q}</span>
                        <span className={`text-2xl font-light text-[#C5A059] transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                     </button>
                     <AnimatePresence>
                        {faqOpen === i && (
                           <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                           >
                              <div className="pt-6 text-[#6B5E51] text-base leading-relaxed font-medium font-serif italic">
                                 "{faq.a}"
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>
         </section>

         {/* ── CTA SECTION ────────────────────────────────────────────────────── */}
         <section className="max-w-5xl mx-auto px-6 mb-20 text-center space-y-10">
            <div className="p-16 border-2 border-[#C5A059]/20 rounded-[48px] bg-white shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="relative z-10 space-y-6">
                  <h2 className="fd text-4xl md:text-5xl font-bold">Enhance Your Academic <br /> <span className="gold-shimmer">Credibility Today</span></h2>
                  <p className="text-[#6B5E51] text-lg font-medium max-w-xl mx-auto">
                     Join 50,000+ researchers and students who trust our humanization engine for their most critical submissions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                     <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-[#2D2926] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#C5A059] transition-all flex items-center justify-center gap-3 shadow-2xl tracking-widest text-xs uppercase"
                     >
                        Start Free Trial <ArrowRight size={16} />
                     </button>
                     <button
                        onClick={() => router.push('/services')}
                        className="bg-[#FDFBF7] text-[#2D2926] border-2 border-[#F1EDEA] px-10 py-5 rounded-2xl font-bold hover:border-[#C5A059] transition-all tracking-widest text-xs uppercase"
                     >
                        View Services
                     </button>
                  </div>
               </div>
            </div>
         </section>

         <CheckoutModal
            isOpen={checkoutPlan !== null}
            onClose={() => setCheckoutPlan(null)}
            items={checkoutPlan ? [{ name: checkoutPlan.title, price: checkoutPlan.actual }] : []}
            subtotal={checkoutPlan?.actual || 0}
            discount={(checkoutPlan?.actual || 0) - (checkoutPlan?.discounted || 0)}
            total={checkoutPlan?.discounted || 0}
            currency="INR"
         />

         <BookCounsellingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
         />
      </main>
   );
}
