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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] max-h-[95vh] border border-[#C5A059]/15 font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-[#6B5E51]/70 hover:text-[#C5A059] z-20 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group">
             <X size={18} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-6 md:p-10 flex flex-row md:flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-0 md:mb-6 p-3 md:p-5 bg-white/10 rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
            <Target size={32} className="md:w-[60px] md:h-[60px]" />
          </div>
          <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">Strategy Node</h2>
            <p className="text-white/70 text-[13px] font-bold md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
              {step === 0 && "Define terminal objective."}
              {step === 1 && "Identify transition node."}
              {step === 2 && "Protocol Verified."}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto md:overflow-hidden">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-sm md:text-xl font-black uppercase tracking-widest italic">Target Params</h1>
              <span className="text-[14px] font-bold font-black text-[#C5A059] uppercase tracking-[0.3em]">Step {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#C5A059] h-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Terminal Objective</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Bachelors', 'Masters', 'PhD'].map((degree) => (
                      <button
                        key={degree}
                        onClick={() => {
                          setFormData({ ...formData, degree });
                          setErrors({ ...errors, degree: false });
                        }}
                        className={`w-full px-6 py-4 rounded-2xl border text-[11px] font-black transition-all text-left flex items-center justify-between uppercase tracking-widest ${formData.degree === degree
                            ? 'border-[#C5A059] bg-[#C5A059]/5 text-[#C5A059]'
                            : 'border-[#F1EDEA] text-[#6B5E51]/70 hover:border-[#C5A059]/20 hover:text-[#3C2A21]'
                          }`}
                      >
                        {degree}
                        {formData.degree === degree && <CheckCircle size={16} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                       <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">University Node</label>
                       <input
                        type="text" placeholder="e.g. Stanford University" value={formData.uniName}
                        onChange={(e) => setFormData({ ...formData, uniName: e.target.value })}
                        className={`w-full px-6 py-4 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-xs text-[#3C2A21] placeholder:text-[#6B5E51]/20 shadow-inner ${errors.uniName ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Specialization</label>
                       <input
                        type="text" placeholder="e.g. Computer Science" value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className={`w-full px-6 py-4 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-xs text-[#3C2A21] placeholder:text-[#6B5E51]/20 shadow-inner ${errors.major ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Term</label>
                         <select
                          value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                          className={`w-full px-6 py-4 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-[#3C2A21] uppercase text-[14px] font-bold tracking-widest shadow-inner appearance-none cursor-pointer ${errors.term ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`}
                         >
                          <option value="">Term</option>
                          <option value="Fall">Fall</option>
                          <option value="Spring">Spring</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Year</label>
                         <select
                          value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className={`w-full px-6 py-4 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-[#3C2A21] uppercase text-[14px] font-bold tracking-widest shadow-inner appearance-none cursor-pointer ${errors.year ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`}
                         >
                          <option value="">Year</option>
                          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                         </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6 justify-center h-full">
                  <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 shadow-inner">
                    <Globe size={40} className="text-[#C5A059]" />
                  </div>
                  <h2 className="text-xl font-black text-[#3C2A21] uppercase tracking-widest italic leading-tight">Timeline Locked</h2>
                  <div className="p-5 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl w-full">
                     <p className="text-[14px] font-bold font-black text-[#C5A059] uppercase tracking-widest">{formData.uniName}</p>
                     <p className="text-[12px] font-bold text-[#3C2A21] mt-1">{formData.major} • {formData.term} {formData.year}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-4">
            {step > 0 && (
              <button onClick={prevStep} className="flex-1 py-4 text-[14px] font-bold font-black text-[#6B5E51]/60 border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>
            )}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#3C2A21] text-white text-[14px] font-bold font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === totalSteps - 1 ? 'Integrate' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
