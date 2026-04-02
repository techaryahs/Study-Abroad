'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Target, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

interface TargetUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const TargetUniversityModal: React.FC<TargetUniversityModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    degree: '',
    uniName: '',
    major: '',
    term: '',
    year: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        degree: initialData.degree || '',
        uniName: initialData.uniName || initialData.university || '',
        major: initialData.major || '',
        term: initialData.term || '',
        year: initialData.year || ''
      });
    } else {
        setFormData({
            degree: '',
            uniName: '',
            major: '',
            term: '',
            year: ''
          });
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = () => {
    let newErrors: { [key: string]: boolean } = {};
    if (step === 0) {
      if (!formData.degree) newErrors.degree = true;
    } else if (step === 1) {
      if (!formData.uniName.trim()) newErrors.uniName = true;
      if (!formData.major.trim()) newErrors.major = true;
      if (!formData.term) newErrors.term = true;
      if (!formData.year) newErrors.year = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === totalSteps - 1) onSubmit(formData);
      else setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#6a5acd] to-[#483d8b] p-12 flex flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
            <Target size={80} />
          </div>
          <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest uppercase relative z-10">Target Strategy</h2>
          <p className="text-white/70 text-[12px] max-w-[220px] font-black leading-relaxed uppercase tracking-widest relative z-10">
            {step === 0 && "Select the terminal degree level of your objective."}
            {step === 1 && "Identify the node and timeline for your transition."}
            {step === 2 && "Protocol Verified. Target parameters locked."}
          </p>
        </div>

        <div className="flex-1 p-12 flex flex-col relative">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black text-white uppercase tracking-widest">Target Params</h1>
              <span className="text-[10px] font-black text-[#6a5acd] uppercase tracking-[0.3em]">Phase {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8 }} className="bg-[#6a5acd] h-full shadow-[0_0_15px_rgba(106,90,205,0.3)]" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Terminal Objective</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Bachelors', 'Masters', 'PhD'].map((degree) => (
                      <button
                        key={degree}
                        onClick={() => {
                          setFormData({ ...formData, degree });
                          setErrors({ ...errors, degree: false });
                        }}
                        className={`w-full px-6 py-4 rounded-2xl border-2 text-[11px] font-black transition-all text-left flex items-center justify-between uppercase tracking-widest ${formData.degree === degree
                            ? 'border-[#6a5acd] bg-[#6a5acd]/5 text-[#6a5acd]'
                            : 'border-white/5 text-white/40 hover:border-white/10 hover:text-white/60'
                          }`}
                      >
                        {degree}
                        {formData.degree === degree && <CheckCircle size={18} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text" placeholder="Target University Node" value={formData.uniName}
                      onChange={(e) => setFormData({ ...formData, uniName: e.target.value })}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.uniName ? 'border-red-500/50' : 'border-white/5 focus:border-[#6a5acd]/50'}`}
                    />
                    <input
                      type="text" placeholder="Primary Specialization" value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.major ? 'border-red-500/50' : 'border-white/5 focus:border-[#6a5acd]/50'}`}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white uppercase text-[10px] tracking-widest ${errors.term ? 'border-red-500/50' : 'border-white/5 focus:border-[#6a5acd]/50'}`}
                      >
                        <option value="" className="bg-[#0a0a0a]">Term</option>
                        <option value="Fall" className="bg-[#0a0a0a]">Fall</option>
                        <option value="Spring" className="bg-[#0a0a0a]">Spring</option>
                      </select>
                      <select
                        value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white uppercase text-[10px] tracking-widest ${errors.year ? 'border-red-500/50' : 'border-white/5 focus:border-[#6a5acd]/50'}`}
                      >
                        <option value="" className="bg-[#0a0a0a]">Year</option>
                        {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y} className="bg-[#0a0a0a]">{y}</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-[#6a5acd]/10 rounded-full flex items-center justify-center border border-[#6a5acd]/20">
                    <Globe size={48} className="text-[#6a5acd]" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">Timeline Locked</h2>
                  <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Target parameters have been synchronized for transition planning.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {step > 0 && (
              <button onClick={prevStep} className="flex-1 py-4 text-[10px] font-black text-white/40 border border-white/10 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>
            )}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#6a5acd] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#483d8b] transition-all shadow-[0_0_30px_rgba(106,90,205,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === totalSteps - 1 ? 'Integrate' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
