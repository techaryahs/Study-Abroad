"use client";

import React from "react";
import { X, Users, MessageSquare, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            className="absolute inset-0 bg-black/60"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center flex-1">Group Details</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                {/* Group Main Info */}
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#c2a878] flex items-center justify-center text-black font-black text-lg shrink-0 scale-95">
                        {group.initials}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-black text-gray-800 leading-tight">
                            {group.author}&apos;s Research Group - {group.title}
                        </h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                            {group.description}
                        </p>
                    </div>
                </div>

                {/* Members Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#c2a878]" />
                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Available Members</h4>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] font-black text-gray-600">1/6</span>
                        </div>
                    </div>

                    <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden">
                        {/* Existing Member */}
                        <div className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50/50 transition-all border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center shadow-inner" />
                                <span className="text-sm font-bold text-gray-700">{group.author}</span>
                            </div>
                            <button className="text-blue-400 hover:text-blue-500 transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Empty Spots (5 to make it 6 total) */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-50 shadow-inner" />
                                    <span className="text-sm font-bold text-gray-400 font-medium">Join Group</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        onClose();
                                        onJoinClick();
                                    }}
                                    className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                                >
                                    <Plus className="w-6 h-6 stroke-[3px]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
