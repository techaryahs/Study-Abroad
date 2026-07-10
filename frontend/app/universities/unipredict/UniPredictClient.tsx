"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Globe,
    BarChart3,
    Sparkles,
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";


const ChatIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5186 20 9.12396 19.6601 7.90487 19.0604L3 20L4.10309 15.6888C3.40771 14.4442 3 13.0182 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function UniPredictPage() {
    const { isPremium } = usePremiumStatus();
    const [academicType, setAcademicType] = useState<"Percentage" | "CGPA">("Percentage");
    const [percentage, setPercentage] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [testType, setTestType] = useState<"GRE" | "GMAT">("GRE");
    const [greVerbal, setGreVerbal] = useState("");
    const [greQuant, setGreQuant] = useState("");
    const [gmatScore, setGmatScore] = useState("");
    const [englishTest, setEnglishTest] = useState<"TOEFL" | "IELTS">("TOEFL");
    const [englishScore, setEnglishScore] = useState("");
    const [budget, setBudget] = useState(5000000); // 50 Lakhs default
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);
        // Simulate algorithm thinking
        setTimeout(() => {
            setIsCalculating(false);
            setShowResult(true);
        }, 2000);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <PremiumLock isPremium={isPremium} isFullPage={true} title="Unlock UniPredict" description="Get premium access to our highly advanced admission prediction algorithm and tailored recommendations.">
        <main
            className="relative min-h-screen text-[#10324a] font-base selection:bg-[#d2a14a]/20 overflow-x-hidden"
            style={{
                background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
            }}
        >

            {/* ── Background Elements ── */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d2a14a]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-[#2ca59d]/10 rounded-full blur-[100px]" />
            </div>

            {/* ── Sub-header / Branding ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 pt-6 md:pt-8 pb-3 md:pb-4 border-b border-[#10324a]/10 flex justify-between items-end">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <span className="w-6 h-[1.5px] bg-[#d2a14a]"></span>
                        <span className="text-[9px] font-black first-letter:uppercase tracking-[0.3em] text-[#2ca59d] uppercase">The Expert Algorithm</span>
                    </div>
                    <h1 className="text-3xl text-[#D4A54A] md:text-4xl font-black tracking-tighter uppercase leading-none italic">
                        UniPredict
                    </h1>
                </div>
            </div>

            {/* ── Top RateMyChances Ad Section ── */}
            <section className="w-full pt-4 lg:pt-10 px-4 sm:px-6 lg:px-16 overflow-hidden border-b border-[#10324a]/10 mb-4 sm:mb-10">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    <div className="space-y-5 lg:space-y-6 order-2 lg:order-1 pb-6 lg:pb-12 text-center lg:text-left z-10 relative">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#D4A54A] leading-[1.1]">
                            UniPredict By EduLeaderGlobal
                        </h1>
                        <p className="text-[#4b5b6a] text-[13px] sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-90">
                            We've spent years perfecting an algorithm that helps match you with the right universities—based on the same expertise we offer in our luxury services. While many students waste thousands on applications, we give you expert guidance for free. All we ask? Share it with someone who could use it!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-1">
                            <button
                                type="button"
                                onClick={() => window.open('/universities/RateMyChances', '_self')}
                                className="w-full sm:w-auto bg-[#d2a14a] text-[#16364b] px-7 py-3.5 rounded-xl text-[11px] sm:text-xs uppercase font-black tracking-widest hover:bg-[#10324a] hover:text-[#d2a14a] transition-all shadow-xl group flex items-center justify-center gap-2.5"
                            >
                                RateMyChances <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#4b5b6a]/60">
                                We have now launched a much more advanced tool
                            </span>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 flex justify-center mt-2 lg:mt-0">
                        {/* Vector girl image */}
                        <div className="w-full max-w-[440px] aspect-[4/3] bg-transparent relative">
                            <Image
                                src="/unipredict-hero.jpg"
                                alt="Algorithm Analysis Graphic"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Section ── */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-6 md:py-10 lg:py-16">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">

                    {/* Left Side: Info & Hero */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-4xl font-black text-[#D4A54A] tracking-tight leading-[1.1]">
                                Discover Your Best University Matches
                            </h2>
                            <p className="text-[#4b5b6a] text-xs md:text-sm leading-relaxed opacity-90 max-w-md">
                                Our proprietary algorithm analyzes your academic background, test scores, and financial goals to predict your admission success at top institutions worldwide.
                            </p>
                        </div>

                        {/* Feature Points */}
                        <div className="space-y-3">
                            {[
                                { icon: <Sparkles size={14} />, text: "Data-driven accuracy spanning 10 years of admits." },
                                { icon: <BarChart3 size={14} />, text: "Detailed breakdown of safe, reach, and dream universities." },
                                { icon: <Globe size={14} />, text: "Global coverage: USA, UK, Europe, Australia & Canada." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#10324a]/70 hover:text-[#2ca59d] transition-colors group">
                                    <div className="w-9 h-9 rounded-full bg-white border border-[#10324a]/10 flex items-center justify-center text-[#2ca59d] group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Content Image */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden border border-[#10324a]/10 shadow-[0_20px_60px_rgba(16,50,74,0.12)] group">
                            <Image
                                src="/unipredict-students.jpg"
                                alt="Students collaborating"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#10324a]/40 to-transparent" />
                        </div>
                    </div>

                    {/* Right Side: Prediction Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 border border-[#10324a]/10 p-5 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_30px_90px_rgba(16,50,74,0.08)] backdrop-blur-xl relative"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d2a14a]/10 rounded-bl-[100%] border-l border-b border-[#10324a]/10" />

                            <form onSubmit={handleCalculate} className="space-y-8 relative z-10">

                                {/* 1. Academic Credentials */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#10324a] text-white flex items-center justify-center text-[14px] font-bold font-black">1</div>
                                        <label className="text-[14px] font-bold font-black uppercase tracking-[0.2em] text-[#2ca59d]">Academic Foundation</label>
                                    </div>

                                    <div className="flex gap-4">
                                        {["Percentage", "CGPA"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAcademicType(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[14px] font-bold font-black uppercase tracking-widest transition-all border ${academicType === type
                                                        ? "bg-[#10324a] text-white border-[#10324a] shadow-lg"
                                                        : "bg-transparent text-[#10324a]/40 border-[#10324a]/15 hover:border-[#d2a14a]"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {academicType === "Percentage" ? (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={percentage}
                                                onChange={(e) => setPercentage(e.target.value)}
                                                placeholder="Percentage (e.g. 85)"
                                                required
                                                maxLength={3}
                                                className="w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] transition-all px-4 py-4 pr-20 text-xs sm:text-sm font-bold outline-none placeholder:text-[#10324a]/30 rounded-t-xl"
                                            />
                                            <span className="absolute right-4 bottom-4 text-[14px] font-bold font-black text-[#10324a]/30 uppercase tracking-widest">% Score</span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={cgpa}
                                                onChange={(e) => setCgpa(e.target.value)}
                                                placeholder="CGPA (e.g. 9.22)"
                                                required
                                                className="w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] transition-all px-4 py-4 pr-20 text-xs sm:text-sm font-bold outline-none placeholder:text-[#10324a]/30 rounded-t-xl"
                                            />
                                            <span className="absolute right-4 bottom-4 text-[14px] font-bold font-black text-[#10324a]/30 uppercase tracking-widest">CGPA / 10</span>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Aptitude Test */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#10324a] text-white flex items-center justify-center text-[14px] font-bold font-black">2</div>
                                        <label className="text-[14px] font-bold font-black uppercase tracking-[0.2em] text-[#2ca59d]">Aptitude Assessment</label>
                                    </div>

                                    <div className="flex gap-4">
                                        {["GRE", "GMAT"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setTestType(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[14px] font-bold font-black uppercase tracking-widest transition-all border ${testType === type
                                                        ? "bg-[#10324a] text-white border-[#10324a] shadow-lg"
                                                        : "bg-transparent text-[#10324a]/40 border-[#10324a]/15 hover:border-[#d2a14a]"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {testType === "GRE" ? (
                                            <>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="Verbal (130-170)"
                                                    value={greVerbal}
                                                    onChange={(e) => setGreVerbal(e.target.value)}
                                                    className="w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                                />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="Quant (130-170)"
                                                    value={greQuant}
                                                    onChange={(e) => setGreQuant(e.target.value)}
                                                    className="w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                                />
                                            </>
                                        ) : (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="Total GMAT (200-800)"
                                                value={gmatScore}
                                                onChange={(e) => setGmatScore(e.target.value)}
                                                className="col-span-2 w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* 3. English Proficiency */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#10324a] text-white flex items-center justify-center text-[14px] font-bold font-black">3</div>
                                        <label className="text-[14px] font-bold font-black uppercase tracking-[0.2em] text-[#2ca59d]">English Proficiency</label>
                                    </div>

                                    <div className="flex gap-4">
                                        {["TOEFL", "IELTS"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setEnglishTest(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[14px] font-bold font-black uppercase tracking-widest transition-all border ${englishTest === type
                                                        ? "bg-[#10324a] text-white border-[#10324a] shadow-lg"
                                                        : "bg-transparent text-[#10324a]/40 border-[#10324a]/15 hover:border-[#d2a14a]"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder={englishTest === "TOEFL" ? "TOEFL Score (0-120)" : "IELTS Band (0-9)"}
                                        value={englishScore}
                                        onChange={(e) => setEnglishScore(e.target.value)}
                                        className="w-full bg-[#f8f4ea]/50 border-2 border-transparent border-b-[#10324a]/15 focus:border-[#d2a14a] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                    />
                                </div>

                                {/* 4. Tuition Expenses */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#10324a] text-white flex items-center justify-center text-[14px] font-bold font-black">4</div>
                                        <label className="text-[14px] font-bold font-black uppercase tracking-[0.2em] text-[#2ca59d]">Financial Planning</label>
                                    </div>

                                    <div className="bg-[#f8f4ea]/60 p-6 rounded-2xl border border-[#10324a]/10">
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-[13px] font-bold font-black uppercase tracking-widest text-[#10324a]/50">Tuition Budget (Max)</span>
                                            <span className="text-xl font-black text-[#D4A54A] tracking-tight">{formatCurrency(budget)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1000000"
                                            max="15000000"
                                            step="100000"
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="w-full accent-[#d2a14a] h-1 bg-[#10324a]/15 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between mt-2 text-[12px] font-black font-bold text-[#10324a]/30 uppercase">
                                            <span>₹10L</span>
                                            <span>₹1.5Cr</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isCalculating}
                                        className="w-full bg-[#d2a14a] hover:bg-[#10324a] text-[#16364b] hover:text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#d2a14a]/15 group relative overflow-hidden"
                                    >
                                        <span className={`flex items-center justify-center gap-3 transition-all ${isCalculating ? "opacity-0" : "opacity-100"}`}>
                                            Analyze Admissions <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        {isCalculating && (
                                            <div className="absolute inset-0 flex items-center justify-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#16364b] animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#16364b] animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#16364b] animate-bounce" />
                                                <span className="text-[13px] font-bold tracking-widest ml-2">Running Algorithm</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── UniPredict Algorithm Explanation ── */}
            <section className="bg-[#10324a] py-16 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(210,161,74,0.1),transparent_50%)]" />

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center text-center relative">
                    <div className="inline-flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 bg-[#d2a14a]/10 border border-[#d2a14a]/20 px-4 sm:px-5 py-1.5 rounded-full">
                        <Sparkles size={14} className="text-[#d2a14a]" />
                        <span className="text-[#d2a14a] text-[9px] font-black uppercase tracking-[0.3em]">Proprietary Technology</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-[#d2a14a] italic tracking-tight mb-6">
                        The Master Predictor Algorithm
                    </h2>

                    <p className="text-white/70 text-xs md:text-base max-w-2xl leading-relaxed mb-10">
                        We&apos;ve spent years perfecting an algorithm that matches you with top universities based on the same expertise we offer in our luxury institutional services. While others provide generic lists, we give you surgical precision for free. All we ask? Share it with a fellow applicant.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
                        {[
                            { title: "SAFE", color: "text-green-400", desc: "90%+ Approval Probability" },
                            { title: "REACH", color: "text-[#d2a14a]", desc: "Highly Competitive Selection" },
                            { title: "DREAM", color: "text-blue-400", desc: "Elite Ivy League Territory" },
                        ].map((node, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] group hover:border-[#d2a14a]/40 transition-all flex flex-col items-center justify-center">
                                <h3 className={`text-3xl sm:text-4xl font-black tracking-tighter mb-3 ${node.color}`}>{node.title}</h3>
                                <p className="text-white/50 text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-loose">{node.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── Result Modal (Simulated) ── */}
            <AnimatePresence>
                {showResult && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowResult(false)}
                            className="absolute inset-0 bg-[#10324a]/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col"
                        >
                            <div className="bg-[#10324a] p-12 text-center relative">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
                                <Sparkles className="absolute top-8 left-8 text-white/30" />
                                <BarChart3 className="absolute bottom-8 right-8 text-white/30" />
                                <h2 className="relative text-4xl font-black text-[#d2a14a] italic tracking-tighter uppercase mb-4">Evaluation Complete</h2>
                                <p className="relative text-white/80 font-bold uppercase tracking-widest text-[14px] font-bold">Your admission landscape is ready</p>
                            </div>
                            <div className="p-12 space-y-8 flex-1">
                                <div className="space-y-4 text-center">
                                    <p className="text-xs font-black text-[#4b5b6a] uppercase tracking-widest">Master Profile Strength</p>
                                    <div className="relative h-4 bg-[#f8f4ea] rounded-full overflow-hidden border border-[#10324a]/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "78%" }}
                                            className="h-full bg-gradient-to-r from-[#d2a14a] to-[#10324a]"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[14px] font-bold font-black text-[#4b5b6a] uppercase tracking-widest">Average</p>
                                        <p className="text-[14px] font-black text-[#D4A54A] uppercase tracking-widest">78% Chance</p>
                                        <p className="text-[14px] font-bold font-black text-[#4b5b6a] uppercase tracking-widest">Excellent</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-[#10324a]/10 flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            setShowResult(false);
                                            setIsBookingOpen(true);
                                        }}
                                        className="bg-[#10324a] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#d2a14a] hover:text-[#16364b] transition-all flex items-center justify-center gap-2"
                                    >
                                        Discuss Your Case <ArrowRight size={14} />
                                    </button>
                                    <button
                                        onClick={() => setShowResult(false)}
                                        className="text-[#4b5b6a] py-2 font-black text-[14px] font-bold uppercase tracking-widest border-b border-transparent hover:border-[#d2a14a] transition-all"
                                    >
                                        Close Results
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BookCounsellingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />
        </main>
        </PremiumLock>
    );
}