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
  Star
} from "lucide-react";

export default function EB1Page() {
  const [currency, setCurrency] = useState("INR");
  const [skipQueue, setSkipQueue] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const basePrice = 49900.00;
  const discountedPrice = 41500.00;

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

  const eb1Categories = [
    {
      title: "EB-1A Visa",
      subtitle: "Extraordinary Ability",
      description: "For individuals with extraordinary abilities in science, arts, education, business, or athletics.",
      highlights: ["No Offer of Employment Needed", "No Labor Certification Needed"],
      popular: true,
      icon: <Award className="text-gold-500" size={24} />
    },
    {
      title: "EB-1B Visa",
      subtitle: "Outstanding Professors",
      description: "For researchers and professors recognized internationally for their contributions.",
      highlights: ["No Labor Certification Needed", "Employment Offer Needed"],
      popular: false,
      icon: <Beaker className="text-gold-500" size={24} />
    },
    {
      title: "EB-1C Visa",
      subtitle: "Multinational Managers",
      description: "For managers or executives working for multinational companies moving to the US.",
      highlights: ["No Labor Certification Needed", "Employment Offer Needed"],
      popular: false,
      icon: <Briefcase className="text-gold-500" size={24} />
    }
  ];

  const criteria = [
    "Evidence of receipt of lesser nationally or internationally recognized prizes or awards for excellence.",
    "Evidence of your membership in associations in the field which demand outstanding achievement.",
    "Evidence of published material about you in professional or major trade publications.",
    "Evidence that you have been asked to judge the work of others, individually or on a panel.",
    "Evidence of your original scientific, scholarly, artistic, athletic, or business-related contributions.",
    "Evidence of your authorship of scholarly articles in professional or major trade publications.",
    "Evidence that your work has been displayed at artistic exhibitions or showcases.",
    "Evidence of your performance of a leading or critical role in distinguished organizations.",
    "Evidence that you command a high salary in relation to others in the field.",
    "Evidence of your commercial successes in the performing arts."
  ];

  return (
    <main className="min-h-screen bg-dark-950 text-white font-base selection:bg-gold-500/20 relative overflow-hidden">
      
      {/* ── BACKGROUND AMBIENT GLOWS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-gold-500/5 blur-[150px] rounded-full" />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 px-8 md:px-20 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:w-1/2 space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[9px] bg-gold-500/5 px-4 py-1.5 rounded-full border border-gold-500/10 inline-block shadow-sm">
                Extraordinary Protocol
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-[1.1] uppercase italic tracking-tight">
                APPLY FOR AN <br />
                <span className="gradient-text-gold block mt-1">EB-1 VISA NODE</span>
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants} className="max-w-xl">
              <p className="text-base md:text-lg text-white/40 leading-relaxed font-medium italic border-l-2 border-gold-500/20 pl-6">
                The <span className="text-white font-black">Highest Priority</span> employment-based visa in the US, architected for individuals with extraordinary global acclaim.
              </p>
            </motion.div>

                  <DiscussionSection serviceId="eb1" />
                  <div className="pt-2 pl-2">
                     <Link href="/checkout?service=eb1" className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:text-gold-500 transition-colors border-b border-transparent hover:border-gold-500/20 pb-1 italic">
                        Start Settlement Node
                     </Link>
                  </div>
               </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/3] w-full group">
               <div className="absolute inset-0 bg-gold-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-gold-500/20 transition-all duration-1000" />
               <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 group-hover:border-gold-500/30 transition-all duration-1000 shadow-2xl">
                 <Image 
                   src="/eb1-hero.png" 
                   alt="EB-1 realistic hero"
                   fill
                   className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-2000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
               </div>
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
           className="max-w-7xl mx-auto p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 group hover:border-gold-500/20 transition-all duration-700 backdrop-blur-3xl"
         >
            <div className="w-12 h-12 rounded-full bg-gold-500/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-all border border-white/5">
               <Zap size={20} className="text-gold-500" />
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-widest gradient-text-gold italic">Porting Protocol Activated</h3>
               <p className="text-white/30 text-[11px] font-medium italic leading-relaxed">
                  Recycle priority dates from <span className="text-white font-bold">EB-2 or EB-3</span> classes to significantly <span className="text-gold-500">lower processing times</span>.
               </p>
            </div>
         </motion.div>
      </section>

      {/* ── WHY CHOOSE YMGRAD ── */}
      <section className="py-24 px-8 md:px-20 relative z-10">
         <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
               <h2 className="text-2xl md:text-4xl font-black uppercase italic gradient-text-gold">Why Choose Us for EB-1</h2>
               <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] max-w-2xl mx-auto font-black italic">Elite-Level End-to-End Petitioner Services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-8">
               {[
                 { t: "Free Eligibility Check", d: "Deep portfolio audit to verify extraordinary ability benchmarks.", icon: <Search size={22} /> },
                 { t: "Build Your Profile", d: "Strategic development to hit high-conquest USCIS definitions.", icon: <GraduationCap size={22} /> },
                 { t: "Success Rates Over 93%", d: "Elite-tier approval vectors for validated qualified candidacy.", icon: <Star size={22} /> }
               ].map((box, i) => (
                 <motion.div key={i} whileHover={{ y: -5 }} className="space-y-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto group-hover:bg-gold-500 group-hover:text-black transition-all duration-700 shadow-lg">
                       {box.icon}
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-[13px] font-black uppercase italic tracking-widest">{box.t}</h4>
                       <p className="text-white/20 text-[11px] leading-relaxed italic px-4">{box.d}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ── ROADMAP SECTION ── */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 border-y border-white/5 relative z-10">
         <div className="max-w-5xl mx-auto space-y-24">
            <div className="text-center space-y-4">
               <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[9px] block">Sequential Progress</span>
               <h2 className="text-3xl md:text-5xl font-black uppercase italic gradient-text-gold">Service Roadmap</h2>
            </div>

            <div className="space-y-16">
               {[
                 { 
                   step: "Phase 01", 
                   title: "Profile Building", 
                   desc: "Advanced profile synthesis to meet Extraordinary benchmarks.", 
                   time: "6 Months", 
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
                   title: "I-140 Filing Node", 
                   desc: "Direct filing protocol with USCIS authorities.", 
                   time: "1-2 Months", 
                   img: "/eb1-hero.png",
                   align: "left"
                 },
                 { 
                   step: "Phase 04", 
                   title: "Decision Node", 
                   desc: "Receive your official I-797 approval notice.", 
                   time: "15 Days / 8 Mo", 
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
                    <div className="md:w-1/2 relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-gold-500/20 transition-all duration-700 shadow-2xl">
                       <Image src={phase.img} alt={phase.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                       <div className="absolute top-4 left-4 bg-gold-500 text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{phase.step}</div>
                    </div>

                    {/* CONTENT NODE */}
                    <div className="md:w-1/2 space-y-4 px-6 text-left">
                       <h3 className="text-xl md:text-2xl font-black italic uppercase group-hover:text-gold-500 transition-colors uppercase">{phase.title}</h3>
                       <p className="text-white/30 text-[13px] font-medium italic leading-relaxed uppercase tracking-tight">{phase.desc}</p>
                       
                       {phase.premium ? (
                          <div className="space-y-3 pt-4">
                             <div className="flex gap-4 items-center">
                                <div className="bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-xl flex items-center justify-between gap-6 w-full">
                                   <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Premium Node</span>
                                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">15 Calendar Days</span>
                                </div>
                             </div>
                             <div className="flex gap-4 items-center">
                                <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl flex items-center justify-between gap-6 w-full opacity-40">
                                   <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Standard Node</span>
                                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">4-8 Months</span>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="flex items-center gap-4 pt-4">
                             <span className="text-[10px] font-black text-white/10 uppercase tracking-widest border border-white/5 px-4 py-1.5 rounded-full uppercase italic">Cycle: {phase.time}</span>
                          </div>
                       )}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ── ANALYTICS ── */}
      <section className="py-24 px-8 md:px-20 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/2 space-y-12">
               <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic gradient-text-gold leading-none">Success Analytics</h2>
                  <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em] italic uppercase">Validated Petitioner Node Output</p>
               </div>
               
               <div className="space-y-8">
                  {[
                    { label: "6 Papers Node", pct: 70 },
                    { label: "7 Papers Node", pct: 79 },
                    { label: "8 Papers Node", pct: 85 },
                    { label: "10+ Papers Node", pct: 97.5 }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-4">
                       <div className="flex justify-between items-end px-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic uppercase">{stat.label}</p>
                          <p className="text-sm font-black gradient-text-gold uppercase tracking-tighter">{stat.pct}%</p>
                       </div>
                       <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.pct}%` }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                            className="h-full bg-gold-500 shadow-[0_0_20px_rgba(194,168,120,0.3)]"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:w-1/2 space-y-12">
               <div className="space-y-4 text-right md:text-left">
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic text-white/20 leading-none">Alternate Nodes</h2>
                  <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.4em] italic uppercase">Global Talent Access</p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "USA (O-1 Visa)", desc: "Priority Work Node.", flag: "US", path: "/services/o1" },
                    { name: "UK (Global Talent)", desc: "Direct Global PR.", flag: "GB", path: "/services/uk-global-talent" },
                    { name: "Australia (National Innovation)", desc: "Priority Access Node.", flag: "AU", path: "/services/australia-national-innovation" }
                  ].map((path, i) => (
                    <Link key={i} href={path.path}>
                       <motion.div 
                         whileHover={{ x: 10 }}
                         className="glass-card p-6 flex items-center justify-between border border-white/5 hover:border-gold-500/20 group transition-all duration-700 cursor-pointer rounded-full"
                        >
                          <div className="flex items-center gap-6">
                             <span className="text-[10px] font-black italic text-white/10 group-hover:text-gold-500 transition-colors uppercase tracking-[0.4em]">{path.flag}</span>
                             <div>
                                <h4 className="text-sm font-black uppercase italic group-hover:text-gold-500 transition-colors uppercase tracking-tight">{path.name}</h4>
                                <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest pt-1 italic">{path.desc}</p>
                             </div>
                          </div>
                          <ChevronDown className="-rotate-90 text-white/20 group-hover:text-gold-500 transition-colors" size={14} />
                       </motion.div>
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ── CRITERIA GRID ── */}
      <section className="py-24 px-8 md:px-20 relative bg-dark-900 border-y border-white/5 z-10">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-6">
               <h2 className="text-3xl md:text-5xl font-black uppercase italic gradient-text-gold">EB-1 Class Eligibility</h2>
               <p className="text-white/20 text-[13px] font-medium italic max-w-4xl mx-auto border-t border-white/5 pt-10">
                  Architecting success for high-conquest global talents. Proof of one major Node award or 3 out of 10 Criteria.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criteria.map((c, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="p-6 bg-white/[0.01] border border-white/5 rounded-[1.5rem] flex items-start gap-6 hover:bg-white/[0.02] hover:border-gold-500/10 transition-all group duration-700"
                  >
                    <span className="text-xl font-black gradient-text-gold italic opacity-20 group-hover:opacity-100 transition-opacity flex-shrink-0">{(i+1).toString().padStart(2, '0')}</span>
                    <p className="text-white/30 text-[11px] font-medium italic leading-relaxed group-hover:text-white/70 transition-colors uppercase tracking-tight">{c}</p>
                  </motion.div>
                ))}
             </div>
         </div>
      </section>

      {/* ── ABOUT SERVICE ── */}
      <section className="py-24 px-8 md:px-20 relative bg-dark-950 z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {eb1Categories.map((cat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className={`glass-card p-10 flex flex-col items-start gap-8 border relative group ${cat.popular ? 'border-gold-500/20 bg-gold-500/[0.01]' : 'border-white/5'}`}
                 >
                   {cat.popular && (
                     <div className="absolute top-4 right-4 bg-gold-500 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                       Popular Node
                     </div>
                   )}
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black transition-all duration-700">
                     {cat.icon}
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-lg font-black uppercase italic tracking-tight group-hover:text-gold-500 transition-colors uppercase">{cat.title}</h3>
                     <p className="text-white/30 text-[11px] font-medium italic leading-relaxed pt-1 group-hover:text-white/60 transition-colors uppercase">{cat.description}</p>
                   </div>
                   <ul className="space-y-3 pt-6 border-t border-white/5 w-full">
                     {cat.highlights.map((h, j) => (
                       <li key={j} className="flex items-center gap-3">
                         <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                         <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{h}</span>
                       </li>
                     ))}
                   </ul>
                 </motion.div>
               ))}
          </div>

          {/* ASSET SPLIT */}
          <div className="flex flex-col lg:flex-row gap-24 items-center">
             <div className="lg:w-1/2 space-y-12">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-none gradient-text-gold">Strategic <br />Advantages</h2>
                <div className="space-y-8">
                   {[
                     { t: "Merit-Based Node", d: "Exclusively for individuals proving extraordinary ability globally." },
                     { t: "PR Gateway Pathway", d: "Direct and fastest pathway to a US Green Card." },
                     { t: "PERM Protocol Bypass", d: "No Labor Certification Needed; bypass the PERM system entirely." },
                     { t: "Priority Status Node", d: "Access the absolute fastest processing times in the US architecture." }
                   ].map((adv, i) => (
                     <div key={i} className="group relative pl-10">
                        <div className="absolute left-0 top-0 w-px h-full bg-gold-500/10 group-hover:bg-gold-500 transition-colors" />
                        <div className="space-y-1">
                           <h4 className="text-base font-black uppercase italic text-white/80 group-hover:text-gold-500 transition-colors">{adv.t}</h4>
                           <p className="text-white/20 text-[12px] font-medium italic group-hover:text-white/50 transition-colors">{adv.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-gold-500/5 blur-[100px] pointer-events-none group-hover:bg-gold-500/10 transition-all duration-1000" />
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-gold-500/20 transition-all duration-1000 shadow-xl">
                   <Image src="/eb1-professionals.png" alt="Global Professionals" width={800} height={1000} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-2000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 to-transparent" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SETTLEMENT SUMMARY ── */}
      <section className="py-24 px-8 md:px-20 bg-dark-950 z-10 relative">
         <div className="max-w-4xl mx-auto">
            <motion.div 
               whileHover={{ y: -5 }}
               className="glass-card p-8 flex flex-col md:flex-row gap-12 overflow-hidden bg-white/[0.01] border border-white/10 hover:border-gold-500/20 items-center"
            >
               <div className="md:w-1/2 space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-[0.4em] gradient-text-gold italic">START NOW</h3>
                  <div className="space-y-4 border-l-2 border-gold-500/20 pl-6">
                     <p className="text-sm font-black italic uppercase">Extraordinary Evaluation Protocol</p>
                     <p className="text-2xl font-black gradient-text-gold">IDR 41,500,000</p>
                  </div>
               </div>
               <div className="md:w-1/2 grid grid-cols-1 gap-4">
                  <Link href="/contact?service=eb1" className="btn-gold px-8 py-4 text-[10px] tracking-widest text-center !rounded-xl">
                     Initiate Case Review
                  </Link>
                  <Link href="/checkout?service=eb1" className="btn-outline-gold px-8 py-4 text-[10px] tracking-widest text-center !rounded-xl">
                     Secure Settlement
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-8 md:px-20 bg-dark-900 overflow-hidden relative z-10 border-y border-white/5">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
               <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[8px] italic">Intellectual Node Query</span>
               <h2 className="text-2xl md:text-4xl font-black uppercase italic gradient-text-gold">Frequently Asked</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {[
                 {
                   q: "Who qualifies for an EB-1A Extraordinary Ability Visa?",
                   a: "Individuals who can demonstrate sustained national or international acclaim. Requires one-time major award or 3 out of 10 USCIS criteria."
                 },
                 {
                   q: "Do I need a job offer for EB-1A?",
                   a: "No. The EB-1A sub-category allows for self-petitioning, meaning no employer sponsorship is required."
                 },
                 {
                   q: "What is the processing time for EB-1?",
                   a: "EB-1 is significantly faster. Premium processing is available for EB-1A and EB-1B, providing results within 45 days."
                 },
                 {
                   q: "Does success lead directly to a Green Card?",
                   a: "Yes. The EB-1 is an immigrant visa node; success directly leads to permanent residency (Green Card) for you and immediate family."
                 }
               ].map((faq, i) => (
                 <div key={i} className="glass-card !p-0 border border-white/5 overflow-hidden group hover:border-gold-500/20 transition-all duration-700">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-6 py-4 flex items-center justify-between gap-6 text-left"
                    >
                       <span className="text-[12px] font-black uppercase tracking-widest italic text-white/50 group-hover:text-white transition-colors">{faq.q}</span>
                       <div className="w-5 h-5 rounded-full border border-white/5 flex items-center justify-center text-gold-500 flex-shrink-0">
                          {openFaq === i ? <Minus size={8} /> : <Plus size={8} />}
                       </div>
                    </button>
                    <motion.div 
                       initial={false}
                       animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                       className="overflow-hidden"
                    >
                       <div className="px-6 pb-4 pt-1">
                          <p className="text-white/20 text-[11px] leading-relaxed italic border-l border-gold-500/10 pl-6 lowercase">{faq.a}</p>
                       </div>
                    </motion.div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-8 md:px-20 text-center bg-dark-950 relative overflow-hidden z-20">
         <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase italic gradient-text-gold">
               CLAIM YOUR <br />EXTRAORDINARY STATUS.
            </h2>
            <p className="text-white/20 text-sm max-w-2xl mx-auto italic font-normal pt-4">
               Partner with elite immigration architects to secure your future in the United States.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
               <Link href="/contact?service=eb1" className="px-10 py-4 btn-gold text-[11px] w-full sm:w-auto text-center tracking-widest">
                  Book Talent Scan
               </Link>
               <Link href="/success-stories" className="px-10 py-4 btn-outline-gold text-[11px] w-full sm:w-auto text-center tracking-widest uppercase italic">
                  Elite Statistics
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
