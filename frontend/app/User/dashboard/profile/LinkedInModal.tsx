"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface LinkedInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialValue?: string;
}

export const LinkedInModal = ({ isOpen, onClose, onSubmit, initialValue = "" }: LinkedInModalProps) => {
  const [url, setUrl] = useState(initialValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0a] rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-white/10"
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">LinkedIn URL</h2>
              <p className="text-[10px] text-[#c9a84c] font-black uppercase tracking-widest">Connect your professional social profile</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl group">
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative group">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-4 focus:ring-[#c9a84c]/5 transition-all text-white placeholder:text-white/20 font-bold"
              />
              <div className="absolute inset-0 bg-[#c9a84c]/2 opacity-0 group-hover:opacity-100 blur-xl -z-10 transition-opacity"></div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[11px] border border-white/5"
              >
                Go Back
              </button>
              <button
                onClick={() => { onSubmit(url); onClose(); }}
                className="flex-[2] py-4 bg-[#20C997] hover:bg-[#1BA37A] text-[#0a0a0a] font-black rounded-2xl shadow-[0_0_30px_rgba(32,201,151,0.2)] transition-all active:scale-95 uppercase tracking-widest text-[11px]"
              >
                Submit URL
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
