'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DiscussionSection from "@/components/shared/DiscussionSection";
import { motion, Variants } from "framer-motion";
import {
   Phone,
   MessageSquare,
   CheckCircle2,
   ChevronDown,
   Info,
   GraduationCap,
   Search,
   Plus,
   Minus,
   PenTool,
   ShieldCheck,
   Zap,
   Globe,
   Award,
   Video,
   Beaker,
   Briefcase,
   Star,
   Tv
} from "lucide-react";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import CheckoutModal from "@/app/User/cart/checkoutmodal";

export default function O1Page() {
   const [currency, setCurrency] = useState("IDR");
   const [skipQueue, setSkipQueue] = useState(false);
   const [openFaq, setOpenFaq] = useState<number | null>(null);
   const [showBookingModal, setShowBookingModal] = useState(false);
   const [showCheckoutModal, setShowCheckoutModal] = useState(false);

   const basePrice = 49900000.00;
   const discountedPrice = 41500000.00;

   const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
   };

   const itemVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            type: "spring",
            stiffness: 110,
            damping: 18,
            duration: 0.6
         }
      }
   };

   const o1Categories = [
      {
         title: "O-1A Visa",
         subtitle: "Sciences, Education, Business, Athletics",
         description: "For individuals with extraordinary abilities in science, education, business, or athletics.",
         highlights: ["Requires US Employer/Agent", "Sustained National/International Acclaim"],
         popular: true,
         icon: <Award className="text-[#D4A848]" size={24} />
      },
      {
         title: "O-1B Visa",
         subtitle: "Arts, Motion Picture, Television",
         description: "For individuals with extraordinary ability in the arts or extraordinary achievement in film/TV.",
         highlights: ["Requires US Employer/Agent", "Distinction in the Field"],
         popular: false,
         icon: <Tv className="text-[#D4A848]" size={24} />
      },
      {
         title: "O-2 Visa",
         subtitle: "Essential Support Personnel",
         description: "For individuals who will accompany an O-1 artist or athlete to assist in a specific event.",
         highlights: ["Must Accompany O-1 Holder", "Critical Skills & Experience"],
         popular: false,
         icon: <Briefcase className="text-[#D4A848]" size={24} />
      }
   ];

   const criteria = [
      "Evidence of receipt of nationally or internationally recognized prizes or awards for excellence.",
      "Evidence of membership in associations requiring outstanding achievements.",
      "Evidence of published material in professional/major trade publications about you.",
      "Evidence of participation on a panel, or individually, as a judge of others' work.",
      "Evidence of original scientific, scholarly, or business-related contributions of major significance.",
      "Evidence of authorship of scholarly articles in professional journals.",
      "Evidence of employment in a critical or essential capacity for distinguished organizations.",
      "Evidence of commanding a high salary or other significant remuneration."
   ];


   return (
      <main className="min-h-screen bg-[#F8F6F1] text-[#362B25] font-base selection:bg-[#D4A848]/20 relative overflow-hidden">

         {/* ── BACKGROUND AMBIENT GLOWS ── */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4A848]/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-[#D4A848]/10 blur-[150px] rounded-full" />
         </div>

         {/* ── HERO SECTION ── */}
         <section className="relative pt-8 pb-12 px-6 md:px-20 z-10 border-b border-[#D4A848]/10">
            <div className="max-w-screen-2xl mx-auto">
               <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12 mb-8">
                  <motion.div
                     initial="hidden"
                     animate="visible"
                     variants={containerVariants}
                     className="flex-1 space-y-4"
                  >
                     <motion.div variants={itemVariants} className="space-y-2">
                        <span className="text-[#D4A848] uppercase tracking-[0.5em] font-black text-[7px] sm:text-[9px] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#D4A848]/20 inline-block shadow-sm">
                           Extraordinary Protocol
                        </span>
                        <h1 className="text-2xl text-[#362B25] md:text-5xl font-black leading-[1.1] uppercase italic tracking-tight">
                           APPLY FOR AN <br className="sm:hidden" />
                           <span className="text-[#D4A848] block mt-1">O-1 VISA NODE</span>
                        </h1>
                     </motion.div>

                     <motion.div variants={itemVariants} className="hidden sm:block max-w-xl">
                        <p className="text-base md:text-lg text-[#675F5B] leading-relaxed font-medium italic border-l-2 border-[#D4A848] pl-6">
                           The <span className="text-[#362B25] font-black">Elite Non-Immigrant</span> work visa in the US, architected for individuals with extraordinary global acclaim in their field.
                        </p>
                     </motion.div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                     className="w-24 h-24 sm:w-1/2 lg:w-1/2 relative shrink-0"
                  >
                     <div className="relative aspect-square sm:aspect-[4/3] w-full group">
                        <div className="absolute inset-0 bg-[#D4A848]/15 blur-[40px] sm:blur-[100px] rounded-full pointer-events-none" />
                        <div className="relative w-full h-full rounded-2xl sm:rounded-[3rem] overflow-hidden border border-[#D4A848]/20 shadow-xl sm:shadow-2xl">
                           <Image
                              src="/eb1-hero.png"
                              alt="O-1 hero"
                              fill
                              className="object-cover opacity-90"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#362B25]/40 to-transparent" />
                        </div>
                     </div>
                  </motion.div>
               </div>

               <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-6"
               >
                  <motion.div variants={itemVariants} className="sm:hidden">
                     <p className="text-sm text-[#675F5B] leading-relaxed font-medium italic border-l-2 border-[#D4A848] pl-4 py-1">
                        The <span className="text-[#362B25] font-black">Elite Non-Immigrant</span> work visa for extraordinary global talent.
                     </p>
                  </motion.div>

                  <DiscussionSection serviceId="o1" />
                  <div className="pt-2 pl-2">
                     <button 
                        onClick={() => setShowCheckoutModal(true)}
                        className="text-[#675F5B] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#D4A848] transition-colors border-b border-transparent hover:border-[#D4A848]/50 pb-1 italic"
                     >
                        Start Settlement Node
                     </button>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* ── PORTING NODE ── */}
         <section className="px-8 md:px-20 z-10 relative">
            <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="max-w-7xl mx-auto p-6 bg-[#FFFFFF] border border-[#D4A848]/20 shadow-sm rounded-[2rem] flex flex-col md:flex-row items-center gap-8 group hover:border-[#D4A848]/50 transition-all duration-700 backdrop-blur-3xl"
            >
               <div className="w-12 h-12 rounded-full bg-[#F8F6F1] flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A848] group-hover:text-[#FFFFFF] transition-all border border-[#D4A848]/20">
                  <Zap size={20} className="text-[#D4A848] group-hover:text-[#FFFFFF]" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#D4A848] italic">H-1B Alternative Activated</h3>
                  <p className="text-[#675F5B] text-[11px] font-medium italic leading-relaxed">
                     Bypass the lottery constraints of <span className="text-[#362B25] font-bold">H-1B</span> with an <span className="text-[#D4A848]">uncapped, infinitely renewable</span> merit-based visa.
                  </p>
               </div>
            </motion.div>
         </section>

         {/* ── WHY CHOOSE US ── */}
         <section className="py-24 px-8 md:px-20 relative z-10">
            <div className="max-w-7xl mx-auto space-y-16">
               <div className="text-center space-y-4">
                  <h2 className="text-2xl md:text-4xl font-black uppercase italic text-[#362B25]">Why Choose Us for O-1</h2>
                  <p className="text-[#675F5B] text-[10px] uppercase tracking-[0.4em] max-w-2xl mx-auto font-black italic">Elite-Level End-to-End Petitioner Services</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-8">
                  {[
                     { t: "Free Eligibility Check", d: "Deep portfolio audit to verify extraordinary ability benchmarks.", icon: <Search size={22} /> },
                     { t: "Build Your Profile", d: "Strategic development to hit high-conquest USCIS definitions.", icon: <GraduationCap size={22} /> },
                     { t: "Success Rates Over 90%", d: "Elite-tier approval vectors for validated qualified candidacy.", icon: <Star size={22} /> }
                  ].map((box, i) => (
                     <motion.div key={i} whileHover={{ y: -5 }} className="space-y-6 group bg-[#FFFFFF] border border-[#D4A848]/20 rounded-3xl p-8 hover:border-[#D4A848]/50 shadow-sm transition-all">
                        <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] border border-[#D4A848]/20 flex items-center justify-center mx-auto group-hover:bg-[#D4A848] group-hover:text-[#FFFFFF] text-[#D4A848] transition-all duration-700 shadow-sm">
                           {box.icon}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-[13px] font-black uppercase italic tracking-widest text-[#362B25]">{box.t}</h4>
                           <p className="text-[#675F5B] text-[11px] leading-relaxed italic px-4">{box.d}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── ROADMAP SECTION ── */}
         <section className="py-24 px-8 md:px-20 bg-[#FFFFFF] border-y border-[#D4A848]/10 relative z-10">
            <div className="max-w-5xl mx-auto space-y-24">
               <div className="text-center space-y-4">
                  <span className="text-[#D4A848] uppercase tracking-[0.5em] font-black text-[9px] block">Sequential Progress</span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic text-[#362B25]">Service Roadmap</h2>
               </div>

               <div className="space-y-16">
                  {[
                     {
                        step: "Phase 01",
                        title: "Profile Building",
                        desc: "Advanced profile synthesis to meet Extraordinary benchmarks.",
                        time: "3-6 Months",
                        img: "/eb1-step1.png",
                        align: "left"
                     },
                     {
                        step: "Phase 02",
                        title: "Petitioning Node",
                        desc: "Architecture of an unbreakable petition narrative.",
                        time: "1-2 Months",
                        img: "/eb1-step2.png",
                        align: "right"
                     },
                     {
                        step: "Phase 03",
                        title: "I-129 Filing Node",
                        desc: "Direct filing protocol with USCIS authorities.",
                        time: "1-2 Months",
                        img: "/eb1-hero.png",
                        align: "left"
                     },
                     {
                        step: "Phase 04",
                        title: "Decision Node",
                        desc: "Receive your official approval notice.",
                        time: "15 Days / 4 Mo",
                        img: "/eb1-step4.png",
                        align: "right",
                        premium: true
                     }
                  ].map((phase, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col md:flex-row gap-8 items-center group ${phase.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                     >
                        {/* IMAGE NODE */}
                        <div className="md:w-1/2 relative aspect-video w-full rounded-[2rem] overflow-hidden border border-[#D4A848]/20 group-hover:border-[#D4A848]/50 transition-all duration-700 shadow-2xl">
                           <Image src={phase.img} alt={phase.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000" />
                           <div className="absolute inset-0 bg-[#D4A848]/5 mix-blend-overlay" />
                           <div className="absolute top-4 left-4 bg-[#D4A848] text-[#FFFFFF] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{phase.step}</div>
                        </div>

                        {/* CONTENT NODE */}
                        <div className="md:w-1/2 space-y-4 px-6 text-left">
                           <h3 className="text-xl md:text-2xl font-black italic uppercase group-hover:text-[#D4A848] text-[#362B25] transition-colors">{phase.title}</h3>
                           <p className="text-[#675F5B] text-[13px] font-medium italic leading-relaxed uppercase tracking-tight">{phase.desc}</p>

                           {phase.premium ? (
                              <div className="space-y-3 pt-4">
                                 <div className="flex gap-4 items-center">
                                    <div className="bg-[#F8F6F1] border border-[#D4A848]/30 px-4 py-2 rounded-xl flex items-center justify-between gap-6 w-full">
                                       <span className="text-[10px] font-black text-[#D4A848] uppercase tracking-widest">Premium Node</span>
                                       <span className="text-[10px] font-bold text-[#675F5B] uppercase tracking-widest">15 Calendar Days</span>
                                    </div>
                                 </div>
                                 <div className="flex gap-4 items-center">
                                    <div className="bg-[#FFFFFF] border border-[#D4A848]/10 px-4 py-2 rounded-xl flex items-center justify-between gap-6 w-full shadow-sm">
                                       <span className="text-[10px] font-black text-[#675F5B] uppercase tracking-widest">Standard Node</span>
                                       <span className="text-[10px] font-bold text-[#675F5B] uppercase tracking-widest">2-4 Months</span>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="flex items-center gap-4 pt-4">
                                 <span className="text-[10px] font-black text-[#675F5B] uppercase tracking-widest border border-[#D4A848]/30 px-4 py-1.5 rounded-full uppercase italic">Cycle: {phase.time}</span>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── ANALYTICS ── */}
         <section className="py-24 px-8 md:px-20 relative z-10 md:bg-[#F8F6F1]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24">
               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-4">
                     <h2 className="text-2xl md:text-3xl font-black uppercase italic text-[#362B25] leading-none">Success Analytics</h2>
                     <p className="text-[#675F5B] text-[9px] font-bold uppercase tracking-[0.4em] italic">Validated Petitioner Node Output</p>
                  </div>

                  <div className="space-y-8">
                     {[
                        { label: "O-1A Science Node", pct: 85 },
                        { label: "O-1A Business Node", pct: 79 },
                        { label: "O-1B Arts Node", pct: 88 },
                        { label: "Premium Processed", pct: 95 }
                     ].map((stat, i) => (
                        <div key={i} className="space-y-4">
                           <div className="flex justify-between items-end px-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#675F5B] italic">{stat.label}</p>
                              <p className="text-sm font-black text-[#D4A848] uppercase tracking-tighter">{stat.pct}%</p>
                           </div>
                           <div className="h-2 w-full bg-[#FFFFFF] rounded-full overflow-hidden border border-[#D4A848]/20 shadow-inner">
                              <motion.div
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${stat.pct}%` }}
                                 transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                                 className="h-full bg-[#D4A848] shadow-[0_0_20px_rgba(212,168,72,0.3)]"
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-4 text-right md:text-left">
                     <h2 className="text-2xl md:text-3xl font-black uppercase italic text-[#362B25] leading-none">Alternate Nodes</h2>
                     <p className="text-[#675F5B] text-[9px] font-bold uppercase tracking-[0.4em] italic">Global Talent Access</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     {[
                        { name: "USA (EB-1 Visa)", desc: "Immigrant Green Card Node.", flag: "US", path: "/services/eb1" },
                        { name: "UK (Global Talent)", desc: "Direct Global PR.", flag: "GB", path: "/services/uk-global-talent" },
                        { name: "Australia (National Innovation)", desc: "Priority Access Node.", flag: "AU", path: "/services/australia-national-innovation" }
                     ].map((path, i) => (
                        <Link key={i} href={path.path}>
                           <motion.div
                              whileHover={{ x: 10 }}
                              className="bg-[#FFFFFF] shadow-sm p-6 flex items-center justify-between border border-[#D4A848]/20 hover:border-[#D4A848]/50 group transition-all duration-700 cursor-pointer rounded-full"
                           >
                              <div className="flex items-center gap-6">
                                 <span className="text-[10px] font-black italic text-[#675F5B] group-hover:text-[#D4A848] transition-colors uppercase tracking-[0.4em]">{path.flag}</span>
                                 <div>
                                    <h4 className="text-sm font-black uppercase italic group-hover:text-[#D4A848] text-[#362B25] transition-colors tracking-tight">{path.name}</h4>
                                    <p className="text-[#675F5B] text-[9px] font-bold uppercase tracking-widest pt-1 italic">{path.desc}</p>
                                 </div>
                              </div>
                              <ChevronDown className="-rotate-90 text-[#675F5B] group-hover:text-[#D4A848] transition-colors" size={14} />
                           </motion.div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* ── CRITERIA GRID ── */}
         <section className="py-24 px-8 md:px-20 relative bg-[#FFFFFF] border-y border-[#D4A848]/10 z-10">
            <div className="max-w-7xl mx-auto space-y-20">
               <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic text-[#362B25]">O-1 Class Eligibility</h2>
                  <p className="text-[#675F5B] text-[13px] font-medium italic max-w-4xl mx-auto border-t border-[#D4A848]/20 pt-10">
                     Architecting success for high-conquest global talents. Proof of one major Node award or 3 out of 8 Criteria.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map((c, i) => (
                     <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className="p-6 bg-[#F8F6F1] border border-[#D4A848]/10 rounded-[1.5rem] flex items-start gap-6 hover:bg-[#FFFFFF] hover:border-[#D4A848]/40 shadow-sm transition-all group duration-700"
                     >
                        <span className="text-xl font-black text-[#D4A848] italic opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                        <p className="text-[#362B25] text-[11px] font-medium italic leading-relaxed group-hover:text-[#D4A848] transition-colors uppercase tracking-tight">{c}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── ABOUT SERVICE ── */}
         <section className="py-24 px-8 md:px-20 relative bg-[#F8F6F1] z-10">
            <div className="max-w-7xl mx-auto space-y-24">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {o1Categories.map((cat, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`bg-[#FFFFFF] shadow-sm p-10 flex flex-col items-start gap-8 rounded-[2rem] border relative group ${cat.popular ? 'border-[#D4A848]/40 bg-[#D4A848]/[0.05]' : 'border-[#D4A848]/10'}`}
                     >
                        {cat.popular && (
                           <div className="absolute top-4 right-4 bg-[#D4A848] text-[#FFFFFF] text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              Popular Node
                           </div>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-[#F8F6F1] border border-[#D4A848]/20 flex items-center justify-center group-hover:bg-[#D4A848] group-hover:text-[#FFFFFF] transition-all duration-700 text-[#D4A848]">
                           {cat.icon}
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-lg font-black uppercase italic tracking-tight group-hover:text-[#D4A848] text-[#362B25] transition-colors">{cat.title}</h3>
                           <p className="text-[#675F5B] text-[11px] font-medium italic leading-relaxed pt-1 group-hover:text-[#362B25] transition-colors uppercase">{cat.description}</p>
                        </div>
                        <ul className="space-y-3 pt-6 border-t border-[#D4A848]/20 w-full">
                           {cat.highlights.map((h, j) => (
                              <li key={j} className="flex items-center gap-3">
                                 <div className="w-1 h-1 rounded-full bg-[#D4A848] flex-shrink-0" />
                                 <span className="text-[10px] font-bold text-[#675F5B] uppercase tracking-widest">{h}</span>
                              </li>
                           ))}
                        </ul>
                     </motion.div>
                  ))}
               </div>

               {/* ASSET SPLIT */}
               <div className="flex flex-col lg:flex-row gap-24 items-center">
                  <div className="lg:w-1/2 space-y-12">
                     <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-none text-[#362B25]">Strategic <br />Advantages</h2>
                     <div className="space-y-8">
                        {[
                           { t: "Uncapped Quotas", d: "Unlike H-1B, there is no annual limit or lottery for O-1 visas." },
                           { t: "Infinite Renewals", d: "Can be renewed indefinitely in 1-year increments." },
                           { t: "J-1 Waiver Bypass", d: "Can be obtained even if subject to the 2-year home residency requirement." },
                           { t: "Dual Intent Flexibility", d: "A clear pathway remains open to adjust status to EB-1 or EB-2 NIW." }
                        ].map((adv, i) => (
                           <div key={i} className="group relative pl-10">
                              <div className="absolute left-0 top-0 w-px h-full bg-[#D4A848]/20 group-hover:bg-[#D4A848] transition-colors" />
                              <div className="space-y-1">
                                 <h4 className="text-base font-black uppercase italic text-[#362B25] group-hover:text-[#D4A848] transition-colors">{adv.t}</h4>
                                 <p className="text-[#675F5B] text-[12px] font-medium italic transition-colors">{adv.d}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="lg:w-1/2 relative group">
                     <div className="absolute inset-0 bg-[#D4A848]/10 blur-[100px] pointer-events-none group-hover:bg-[#D4A848]/20 transition-all duration-1000" />
                     <div className="relative rounded-[2.5rem] overflow-hidden border border-[#D4A848]/20 group-hover:border-[#D4A848]/50 transition-all duration-1000 shadow-xl">
                        <Image src="/eb1-professionals.png" alt="Global Professionals" width={800} height={1000} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-2000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/70 to-transparent mix-blend-overlay" />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ── SETTLEMENT SUMMARY ── */}
         {/* <section className="py-24 px-8 md:px-20 bg-[#F8F6F1] z-10 relative">
            <div className="max-w-4xl mx-auto">
               <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#FFFFFF] rounded-[2rem] p-8 flex flex-col md:flex-row gap-12 overflow-hidden border border-[#D4A848]/20 shadow-md hover:border-[#D4A848]/50 items-center transition-all"
               >
                  <div className="md:w-1/2 space-y-6">
                     <h3 className="text-xl font-black uppercase tracking-[0.4em] text-[#D4A848] italic">START NOW</h3>
                     <div className="space-y-4 border-l-2 border-[#D4A848]/40 pl-6">
                        <p className="text-sm font-black italic uppercase text-[#362B25]">Extraordinary Evaluation Protocol</p>
                        <p className="text-2xl font-black text-[#D4A848]">IDR 41,500,000</p>
                     </div>
                  </div>
                  <div className="md:w-1/2 grid grid-cols-1 gap-4">
                     <button 
                        onClick={() => setShowBookingModal(true)}
                        className="bg-[#D4A848] hover:bg-[#c2983d] text-[#FFFFFF] px-8 py-4 text-[10px] tracking-widest text-center uppercase font-black !rounded-xl transition-colors shadow-md"
                     >
                        Initiate Case Review
                     </button>
                      <button 
                         onClick={() => setShowCheckoutModal(true)}
                         className="border border-[#D4A848] text-[#D4A848] hover:bg-[#D4A848]/10 px-8 py-4 text-[10px] tracking-widest uppercase font-black text-center !rounded-xl transition-colors"
                      >
                         Secure Settlement
                      </button>
                  </div>
               </motion.div>
            </div>
         </section> */}

         {/* ── FAQ ── */}
         <section className="py-24 px-8 md:px-20 bg-[#FFFFFF] border-y border-[#D4A848]/10 z-10 relative">
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center space-y-2">
                  <span className="text-[#D4A848] uppercase tracking-[0.5em] font-black text-[8px] italic">Intellectual Node Query</span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase italic text-[#362B25]">Frequently Asked</h2>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  {[
                     {
                        q: "Who qualifies for an O-1 Visa?",
                        a: "Individuals who can demonstrate extraordinary ability by sustained national or international acclaim in sciences, arts, education, business, or athletics."
                     },
                     {
                        q: "Do I need a job offer for O-1?",
                        a: "Yes. The O-1 is an employer-sponsored visa, meaning you must have a US employer or agent to petition on your behalf."
                     },
                     {
                        q: "What is the processing time for O-1?",
                        a: "With premium processing, USCIS will process the petition within 15 calendar days."
                     },
                     {
                        q: "Is there a limit on how long I can stay?",
                        a: "The initial period of stay can be up to 3 years. After that, it can be extended indefinitely in 1-year increments as long as the work continues."
                     }
                  ].map((faq, i) => (
                     <div key={i} className="bg-[#F8F6F1] rounded-2xl border border-[#D4A848]/10 overflow-hidden group hover:border-[#D4A848]/50 transition-all duration-700">
                        <button
                           onClick={() => setOpenFaq(openFaq === i ? null : i)}
                           className="w-full px-6 py-4 flex items-center justify-between gap-6 text-left"
                        >
                           <span className="text-[12px] font-black uppercase tracking-widest italic text-[#675F5B] group-hover:text-[#362B25] transition-colors">{faq.q}</span>
                           <div className="w-5 h-5 rounded-full border border-[#D4A848]/20 flex items-center justify-center text-[#D4A848] flex-shrink-0 bg-[#FFFFFF]">
                              {openFaq === i ? <Minus size={8} /> : <Plus size={8} />}
                           </div>
                        </button>
                        <motion.div
                           initial={false}
                           animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                           className="overflow-hidden"
                        >
                           <div className="px-6 pb-4 pt-1">
                              <p className="text-[#675F5B] text-[11px] leading-relaxed italic border-l border-[#D4A848] pl-6 lowercase">{faq.a}</p>
                           </div>
                        </motion.div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* ── FINAL CTA ── */}
         <section className="py-32 px-8 md:px-20 text-center bg-[#F8F6F1] relative overflow-hidden z-20">
            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
               <h2 className="text-3xl md:text-5xl font-black italic uppercase text-[#362B25]">
                  CLAIM YOUR <br />EXTRAORDINARY STATUS.
               </h2>
               <p className="text-[#675F5B] text-sm max-w-2xl mx-auto italic font-black pt-4">
                  Partner with elite immigration architects to secure your future in the United States.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                  <button 
                     onClick={() => setShowBookingModal(true)}
                     className="px-10 py-4 bg-[#D4A848] text-[#FFFFFF] font-black hover:bg-[#c2983d] rounded-xl text-[11px] w-full sm:w-auto text-center tracking-widest transition-colors shadow-md"
                  >
                     Book Talent Scan
                  </button>
               </div>
            </div>
         </section>

         <BookCounsellingModal 
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
         />

         <CheckoutModal 
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            items={[{ name: "Extraordinary Evaluation Protocol (O-1)", price: discountedPrice }]}
            subtotal={basePrice}
            discount={basePrice - discountedPrice}
            total={discountedPrice}
            currency={currency}
         />
      </main>
   );
}
