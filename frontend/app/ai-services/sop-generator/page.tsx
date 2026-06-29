"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Play, Zap } from 'lucide-react';
import CheckoutModal from '@/app/User/cart/checkoutmodal';
import BookCounsellingModal from '@/components/shared/BookCounsellingModal';

export default function AISOPGeneratorPage() {
    const [checkoutPlan, setCheckoutPlan] = useState<{ actual: number; discounted: number; title: string } | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans">
            <div className="pt-4 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-serif font-bold text-[#362B25] leading-[1.15] tracking-tight">
                            AI SOP Generator - <br className="hidden lg:block" />
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
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="px-8 py-4 rounded-xl bg-[#362B25] text-white font-bold text-[15px] tracking-wide hover:bg-[#241c18] transition-all text-center flex items-center justify-center gap-3 shadow-xl shadow-[#362B25]/20 group w-full sm:w-auto"
                            >
                                <Sparkles size={18} className="text-[#D4A848] group-hover:scale-110 transition-transform" />
                                Build Your SOP Today
                            </button>
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
                <div className="mt-16 pt-12 border-t border-[#D4A848]/10 max-w-5xl mx-auto">
                    <p className="text-center text-[#675F5B] font-bold text-[11px] tracking-[0.2em] uppercase opacity-70 mb-12">Admissions Secured At Top Universities</p>
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

                {/* Key Features */}
                <div className="mt-16 max-w-5xl mx-auto pt-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#362B25] mb-4">Key Features</h2>
                        <p className="text-[#675F5B] text-lg font-medium">Your AI Partner for Original, Plagiarism-Free, and Polished Statements</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Feature 1 */}
                        <div className="group">
                            <div className="w-full aspect-[4/3] rounded-3xl bg-[#596E92] mb-6 overflow-hidden flex items-center justify-center p-8 transition-transform group-hover:-translate-y-2 duration-300 shadow-lg relative">
                                <Sparkles className="absolute top-10 left-10 text-white/50" size={24} />
                                <Star className="absolute bottom-16 right-16 fill-[#D4A848] text-[#D4A848]/80" size={32} />
                                {/* Placeholder for feature illustration */}
                                <div className="w-36 h-44 bg-[#FDFBF7] rounded-[20px] shadow-2xl relative flex flex-col items-center justify-center border-t-[12px] border-[#D4A848]">
                                    <div className="text-[#e29348] font-black text-[32px] drop-shadow-sm mt-4">SOP</div>
                                    <div className="flex gap-2 mt-4 opacity-30">
                                        <div className="h-1.5 w-12 bg-gray-400 rounded-full"></div>
                                        <div className="h-1.5 w-6 bg-gray-400 rounded-full"></div>
                                    </div>
                                    <div className="flex gap-2 mt-1 opacity-20">
                                        <div className="h-1.5 w-16 bg-gray-400 rounded-full"></div>
                                    </div>
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center text-white font-bold text-xl border-[3px] border-white/20 backdrop-blur-md">AI</div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-[#362B25] mb-3">AI-Powered Content Generation</h3>
                            <p className="text-[#675F5B] leading-[1.6]">Create a customized and impactful SOP that stands out without sounding like a generic, ChatGPT-generated content.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group">
                            <div className="w-full aspect-[4/3] rounded-3xl bg-[#233A40] mb-6 overflow-hidden flex items-center justify-center p-8 transition-transform group-hover:-translate-y-2 duration-300 shadow-lg">
                                {/* Placeholder for feature illustration */}
                                <div className="w-36 h-44 bg-gradient-to-br from-white/10 to-transparent rounded-[20px] border-[2px] border-[#362B25]/20 backdrop-blur-md relative flex items-center justify-center shadow-2xl">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-[#c8922c] to-[#fce498] rounded-full shadow-[0_0_50px_rgba(212,168,72,0.3)] flex flex-col items-center justify-center text-[#362B25] font-black text-center p-2 border-[4px] border-dashed border-[#57442a]/30 leading-tight">
                                        <div className="text-3xl pt-1">100%</div>
                                        <div className="text-[12px] tracking-wider mt-0.5">ORIGINAL</div>
                                    </div>
                                    <div className="absolute -right-2 top-8 text-green-400"><div className="flex justify-center items-center w-6 h-6 bg-green-500 rounded-full text-white">✓</div></div>
                                    <div className="absolute -left-4 bottom-12 text-green-400 scale-75"><div className="flex justify-center items-center w-6 h-6 bg-green-500 rounded-full text-white">✓</div></div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-[#362B25] mb-3">Authenticity Assured</h3>
                            <p className="text-[#675F5B] leading-[1.6]">Receive plagiarism-free, unique content tailored to your profile and aspirations.</p>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-16 max-w-5xl mx-auto border-t border-[#D4A848]/10 pt-16 pb-16">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#362B25] mb-4">How It Works</h2>
                        <p className="text-[#675F5B] text-lg font-medium">Turn Your input into impact, effortlessly!</p>
                    </div>

                    <div className="relative">
                        {/* Center Timeline Line */}
                        <div className="absolute left-1/2 top-4 bottom-10 w-[2px] bg-gradient-to-b from-[#D4A848] via-[#e5dfd3] to-transparent hidden md:block -ml-[1px]"></div>

                        {/* Step 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mb-16 md:mb-20 relative px-4 md:px-0">
                            {/* Dot on timeline */}
                            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-5 h-5 rounded-full bg-[#D4A848] border-[4px] border-[#FDFBF7] shadow-sm hidden md:block z-10"></div>

                            <div className="hidden md:flex justify-end pr-8">
                                {/* App Mockup */}
                                <div className="bg-white p-6 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#D4A848]/20 w-full max-w-[360px]">
                                    <div className="h-3 w-28 bg-gray-100 rounded-full mb-6"></div>
                                    <div className="space-y-4">
                                        <div className="h-10 border border-gray-100 bg-gray-50/50 rounded-xl flex items-center px-4"><div className="w-4 h-4 rounded-full bg-[#9c182f] mr-3"></div><span className="text-[11px] font-bold text-gray-500">Harvard University</span></div>
                                        <div className="h-24 border border-gray-100 bg-gray-50/50 rounded-xl p-4"><div className="h-2 w-3/4 bg-gray-200 rounded-full mb-3"></div><div className="h-2 w-1/2 bg-gray-200 rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:pl-8">
                                <div className="inline-flex px-4 py-1.5 rounded-full bg-[#D4A848]/10 text-[#D4A848] font-black text-[11px] tracking-widest uppercase mb-4">Step 1</div>
                                <div className="bg-[#362B25] text-white p-6 md:p-8 rounded-[28px] shadow-xl group hover:-translate-y-1 transition-transform">
                                    <h3 className="text-2xl font-bold font-serif mb-3 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-[10px] flex items-center justify-center shrink-0">
                                            <div className="w-5 h-5 border-[2px] border-white/80 border-t-[#D4A848] border-t-4 rounded-[4px]"></div>
                                        </div>
                                        Input Details
                                    </h3>
                                    <p className="text-white/80 leading-relaxed text-[15px]">Provide your background and goals by filling out a simple form. It takes just 15-20 minutes.</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mb-16 md:mb-20 relative px-4 md:px-0">
                            {/* Dot on timeline */}
                            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-5 h-5 rounded-full bg-[#e5dfd3] border-[4px] border-[#FDFBF7] hidden md:block z-10 transition-colors hover:bg-[#D4A848]"></div>

                            <div className="md:order-2 md:pl-8 hidden md:flex justify-start">
                                {/* App Mockup */}
                                <div className="bg-[#8b9ba8] p-8 rounded-[24px] shadow-sm w-full max-w-[360px] flex flex-col items-center justify-center text-center aspect-[4/3]">
                                    <div className="mb-4 w-full flex justify-center flex-wrap gap-2 opacity-20">
                                        {[...Array(9)].map((_, i) => <Star key={i} size={14} className="fill-white text-white" />)}
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-1">Just a moment!</h4>
                                    <p className="text-white/85 text-[11px]">Something special is brewing...</p>
                                </div>
                            </div>

                            <div className="md:order-1 md:pr-8 md:text-right">
                                <div className="flex md:justify-end mb-4">
                                    <div className="inline-flex px-4 py-1.5 rounded-full bg-[#D4A848]/10 text-[#D4A848] font-black text-[11px] tracking-widest uppercase">Step 2</div>
                                </div>
                                <div className="bg-white border border-[#D4A848]/10 text-[#362B25] p-6 md:p-8 rounded-[28px] shadow-sm group hover:-translate-y-1 transition-transform">
                                    <h3 className="text-2xl font-bold font-serif mb-3 flex items-center md:justify-end gap-4">
                                        <div className="w-10 h-10 bg-[#F8F6F1] rounded-[10px] flex items-center justify-center shrink-0 md:order-2">
                                            <Sparkles size={20} className="text-[#D4A848]" />
                                        </div>
                                        <span className="md:order-1">AI Magic</span>
                                    </h3>
                                    <p className="text-[#675F5B] leading-relaxed text-[15px]">Our AI analyzes your inputs and crafts a high-quality, professional SOP.</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mb-16 md:mb-20 relative px-4 md:px-0">
                            {/* Dot on timeline */}
                            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-5 h-5 rounded-full bg-[#e5dfd3] border-[4px] border-[#FDFBF7] hidden md:block z-10 hover:bg-[#D4A848]"></div>

                            <div className="hidden md:flex justify-end pr-8">
                                {/* App Mockup */}
                                <div className="bg-white p-6 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#D4A848]/20 w-full max-w-[360px]">
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                                        <div className="h-5 w-14 bg-[#362B25] rounded-full"></div>
                                    </div>
                                    <div className="border border-gray-100 rounded-[16px] p-5">
                                        <div className="h-3 w-28 bg-gray-200 rounded-full mx-auto mb-5"></div>
                                        <div className="space-y-2">
                                            {[...Array(5)].map((_, i) => <div key={i} className="h-[4px] w-full bg-gray-100 rounded-full"></div>)}
                                            <div className="h-[4px] w-2/3 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:pl-8">
                                <div className="inline-flex px-4 py-1.5 rounded-full bg-[#D4A848]/10 text-[#D4A848] font-black text-[11px] tracking-widest uppercase mb-4">Step 3</div>
                                <div className="bg-[#362B25] text-white p-6 md:p-8 rounded-[28px] shadow-xl group hover:-translate-y-1 transition-transform">
                                    <h3 className="text-2xl font-bold font-serif mb-3 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-[10px] flex items-center justify-center shrink-0">
                                            <div className="w-5 h-5 border-[2px] border-white/80 rounded-[4px] border-b-[#e29348] border-b-[4px]"></div>
                                        </div>
                                        Get Your SOP
                                    </h3>
                                    <p className="text-white/60 leading-relaxed text-[15px]">Get your curated Statement of Purpose instantly without any deviation from your provided input.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center relative px-4 md:px-0">
                            {/* Dot on timeline */}
                            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-5 h-5 rounded-full bg-[#D4A848] border-[4px] border-[#FDFBF7] hidden md:block z-10 shadow-[0_0_15px_rgba(212,168,72,0.4)]"></div>

                            <div className="md:order-2 md:pl-8 hidden md:flex justify-start">
                                {/* App Mockup */}
                                <div className="bg-white p-2.5 rounded-[16px] shadow-[0_0_30px_rgba(212,168,72,0.15)] border border-[#D4A848]/30 w-full max-w-[380px]">
                                    <div className="bg-[#362B25] rounded-[10px] p-5 flex flex-col h-[280px] overflow-hidden relative">
                                        <div className="bg-white w-full rounded border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-full">

                                            {/* Top section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="h-1.5 w-16 bg-gray-800 rounded"></div>
                                                    <div className="flex gap-1.5">
                                                        <div className="h-3 w-10 bg-[#1e2329] rounded"></div>
                                                        <div className="h-3 w-16 bg-[#D4A848] rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded w-[95%]"></div>
                                                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded w-[85%]"></div>
                                                </div>
                                            </div>

                                            {/* Mid section controls */}
                                            <div className="flex justify-between items-center py-3 border-y border-gray-100 my-2">
                                                <div className="flex gap-2 items-center">
                                                    <div className="h-1 w-14 bg-gray-800 rounded"></div>
                                                    <div className="h-3 w-7 bg-[#f8f9fa] border border-gray-200 rounded-[2px]"></div>
                                                    <div className="h-3 w-7 bg-[#f8f9fa] border border-gray-200 rounded-[2px]"></div>
                                                    <div className="h-3 w-7 bg-[#D4A848] border border-[#D4A848] rounded-[2px]"></div>
                                                </div>
                                                <div className="h-3 w-12 bg-[#1e2329] rounded"></div>
                                            </div>

                                            {/* Bottom section */}
                                            <div>
                                                <div className="h-1.5 w-20 bg-gray-800 rounded mb-3"></div>
                                                <div className="space-y-1.5">
                                                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded w-[90%]"></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:order-1 md:pr-8 md:text-right">
                                <div className="flex md:justify-end mb-4">
                                    <div className="inline-flex px-4 py-1.5 rounded-full bg-[#D4A848]/10 text-[#D4A848] font-black text-[11px] tracking-widest uppercase">Step 4</div>
                                </div>
                                <div className="bg-white border border-[#D4A848]/10 text-[#362B25] p-6 md:p-8 rounded-[28px] shadow-sm group hover:-translate-y-1 transition-transform">
                                    <h3 className="text-2xl font-bold font-serif mb-3 flex items-center md:justify-end gap-4">
                                        <div className="w-10 h-10 bg-[#F8F6F1] rounded-[10px] flex items-center justify-center shrink-0 md:order-2">
                                            <div className="w-4 h-5 border-[2px] border-[#D4A848] rounded-[3px] shadow-sm relative"><div className="absolute -right-[6px] top-1 w-1 h-2 bg-[#362B25] rounded-r-[2px]"></div></div>
                                        </div>
                                        <span className="md:order-1">AI & Plagiarism Removal</span>
                                    </h3>
                                    <p className="text-[#675F5B] leading-relaxed text-[15px]">Our AI remover ensures your SOP passes detection checks while remaining authentic.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Go AI-Safe Section */}
                <div className="mt-12 max-w-6xl mx-auto px-6 lg:px-10 pb-20">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left Side - Image */}
                        <div className="w-full lg:w-1/2 relative">
                            {/* Accent Background */}
                            <div className="absolute top-4 -left-6 bottom-4 right-6 bg-[#fcf8ef] rounded-3xl -z-10"></div>

                            {/* Image Container */}
                            <img
                                src="/student-grad-sop.png"
                                alt="Student Graduation Success"
                                className="w-full h-auto aspect-square object-cover rounded-[24px] shadow-sm transform transition-transform duration-700 hover:scale-[1.02]"
                            />
                        </div>

                        {/* Right Side - Content */}
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-[40px] md:text-[46px] text-[#362B25] mb-4 tracking-tight leading-tight">Go AI-Safe</h2>
                            <p className="text-[#675F5B] text-[18px] mb-10">Instantly create a flawless SOP that is affordable and AI-proof!</p>

                            <div className="flex flex-col gap-6 mb-12">
                                {/* Checklist Items */}
                                <div className="flex items-center gap-5">
                                    <div className="w-11 h-11 bg-[#D4A848] rounded-[10px] flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] border-[1.5px] border-white rounded-[4px] relative">
                                            {/* Abstract bot icon */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-[2px] bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="text-[#362B25] font-medium text-[16px]">AI Detection & Removal</span>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-11 h-11 bg-[#D4A848] rounded-[10px] flex items-center justify-center shrink-0">
                                        <div className="w-[18px] h-[18px] border-[1.5px] border-white rounded-[10px] flex items-center justify-center">
                                            <span className="text-white text-[11px] font-bold">✓</span>
                                        </div>
                                    </div>
                                    <span className="text-[#362B25] font-medium text-[16px]">Plagiarism-Free</span>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-11 h-11 bg-[#D4A848] rounded-[10px] flex items-center justify-center shrink-0">
                                        {/* Abstract user icon */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 border-[1.5px] border-white rounded-full mb-[1px]"></div>
                                            <div className="w-4 h-[6px] border-[1.5px] border-white rounded-t-[10px] border-b-0"></div>
                                        </div>
                                    </div>
                                    <span className="text-[#362B25] font-medium text-[16px]">Customized for You</span>
                                </div>
                            </div>

                            <Link
                                href="/ai-services/sop-generator/build"
                                className="inline-flex items-center justify-center bg-[#362B25] hover:bg-[#1a202c] text-[#f8f9fa] text-sm font-medium py-3 px-6 rounded shadow-sm transition-colors"
                            >
                                Build Your SOP →
                            </Link>
                        </div>

                    </div>
                </div>
                {/* Comparison Section */}
                <div className="mt-20 max-w-7xl mx-auto px-6 lg:px-10 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                        {/* Left Side - Text */}
                        <div className="lg:col-span-5 text-center lg:text-left">
                            <h2 className="text-[40px] md:text-[46px] font-sans font-medium text-[#362B25] mb-6 leading-[1.1] tracking-tight">
                                Why Our AI Beats Generic AI Like ChatGPT
                            </h2>
                            <p className="text-[#675F5B] text-[20px] mb-12 font-medium max-w-md mx-auto lg:mx-0">
                                Our model is not just another AI. It is built for success!
                            </p>

                            <Link
                                href="/ai-services/sop-generator/build"
                                className="inline-flex items-center justify-center bg-[#D4A848] hover:bg-[#b08b3b] text-white font-medium py-3.5 px-8 rounded-lg shadow-[0_10px_20px_rgba(212,168,72,0.3)] transition-transform hover:-translate-y-1"
                            >
                                Build Your SOP →
                            </Link>
                        </div>

                        {/* Right Side - Comparison Cards */}
                        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">

                            {/* ChatGPT Card */}
                            <div className="flex-1 border border-gray-200 rounded-xl p-8 bg-white shadow-sm flex flex-col">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#74aa9c] rounded-[10px] flex items-center justify-center text-white shrink-0">
                                            {/* Minimalist ChatGPT flower logo replacement */}
                                            <div className="w-5 h-5 border-[2px] border-white rounded-[5px] rotate-45 relative"><div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full"></div></div>
                                        </div>
                                        <span className="font-bold text-[#10a37f] text-lg">ChatGPT</span>
                                    </div>
                                    <div className="bg-[#f0f2f5] text-[#362B25] text-[11px] uppercase font-bold px-3 py-1.5 rounded tracking-widest">Generic AI Model</div>
                                </div>

                                <ul className="space-y-6 flex-1">
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded shrink-0 flex items-center justify-center mt-0.5"><div className="w-2.5 h-[2px] bg-white rounded-full"></div></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">ChatGPT generates general content without specialized training.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded shrink-0 flex items-center justify-center mt-0.5"><div className="w-2.5 h-[2px] bg-white rounded-full"></div></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Often provides depthless, template-like outputs.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded shrink-0 flex items-center justify-center mt-0.5"><div className="w-2.5 h-[2px] bg-white rounded-full"></div></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Easily detectable as AI-generated.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded shrink-0 flex items-center justify-center mt-0.5"><div className="w-2.5 h-[2px] bg-white rounded-full"></div></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">May produce unchecked output that triggers plagiarism flags.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded shrink-0 flex items-center justify-center mt-0.5"><div className="w-2.5 h-[2px] bg-white rounded-full"></div></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Not specialized for university applications.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* EduLeaderGlobal Card */}
                            <div className="flex-1 border-[2px] border-[#D4A848] rounded-xl p-8 bg-white shadow-[0_10px_40px_rgba(235,192,62,0.15)] flex flex-col relative transform md:-translate-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#362B25] rounded-full flex items-center justify-center text-[#D4A848] shrink-0 font-serif font-black text-xl leading-none">
                                            I
                                        </div>
                                        <span className="font-bold text-[#362B25] text-[17px] leading-tight">International<br />Eduleader Council</span>
                                    </div>
                                    <div className="bg-[#D4A848] text-white text-[11px] uppercase font-bold px-3 py-1.5 rounded tracking-widest shadow-sm">Council-Verified AI</div>
                                </div>

                                <ul className="space-y-6 flex-1">
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-[#D4A848] rounded shrink-0 flex items-center justify-center mt-0.5 shadow-sm"><span className="text-white text-[12px] font-bold">✓</span></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Our AI is trained on SOPs from students admitted to the world's top universities.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-[#D4A848] rounded shrink-0 flex items-center justify-center mt-0.5 shadow-sm"><span className="text-white text-[12px] font-bold">✓</span></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Generates personalized SOPs based on user inputs.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-[#D4A848] rounded shrink-0 flex items-center justify-center mt-0.5 shadow-sm"><span className="text-white text-[12px] font-bold">✓</span></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Comes with EduLeaderGlobal AI Remover to ensure originality & AI-proofing.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-[#D4A848] rounded shrink-0 flex items-center justify-center mt-0.5 shadow-sm"><span className="text-white text-[12px] font-bold">✓</span></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Ensures a unique, high-quality SOP that passes plagiarism checks.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-5 h-5 bg-[#D4A848] rounded shrink-0 flex items-center justify-center mt-0.5 shadow-sm"><span className="text-white text-[12px] font-bold">✓</span></div>
                                        <span className="text-[#362B25] text-[14px] leading-relaxed">Built specifically to generate SOPs that adhere to university admission standards.</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="mt-20 max-w-6xl mx-auto px-6 lg:px-10 pb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-[36px] md:text-[44px] text-[#362B25] mb-6 tracking-tight leading-tight font-medium">
                            Small Investment <span className="font-light text-gray-400 mx-2">→</span> Great Impact
                        </h2>
                        <p className="text-[#675F5B] text-[16px] md:text-[18px] max-w-3xl mx-auto mb-8 leading-relaxed">
                            1 in 3 students face rejections due to a subpar SOP. With application fees averaging $100, every submission matters. Secure top admits with SOPs powered by our model trained on drafts from Ivy League graduates.
                        </p>

                        {/* Currency Selector Mockup */}
                        <div className="inline-flex items-center gap-3 border border-gray-200 rounded-md px-4 py-2 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <span className="text-[#362B25] font-medium text-[15px]">INR</span>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">

                        {/* Card 1 */}
                        <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                            <div className="text-gray-500 text-[13px] mb-2">Price: <span className="line-through">INR 5,000</span></div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="font-bold text-[#362B25] text-xl">INR</span>
                                <span className="font-bold text-[#362B25] text-[38px] leading-none">3,999</span>
                            </div>
                            <div className="inline-block border border-gray-200 rounded-lg px-4 py-2 text-gray-500 text-[13px] mb-8 bg-gray-50/50 self-start">
                                1 SOP for INR 3,999
                            </div>

                            <div className="text-[#362B25] font-semibold text-[15px] mb-6">What's included</div>
                            <ul className="space-y-5 flex-1 mb-10">
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[11px] font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Generate <strong className="font-semibold text-gray-800">1</strong> SOP</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[11px] font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">AI and Plagiarism Removal</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[11px] font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Fully Customized</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[11px] font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Perfect for a single high-stakes application</span>
                                </li>
                            </ul>
                            <button onClick={() => setCheckoutPlan({ actual: 5000, discounted: 3999, title: "1 SOP" })} className="w-full py-4 rounded-xl bg-[#f8f9fa] hover:bg-gray-100 text-[#362B25] font-medium text-[15px] text-center transition-colors">Upgrade Now</button>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                            <div className="text-gray-400 text-[13px] mb-2">Price: <span className="line-through">INR 25,000</span></div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="font-bold text-[#362B25] text-xl">INR</span>
                                <span className="font-bold text-[#362B25] text-[38px] leading-none">14,999</span>
                            </div>
                            <div className="inline-block border border-gray-200 rounded-lg px-4 py-2 text-gray-500 text-[13px] mb-8 bg-gray-50/50 self-start">
                                1 SOP for INR 2,999
                            </div>

                            <div className="text-[#362B25] font-semibold text-[15px] mb-6">What's included</div>
                            <ul className="space-y-5 flex-1 mb-10">
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Generate <strong className="font-semibold text-gray-800">5</strong> SOPs</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">5x AI and Plagiarism Removal</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Fully Customized</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-[#362B25] text-[14px]">Ideal for applying to multiple top schools</span>
                                </li>
                            </ul>
                            <button onClick={() => setCheckoutPlan({ actual: 25000, discounted: 14999, title: "5 SOPs" })} className="w-full py-4 rounded-xl bg-[#f8f9fa] hover:bg-gray-100 text-[#362B25] font-medium text-[15px] text-center transition-colors">Upgrade Now</button>
                        </div>

                        {/* Card 3 (Value) */}
                        <div className="bg-[#362B25] rounded-2xl md:rounded-[24px] p-8 shadow-[0_20px_40px_rgb(0,0,0,0.15)] flex flex-col h-full relative transform md:-translate-y-4 border border-gray-700">
                            <div className="absolute top-6 right-6 border border-[#D4A848] text-[#D4A848] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded">Value</div>
                            <div className="text-gray-400 text-[13px] mb-2">Price: <span className="line-through">INR 40,000</span></div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="font-bold text-white text-xl">INR</span>
                                <span className="font-bold text-white text-[38px] leading-none">24,999</span>
                            </div>
                            <div className="inline-block border border-gray-600 rounded-lg px-4 py-2 text-gray-300 text-[13px] mb-8 bg-black/20 self-start">
                                1 SOP for INR 2,499
                            </div>

                            <div className="text-white font-semibold text-[15px] mb-6">What's included</div>
                            <ul className="space-y-5 flex-1 mb-10">
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-gray-200 text-[14px]">Generate <strong className="font-semibold text-white">10</strong> SOPs</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-gray-200 text-[14px]">10x AI and Plagiarism Removal</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-gray-200 text-[14px]">Fully Customized</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#48bb78] rounded-full w-[18px] h-[18px] flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-[14px] font-bold font-bold">✓</span></div>
                                    <span className="text-gray-200 text-[14px]">Great for applying across universities or diverse programs</span>
                                </li>
                            </ul>
                            <button onClick={() => setCheckoutPlan({ actual: 40000, discounted: 24999, title: "10 SOPs" })} className="w-full py-4 rounded-xl bg-[#D4A848] hover:bg-[#d8ae31] text-[#362B25] font-bold text-[15px] text-center transition-colors shadow-lg">Upgrade Now</button>
                        </div>

                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-[34px] md:text-[42px] text-[#362B25] mb-3 tracking-tight font-medium">Frequently Asked Questions!</h2>
                        <p className="text-[#675F5B] text-[18px]">Helping you understand every step of the way.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Can I use the same SOP for multiple applications?", a: "While you can, we recommend slight modifications to tailor each SOP to specific universities for better acceptance chances." },
                            { q: "How long does it take to generate my SOP?", a: "Your fully customized SOP, perfectly bypassed and polished, will be generated within 15-20 minutes after completing the input details." },
                            { q: "Do I need to provide any details before generating my SOP?", a: "Yes, you'll need to answer a few simple questions regarding your background, your targeted university, and the specific reasons you wish to join the program." },
                            { q: "Is the SOP plagiarism-free and AI-safe?", a: "Absolutely. Our advanced AI-Removal engine refines the language so it retains the human touch, making it completely undetectable by standard AI detectors." },
                            { q: "Will my SOP be unique even if I generate it multiple times?", a: "Yes, each output is distinctively crafted around your specific background data, ensuring no two generated SOPs are ever identical." }
                        ].map((faq, index) => (
                            <details key={index} className="group bg-white border border-gray-100 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] marker:content-['']" open={index === 0}>
                                <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                    <h3 className="font-bold text-[#362B25] pr-8 text-[16px] md:text-[18px]">{faq.q}</h3>
                                    <div className="bg-[#fdf6e3] w-8 h-8 rounded shrink-0 flex items-center justify-center text-[#D4A848] border border-[#f5e3aa]">
                                        <span className="font-bold text-[22px] leading-none group-open:hidden">+</span>
                                        <span className="font-bold text-[22px] leading-none hidden group-open:block -mt-1">-</span>
                                    </div>
                                </summary>
                                <div className="px-6 md:px-8 pb-8 pt-0 text-[#675F5B] text-[15px] md:text-[16px] leading-relaxed border-t border-gray-50 mt-2 pt-6">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* ── FINAL CTA SECTION ────────────────────────────────────────────────── */}
                <div className="mt-12 mb-32 max-w-5xl mx-auto">
                    <div className="bg-[#362B25] rounded-[48px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl border border-[#D4A848]/20">
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4A848]/5 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#D4A848]/5 blur-[100px] rounded-full" />

                        <div className="space-y-4 relative z-10">
                            <span className="text-[#D4A848] text-[11px] font-bold tracking-[0.3em] uppercase">Begin Your Legacy</span>
                            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight">Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4A848] to-[#9c782b]">Future Protocol</span> Starts Here</h2>
                            <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto italic">
                                "Secure your admissions with precision-drafted Statement of Purpose. Trained on successful Ivy League scripts."
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10 pt-4">
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="bg-[#D4A848] text-[#362B25] px-10 py-5 rounded-2xl font-bold hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl tracking-widest text-xs uppercase"
                            >
                                Consult SOP Expert <Zap size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('pricing');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-white/5 text-white border-2 border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all tracking-widest text-xs uppercase"
                            >
                                View Protocols
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Checkout Modal overlay */}
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
        </div>
    );
}