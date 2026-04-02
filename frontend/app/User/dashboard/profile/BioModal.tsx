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
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Update Bio</h2>
            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-1.5 bg-white/5 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="relative group">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Awaiting narrative synchronization..."
              className="w-full h-32 p-5 text-xs text-white bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500/50 transition-all resize-none placeholder:text-white/10 font-bold leading-relaxed"
            />
            <div className="absolute bottom-3 right-4 text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">
              {bio.length} CHARS
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white font-black rounded-xl transition-all uppercase tracking-widest text-[9px]"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSubmit(bio); onClose(); }}
              className="px-8 py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-black rounded-xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[9px]"
            >
              Save Bio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
