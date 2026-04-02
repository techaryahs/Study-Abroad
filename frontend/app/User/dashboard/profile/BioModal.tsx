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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#d4af37]/20"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Update Bio</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="relative group">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What would you like others to know about you?"
              className="w-full h-40 p-6 text-white bg-white/5 border border-[#d4af37]/20 rounded-2xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-4 focus:ring-[#c9a84c]/5 transition-all resize-none placeholder:text-white/20 font-medium"
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-white/30 font-black uppercase tracking-widest">
              {bio.length} characters
            </div>
            {/* Subtle glow effect on focus */}
            <div className="absolute inset-0 bg-[#c9a84c]/5 opacity-0 group-focus-within:opacity-100 blur-2xl -z-10 transition-opacity"></div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={onClose}
              className="px-10 py-3.5 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[11px]"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSubmit(bio); onClose(); }}
              className="px-12 py-3.5 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0a0a] font-black rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all active:scale-95 uppercase tracking-widest text-[11px]"
            >
              Save Bio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
