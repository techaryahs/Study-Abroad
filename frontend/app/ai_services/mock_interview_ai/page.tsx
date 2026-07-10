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
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

export default function USVisaMockInterview() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [currency, setCurrency] = useState("INR");
    const [checkoutPlan, setCheckoutPlan] = useState<{ actual: number; discounted: number; title: string } | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

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
        <main
            className="min-h-screen pb-32 text-[#10324a]"
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

                @keyframes shimmer {
                  0% { background-position: -200% center; }
                  100% { background-position: 200% center; }
                }

                .glass-panel {
                  background: rgba(255,255,255,0.85);
                  border: 1px solid rgba(16,50,74, 0.10);
                  border-radius: 32px;
                  box-shadow: 0 30px 90px rgba(16,50,74, 0.08);
                }

                .ai-card {
                  background: rgba(255,255,255,0.75);
                  border: 1px solid rgba(16,50,74, 0.10);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .ai-card:hover {
                  border-color: #d2a14a;
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(16,50,74, 0.08);
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
                  background: rgba(255,255,255,0.85);
                  border: 1px solid rgba(16,50,74, 0.10);
                  border-radius: 32px;
                  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .pricing-card.featured {
                  background: #10324a;
                  color: white;
                  border-color: #10324a;
                }
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative pt-8 pb-12 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(44,165,157, 0.10) 0%, transparent 100%)" }}>
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[11px] tracking-[0.2em] uppercase w-fit">
                       Institutional Grade AI
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95]">
                       <span className="gold-shimmer">Master Your <br/> Visa Interview</span>
                    </h1>
                    <p className="text-[#4b5b6a] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                       "Precision-engineered AI simulations that replicate the exact psychological and technical protocols of US Visa Officers."
                    </p>
                     </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                  >
                     <div className="glass-panel p-2 overflow-hidden">
                        <div className="bg-[#10324a] rounded-[28px] overflow-hidden">
                           <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/10">
                              <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                 <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                                 <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                              </div>
                              <span className="text-[14px] font-bold text-white/40 font-bold tracking-widest uppercase">Encryption Active</span>
                           </div>
                           <div className="p-6 space-y-4">
                              <div className="flex gap-3 items-start">
                                 <div className="w-8 h-8 rounded-lg bg-[#d2a14a] flex items-center justify-center font-bold text-[#10324a] text-[10px] shrink-0">VO</div>
                                 <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-white/80 leading-relaxed max-w-[85%]">
                                    "Welcome. I see you're applying for an F-1 visa. Why did you choose this specific university for your Masters?"
                                 </div>
                              </div>
                              <div className="flex gap-3 items-start flex-row-reverse">
                                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-[10px] shrink-0">YOU</div>
                                 <div className="bg-[#d2a14a] rounded-2xl rounded-tr-none p-4 text-xs text-[#10324a] font-medium leading-relaxed max-w-[85%]">
                                    "I chose University of California because of their advanced research in Neural Networks and the specific faculty mentorship program..."
                                 </div>
                              </div>
                              <div className="pt-4 border-t border-white/10">
                                 <div className="flex items-center gap-3 text-[#d2a14a] mb-2">
                                    <Zap size={16} />
                                    <span className="text-[14px] font-bold font-bold tracking-widest uppercase">Live Feedback Engine</span>
                                 </div>
                                 <div className="text-white/50 text-[11px] italic font-medium leading-relaxed">
                                    "Strong answer. You successfully linked your academic interests to specific university offerings. Recommendation: Mention one specific professor's work to boost credibility."
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* Decorative Elements */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d2a14a]/15 blur-3xl rounded-full -z-10" />
                     <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#2ca59d]/12 blur-3xl rounded-full -z-10" />
                  </motion.div>
               </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                           { 
                             icon: <Video className="text-[#d2a14a]" />, 
                             title: "Video Simulation", 
                             desc: "Face an AI-driven officer with real-time facial analysis and stress level monitoring." 
                           },
                           { 
                             icon: <Zap className="text-[#d2a14a]" />, 
                             title: "Instant Diagnostics", 
                             desc: "Get immediate scoring on your confidence, grammar, and factual consistency." 
                           },
                           { 
                             icon: <ShieldCheck className="text-[#d2a14a]" />, 
                             title: "Approval Predictor", 
                             desc: "Our neural network predicts your approval percentage based on historical visa trends." 
                           }
                        ].map((item, i) => (
                           <div key={i} className="ai-card p-10 space-y-6">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2ca59d]/15 to-[#d2a14a]/15 flex items-center justify-center shadow-sm">
                                 {item.icon}
                              </div>
                              <h3 className="text-2xl font-black text-[#10324a]">{item.title}</h3>
                              <p className="text-[#4b5b6a] text-base leading-relaxed">{item.desc}</p>
                           </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ──────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#10324a] text-white relative overflow-hidden">
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(210,161,74,0.12),transparent_50%)]" />
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(44,165,157,0.12),transparent_50%)]" />
               <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                     {[
                        { label: "AI Accuracy", val: "97.6%" },
                        { label: "Processed Cases", val: "50k+" },
                        { label: "Success Boost", val: "270%" },
                        { label: "Review Latency", val: " < 1s" }
                     ].map((stat, i) => (
                        <div key={i} className="text-center space-y-2">
                           <p className="gold-shimmer text-5xl font-black">{stat.val}</p>
                           <p className="text-white/50 text-[14px] font-bold font-bold tracking-[0.2em] uppercase">{stat.label}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* ── PRICING SECTION ─────────────────────────────────────────────────── */}
            <section id="pricing" className="py-32 px-6">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20 space-y-6">
                     <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Limited Time Enrollment</span>
                     <h2 className="text-5xl md:text-6xl font-black leading-tight">
                        <span className="gold-shimmer">Elite Access Protocols</span>
                     </h2>
                     <p className="text-[#4b5b6a] text-lg font-medium max-w-2xl mx-auto italic">
                        "Secure your visa first attempt. Avoid the $185 re-application fee and months of delay."
                     </p>
                     
                     <div className="flex justify-center gap-4 mt-8">
                        {["USD", "INR", "GBP", "EUR"].map(c => (
                           <button 
                             key={c}
                             onClick={() => setCurrency(c)}
                             className={`px-4 py-1.5 rounded-full text-[14px] font-bold font-bold transition-all border ${currency === c ? 'bg-[#10324a] text-white border-[#10324a]' : 'text-[#4b5b6a] border-[#10324a]/12 hover:border-[#d2a14a]'}`}
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
                              <div className="absolute top-0 right-0 bg-[#d2a14a] text-[#10324a] text-[13px] font-bold font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                                 {plan.label}
                              </div>
                           )}
                           <div className="space-y-4">
                              <h3 className="text-3xl font-black">{plan.rounds}</h3>
                              <div className="flex items-baseline gap-2">
                                 <span className={plan.highlight ? 'text-white/40 text-sm line-through' : 'text-[#4b5b6a] text-sm line-through'}>{currency} {plan.original.toLocaleString('en-IN')}</span>
                                 <span className={plan.highlight ? 'text-[#d2a14a] text-5xl font-black' : 'text-[#10324a] text-5xl font-black'}>
                                    {currency} {plan.price.toLocaleString('en-IN')}
                                 </span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              {plan.features.map((f, j) => (
                                 <div key={j} className="flex gap-3 items-center">
                                    <CheckCircle2 size={16} className="text-[#d2a14a]" />
                                    <span className={`text-sm font-medium ${plan.highlight ? 'text-white/70' : 'text-[#4b5b6a]'}`}>{f}</span>
                                 </div>
                              ))}
                           </div>
                            <button 
                                onClick={() => setCheckoutPlan({ actual: plan.original, discounted: plan.price, title: `${plan.rounds} Mock Interview` })}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.highlight ? 'bg-[#d2a14a] text-[#10324a] hover:bg-white' : 'bg-[#10324a] text-white hover:bg-[#d2a14a] hover:text-[#10324a]'}`}
                            >
                               Initialize Protocol
                            </button>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* ── FAQ SECTION ────────────────────────────────────────────────────── */}
            <section className="py-24 px-6 bg-white/40">
               <div className="max-w-4xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                     <h2 className="text-4xl font-black text-[#10324a]">Protocol <span className="gold-shimmer">Inquiries</span></h2>
                     <p className="text-[#4b5b6a] font-medium italic">Everything you need to know about our institutional AI</p>
                  </div>
                  <div className="space-y-4">
                      {faqs.map((faq, i) => (
                        <div key={i} className="bg-white/80 rounded-3xl p-8 border border-[#10324a]/10 shadow-sm">
                           <button 
                             onClick={() => setOpenFaq(openFaq === i ? null : i)}
                             className="w-full flex items-center justify-between text-left group"
                           >
                              <span className="font-black text-[#10324a] group-hover:text-[#d2a14a] transition-colors uppercase tracking-tight text-sm">{faq.q}</span>
                              <ChevronDown size={20} className={`text-[#d2a14a] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                           </button>
                           <AnimatePresence>
                              {openFaq === i && (
                                 <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: "auto", opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="overflow-hidden"
                                 >
                                    <div className="pt-6 text-[#4b5b6a] text-base leading-relaxed italic">
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
 
            {/* ── FINAL CTA SECTION ────────────────────────────────────────────────── */}
            <section className="py-32 px-6">
               <div className="max-w-5xl mx-auto">
                  <div className="bg-white/85 border border-[#d2a14a]/25 rounded-[48px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d2a14a] to-transparent" />
                     <div className="space-y-4 relative z-10">
                        <span className="text-[#0f4c5c] text-[11px] font-black tracking-[0.3em] uppercase">Ready for Approval?</span>
                        <h2 className="text-5xl md:text-6xl font-black text-[#10324a]">Claim Your <span className="gold-shimmer">Status Today</span></h2>
                        <p className="text-[#4b5b6a] text-lg font-medium max-w-2xl mx-auto italic">
                           "Join 50,000+ applicants who secured their visas using our institutional-grade simulation protocols."
                        </p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10 pt-4">
                        <button 
                           onClick={() => setIsBookingOpen(true)}
                           className="bg-[#10324a] text-white px-10 py-5 rounded-2xl font-black hover:bg-[#d2a14a] hover:text-[#10324a] transition-all flex items-center justify-center gap-3 shadow-2xl tracking-widest text-xs uppercase"
                        >
                           Consult Advisor <Zap size={16} />
                        </button>
                        <button 
                           onClick={() => {
                              const el = document.getElementById('pricing');
                              el?.scrollIntoView({ behavior: 'smooth' });
                           }}
                           className="bg-white text-[#10324a] border-2 border-[#10324a]/12 px-10 py-5 rounded-2xl font-black hover:border-[#d2a14a] transition-all tracking-widest text-xs uppercase"
                        >
                           View Protocols
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