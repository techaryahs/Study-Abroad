"use client";

import React, { useEffect, useState } from "react";
import { Users, Clock, ExternalLink, ArrowRight, MoreHorizontal, MessageCircle, Send, Copy, Link as LinkIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const groups = [
  {
    id: 1,
    title: "Medicine and Clinical Research",
    author: "P C",
    initials: "PC",
    description: "I'm planning to publish a research paper in the area of Construction Management integrated with Data Analytics. The focus would be on applying analytics techniques to real construction problems — such as schedule optimization, cost prediction, delay analysis, or performance forecasting.",
    date: "Apr 29, 2025",
    spots: "1/6",
    creator: { _id: "mock1", name: "P C", profile: { isPublic: true } }
  },
  {
    id: 2,
    title: "Transportation Infrastructure Engineering: Sustainable",
    author: "S M",
    initials: "SM",
    description: "Looking for enthusiasts to collaborate on a sustainable infrastructure study project focusing on modern urban transport solutions.",
    date: "Jan 24, 2025",
    spots: "1/6",
    creator: { _id: "mock2", name: "S M", profile: { isPublic: true } }
  },
  {
    id: 3,
    title: "Blockchain in Supply Chain Management",
    author: "A K",
    initials: "AK",
    description: "Developing a framework for enhancing supply chain transparency using decentralized ledgers. Seeking co-authors for technical and economic analysis.",
    date: "Feb 02, 2025",
    spots: "1/6",
    creator: { _id: "mock3", name: "A K", profile: { isPublic: true } }
  },
  {
    id: 4,
    title: "CPA Preparation and Accounting",
    date: "Apr 02, 2026",
    spots: "1/6",
    author: "R P",
    description: "Hi, this is R P. This is my research group focused on CPA preparation and accounting standards.",
    initials: "RP",
    creator: { _id: "mock4", name: "R P", profile: { isPublic: false } }
  },
  {
    id: 5,
    title: "Information Systems (MIS)",
    date: "Oct 30, 2025",
    spots: "2/6",
    author: "U S",
    description: "I'm interested in starting a research group focused on Statistics, Quantitative Analysis, and IT-related studies, with the goal of publishing papers through IEEE or other reputable research...",
    initials: "US",
    creator: { _id: "mock5", name: "U S", profile: { isPublic: true } }
  },
  {
    id: 6,
    title: "Computer Science",
    date: "Oct 13, 2025",
    spots: "1/2",
    author: "H M",
    initials: "HM",
    description: "Computer Science research group focusing on AI, Machine Learning, and Cloud Computing infrastructures.",
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredGroups.length > 0 ? filteredGroups.map((group) => (
        <div 
          key={group.id} 
          onClick={() => onCardClick?.(group)}
          className="glass-card flex flex-col gap-4 !p-0 overflow-hidden hover:scale-[1.01] transition-transform duration-300 cursor-pointer group/card relative"
        >
          <div className="relative h-24 bg-gradient-to-br from-[#c2a878]/10 via-[#05070a] to-[#c2a878]/5 flex items-center justify-center p-4">
            <div className="absolute top-2.5 left-3 flex gap-2">
              <span className="bg-[#05070a]/80 text-[9px] px-2 py-0.5 rounded text-white/40 border border-white/5 uppercase tracking-tight font-bold"> {group.date}</span>
              <span className="bg-[#05070a]/80 text-[9px] px-2 py-0.5 rounded text-[#c2a878]/70 border border-white/5 flex items-center gap-1 uppercase tracking-tight font-bold">
                <Users className="w-3 h-3" /> {group.spots}
              </span>
            </div>

            {/* Share Menu */}
            <div className="absolute top-2 right-3 share-menu-container">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenShareId(openShareId === group.id ? null : group.id);
                    }}
                    className="p-1 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                <AnimatePresence>
                    {openShareId === group.id && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl z-[60] overflow-hidden p-1.5"
                        >
                            <button 
                                onClick={(e) => handleShareWhatsApp(e, group)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-all group/item"
                            >
                                <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <MessageCircle className="w-4 h-4 fill-green-600" />
                                </div>
                                <span className="text-[11.5px] font-bold text-gray-700">Share on whatsapp</span>
                            </button>
                            <button 
                                onClick={(e) => handleShareTelegram(e, group)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-all group/item"
                            >
                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Send className="w-4 h-4 fill-blue-500" />
                                </div>
                                <span className="text-[11.5px] font-bold text-gray-700">Share on telegram</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <button 
                                onClick={(e) => handleCopyLink(e, group)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                        <Copy className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11.5px] font-bold text-gray-700">Copy Link</span>
                                </div>
                                {copiedId === group.id && <Check className="w-3.5 h-3.5 text-green-500" />}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <h3 className="text-center text-[12.5px] font-black uppercase text-white tracking-wide mt-2 max-w-[85%] line-clamp-2 leading-tight">
              {group.title}
            </h3>
          </div>
          
          <div className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c2a878] flex items-center justify-center text-black font-black text-[10px]">
                {group.initials}
              </div>
              <span className="font-bold text-white/80 text-[11px] tracking-tight">{group.author}</span>
            </div>
            
            <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3 font-medium">
              {group.description}
            </p>
            
            <div className="flex gap-2.5 mt-2">
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
                className={`flex-1 btn-outline-gold !py-2.5 text-[10px] !rounded-lg flex items-center justify-center gap-2 !font-bold !tracking-tight !border-white/10 hover:!border-[#c2a878]/30 transition-all focus:outline-none ${(!group.creator?.profile?.isPublic && group.creator) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Visit Profile
              </button>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onJoinClick?.();
                }}
                className="flex-1 bg-[#c2a878] hover:bg-[#d4af37] text-black !py-2.5 text-[9px] !rounded-lg flex items-center justify-center gap-1.5 !font-black uppercase tracking-tight transition-all shadow-lg active:scale-95 focus:outline-none"
              >
                Join Group <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center text-white/30 font-medium uppercase tracking-widest text-[11px]">
          No groups matching your search...
        </div>
      )}
    </div>
  );
}
