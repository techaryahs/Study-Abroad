"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  ChevronDown, 
  Play,
  Award,
  History,
  TrendingUp,
  CreditCard
} from "lucide-react";
import CheckoutModal from "@/app/User/cart/checkoutmodal";

export default function USVisaMockInterview() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [currency, setCurrency] = useState("INR");
    const [checkoutPlan, setCheckoutPlan] = useState<{ actual: number; discounted: number; title: string } | null>(null);

    const faqs = [
        {
            q: "How does the US Visa Mock Interview AI work?",
            a: "Our AI model is inspired by real-life visa interviews and follows the same pattern, tonality, and style. It has been trained from more than 1000 real-life interview scripts and can provide real-time insights into preparing yourself for the actual interview.",
        },
        {
            q: "What types of questions can I expect?",
            a: "You can expect questions about your study plans, financial capability, ties to your home country, and future plans — all closely mirroring actual US visa officer questioning patterns.",
        },
        {
            q: "How realistic is the feedback provided?",
            a: "Our AI provides feedback with 97.6% accuracy, mirroring real visa officer decision-making. It evaluates your answers on clarity, confidence, and factual consistency.",
        },
        {
            q: "Will this improve my chances of approval?",
            a: "Yes. Our data shows that candidates who complete 5+ rounds see a 270% boost in success rates. Practice builds confidence and refines your answers significantly.",
        }
    ];

    const plans = [
        {
            rounds: "1 Round",
            price: 499,
            original: 999,
            features: ["1 Mock Interview Round", "Realtime Feedback", "Confidence Score"],
            highlight: false,
        },
        {
            rounds: "5 Rounds",
            price: 1999,
            original: 4999,
            features: ["5 Mock Interview Rounds", "270% Success Boost", "Progress Tracking"],
            highlight: true,
            label: "RECOMMENDED",
        },
        {
            rounds: "10 Rounds",
            price: 3499,
            original: 9999,
            features: ["10 Mock Interview Rounds", "Priority AI Engine", "Full Performance Audit"],
            highlight: false,
        },
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

                .glass-panel {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.15);
                  border-radius: 32px;
                  box-shadow: 0 40px 100px rgba(197,160,89, 0.05);
                }

                .ai-card {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.1);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .ai-card:hover {
                  border-color: #C5A059;
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(197,160,89, 0.08);
                }

                .status-badge {
                  font-size: 10px;
                  font-weight: 800;
                  padding: 4px 12px;
                  border-radius: 100px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
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
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.08) 0%, transparent 100%)" }}>
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase">
                       Institutional Grade AI
                    </span>
                    <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#2D2926]">
                       Master Your <br/> <span className="gold-shimmer">Visa Interview</span>
                    </h1>
                    <p className="text-black text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                       "Precision-engineered AI simulations that replicate the exact psychological and technical protocols of US Visa Officers."
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                  >
                     <div className="glass-panel p-2 overflow-hidden shadow-2xl">
                        <div className="bg-[#2D2926] rounded-[28px] overflow-hidden">
                           <div className="bg-[#3A3530] px-6 py-4 flex items-center justify-between border-b border-white/5">
                              <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                 <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                                 <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                              </div>
                              <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Encryption Active</span>
                           </div>
                           <div className="p-10 space-y-8">
                              <div className="flex gap-4 items-start">
                                 <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center font-bold text-[#2D2926] text-xs">VO</div>
                                 <div className="bg-white/5 rounded-2xl rounded-tl-none p-5 text-sm text-white/80 leading-relaxed max-w-[80%]">
                                    "Welcome. I see you're applying for an F-1 visa. Why did you choose this specific university for your Masters?"
                                 </div>
                              </div>
                              <div className="flex gap-4 items-start flex-row-reverse">
                                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-xs">YOU</div>
                                 <div className="bg-[#C5A059] rounded-2xl rounded-tr-none p-5 text-sm text-[#2D2926] font-medium leading-relaxed max-w-[80%]">
                                    "I chose University of California because of their advanced research in Neural Networks and the specific faculty mentorship program..."
                                 </div>
                              </div>
                              <div className="pt-6 border-t border-white/5">
                                 <div className="flex items-center gap-3 text-[#C5A059] mb-4">
                                    <Zap size={16} />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Live Feedback Engine</span>
                                 </div>
                                 <div className="text-white/40 text-xs italic font-medium leading-relaxed">
                                    "Strong answer. You successfully linked your academic interests to specific university offerings. Recommendation: Mention one specific professor's work to boost credibility."
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 blur-3xl rounded-full -z-10" />
                     <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#C5A059]/5 blur-3xl rounded-full -z-10" />
                  </motion.div>
               </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                           { 
                             icon: <Video className="text-[#C5A059]" />, 
                             title: "Video Simulation", 
                             desc: "Face an AI-driven officer with real-time facial analysis and stress level monitoring." 
                           },
                           { 
                             icon: <Zap className="text-[#C5A059]" />, 
                             title: "Instant Diagnostics", 
                             desc: "Get immediate scoring on your confidence, grammar, and factual consistency." 
                           },
                           { 
                             icon: <ShieldCheck className="text-[#C5A059]" />, 
                             title: "Approval Predictor", 
                             desc: "Our neural network predicts your approval percentage based on historical visa trends." 
                           }
                        ].map((item, i) => (
                           <div key={i} className="ai-card p-10 space-y-6">
                              <div className="w-14 h-14 rounded-2xl bg-[#F8F5F0] flex items-center justify-center shadow-sm">
                                 {item.icon}
                              </div>
                              <h3 className="fd text-2xl font-bold">{item.title}</h3>
                              <p className="text-black text-base leading-relaxed">{item.desc}</p>
                           </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ──────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#2D2926] text-white">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                     {[
                        { label: "AI Accuracy", val: "97.6%" },
                        { label: "Processed Cases", val: "50k+" },
                        { label: "Success Boost", val: "270%" },
                        { label: "Review Latency", val: " < 1s" }
                     ].map((stat, i) => (
                        <div key={i} className="text-center space-y-2">
                           <p className="gold-shimmer fd text-5xl font-bold">{stat.val}</p>
                           <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">{stat.label}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* ── PRICING SECTION ─────────────────────────────────────────────────── */}
            <section className="py-32 px-6">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20 space-y-6">
                     <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">Limited Time Enrollment</span>
                     <h2 className="fd text-5xl md:text-6xl font-bold leading-tight">Elite <span className="gold-shimmer">Access Protocols</span></h2>
                     <p className="text-black text-lg font-medium max-w-2xl mx-auto italic">
                        "Secure your visa first attempt. Avoid the $185 re-application fee and months of delay."
                     </p>
                     
                     <div className="flex justify-center gap-4 mt-8">
                        {["USD", "INR", "GBP", "EUR"].map(c => (
                           <button 
                             key={c}
                             onClick={() => setCurrency(c)}
                             className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border ${currency === c ? 'bg-[#2D2926] text-white border-[#2D2926]' : 'text-black border-[#F1EDEA] hover:border-[#C5A059]'}`}
                           >
                              {c}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                     {plans.map((plan, i) => (
                        <div key={i} className={`pricing-card p-12 space-y-10 relative overflow-hidden ${plan.highlight ? 'featured shadow-2xl scale-105 z-10' : ''}`}>
                           {plan.label && (
                              <div className="absolute top-0 right-0 bg-[#C5A059] text-[#2D2926] text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                                 {plan.label}
                              </div>
                           )}
                           <div className="space-y-4">
                              <h3 className="fd text-3xl font-bold">{plan.rounds}</h3>
                              <div className="flex items-baseline gap-2">
                                 <span className={plan.highlight ? 'text-white/40 text-sm line-through' : 'text-black text-sm line-through'}>{currency} {plan.original.toLocaleString('en-IN')}</span>
                                 <span className={plan.highlight ? 'text-[#C5A059] text-5xl font-bold' : 'text-[#2D2926] text-5xl font-bold'}>
                                    {currency} {plan.price.toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              {plan.features.map((f, j) => (
                                 <div key={j} className="flex gap-3 items-center">
                                    <CheckCircle2 size={16} className="text-[#C5A059]" />
                                    <span className={`text-sm font-medium ${plan.highlight ? 'text-white/60' : 'text-black'}`}>{f}</span>
                                 </div>
                              ))}
                           </div>
                            <button 
                                onClick={() => setCheckoutPlan({ actual: plan.original, discounted: plan.price, title: `${plan.rounds} Mock Interview` })}
                                className={`w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${plan.highlight ? 'bg-[#C5A059] text-[#2D2926] hover:bg-white' : 'bg-[#2D2926] text-white hover:bg-[#C5A059]'}`}
                            >
                               Initialize Protocol
                            </button>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* ── FAQ SECTION ────────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-[#F8F5F0]">
               <div className="max-w-4xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                     <h2 className="fd text-4xl font-bold">Protocol <span className="gold-shimmer">Inquiries</span></h2>
                     <p className="text-black font-medium italic">Everything you need to know about our institutional AI</p>
                  </div>
                  <div className="space-y-4">
                      {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-[#F1EDEA] shadow-sm">
                           <button 
                             onClick={() => setOpenFaq(openFaq === i ? null : i)}
                             className="w-full flex items-center justify-between text-left group"
                           >
                              <span className="font-bold text-[#2D2926] group-hover:text-[#C5A059] transition-colors uppercase tracking-tight text-sm">{faq.q}</span>
                              <ChevronDown size={20} className={`text-[#C5A059] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                           </button>
                           <AnimatePresence>
                              {openFaq === i && (
                                 <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: "auto", opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="overflow-hidden"
                                 >
                                    <div className="pt-6 text-black text-base leading-relaxed font-serif italic">
                                       "{faq.a}"
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      ))}
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
        </main>
    );
}