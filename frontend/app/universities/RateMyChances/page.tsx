"use client";

import { motion } from "framer-motion";
import {
    ChevronRight,
    ChevronDown,
    Building2,
    DollarSign,
    GraduationCap,
    Sparkles,
    TrendingUp,
    FileText,
    Clock,
    Calculator,
    CheckCircle2,
    Award
} from "lucide-react";
import Image from "next/image";
import usaData from "@/data/USA.json";

const Globe = ({ className, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);
// ─── Premium Features Data ───────────────────────────────────────────────────
const premiumFeatures = [
    {
        icon: <Calculator className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "Rate Your Chances",
        description: "Advanced algorithms find your ideal university!"
    },
    {
        icon: <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "Overall Profile Check",
        description: "In-depth analysis for the complete picture!"
    },
    {
        icon: <FileText className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "Improvements Detailed",
        description: "Expert-level profile-building guidance."
    },
    {
        icon: <Clock className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "Quick Evaluations",
        description: "Instant feedback and rapid results."
    },
    {
        icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "24/7 Access",
        description: "Access your dashboard anywhere, anytime."
    },
    {
        icon: <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-[#D4A848]" strokeWidth={1.5} />,
        title: "Mathematical Modelling",
        description: "Complex systems distilled into simple results."
    }
];



export default function RateMyChancesPage() {
    const harvardInfo = usaData.find(u => u.slug === 'harvard-university') || usaData[0];
    const topBranch = harvardInfo.branches[0];

    const USD_TO_INR = 83; // Standard conversion rate
    const formatINR = (usdAmount: number | undefined) => {
        if (!usdAmount) return "N/A";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(usdAmount * USD_TO_INR);
    };

    const uniData = {
        name: harvardInfo.name,
        location: `${harvardInfo.location.state}, ${harvardInfo.location.country}`,
        logo_url: harvardInfo.logo,
        rank: 1,
        stats: [
            { label: "Average Salary", value: formatINR(harvardInfo.common_sections.employment_figures.average_salary) },
            { label: "Tuition Fee", value: formatINR(topBranch.stats.tuition_fee) },
            { label: "Average GPA", value: topBranch.stats.avg_gpa },
            (topBranch.stats as any).avg_gmat ? { label: "Average GMAT Score", value: (topBranch.stats as any).avg_gmat } : null,
            (topBranch.stats as any).avg_gre ? { label: "Average GRE Score", value: (topBranch.stats as any).avg_gre } : null,
            (topBranch.stats as any).avg_lsat ? { label: "Average LSAT Score", value: (topBranch.stats as any).avg_lsat } : null,
            (topBranch.stats as any).avg_mcat ? { label: "Average MCAT Score", value: (topBranch.stats as any).avg_mcat } : null,
            { label: "Acceptance Rate", value: `${topBranch.stats.acceptance_rate}%` }
        ].filter(Boolean) as { label: string; value: string | number }[]
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#362B25] font-base selection:bg-[#D4A848]/20 overflow-x-hidden pt-[100px] mb-8">
            
            {/* ── Hero Section ── */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4 text-center space-y-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-black text-[#D4A848] tracking-tighter mb-1 font-serif">
                        RateMyChances
                    </h1>
                    <p className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-[0.2em] text-[#675F5B]/80 mt-2">
                        Powered By Global Counsellor Centre
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center relative mt-6"
                >
                    <div className="absolute -left-10 lg:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F8F6F1] rounded-full items-center justify-center text-[#D4A848] shadow-sm hidden sm:flex">
                        <Sparkles size={20} />
                    </div>
                    <p className="text-[#675F5B] text-[13px] sm:text-sm md:text-base leading-relaxed max-w-2xl text-left z-10 relative bg-white p-5 sm:p-6 rounded-2xl border border-[#D4A848]/10 shadow-sm font-medium">
                        Rate My Chances, a unique algorithm, evaluates GPA, research, work experience, GRE/GMAT scores, and acceptance rates, providing accurate admission probabilities and profile improvement guidance. Highly relied upon!
                    </p>
                </motion.div>
            </section>

            {/* ── Example Harvard Card ── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-[#D4A848]/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-6 sm:right-8 w-10 sm:w-12 h-14 sm:h-16 bg-[#D4A848] rounded-b-xl flex flex-col items-center justify-center text-white shadow-lg shadow-[#D4A848]/30">
                        <Award size={14} className="mb-1 opacity-80" />
                        <span className="font-black text-sm sm:text-lg leading-none">{uniData.rank}</span>
                    </div>

                    <div className="mb-6">
                        <span className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-[0.2em] text-[#25D366]">
                            Try it out Free!
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center border-b border-[#D4A848]/10 pb-6">
                        {/* Title & Logo */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F6F1] rounded-[1.5rem] flex items-center justify-center text-4xl border border-[#D4A848]/20 shadow-inner shrink-0 overflow-hidden relative">
                                <Image src={uniData.logo_url} alt={uniData.name} fill className="object-cover p-2" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-[#362B25] tracking-tight">{uniData.name}</h2>
                                <p className="text-xs sm:text-sm text-[#675F5B]/70 flex items-center gap-1 mt-1 font-medium">
                                    <Building2 size={12} /> {uniData.location}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-[2] w-full mt-4 md:mt-0">
                            {uniData.stats.map((stat, idx) => (
                                <div key={idx} className="text-left space-y-1">
                                    <p className="text-[13px] font-bold sm:text-[14px] font-bold uppercase font-bold tracking-widest text-[#675F5B]/60">
                                        {stat.label}
                                    </p>
                                    <p className="text-sm sm:text-base font-black text-[#362B25]">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => window.open(`/universities/${harvardInfo.slug}`, '_self')}
                            className="flex-1 py-3 sm:py-4 px-6 rounded-xl border border-[#D4A848]/40 text-[#D4A848] font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#D4A848] hover:text-white transition-colors"
                        >
                            View More
                        </button>
                        <button 
                            onClick={() => document.getElementById('premium-cta')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex-1 py-3 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4A848] to-[#B38F3A] text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-[#D4A848]/20 hover:shadow-[#D4A848]/40 hover:-translate-y-0.5 transition-all outline-none border border-[rgba(255,255,255,0.2)]"
                        >
                            RateMyChances
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ── Probability Bar ── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
                <div className="bg-white border border-[#D4A848]/10 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex flex-col sm:flex-row text-center divide-y sm:divide-y-0 sm:divide-x divide-black/5">

                    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-red-50 to-transparent">
                        <p className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-widest text-red-600 mb-1">Out of League</p>
                        <p className="text-[14px] font-bold font-bold text-red-600/50 mb-2">&lt;70%</p>
                        <p className="text-xs font-semibold text-red-800">Best not to apply.</p>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-transparent">
                        <p className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-widest text-[#D4A848] mb-1">Ambitious</p>
                        <p className="text-[14px] font-bold font-bold text-[#D4A848]/50 mb-2">&gt;70%</p>
                        <p className="text-xs font-semibold text-[#B38F3A]">May be worth applying.</p>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-transparent">
                        <p className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-widest text-yellow-600 mb-1">Moderate</p>
                        <p className="text-[14px] font-bold font-bold text-yellow-600/50 mb-2">&gt;80%</p>
                        <p className="text-xs font-semibold text-yellow-800">Looking good!</p>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-transparent">
                        <p className="text-[14px] font-bold sm:text-xs font-black uppercase tracking-widest text-green-600 mb-1">Safe</p>
                        <p className="text-[14px] font-bold font-bold text-green-600/50 mb-2">&gt;90%</p>
                        <p className="text-xs font-semibold text-green-800">We love your chances!</p>
                    </div>

                </div>
            </section>

            {/* ── Premium Options CTA ── */}
            <section id="premium-cta" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex flex-col items-start sm:items-center overflow-hidden">
                <button 
                    onClick={() => document.getElementById('why-premium')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-5 rounded-full border-2 border-[#D4A848]/40 text-[#D4A848] font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-[#D4A848] hover:text-white transition-all shadow-xl shadow-[#D4A848]/10 group z-10 bg-white"
                >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce group-hover:animate-none" />
                    Go For Premium
                </button>
            </section>

            {/* ── Why Go Premium Grid ── */}
            <section id="why-premium" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-[#362B25] tracking-tight relative inline-block">
                        Why go premium?
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            className="absolute -bottom-4 left-0 h-1 bg-[#D4A848]"
                        />
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
                    {premiumFeatures.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4 group"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-[#D4A848]/10 shadow-lg shadow-[#D4A848]/5 flex items-center justify-center group-hover:scale-110 group-hover:border-[#D4A848]/40 transition-all duration-300 relative">
                                {/* Small decorative star icon */}
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4A848] rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform hidden sm:flex">
                                    <Sparkles size={10} />
                                </div>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-[#362B25] tracking-tight mt-4">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-[#675F5B]/80 font-medium leading-relaxed max-w-[250px]">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Book Session CTA Footer */}
                <div className="flex justify-center mt-20 pb-10">
                    <button
                        onClick={() => window.open('/services/admission-guidance', '_self')}
                        className="bg-[#362B25] text-white px-8 py-4 sm:px-12 sm:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-[#D4A848] transition-colors shadow-2xl flex items-center gap-3"
                    >
                        Contact Experts <ChevronRight size={18} />
                    </button>
                </div>
            </section>
        </main>
    );
}
