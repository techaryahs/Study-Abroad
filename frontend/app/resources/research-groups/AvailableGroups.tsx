"use client";

import React, { useEffect, useState } from "react";
import { Users, Clock, ExternalLink, ArrowRight, MoreHorizontal, MessageCircle, Send, Copy, Link as LinkIcon, Check, Calendar, Share2, Activity, Brain, Microscope, FlaskConical, BookOpen, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";

export const groups = [
  {
    id: 1,
    title: "Medicine and Clinical Research",
    author: "P C",
    initials: "PC",
    description: "Architecting a synthesis model for Construction Management integrated with Data Analytics. Investigating schedule optimization and cost prediction through advanced performance forecasting.",
    date: "Apr 29, 2025",
    spots: "1/6",
    creator: { _id: "mock1", name: "P C", profile: { isPublic: true } }
  },
  {
    id: 2,
    title: "Sustainable Transportation Infrastructure",
    author: "S M",
    initials: "SM",
    description: "Aggregating urban transport datasets to define modern sustainability benchmarks in infrastructure engineering. Seeking cross-disciplinary co-authors.",
    date: "Jan 24, 2025",
    spots: "1/6",
    creator: { _id: "mock2", name: "S M", profile: { isPublic: true } }
  },
  {
    id: 3,
    title: "Blockchain & Supply Chain Transparency",
    author: "A K",
    initials: "AK",
    description: "Developing a robust framework for decentralized ledger implementation in global logistics. Focus on technical and economic impact analysis.",
    date: "Feb 02, 2025",
    spots: "1/6",
    creator: { _id: "mock3", name: "A K", profile: { isPublic: true } }
  },
  {
    id: 4,
    title: "CPA Standards & Quantitative Accounting",
    date: "Apr 02, 2026",
    spots: "1/6",
    author: "R P",
    description: "A specialized cluster focused on regulatory CPA preparation and the evolution of international accounting standards in digital economies.",
    initials: "RP",
    creator: { _id: "mock4", name: "R P", profile: { isPublic: false } }
  },
  {
    id: 5,
    title: "Information Systems (MIS) Statistics",
    date: "Oct 30, 2025",
    spots: "2/6",
    author: "U S",
    description: "Quantitative analysis of IT-related sociological studies. Target publication via IEEE. Focus on Statistics and high-velocity data systems.",
    initials: "US",
    creator: { _id: "mock5", name: "U S", profile: { isPublic: true } }
  },
  {
    id: 6,
    title: "Computer Science: Distributed AI",
    date: "Oct 13, 2025",
    spots: "1/2",
    author: "H M",
    initials: "HM",
    description: "Deep-dive research into Distributed AI and Cloud Computing infrastructures. Analyzing scalability in machine learning deployments.",
    creator: { _id: "mock6", name: "H M", profile: { isPublic: true } }
  }
];

interface AvailableGroupsProps {
  searchQuery?: string;
  onJoinClick?: () => void;
  onCardClick?: (group: any) => void;
}

export default function AvailableGroups({ searchQuery = "", onJoinClick, onCardClick }: AvailableGroupsProps) {
  const [openShareId, setOpenShareId] = React.useState<number | null>(null);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const { isPremium } = usePremiumStatus();

  const filteredGroups = groups.filter(group => 
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGroupUrl = (group: any) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const formattedTitle = group.title.trim().replace(/\s+/g, '_').replace(/[^\w]/g, '');
    return `${baseUrl}/resources/research-groups/${formattedTitle}/${group.id}/`;
  };

  const handleCopyLink = (e: React.MouseEvent, group: any) => {
    e.stopPropagation();
    const url = getGroupUrl(group);
    navigator.clipboard.writeText(url);
    setCopiedId(group.id);
    setTimeout(() => setCopiedId(null), 2000);
    setOpenShareId(null);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, group: any) => {
    e.stopPropagation();
    const url = getGroupUrl(group);
    const text = encodeURIComponent(url);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    setOpenShareId(null);
  };

  const handleShareTelegram = (e: React.MouseEvent, group: any) => {
    e.stopPropagation();
    const url = getGroupUrl(group);
    window.open(`https://t.me/share/url?url=${url}`, "_blank");
    setOpenShareId(null);
  };

  useEffect(() => {
    if (openShareId === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.share-menu-container')) {
        setOpenShareId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openShareId]);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredGroups.length > 0 ? (
        <>
        {filteredGroups.slice(0, 3).map((group) => (
        <div 
          key={group.id} 
          onClick={() => onCardClick?.(group)}
          className="group/card relative bg-white border border-[rgba(197,160,89,0.15)] rounded-[24px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer shadow-sm"
        >
          <div className="relative h-28 bg-[rgba(197,160,89,0.03)] flex items-center justify-center p-6 border-b border-[#F1EDEA]">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)", backgroundSize: '16px 16px' }}></div>
              
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="bg-white/80 backdrop-blur-md text-[13px] font-bold px-2.5 py-1 rounded-md text-[#6B5E51] border border-[rgba(197,160,89,0.1)] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5">
                   <Calendar className="w-2.5 h-2.5" /> {group.date}
                </span>
                <span className="bg-white/80 backdrop-blur-md text-[13px] font-bold px-2.5 py-1 rounded-md text-[#C5A059] border border-[rgba(197,160,89,0.1)] flex items-center gap-1.5 uppercase tracking-wider font-bold shadow-sm">
                  <Users className="w-3 h-3" /> {group.spots} Active
                </span>
              </div>

            <div className="absolute top-4 right-4 share-menu-container z-20">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenShareId(openShareId === group.id ? null : group.id);
                    }}
                    className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white border border-transparent hover:border-[rgba(197,160,89,0.2)] transition-all text-[#A8A29E] hover:text-[#C5A059]"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                <AnimatePresence>
                    {openShareId === group.id && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden p-2 border border-[rgba(197,160,89,0.1)]"
                        >
                            <button 
                                onClick={(e) => handleShareWhatsApp(e, group)}
                                className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#F8F5F0] rounded-xl transition-all group/item"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <MessageCircle className="w-4 h-4 fill-green-600" />
                                </div>
                                <span className="text-xs font-bold text-[#2D2926]">Liaison via WhatsApp</span>
                            </button>
                            <button 
                                onClick={(e) => handleShareTelegram(e, group)}
                                className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#F8F5F0] rounded-xl transition-all group/item"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Send className="w-4 h-4 fill-blue-500" />
                                </div>
                                <span className="text-xs font-bold text-[#2D2926]">Dispatch to Telegram</span>
                            </button>
                            <div className="h-px bg-[#F1EDEA] my-2 mx-2" />
                            <button 
                                onClick={(e) => handleCopyLink(e, group)}
                                className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-[#F8F5F0] rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#6B5E51]">
                                        <Copy className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-[#2D2926]">Copy Access URL</span>
                                </div>
                                {copiedId === group.id && <Check className="w-4 h-4 text-emerald-500" />}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <h3 className="fd text-center text-lg md:text-xl font-bold text-[#2D2926] tracking-tight mt-4 max-w-[90%] line-clamp-1 leading-tight z-10">
              {group.title}
            </h3>
          </div>
          
          <div className="p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2D2926] flex items-center justify-center text-[#C5A059] font-bold text-xs border-2 border-white shadow-md">
                {group.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold font-bold text-[#A8A29E] uppercase tracking-widest leading-none mb-1">Principal Investigator</span>
                <span className="font-bold text-[#2D2926] text-xs">{group.author}</span>
              </div>
            </div>
            
            <p className="text-sm text-[#6B5E51] leading-relaxed line-clamp-3 font-medium opacity-90">
              {group.description}
            </p>
            
            <div className="flex gap-4 mt-2">
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (!group.creator?.profile?.isPublic && group.creator) {
                        alert("This profile is private.");
                        return;
                    }
                    if (group.creator?._id) {
                        window.location.href = `/profile/${group.creator._id}`;
                    } else {
                        alert("This is a system group. Profile not available.");
                    }
                }}
                className={`flex-1 px-4 py-3 bg-[rgba(197,160,89,0.05)] text-[#C5A059] text-[14px] font-bold rounded-xl flex items-center justify-center gap-2 font-bold tracking-widest border border-[rgba(197,160,89,0.1)] hover:bg-[rgba(197,160,89,0.1)] transition-all uppercase ${(!group.creator?.profile?.isPublic && group.creator) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Profile
              </button>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onJoinClick?.();
                }}
                className="flex-[1.5] bg-[#2D2926] hover:bg-[#C5A059] text-white py-3 px-6 text-[14px] font-bold rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
              >
                Join Cluster <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      </>
      ) : (
        <div className="col-span-full py-32 text-center">
          <div className="w-20 h-20 bg-[rgba(197,160,89,0.05)] rounded-full flex items-center justify-center mx-auto mb-6 text-[#A8A29E]">
             <Users size={32} />
          </div>
          <h2 className="fd text-2xl font-bold text-[#2D2926]">No Clusters Identified</h2>
          <p className="text-[#6B5E51] font-medium max-w-sm mt-4 leading-relaxed mx-auto">
            Adjust your filters or try a different search term to find what you're looking for.
          </p>
        </div>
      )}
    </div>

    {filteredGroups.length > 3 && (
      <div className="mt-8">
        <PremiumLock isPremium={isPremium} title="Unlock All Research Groups" description="Get premium access to join world-class research teams and exclusive mentorship programs.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGroups.slice(3).map((group) => (
              <div 
                key={group.id} 
                onClick={() => onCardClick?.(group)}
                className="group/card relative bg-white border border-[rgba(197,160,89,0.15)] rounded-[24px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer shadow-sm"
              >
                <div className="relative h-28 bg-[rgba(197,160,89,0.03)] flex items-center justify-center p-6 border-b border-[#F1EDEA]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)", backgroundSize: '16px 16px' }}></div>
                    
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <span className="bg-white/80 backdrop-blur-md text-[13px] font-bold px-2.5 py-1 rounded-md text-[#6B5E51] border border-[rgba(197,160,89,0.1)] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5">
                         <Calendar className="w-2.5 h-2.5" /> {group.date}
                      </span>
                      <span className="bg-white/80 backdrop-blur-md text-[13px] font-bold px-2.5 py-1 rounded-md text-[#C5A059] border border-[rgba(197,160,89,0.1)] flex items-center gap-1.5 uppercase tracking-wider font-bold shadow-sm">
                        <Users className="w-3 h-3" /> {group.spots} Active
                      </span>
                    </div>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl fd font-bold text-[#2D2926] leading-tight mb-3">
                      {group.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E6D5B8] flex items-center justify-center shadow-inner">
                        <span className="text-white font-bold text-xs">{group.initials}</span>
                      </div>
                      <div>
                        <p className="text-[#2D2926] font-bold text-sm leading-none">{group.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PremiumLock>
      </div>
    )}
    </>
  );
}
