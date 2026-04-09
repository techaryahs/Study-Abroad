"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, 
    Video, 
    MessageSquare,
    CheckCircle,
    ChevronDown,
    Zap,
    ShieldCheck,
    Star,
    ArrowRight
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

const profileFeatures = [
    { title: "Visual Identity", desc: "Premium profile picture selection and bespoke background cover architecting." },
    { title: "Narrative Strategy", desc: "Crafting the perfect headline and executive summary for high-end resonance." },
    { title: "Experience Optimization", desc: "In-depth positioning of career milestones, internships, and leadership roles." },
    { title: "Credential Mapping", desc: "Strategic placement of certifications, volunteering, and niche skill endorsements." },
    { title: "Social Proofing", desc: "Systematic approach to gathering high-impact recommendations and honors." },
    { title: "Algorithm Sync", desc: "Technical profile settings revamping to maximize visibility to Tier-1 recruiters." }
];

export default function LinkedinProfilePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

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

                .feature-pill {
                  background: white;
                  border: 1px solid rgba(197,160,89, 0.1);
                  border-radius: 24px;
                  transition: all 0.4s ease;
                }

                .feature-pill:hover {
                  border-color: #C5A059;
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(197,160,89, 0.08);
                }

                .btn-gold {
                   background: #C5A059;
                   color: white;
                   padding: 18px 30px;
                   border-radius: 18px;
                   font-weight: 700;
                   text-transform: uppercase;
                   letter-spacing: 0.1em;
                   font-size: 11px;
                   transition: all 0.3s ease;
                   display: inline-flex;
                   alignItems: center;
                   gap: 10px;
                }
                .btn-gold:hover {
                   background: #2D2926;
                   transform: translateY(-2px);
                   box-shadow: 0 10px 20px rgba(197,160,89, 0.2);
                }
            `}</style>

            {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.1) 0%, transparent 100%)" }}>
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-4">
                        <Link 
                            href="/services" 
                            className="inline-flex items-center gap-2 text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Services
                        </Link>
                        <span className="inline-block px-5 py-2 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[11px] tracking-[0.2em] uppercase w-fit">
                           Professional Identity Protocol
                        </span>
                    </div>
                    <h1 className="fd text-5xl md:text-7xl font-bold leading-[0.95] text-[#2D2926]">
                       Architect Your <br/> <span className="gold-shimmer">LinkedIn Presence</span>
                    </h1>
                    <p className="text-[#6B5E51] text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                       "Transition your digital persona from a static resume to a high-influence professional ecosystem designed for Tier-1 opportunities."
                    </p>
                    <div className="flex items-center gap-6">
                        <DiscussionSection serviceId="linkedin" />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                  >
                     <div className="glass-panel p-2 overflow-hidden shadow-2xl">
                        <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden border border-[#F1EDEA]">
                           <div className="bg-[#F8F5F0] px-6 py-4 flex items-center justify-between border-b border-[#F1EDEA]">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white">in</div>
                                 <span className="text-[10px] text-[#2D2926] font-bold tracking-widest uppercase">Live Network Simulator</span>
                              </div>
                              <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse" title="Engine Active" />
                           </div>
                           <div className="p-10 space-y-8">
                              <div className="flex gap-4 items-start">
                                 <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] border border-[#C5A059]/20 flex items-center justify-center text-xl">✨</div>
                                 <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-[#F1EDEA] rounded-full w-[60%]" />
                                    <div className="h-3 bg-[#F1EDEA] rounded-full w-[90%]" />
                                    <div className="h-3 bg-[#F1EDEA] rounded-full w-[40%]" />
                                 </div>
                              </div>
                              <div className="p-6 bg-[#2D2926] rounded-2xl space-y-4">
                                 <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Strategy Insight</p>
                                 <p className="text-white font-serif italic text-base leading-relaxed">
                                    "We optimize for the LinkedIn 'Core-100' algorithm, ensuring your profile triggers the right recruiter signals within the first 3 seconds of a view."
                                 </p>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-[#C5A059] tracking-widest uppercase border-t border-[#F1EDEA] pt-6">
                                 <span>Profile Strength: All-Star</span>
                                 <span>Search Visibility: +420%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* Decorative Elements */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 blur-3xl rounded-full -z-10" />
                     <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#C5A059]/5 blur-3xl rounded-full -z-10" />
                  </motion.div>
               </div>
            </section>

            {/* ── CORE CAPABILITIES ──────────────────────────────────────────────── */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[#C5A059] text-[11px] font-bold tracking-[0.3em] uppercase">The Architecture of Influence</span>
                        <h2 className="fd text-4xl md:text-5xl font-bold leading-tight">Bespoke Profile <span className="gold-shimmer">Development Nodes</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profileFeatures.map((feat, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="feature-pill p-10 space-y-6"
                           >
                              <div className="w-12 h-12 rounded-xl bg-[#F8F5F0] flex items-center justify-center text-[#C5A059]">
                                 <CheckCircle size={24} />
                              </div>
                              <h3 className="fd text-2xl font-bold text-[#2D2926]">{feat.title}</h3>
                              <p className="text-[#6B5E51] text-sm leading-relaxed font-medium">{feat.desc}</p>
                           </motion.div>
                        ))}
                    </div>

                    <div className="glass-panel p-10 bg-[#F8F5F0] border-none text-center space-y-6 max-w-4xl mx-auto">
                        <Star className="mx-auto text-[#C5A059]" size={32} />
                        <h3 className="fd text-3xl font-bold italic text-[#2D2926]">Synchronous Elite Mentorship</h3>
                        <p className="text-[#6B5E51] text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
                           "Every session is conducted via exclusive one-on-one virtual workshop, ensuring your narrative is precisely tailored to your specific global ambition."
                        </p>
                    </div>
                </div>
            </section>

            {/* ── PRICING SYNOPSIS ────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#2D2926] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C5A059]/5 blur-[200px] rounded-full pointer-events-none" />
               <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <h2 className="fd text-5xl font-bold leading-tight">Secure Your <br/> <span className="gold-shimmer">Strategic Advantage</span></h2>
                     <p className="text-white/40 text-lg font-medium italic max-w-md">
                        Your digital footprint is the bridge to your future. Cross it with the confidence of an institutional-grade profile.
                     </p>
                     <div className="flex flex-col gap-6 pt-4">
                        {[
                            { icon: <Zap size={18}/>, label: "Immediate Recruiter Attention" },
                            { icon: <ShieldCheck size={18}/>, label: "Algorithm-Optimized Discovery" },
                            { icon: <Star size={18}/>, label: "Elite Networking Protocol" }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 text-white/80">
                              <div className="text-[#C5A059]">{item.icon}</div>
                              <span className="text-sm font-bold tracking-widest uppercase">{item.label}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="relative">
                     <div className="glass-panel p-12 bg-white/5 border-white/10 backdrop-blur-xl space-y-10">
                        <AddToCart serviceId="linkedin" />
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic">Encrypted Secure Checkout</span>
                            <div className="flex gap-2">
                                <div className="w-8 h-5 bg-white/5 rounded" />
                                <div className="w-8 h-5 bg-white/5 rounded" />
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <FAQSection />

            {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
            <section className="py-20 px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto bg-white border border-[#C5A059]/20 rounded-[48px] p-16 flex flex-col items-center text-center space-y-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-3xl rounded-full -mr-32 -mt-32" />
                    
                    <div className="space-y-4">
                        <h4 className="fd text-4xl font-bold text-[#2D2926]">Ready to Lead Your Network?</h4>
                        <p className="text-[#6B5E51] text-lg font-medium italic">Discover how we can architect a strategy for your specific career arc.</p>
                    </div>

                    <Link href="/contact" className="btn-gold shadow-2xl group">
                        Enter Professional Portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>

        </main>
    );
}

