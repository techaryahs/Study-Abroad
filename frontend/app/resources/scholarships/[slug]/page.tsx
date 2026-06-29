"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Award, MapPin, Phone, Mail, ExternalLink, GraduationCap } from "lucide-react";
import scholarshipData from "@/data/scolarship.json";
import { motion } from "framer-motion";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";

const ScholarshipDetail = () => {
    const { isPremium } = usePremiumStatus();
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
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#2D2926]">
                <div className="text-center">
                    <h1 className="fd text-4xl font-bold mb-4">Scholarship Not Found</h1>
                    <button 
                        onClick={() => router.push("/resources/scholarships")}
                        className="text-[#C5A059] font-bold hover:underline"
                    >
                        Return to Catalogue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PremiumLock isPremium={isPremium} isFullPage={true} title="Unlock Scholarship Details" description="Get premium access to explore detailed requirements, application strategies, and full funding amounts for this scholarship.">
        <div className="min-h-screen flex flex-col lg:flex-row relative z-10" style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}>
            
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

                .sidebar-dark {
                  background: #2D2926;
                }

                .info-card {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.15);
                  padding: 30px;
                  border-radius: 20px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }

                .back-btn {
                  background: #FFFFFF;
                  border: 1px solid rgba(197,160,89, 0.2);
                  color: #2D2926;
                  padding: 10px 24px;
                  border-radius: 100px;
                  transition: all 0.3s ease;
                }
                .back-btn:hover {
                  border-color: #C5A059;
                  transform: translateX(-4px);
                }
            `}</style>

            {/* Left Sidebar - High Engagement CTA */}
            <div className="w-full lg:w-[420px] xl:w-[480px] sidebar-dark lg:h-fit flex flex-col lg:sticky lg:top-24 p-8 md:p-10 lg:p-12 items-center justify-start lg:justify-center border-b lg:border-b-0 border-white/5 py-10 lg:py-14 rounded-[40px] lg:m-6 shadow-2xl">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-12"
                >
                   <div className="w-40 h-40 md:w-44 md:h-44 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <div className="w-28 h-28 md:w-32 md:h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                          <GraduationCap size={100} className="text-[#C5A059] opacity-90 drop-shadow-2xl" strokeWidth={1} />
                      </div>
                   </div>
                   <div className="absolute top-2 right-2 w-14 h-14 bg-[#C5A059] rounded-full flex items-center justify-center border-4 border-[#2D2926] rotate-12 shadow-2xl">
                      <Award size={24} className="text-white" />
                   </div>
                </motion.div>

                <div className="text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(197,160,89,0.1)] text-[#C5A059] font-bold text-[14px] font-bold tracking-[0.2em] uppercase mb-8 border border-[rgba(197,160,89,0.2)]">
                      Funding Opportunity
                    </span>
                    <h2 className="fd text-4xl font-bold text-white mb-6 leading-tight">Ready to <span className="gold-shimmer">Apply?</span></h2>
                    <p className="text-[#A8A29E] font-medium text-sm mb-12 leading-relaxed">
                        Transition to the official portal to complete your institutional application.
                    </p>
                    
                    <a 
                        href={scholarship.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#C5A059] text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-white hover:text-[#2D2926] transition-all shadow-2xl scale-105 active:scale-95"
                    >
                        Initialize Application
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 md:p-16 lg:p-24 relative">
                <button 
                    onClick={() => router.back()}
                    className="back-btn inline-flex items-center gap-3 group mb-16 font-bold text-[11px] uppercase tracking-widest shadow-sm"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Index
                </button>

                <div className="max-w-5xl mx-auto">
                   <header className="mb-20">
                      <div className="flex items-center gap-4 mb-6">
                         <span className="h-[1px] w-12 bg-[#C5A059]/40" />
                         <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#A8A29E]">
                            Sponsor Profile / <span className="text-[#2D2926] font-bold">{scholarship.sponsor}</span>
                         </p>
                      </div>
                      <h1 className="fd text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight text-[#2D2926] break-words">
                        {scholarship.name}
                      </h1>
                   </header>

                     {/* Key Information Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                        <div className="space-y-10">
                           <div className="info-card group">
                              <div className="flex items-center gap-5 mb-6">
                                 <div className="w-12 h-12 rounded-xl bg-[rgba(239,68,68,0.08)] flex items-center justify-center border border-[rgba(239,68,68,0.15)]">
                                    <Calendar size={22} className="text-red-500" />
                                 </div>
                                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5E51]">Closing Deadline</span>
                              </div>
                              <span className="text-2xl font-bold text-[#2D2926] block leading-tight">{scholarship.deadline}</span>
                           </div>

                           <div className="info-card group">
                              <div className="flex items-center gap-5 mb-6">
                                 <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.08)] flex items-center justify-center border border-[rgba(16,185,129,0.15)]">
                                    <DollarSign size={22} className="text-emerald-600" />
                                 </div>
                                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5E51]">Benefit Value</span>
                              </div>
                              <span className="text-3xl font-bold gold-shimmer block">{scholarship.amount}</span>
                           </div>
                        </div>

                        <div className="space-y-10">
                           <div className="info-card group">
                              <div className="flex items-center gap-5 mb-6">
                                 <div className="w-12 h-12 rounded-xl bg-[rgba(197,160,89,0.08)] flex items-center justify-center border border-[rgba(197,160,89,0.15)]">
                                    <Award size={22} className="text-[#C5A059]" />
                                 </div>
                                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5E51]">Allocations</span>
                              </div>
                              <span className="text-2xl font-bold text-[#2D2926] block leading-tight">{scholarship.number_of_awards} Recipients</span>
                           </div>
                           
                           <div className="info-card group">
                              <div className="flex items-center gap-5 mb-6">
                                 <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.08)] flex items-center justify-center border border-[rgba(59,130,246,0.15)]">
                                    <MapPin size={22} className="text-blue-600" />
                                 </div>
                                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5E51]">Institutional Base</span>
                              </div>
                              <span className="text-2xl font-bold text-[#2D2926] block leading-tight">{scholarship.host_country}</span>
                           </div>
                        </div>
                   </div>

                   {/* Content Narrative */}
                   <div className="space-y-24 pb-32">
                       <section>
                          <h3 className="fd text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2926] mb-10 tracking-tight">Scope & Purpose</h3>
                          <div className="max-w-4xl text-[#6B5E51] font-medium leading-[1.8] text-lg">
                             <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#C5A059] first-letter:mr-4 first-letter:float-left first-letter:mt-2">
                                {scholarship.description}
                             </p>
                          </div>
                       </section>

                       <section className="bg-[#FFFFFF] border border-[rgba(197,160,89,0.15)] p-12 lg:p-16 rounded-[40px] shadow-sm">
                          <h3 className="fd text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2926] mb-10 border-b border-[#F1EDEA] pb-6">Eligibility & Criteria</h3>
                          <div className="grid md:grid-cols-2 gap-12">
                            <div>
                               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-4">Core Conditions</span>
                               <p className="text-[#6B5E51] font-medium leading-relaxed">{scholarship.conditions}</p>
                            </div>
                            <div>
                               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-4">Financial Benchmarks</span>
                               <p className="text-[#6B5E51] font-medium leading-relaxed">{scholarship.income_criteria}</p>
                            </div>
                          </div>
                       </section>

                       <section>
                          <h3 className="fd text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2926] mb-10 tracking-tight">Value Proposition</h3>
                          <div className="p-10 bg-[rgba(197,160,89,0.05)] border-l-4 border-[#C5A059] rounded-r-[30px] font-medium italic text-xl text-[#2D2926] leading-relaxed opacity-90 shadow-inner">
                             "{scholarship.perks}"
                          </div>
                       </section>

                       <section className="info-card bg-[#2D2926] text-white border-none py-16 px-12 md:px-20 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #C5A059 1px, transparent 1px)", backgroundSize: '30px 30px' }}></div>
                          <h3 className="fd text-3xl font-bold mb-14 text-white">Liaison Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#C5A059]">
                                   <MapPin size={20} />
                                   <span className="text-[14px] font-bold font-bold uppercase tracking-widest opacity-80">Provider HQ</span>
                                </div>
                                <p className="text-sm font-medium text-[#A8A29E] leading-relaxed">{scholarship.contact.address}</p>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#C5A059]">
                                   <Phone size={20} />
                                   <span className="text-[14px] font-bold font-bold uppercase tracking-widest opacity-80">Liaison</span>
                                </div>
                                <p className="text-sm font-medium text-[#A8A29E] leading-relaxed">{scholarship.contact.phone}</p>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#C5A059]">
                                   <Mail size={20} />
                                   <span className="text-[14px] font-bold font-bold uppercase tracking-widest opacity-80">Inquiries</span>
                                </div>
                                <p className="text-sm font-bold text-white tracking-wide truncate">{scholarship.contact.email}</p>
                             </div>
                          </div>
                       </section>
                   </div>
                </div>
            </div>
        </div>
        </PremiumLock>
    );
};

export default ScholarshipDetail;
