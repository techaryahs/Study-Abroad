"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    CheckCircle2, 
    ShieldCheck, 
    Phone, 
    MessageSquare,
    Search,
    Compass,
    FileText
} from "lucide-react";
import FAQSection from "@/components/shared/FAQSection";
import AddToCart from "@/components/shared/AddToCart";

// ─── Data ────────────────────────────────────────────────────────────────────

const includesItems = [
    "Scholarship Statement",
    "Letter of Recommendation (Scholarship-Oriented)",
    "Interview Preparation Scripts",
    "Mock Interview",
    "Video Question Scripts",
    "Application Portal Help including answers to the questions on the portals."
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScholarshipHelpPage() {
    return (
        <main className="min-h-screen bg-dark-950 text-white selection:bg-gold-500/30 font-base overflow-x-hidden">
            {/* ── HERO SECTION ── */}
            <section className="relative px-6 md:px-16 pt-12 pb-12 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
                


                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start relative z-10 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight uppercase">
                            SCHOLARSHIP <br />
                            <span className="gradient-text-gold">APPLICATION HELP</span>
                        </h1>
                        <div className="pb-2">
                            <Link 
                                href="/services" 
                                className="inline-flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors group relative z-20"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest leading-none">Back to Services</span>
                            </Link>
                        </div>
                        <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-8">
                            Hoping to get an admit, or already have one? Over 60% of our applicants get a scholarship/fellowship before they step into their university. Now, you can get one too.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <h3 className="text-[15px] font-medium text-white/90">Includes:</h3>
                            <div className="flex gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#1e2a4f] flex items-center justify-center text-indigo-300 shadow-lg border border-white/5">
                                        <Phone size={20} fill="currentColor" className="text-indigo-200" />
                                    </div>
                                    <span className="text-xs text-white/70">Audio call</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#1c3f2d] flex items-center justify-center text-green-400 shadow-lg border border-white/5">
                                        <MessageSquare size={20} fill="currentColor" className="text-green-300" />
                                    </div>
                                    <span className="text-xs text-white/70">Text Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link 
                                href="/contact" 
                                className="inline-block border border-gold-500 text-gold-500 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gold-500 hover:text-black hover:shadow-lg hover:shadow-gold-500/20 text-center"
                            >
                                Discuss Your Case
                            </Link>
                            <div className="text-xs text-white/50 max-w-[130px] leading-tight">
                                Have questions about this service? Let's chat.
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative mt-8 lg:mt-0"
                    >
                        <div className="relative w-full max-w-md ml-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-dark-900/40 group flex flex-col items-center justify-center p-4">
                            <img
                                src="/scholarship-hero.png"
                                alt="Scholarship"
                                className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 relative z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent pointer-events-none z-20" />
                            
                            <div className="relative p-6 mt-auto z-30 w-full">
                                <div className="bg-dark-950/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl mt-4">
                                    <p className="text-white/90 text-[15px] font-medium font-serif italic leading-relaxed text-center drop-shadow-md">
                                        "Our mentored students receive scholarships ranging from $1,000 up to full tuition waivers, significantly reducing their financial burden."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTENT GRID ── */}
            <section className="py-16 px-6 md:px-16 bg-dark-900/20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
                    
                    {/* Main Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-medium text-white flex items-center gap-3">
                                About Service
                            </h2>
                            <div className="w-32 h-0.5 bg-gold-500" />
                        </div>

                        <div className="grid gap-6">
                            <p className="text-[15px] text-white/80 leading-relaxed font-normal">
                                While gaining that admit may not be the hardest thing you've ever done, attaining a scholarship or a fellowship is definitely one of the most difficult parts of the application process. I have helped thousands of students attain their scholarship and in this process, I plan on bringing the same results out for you.
                            </p>
                            <p className="text-[15px] text-white/80 leading-relaxed font-normal">
                                Over the years, we have realized that there's strategies in place that we can take with your scholarship application such that they will maximize your chances of gaining the scholarship. We intend to use the same strategy in order to fortify your applications.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h3 className="text-base font-bold text-white">The process:</h3>
                            <ol className="list-decimal space-y-4 pl-4 text-[15px] text-white/80 leading-relaxed">
                                <li>
                                    We begin by analyzing your application and selecting the list of scholarships/fellowships that you are eligible to apply for.
                                </li>
                                <li>
                                    We look at both <strong>university-specific and external scholarships</strong> that you are eligible for. Due to our years of experience, we can quickly find the scholarships you are most likely to see success with. We find as many scholarships that we can for your profile and give you a list of them for your profile.
                                </li>
                                <li>
                                    Next, we select up to 3 scholarships and start your application process with you. Here, we help you with the following:
                                    <ul className="list-none pl-6 mt-3 space-y-1">
                                        {includesItems.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5">
                                                <div className="w-1.5 h-1.5 border border-white/40 rounded-full shrink-0 mt-2" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </motion.div>

                    {/* Pricing Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-24 h-max"
                    >
                            <AddToCart serviceId="scholarship" />

                        <Link href="/contact" className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] shadow-md flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer block">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                <MessageSquare size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white/90 text-sm">Discuss Your Case</h4>
                                <p className="text-xs text-white/50 font-normal mt-0.5">Have questions about this service? Let's chat.</p>
                            </div>
                        </Link>
                    </motion.div>

                </div>
            </section>

            <FAQSection />

            {/* ── FOOTER CTA ── */}
            <section className="px-6 md:px-16 pb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto bg-gradient-to-r from-dark-900 to-dark-950 border border-gold-500/20 rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-3xl rounded-full" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/20 bg-dark-800 flex items-center justify-center text-3xl shadow-xl grayscale hover:grayscale-0 transition-all">
                           👤
                        </div>
                        <div>
                            <h4 className="font-black text-xl mb-1 uppercase tracking-tight">Speak with a Consultant</h4>
                            <p className="text-white/40 text-xs font-medium italic">Discover how we can tailor our strategies to your specific profile.</p>
                        </div>
                    </div>
                    <button className="whitespace-nowrap px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-gold-500 transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.2em] relative z-10 shadow-2xl">
                        <Link href="/contact">Message Now &rarr;</Link>
                    </button>
                </motion.div>
            </section>
        </main>
    );
}