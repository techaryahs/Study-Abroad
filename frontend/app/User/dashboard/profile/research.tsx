'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Calendar, Link as LinkIcon, CheckCircle, ArrowRight, ArrowLeft, Search } from 'lucide-react';

interface ResearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function Research({ isOpen, onClose, onSubmit, initialData }: ResearchProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    date: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        publisher: initialData.publisher || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        url: initialData.url || "",
        description: initialData.description || "",
      });
    } else {
        setFormData({
            title: "",
            publisher: "",
            date: "",
            url: "",
            description: "",
          });
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, boolean> = {};
    if (currentStep === 0) {
      if (!formData.title.trim()) newErrors.title = true;
      if (!formData.publisher.trim()) newErrors.publisher = true;
    } else if (currentStep === 1) {
      if (!formData.date) newErrors.date = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 2) setStep(prev => prev + 1);
      else onSubmit(formData);
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-white/10 font-sans">

        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#607D8B] to-[#455A64] p-12 flex flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
            <FileText size={80} />
          </div>
          <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest uppercase relative z-10">Research Lab</h2>
          <p className="text-white/70 text-[12px] font-black leading-relaxed uppercase tracking-widest relative z-10">
            {step === 0 && "Identify your publication and research node."}
            {step === 1 && "Document the timeline of discovery."}
            {step === 2 && "Protocol Verified. Discovery logged."}
          </p>
        </div>

        <div className="flex-1 p-12 flex flex-col relative text-white">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest text-white">Research Data</h1>
              <span className="text-[10px] font-black text-[#607D8B] uppercase tracking-[0.3em]">Step {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#607D8B] h-full shadow-[0_0_15px_rgba(96,125,139,0.3)]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Publication Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Quantum Neural Networks" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none font-bold text-white placeholder:text-white/10 transition-all ${errors.title ? 'border-red-500/50' : 'border-white/5 focus:border-[#607D8B]/50'}`} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Publisher / Journal</label>
                    <input type="text" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} placeholder="e.g. IEEE Journal" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none font-bold text-white placeholder:text-white/10 transition-all ${errors.publisher ? 'border-red-500/50' : 'border-white/5 focus:border-[#607D8B]/50'}`} />
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Publication Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none font-bold text-white transition-all ${errors.date ? 'border-red-500/50' : 'border-white/5 focus:border-[#607D8B]/50'}`} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Discovery Link (URL)</label>
                    <input type="text" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#607D8B]/50 rounded-2xl outline-none font-bold text-white placeholder:text-white/10" />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-[#607D8B]/10 rounded-full flex items-center justify-center border border-[#607D8B]/20">
                    <CheckCircle size={48} className="text-[#607D8B]" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">Protocol Verified</h2>
                  <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Research data has been synchronized with the discovery network.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {step > 0 && <button onClick={prevStep} className="flex-1 py-4 text-[10px] font-black text-white/40 border border-white/10 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#607D8B] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#455A64] transition-all shadow-[0_0_30px_rgba(96,125,139,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === 2 ? 'Submit' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
