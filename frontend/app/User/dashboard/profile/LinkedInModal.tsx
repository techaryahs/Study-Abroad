'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: string;
}

export const LinkedInModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [url, setUrl] = useState(initialData || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    setUrl(initialData || ''); 
    setError(null);
  }, [initialData]);

  const validateLinkedIn = (value: string) => {
    if (!value) return true;
    const regex = /^https?:\/\/(www\.)?([a-z]+\.)?linkedin\.com\/.*$/i;
    return regex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateLinkedIn(url)) {
      setError("Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(url);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Failed to save. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#2D2926]/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            className="bg-white border border-[#F1EDEA] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_40px_100px_rgba(197,160,89,0.1)]"
          >
            <div className="p-6 border-b border-[#F1EDEA] flex justify-between items-center bg-[#FDFBF7]">
                <h2 className="text-xs font-black text-[#2D2926] uppercase tracking-widest">LinkedIn Profile Protocol</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#F1EDEA] rounded-full text-[#6B5E51] transition-all"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest ml-1">Profile Interface URL</p>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]">
                    <LinkIcon size={16} />
                  </div>
                  <input 
                    type="url" 
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full bg-[#F8F5F0] border ${error ? 'border-red-500/50' : 'border-[#F1EDEA]'} rounded-2xl pl-12 pr-4 py-4 text-sm text-[#2D2926] font-medium focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-[#C5A059]'} transition-all placeholder:text-[#6B5E51]/40`}
                    required
                  />
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">
                    {error}
                  </motion.p>
                )}
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full py-5 bg-[#C5A059] text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#2D2926] transition-all disabled:opacity-50"
              >
                {loading ? "Synchronizing..." : "Save Platform Node"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
