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

  useEffect(() => { setUrl(initialData || ''); }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(url);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h2 className="text-xs font-black text-white uppercase tracking-widest">LinkedIn Profile</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-gray-500 transition-all"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Profile URL</p>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  required
                />
              </div>

              <button disabled={loading} type="submit" className="w-full py-3.5 bg-gold-500 text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-gold-400 transition-all">
                {loading ? "Saving..." : "Save Platform Node"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
