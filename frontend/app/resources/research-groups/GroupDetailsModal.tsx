"use client";

import React from "react";
import { X, Users, MessageSquare, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EntitlementGuard } from "@/components/shared/EntitlementGuard";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
  onJoinClick: () => void;
}

export default function GroupDetailsModal({ isOpen, onClose, group, onJoinClick }: GroupDetailsModalProps) {
    if (!group) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2D2926]/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-3xl overflow-hidden border border-[rgba(197,160,89,0.1)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F1EDEA]">
              <h2 className="text-[14px] font-bold font-bold text-[#A8A29E] uppercase tracking-[0.3em] flex-1">Cluster Specifications</h2>
              <button 
                onClick={onClose}
                className="text-[#A8A29E] hover:text-[#C5A059] transition-all bg-[#F8F5F0] p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 md:p-10 flex flex-col gap-8 max-h-[85vh] overflow-y-auto">
                <EntitlementGuard featureId="research_groups" fallbackTitle="Unlock Research Cluster" fallbackDescription="Get premium access to explore detailed requirements, team structure, and apply for membership in this research cluster.">
                {/* Group Main Info */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#2D2926] flex items-center justify-center text-[#C5A059] font-bold text-xl shrink-0 border shadow-inner">
                        {group.initials}
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="fd text-2xl md:text-3xl font-bold text-[#2D2926] leading-tight">
                            Investigator {group.author} / {group.title}
                        </h3>
                        <p className="text-sm text-[#6B5E51] leading-relaxed font-medium opacity-80 italic">
                           "{group.description}"
                        </p>
                    </div>
                </div>

                {/* Performance Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8F5F0] p-4 rounded-2xl border border-[rgba(197,160,89,0.1)]">
                    <span className="text-[13px] font-bold font-bold text-[#A8A29E] uppercase tracking-widest block mb-2">Saturation</span>
                    <span className="text-lg font-bold text-[#2D2926]">{group.spots} Members</span>
                  </div>
                  <div className="bg-[#F8F5F0] p-4 rounded-2xl border border-[rgba(197,160,89,0.1)]">
                    <span className="text-[13px] font-bold font-bold text-[#A8A29E] uppercase tracking-widest block mb-2">Initiated</span>
                    <span className="text-lg font-bold text-[#2D2926]">{group.date}</span>
                  </div>
                </div>

                {/* Members Section */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-[#F1EDEA] pb-3">
                        <Users className="w-5 h-5 text-[#C5A059]" />
                        <h4 className="text-[11px] font-bold text-[#2D2926] uppercase tracking-widest">Scientific Personnel</h4>
                    </div>

                    <div className="flex flex-col border border-[rgba(197,160,89,0.1)] rounded-2xl overflow-hidden bg-[#FDFBF7]/50 shadow-inner">
                        {/* Principal Investigator */}
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#F1EDEA]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[rgba(197,160,89,0.1)] flex items-center justify-center text-[#C5A059] font-bold text-xs">PI</div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-[#2D2926]">{group.author}</span>
                                  <span className="text-[13px] font-bold font-bold text-[#A8A29E] uppercase">Lead Author</span>
                                </div>
                            </div>
                            <button className="text-[#C5A059] hover:scale-110 transition-all">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Vacant Positions */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-[#F1EDEA]/50 last:border-0 opacity-70">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-white border border-dashed border-[#A8A29E]/30" />
                                    <span className="text-xs font-bold text-[#A8A29E]">Available Slot</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        onClose();
                                        onJoinClick();
                                    }}
                                    className="text-[#C5A059] hover:scale-110 transition-all p-1"
                                >
                                    <Plus className="w-6 h-6 stroke-[2px]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                  <button 
                      onClick={() => {
                          onClose();
                          onJoinClick();
                      }}
                      className="w-full bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold py-5 rounded-2xl uppercase tracking-[0.2em] text-[14px] font-bold transition-all shadow-xl active:scale-[0.98]"
                  >
                      Apply for Cluster Membership
                  </button>
                </div>
                </EntitlementGuard>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
