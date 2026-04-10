import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Play } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';


export default function AISOPGeneratorPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    
                    {/* Left Content */}
                    <div className="space-y-8 relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-serif font-bold text-[#362B25] leading-[1.15] tracking-tight">
                            AI SOP Generator - <br className="hidden lg:block"/>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4A848] to-[#9c782b]">
                                Original Writing Crafted to Bypass AI Detectors
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-[20px] text-[#675F5B] leading-[1.6] max-w-lg font-medium">
                            Get a plagiarism-free Statement of Purpose (SOP) in minutes - designed to reflect your story and meet top university standards for admissions and scholarships.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            <Link 
                                href="#pricing" 
                                className="px-8 py-4 rounded-xl border-2 border-[#D4A848]/20 text-[#362B25] font-bold text-[15px] tracking-wide hover:bg-[#D4A848]/5 transition-all text-center flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Buy Now <ArrowRight size={18} />
                            </Link>
                            <Link 
                                href="/ai-services/sop-generator/build" 
                                className="px-8 py-4 rounded-xl bg-[#362B25] text-white font-bold text-[15px] tracking-wide hover:bg-[#241c18] transition-all text-center flex items-center justify-center gap-3 shadow-xl shadow-[#362B25]/20 group w-full sm:w-auto"
                            >
                                <Sparkles size={18} className="text-[#D4A848] group-hover:scale-110 transition-transform" /> 
                                Build Your SOP Today
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-8">
                            <div className="relative flex items-center justify-center w-10 h-10 bg-[#D4A848]/10 rounded-full shrink-0">
                                <Star size={20} className="text-[#D4A848] fill-[#D4A848]" />
                            </div>
                            <span className="font-semibold text-[#675F5B] text-[15px]">Trusted by Students from 20+ Countries</span>
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div className="relative group w-full aspect-square md:aspect-[4/3] lg:aspect-video rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[4px] border-white/60 transform transition-transform duration-700 hover:-translate-y-2 lg:rotate-1">
                        <img 
                            src="/sop-illustration.png" 
                            alt="AI SOP Generator Flat Illustration"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        
                        {/* Subtle inner shadow/border overlay for premium feel */}
                        <div className="absolute inset-0 border border-black/5 rounded-[28px] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>

                </div>

                {/* Universities Strip */}
                <div className="mt-32 pt-16 border-t border-[#D4A848]/10 max-w-5xl mx-auto">
                    <p className="text-center text-[#675F5B] font-bold text-xs tracking-[0.2em] uppercase opacity-50 mb-12">Admissions Secured At Top Universities</p>
                    <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center transition-all duration-700">
                        {[
                            { name: 'Stanford', domain: 'stanford.edu' },
                            { name: 'Harvard', domain: 'harvard.edu' },
                            { name: 'NYU', domain: 'nyu.edu' },
                            { name: 'Duke', domain: 'duke.edu' },
                            { name: 'Columbia', domain: 'columbia.edu' }
                        ].map((uni) => (
                            <div key={uni.domain} className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-[10px] shadow-sm border border-[#D4A848]/20 flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-md">
                                    <img src={`https://www.google.com/s2/favicons?domain=${uni.domain}&sz=128`} alt={`${uni.name} logo`} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-serif font-bold text-lg md:text-[22px] text-[#362B25] tracking-tight">{uni.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            
            
        </div>
    );
}
