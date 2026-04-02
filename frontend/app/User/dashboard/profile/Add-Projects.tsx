'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layout, Calendar, Link as LinkIcon, CheckCircle, ArrowRight, ArrowLeft, Rocket } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit }: ProjectFormModalProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    purpose: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    url: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalSteps = 4;
  const progressPercent = ((step + 1) / 4) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, boolean> = {};
    if (currentStep === 0) {
      if (!formData.title.trim()) newErrors.title = true;
      if (!formData.role.trim()) newErrors.role = true;
    } else if (currentStep === 1) {
      if (!formData.startDate) newErrors.startDate = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(prev => prev + 1);
      else onSubmit(formData);
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-[#d4af37]/20 font-sans">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] p-12 flex flex-col items-center justify-center text-center text-white relative">
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
             <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-[#d4af37]/20 shadow-2xl relative z-10">
                <Rocket size={80} />
             </div>
             <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest uppercase relative z-10">Project Lab</h2>
             <p className="text-white/70 text-[12px] font-black leading-relaxed uppercase tracking-widest relative z-10">
               {step === 0 && "Identify your project and functional node."}
               {step === 1 && "Sync the timeline of your innovation."}
               {step === 2 && "Document the technical architecture."}
               {step === 3 && "Protocol Verified. Prototype logged."}
             </p>
        </div>

        <div className="flex-1 p-12 flex flex-col relative text-white">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest text-white">Project Data</h1>
              <span className="text-[10px] font-black text-[#9C27B0] uppercase tracking-[0.3em]">Step {step + 1} of 4</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#9C27B0] h-full shadow-[0_0_15px_rgba(156,39,176,0.3)]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Project Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. AI Vision Engine" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none font-bold text-white placeholder:text-white/10 transition-all ${errors.title ? 'border-red-500/50' : 'border-white/5 focus:border-[#9C27B0]/50'}`} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Role / Node Contribution</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Lead Architect" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none font-bold text-white placeholder:text-white/10 transition-all ${errors.role ? 'border-red-500/50' : 'border-white/5 focus:border-[#9C27B0]/50'}`} />
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Ignition</label>
                       <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#9C27B0]/50 rounded-2xl outline-none font-bold text-white" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Deployment</label>
                       <input type="date" disabled={formData.isOngoing} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#9C27B0]/50 rounded-2xl outline-none font-bold text-white disabled:opacity-20" />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, isOngoing: !formData.isOngoing})}>
                     <div className={`w-5 h-5 rounded border-2 transition-all ${formData.isOngoing ? 'bg-[#9C27B0] border-[#9C27B0]' : 'border-[#d4af37]/20 group-hover:border-white/30'}`}>
                        {formData.isOngoing && <CheckCircle size={16} className="text-[#0a0a0a]" />}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Active Prototyping</span>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Source / Deployment Link</label>
                    <input type="text" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#9C27B0]/50 rounded-2xl outline-none font-bold text-white placeholder:text-white/10" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Architecture Core (Description)</label>
                    <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Explain the technical stack and innovation..." className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#9C27B0]/50 rounded-2xl outline-none font-bold text-white placeholder:text-white/10 resize-none transition-all" />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                   <div className="w-24 h-24 bg-[#9C27B0]/10 rounded-full flex items-center justify-center border border-[#9C27B0]/20">
                      <CheckCircle size={48} className="text-[#9C27B0]" />
                   </div>
                   <h2 className="text-xl font-black text-white uppercase tracking-widest">Protocol Verified</h2>
                   <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Project data has been captured and synchronized with the innovation node.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {step > 0 && <button onClick={prevStep} className="flex-1 py-4 text-[10px] font-black text-white/50 border border-[#d4af37]/20 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#9C27B0] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#7B1FA2] transition-all shadow-[0_0_30px_rgba(156,39,176,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === 3 ? 'Deploy Node' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}