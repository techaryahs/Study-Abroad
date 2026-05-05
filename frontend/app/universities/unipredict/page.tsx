"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, 
    Globe, 
    BarChart3, 
    Sparkles,
} from "lucide-react";
import Image from "next/image";


const ChatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5186 20 9.12396 19.6601 7.90487 19.0604L3 20L4.10309 15.6888C3.40771 14.4442 3 13.0182 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function UniPredictPage() {
    const [academicType, setAcademicType] = useState<"Percentage" | "CGPA">("Percentage");
    const [percentage, setPercentage] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [testType, setTestType] = useState<"GRE" | "GMAT">("GRE");
    const [greVerbal, setGreVerbal] = useState("");
    const [greQuant, setGreQuant] = useState("");
    const [gmatScore, setGmatScore] = useState("");
    const [englishTest, setEnglishTest] = useState<"TOEFL" | "IELTS">("TOEFL");
    const [englishScore, setEnglishScore] = useState("");
    const [budget, setBudget] = useState(5000000);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);
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
        <main className="min-h-screen bg-[#F8F6F1] text-[#362B25] font-base selection:bg-[#D4A848]/20 overflow-x-hidden">
            
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D4A848]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-[#D4A848]/3 rounded-full blur-[100px]" />
            </div>

            {/* Sub-header / Branding */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 pt-8 md:pt-12 pb-4 md:pb-6 border-b border-[#D4A848]/10 flex justify-between items-end">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#D4A848]"></span>
                        <span className="text-[10px] font-black tracking-[0.4em] text-[#D4A848] uppercase">The Expert Algorithm</span>
                    </div>
                    <h1 className="text-4xl text-[#362B25] md:text-6xl font-black tracking-tighter uppercase leading-none italic">
                        Uni<span className="text-[#D4A848]">Predict</span>
                    </h1>
                </div>
            </div>

            {/* Top RateMyChances Section */}
            <section className="w-full bg-[#F8F6F1] pt-8 lg:pt-16 px-4 sm:px-6 lg:px-16 overflow-hidden border-b border-[#D4A848]/10 mb-8 sm:mb-16">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="space-y-6 lg:space-y-8 order-2 lg:order-1 pb-8 lg:pb-16 text-center lg:text-left z-10 relative">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#362B25] leading-[1.1]">
                            UniPredict By <span className="text-[#D4A848] italic pr-2">GCC</span>
                        </h1>
                        {/* PARAGRAPH → text-black */}
                        <p className="text-black text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                            We've spent years perfecting an algorithm that helps match you with the right universities—based on the same expertise we offer in our luxury services. While many students waste thousands on applications, we give you expert guidance for free. All we ask? Share it with someone who could use it!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2">
                            <button 
                                type="button"
                                onClick={() => window.open('/universities/RateMyChances', '_self')}
                                className="w-full sm:w-auto bg-[#D4A848] text-[#362B25] px-8 py-4 rounded-xl text-xs sm:text-sm uppercase font-black tracking-widest hover:bg-[#362B25] hover:text-[#D4A848] transition-all shadow-xl group flex items-center justify-center gap-3"
                            >
                                RateMyChances <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            {/* PARAGRAPH → text-black */}
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-black">
                                We have now launched a much more advanced tool
                            </span>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 flex justify-center mt-4 lg:mt-0">
                        <div className="w-full max-w-[500px] aspect-[4/3] bg-transparent relative">
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

            {/* Main Section */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    
                    {/* Left Side */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-black text-[#362B25] tracking-tight leading-[1.1]">
                                Discover Your <span className="text-[#D4A848]">Best University</span> Matches
                            </h2>
                            {/* PARAGRAPH → text-black */}
                            <p className="text-black text-sm md:text-base leading-relaxed max-w-md">
                                Our proprietary algorithm analyzes your academic background, test scores, and financial goals to predict your admission success at top institutions worldwide.
                            </p>
                        </div>

                        {/* Feature Points */}
                        <div className="space-y-4">
                            {[
                                { icon: <Sparkles size={16} />, text: "Data-driven accuracy spanning 10 years of admits." },
                                { icon: <BarChart3 size={16} />, text: "Detailed breakdown of safe, reach, and dream universities." },
                                { icon: <Globe size={16} />, text: "Global coverage: USA, UK, Europe, Australia & Canada." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black hover:text-[#D4A848] transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-white border border-[#D4A848]/10 flex items-center justify-center text-[#D4A848] group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Content Image */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-[#D4A848]/20 shadow-2xl group">
                            <Image 
                                src="/unipredict-students.jpg"
                                alt="Students collaborating"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#362B25]/30 to-transparent" />
                        </div>
                    </div>

                    {/* Right Side: Prediction Form */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[#D4A848]/20 p-5 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-xl relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/5 rounded-bl-[100%] border-l border-b border-[#D4A848]/10" />

                            <form onSubmit={handleCalculate} className="space-y-8 relative z-10">
                                
                                {/* 1. Academic Credentials */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#362B25] text-white flex items-center justify-center text-[10px] font-black">1</div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A848]">Academic Foundation</label>
                                    </div>
                                    <div className="flex gap-4">
                                        {["Percentage", "CGPA"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAcademicType(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                    academicType === type
                                                    ? "bg-[#362B25] text-white border-[#362B25] shadow-lg"
                                                    : "bg-transparent text-[#362B25]/40 border-[#D4A848]/20 hover:border-[#D4A848]"
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
                                                className="w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] transition-all px-4 py-4 pr-20 text-xs sm:text-sm font-bold outline-none placeholder:text-[#362B25]/30 rounded-t-xl"
                                            />
                                            <span className="absolute right-4 bottom-4 text-[10px] font-black text-[#362B25]/30 uppercase tracking-widest">% Score</span>
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
                                                className="w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] transition-all px-4 py-4 pr-20 text-xs sm:text-sm font-bold outline-none placeholder:text-[#362B25]/30 rounded-t-xl"
                                            />
                                            <span className="absolute right-4 bottom-4 text-[10px] font-black text-[#362B25]/30 uppercase tracking-widest">CGPA / 10</span>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Aptitude Test */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#362B25] text-white flex items-center justify-center text-[10px] font-black">2</div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A848]">Aptitude Assessment</label>
                                    </div>
                                    <div className="flex gap-4">
                                        {["GRE", "GMAT"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setTestType(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                    testType === type 
                                                    ? "bg-[#362B25] text-white border-[#362B25] shadow-lg" 
                                                    : "bg-transparent text-[#362B25]/40 border-[#D4A848]/20 hover:border-[#D4A848]"
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
                                                    className="w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                                />
                                                <input 
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="Quant (130-170)"
                                                    value={greQuant}
                                                    onChange={(e) => setGreQuant(e.target.value)}
                                                    className="w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
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
                                                className="col-span-2 w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* 3. English Proficiency */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#362B25] text-white flex items-center justify-center text-[10px] font-black">3</div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A848]">English Proficiency</label>
                                    </div>
                                    <div className="flex gap-4">
                                        {["TOEFL", "IELTS"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setEnglishTest(type as any)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                    englishTest === type 
                                                    ? "bg-[#362B25] text-white border-[#362B25] shadow-lg" 
                                                    : "bg-transparent text-[#362B25]/40 border-[#D4A848]/20 hover:border-[#D4A848]"
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
                                        className="w-full bg-[#F8F6F1]/50 border-2 border-transparent border-b-[#D4A848]/20 focus:border-[#D4A848] outline-none px-4 py-3 text-xs font-black rounded-t-xl"
                                    />
                                </div>

                                {/* 4. Financial Planning */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-[#362B25] text-white flex items-center justify-center text-[10px] font-black">4</div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A848]">Financial Planning</label>
                                    </div>
                                    <div className="bg-[#F8F6F1]/80 p-6 rounded-2xl border border-[#D4A848]/10">
                                        <div className="flex justify-between items-end mb-4">
                                            {/* PARAGRAPH → text-black */}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-black">Tuition Budget (Max)</span>
                                            <span className="text-xl font-black text-[#D4A848] tracking-tight">{formatCurrency(budget)}</span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="1000000"
                                            max="15000000"
                                            step="100000"
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="w-full accent-[#D4A848] h-1 bg-[#D4A848]/20 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between mt-2 text-[8px] font-bold text-black uppercase">
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
                                        className="w-full bg-[#D4A848] hover:bg-[#362B25] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#D4A848]/10 group relative overflow-hidden"
                                    >
                                        <span className={`flex items-center justify-center gap-3 transition-all ${isCalculating ? "opacity-0" : "opacity-100"}`}>
                                            Analyze Admissions <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        {isCalculating && (
                                            <div className="absolute inset-0 flex items-center justify-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                                                <span className="text-[9px] tracking-widest ml-2">Running Algorithm</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Algorithm Explanation */}
            <section className="bg-[#362B25] py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white transform -rotate-12" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white transform rotate-12" />
                </div>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 bg-[#D4A848]/10 border border-[#D4A848]/20 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                        <Sparkles size={16} className="text-[#D4A848]" />
                        <span className="text-[#D4A848] text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Technology</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight mb-8">
                        The Master Predictor <span className="text-[#D4A848]">Algorithm</span>
                    </h2>
                    {/* PARAGRAPH on dark bg → text-white */}
                    <p className="text-white text-sm md:text-lg max-w-3xl leading-relaxed mb-16">
                        We&apos;ve spent years perfecting an algorithm that matches you with top universities based on the same expertise we offer in our luxury institutional services. While others provide generic lists, we give you surgical precision for free. All we ask? Share it with a fellow applicant.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 w-full">
                        {[
                            { title: "SAFE", color: "text-green-400", desc: "90%+ Approval Probability" },
                            { title: "REACH", color: "text-[#D4A848]", desc: "Highly Competitive Selection" },
                            { title: "DREAM", color: "text-blue-400", desc: "Elite Ivy League Territory" },
                        ].map((node, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] group hover:border-[#D4A848]/40 transition-all">
                                <h3 className={`text-4xl sm:text-5xl font-black tracking-tighter mb-4 ${node.color}`}>{node.title}</h3>
                                {/* PARAGRAPH on dark bg → text-white */}
                                <p className="text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-loose">{node.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Result Modal */}
            <AnimatePresence>
                {showResult && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowResult(false)}
                            className="absolute inset-0 bg-[#362B25]/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col"
                        >
                            <div className="bg-[#D4A848] p-12 text-center relative">
                                <Sparkles className="absolute top-8 left-8 text-white/40" />
                                <BarChart3 className="absolute bottom-8 right-8 text-white/40" />
                                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Evaluation Complete</h2>
                                <p className="text-white font-bold uppercase tracking-widest text-[10px]">Your admission landscape is ready</p>
                            </div>
                            <div className="p-12 space-y-8 flex-1">
                                <div className="space-y-4 text-center">
                                    {/* PARAGRAPH → text-black */}
                                    <p className="text-xs font-black text-black uppercase tracking-widest">Master Profile Strength</p>
                                    <div className="relative h-4 bg-[#F8F6F1] rounded-full overflow-hidden border border-[#D4A848]/10">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "78%" }}
                                            className="h-full bg-gradient-to-r from-[#D4A848] to-[#362B25]"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        {/* PARAGRAPH → text-black */}
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">Average</p>
                                        <p className="text-[14px] font-black text-[#D4A848] uppercase tracking-widest">78% Chance</p>
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">Excellent</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-[#D4A848]/10 flex flex-col gap-4">
                                    <button 
                                        onClick={() => window.open('/services/admission-guidance', '_self')}
                                        className="bg-[#362B25] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#D4A848] transition-all"
                                    >
                                        Discuss Your Case →
                                    </button>
                                    <button 
                                        onClick={() => setShowResult(false)}
                                        className="text-black py-2 font-black text-[10px] uppercase tracking-widest border-b border-transparent hover:border-[#D4A848] transition-all"
                                    >
                                        Close Results
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}