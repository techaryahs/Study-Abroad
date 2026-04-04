"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Award, MapPin, Phone, Mail, ExternalLink, GraduationCap } from "lucide-react";
import scholarshipData from "@/data/scolarship.json";

const ScholarshipDetail = () => {
    const { slug } = useParams();
    const router = useRouter();
    const scholarship = scholarshipData.scholarships.find((s) => s.slug === slug);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.display = 'none';
        }
        return () => {
            if (footer) {
                footer.style.display = 'block';
            }
        };
    }, []);

    if (!scholarship) {
        return (
            <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Scholarship Not Found</h1>
                    <button 
                        onClick={() => router.push("/resources/scholarships")}
                        className="text-[#c2a878] hover:underline"
                    >
                        Back to Scholarships
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070a] text-white flex flex-col lg:flex-row relative z-10">
            {/* Left Sidebar - Visual CTA (Fixed on Desktop, Stacks on Mobile) */}
            <div className="w-full lg:w-[400px] xl:w-[480px] bg-[#c2a878] lg:h-screen flex flex-col lg:sticky lg:top-0 p-8 md:p-12 items-center justify-center border-b lg:border-b-0 lg:border-r border-black/5">
                <div className="relative mb-8 lg:mb-12">
                   <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-full flex items-center justify-center animate-pulse backdrop-blur-3xl">
                      <div className="w-36 h-36 md:w-48 md:h-48 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-2xl">
                         <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                             <GraduationCap size={120} className="text-black drop-shadow-2xl sm:scale-110 lg:scale-125" strokeWidth={1.5} />
                         </div>
                      </div>
                   </div>
                   <div className="absolute -top-4 -right-4 w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center border-4 border-[#c2a878] rotate-12 shadow-2xl">
                      <Award size={18} className="text-[#c2a878]" />
                   </div>
                </div>

                <div className="text-center max-w-xs">
                    <h2 className="text-3xl md:text-4xl font-black text-black uppercase mb-4 italic font-serif leading-tight tracking-tight">Interested?</h2>
                    <p className="text-black/70 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] mb-8 lg:mb-12 leading-relaxed">
                        Visit the official website to get more information and apply.
                    </p>
                    
                    <a 
                        href={scholarship.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:scale-105 transition-all shadow-2xl group active:scale-95"
                    >
                        Apply Now
                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-all" />
                    </a>
                </div>
            </div>

            {/* Right Side - Scrollable Detail Content */}
            <div className="flex-1 p-6 md:p-12 lg:p-20 relative bg-[#05070a]">
                
                {/* Responsive Navigation Button */}
                <button 
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-3 text-[#c2a878] hover:text-white transition-all bg-white/[0.03] px-6 py-2.5 rounded-full border border-white/10 group mb-12 shadow-sm"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-extrabold text-[10px] uppercase tracking-[0.3em]">Back to Listing</span>
                </button>

                <div>
                   {/* Header Architecture */}
                   <header className="mb-16 lg:mb-24">
                      <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black italic font-serif leading-[1.1] tracking-tighter mb-6 text-white hover:text-[#c2a878] transition-colors cursor-default">
                        {scholarship.name}
                      </h1>
                      <div className="flex items-center gap-6">
                        <div className="h-[2px] w-12 bg-[#c2a878]/50" />
                        <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-gray-500">
                           Sponsor / <span className="text-gray-300 font-bold tracking-widest">{scholarship.sponsor}</span>
                        </p>
                      </div>
                   </header>

                   {/* Key Information Matrix */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 mb-20 lg:mb-32">
                       {/* Performance Indicators */}
                       <div className="space-y-12">
                          <div className="group border-b border-white/5 pb-8">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                   <Calendar size={18} className="text-red-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Deadline</span>
                             </div>
                             <span className="text-xl md:text-2xl font-bold block pl-14 text-white/95">{scholarship.deadline}</span>
                          </div>

                          <div className="group border-b border-white/5 pb-8">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                   <DollarSign size={18} className="text-emerald-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Amount</span>
                             </div>
                             <span className="text-xl md:text-2xl lg:text-3xl font-bold block pl-14 text-emerald-400">{scholarship.amount}</span>
                          </div>

                          <div className="group border-b border-white/5 pb-8">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                   <Award size={18} className="text-blue-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Awards</span>
                             </div>
                             <span className="text-xl md:text-2xl font-bold block pl-14 text-white/95">{scholarship.number_of_awards}</span>
                          </div>
                       </div>

                       {/* Eligibility Meta */}
                       <div className="space-y-12">
                          <div className="group border-b border-white/5 pb-8">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                   <MapPin size={18} className="text-purple-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Host Country</span>
                             </div>
                             <span className="text-xl md:text-2xl font-bold block pl-14 text-white/95">{scholarship.host_country}</span>
                          </div>

                          <div className="group border-b border-white/5 pb-8">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878] block mb-4">Conditions</span>
                              <p className="text-gray-400 text-sm md:text-base leading-relaxed pl-14 border-l border-white/10">{scholarship.conditions}</p>
                          </div>

                          <div className="group border-b border-white/5 pb-8">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878] block mb-4">Income Filter</span>
                              <p className="text-gray-400 text-sm md:text-base leading-relaxed pl-14 border-l border-white/10">{scholarship.income_criteria}</p>
                          </div>
                       </div>
                   </div>

                   {/* Rich Narrative Sections */}
                   <div className="space-y-24 lg:space-y-32 pb-20">
                       <section>
                          <h3 className="text-3xl md:text-4xl font-black italic font-serif italic text-white/95 mb-8 tracking-tight">Scope & Narrative</h3>
                          <div className="space-y-6 text-gray-400 leading-relaxed max-w-4xl text-sm md:text-base">
                             <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#c2a878] first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                                {scholarship.description}
                             </p>
                          </div>
                       </section>

                       <section>
                          <h3 className="text-3xl md:text-4xl font-black italic font-serif italic text-white/95 mb-8 tracking-tight">Value Proposition</h3>
                          <div className="max-w-3xl bg-white/[0.01] border-l-4 border-[#c2a878] p-8 md:p-12 rounded-r-[2rem] shadow-2xl">
                             <p className="text-gray-300 leading-relaxed text-sm md:text-lg font-medium italic opacity-90">{scholarship.perks}</p>
                          </div>
                       </section>

                       {/* Responsive Liaison Card */}
                       <section className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group shadow-3xl">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c2a878]/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                          <h3 className="text-2xl md:text-3xl font-black italic font-serif mb-12 italic relative z-10 tracking-tight">Liaison Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#c2a878]/80">
                                   <MapPin size={18} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Official Address</span>
                                </div>
                                <p className="text-sm md:text-base font-bold text-gray-200 leading-tight pl-8">{scholarship.contact.address}</p>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#c2a878]/80">
                                   <Phone size={18} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Communication</span>
                                </div>
                                <p className="text-sm md:text-base font-bold text-gray-200 leading-tight pl-8">{scholarship.contact.phone}</p>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#c2a878]/80">
                                   <Mail size={18} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direct Email</span>
                                </div>
                                <p className="text-sm md:text-base font-black text-[#c2a878] leading-tight pl-8 truncate">{scholarship.contact.email}</p>
                             </div>
                          </div>
                       </section>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetail;
