"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bio: string) => void;
  initialValue?: string;
}

export const BioModal = ({ isOpen, onClose, onSubmit, initialValue = "" }: BioModalProps) => {
  const [bio, setBio] = useState(initialValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3C2A21]/40 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#C5A059]/15"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-[#3C2A21] uppercase tracking-widest italic">Update Narrative</h2>
            <button onClick={onClose} className="text-[#6B5E51]/70 hover:text-[#C5A059] transition-colors p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="relative group">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Awaiting narrative synchronization..."
              className="w-full h-40 p-6 text-xs text-[#3C2A21] bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl focus:outline-none focus:border-[#C5A059] transition-all resize-none placeholder:text-[#6B5E51]/20 font-bold leading-relaxed shadow-inner"
            />
            <div className="absolute bottom-4 right-5 text-[12px] font-black text-[#6B5E51]/30 font-black uppercase tracking-[0.2em]">
              {bio.length} CHARS
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#FDFBF7] border border-[#F1EDEA] text-[#6B5E51] font-black rounded-xl transition-all uppercase tracking-widest text-[13px] font-bold hover:text-[#3C2A21]"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSubmit(bio); onClose(); }}
              className="px-10 py-3 bg-[#C5A059] hover:bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[13px] font-bold"
            >
              Save Bio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
