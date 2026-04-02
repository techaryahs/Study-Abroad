'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GraduationCap, ArrowRight, ArrowLeft, School } from 'lucide-react';

interface UnderGradModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const UnderGradModal = ({ isOpen, onClose, onSubmit }: UnderGradModalProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    university: '',
    major: '',
    backlogs: '',
    cgpa: '',
    outOf: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: { [key: string]: boolean } = {};
    if (currentStep === 0) {
      if (!formData.university.trim()) newErrors.university = true;
      if (!formData.major.trim()) newErrors.major = true;
    } else if (currentStep === 1) {
      if (!formData.backlogs.trim()) newErrors.backlogs = true;
      if (!formData.cgpa.trim()) newErrors.cgpa = true;
      if (!formData.outOf) newErrors.outOf = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < totalSteps - 1) setStep(step + 1);
      else onSubmit(formData);
    }
  };

  const prevStep = () => {
    setErrors({});
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#20C997] to-[#1BA37A] p-12 flex flex-col items-center justify-center text-center text-[#0a0a0a] relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
            <GraduationCap size={80} />
          </div>
          <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest uppercase relative z-10">Undergrad Degree</h2>
          <p className="text-[#0a0a0a]/70 text-[12px] max-w-[220px] font-black leading-relaxed uppercase tracking-widest relative z-10">
            {step === 0 && "Identify your alma mater and specialized field of study."}
            {step === 1 && "Document your scholastic achievements and standing."}
            {step === 2 && "Verification complete. Ready for ecosystem integration."}
          </p>
        </div>

        <div className="flex-1 p-12 flex flex-col relative">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black text-white uppercase tracking-widest">Scholastic Data</h1>
              <span className="text-[10px] font-black text-[#20C997] uppercase tracking-[0.3em]">Phase {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8 }} className="bg-[#20C997] h-full shadow-[0_0_15px_rgba(32,201,151,0.3)]" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">University / College</label>
                    <input
                      type="text" placeholder="e.g. Stanford University" value={formData.university}
                      onChange={(e) => {
                        setFormData({ ...formData, university: e.target.value });
                        if (errors.university) setErrors({ ...errors, university: false });
                      }}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.university ? 'border-red-500/50' : 'border-white/5 focus:border-[#20C997]/50'}`}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Specialization / Major</label>
                    <input
                      type="text" placeholder="e.g. Computer Science" value={formData.major}
                      onChange={(e) => {
                        setFormData({ ...formData, major: e.target.value });
                        if (errors.major) setErrors({ ...errors, major: false });
                      }}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.major ? 'border-red-500/50' : 'border-white/5 focus:border-[#20C997]/50'}`}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Backlogs</label>
                      <input
                        type="text" placeholder="Count" value={formData.backlogs}
                        maxLength={2}
                        onChange={(e) => setFormData({ ...formData, backlogs: e.target.value.replace(/[^0-9]/g, '') })}
                        className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.backlogs ? 'border-red-500/50' : 'border-white/5 focus:border-[#20C997]/50'}`}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Score</label>
                      <input
                        type="text" placeholder="CGPA/ %" value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.cgpa ? 'border-red-500/50' : 'border-white/5 focus:border-[#20C997]/50'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Scale Range</label>
                    <select
                      value={formData.outOf} onChange={(e) => setFormData({ ...formData, outOf: e.target.value })}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl appearance-none outline-none font-bold text-white ${errors.outOf ? 'border-red-400' : 'border-white/5 focus:border-[#20C997]/50'}`}
                    >
                      <option value="" className="bg-[#0a0a0a]">Select Scale</option>
                      {[4, 5, 10, 100].map(v => <option key={v} value={v} className="bg-[#0a0a0a]">{v}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-[#20C997]/10 rounded-full flex items-center justify-center border border-[#20C997]/20">
                    <CheckCircle size={48} className="text-[#20C997]" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">Protocol Verified</h2>
                  <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Integrated data is ready for ecosystem submission.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {step > 0 && (
              <button onClick={prevStep} className="flex-1 py-4 text-[10px] font-black text-white/40 border border-white/10 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>
            )}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#20C997] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#1BA37A] transition-all shadow-[0_0_30px_rgba(32,201,151,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === totalSteps - 1 ? 'Integrate' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
