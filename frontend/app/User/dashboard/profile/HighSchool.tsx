'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, School, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

// Success Modal Component
export const SuccessModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md"
    />
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative bg-[#0a0a0a] p-12 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-[#d4af37]/20"
    >
      <div className="w-20 h-20 bg-[#c9a84c]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#c9a84c]/30">
        <CheckCircle size={40} className="text-[#c9a84c]" />
      </div>
      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">Success</h3>
      <p className="text-white/40 text-sm font-bold mb-10 leading-relaxed uppercase tracking-widest">Your school details have been saved.</p>
      <button
        onClick={onClose}
        className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#d4a843] transition-all shadow-lg active:scale-95"
      >
        Dismiss
      </button>
    </motion.div>
  </div>
);

interface HighSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const HighSchoolModal = ({ isOpen, onClose, onSubmit, initialData }: HighSchoolModalProps) => {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [formData, setFormData] = useState({
    schoolName: '',
    cgpa: '',
    outOf: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        schoolName: initialData.schoolName || '',
        cgpa: initialData.cgpa || '',
        outOf: initialData.outOf || '',
      });
    } else {
      setFormData({
        schoolName: '',
        cgpa: '',
        outOf: '',
      });
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = (step / 2) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: { [key: string]: boolean } = {};
    if (currentStep === 0) {
      if (!formData.schoolName.trim()) newErrors.schoolName = true;
    } else if (currentStep === 1) {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-[#d4af37]/20"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left Side Panel */}
        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#c9a84c] to-[#a68a3d] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <motion.div
            key={step}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-[#d4af37]/20 shadow-2xl relative z-10"
          >
            {step < 2 ? <School size={80} className="text-[#0a0a0a]" /> : <CheckCircle size={80} className="text-[#0a0a0a]" />}
          </motion.div>
          <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest text-[#0a0a0a] uppercase relative z-10">Add High School</h2>
          <p className="text-[#0a0a0a]/70 text-[12px] max-w-[220px] font-black leading-relaxed uppercase tracking-widest relative z-10">
            {step === 0 && "Which school did you attend?"}
            {step === 1 && "Enter your marks or CGPA."}
            {step === 2 && "Information ready to be saved."}
          </p>
        </div>

        {/* Right Side Panel / Form */}
        <div className="flex-1 p-12 flex flex-col relative">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black text-white uppercase tracking-widest">Education Info</h1>
              <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-[0.3em]">
                Phase {step + 1} of 3
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="bg-[#c9a84c] h-full shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Institution Name</label>
                    <input
                      type="text" placeholder="e.g. St. Xavier's International" value={formData.schoolName}
                      onChange={(e) => {
                        setFormData({ ...formData, schoolName: e.target.value });
                        if (errors.schoolName) setErrors({ ...errors, schoolName: false });
                      }}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.schoolName ? 'border-red-500/50' : 'border-white/5 focus:border-[#c9a84c]/50'}`}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Performance Score</label>
                    <input
                      type="text" placeholder="CGPA Or Percentage" value={formData.cgpa}
                      maxLength={5}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        setFormData({ ...formData, cgpa: val });
                        if (errors.cgpa) setErrors({ ...errors, cgpa: false });
                      }}
                      className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10 ${errors.cgpa ? 'border-red-500/50' : 'border-white/5 focus:border-[#c9a84c]/50'}`}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Scale Range</label>
                    <div className="relative">
                      <select
                        value={formData.outOf} onChange={(e) => {
                          setFormData({ ...formData, outOf: e.target.value });
                          if (errors.outOf) setErrors({ ...errors, outOf: false });
                        }}
                        className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl appearance-none outline-none font-bold text-white ${errors.outOf ? 'border-red-500/50' : 'border-white/5 focus:border-[#c9a84c]/50'}`}
                      >
                        <option value="" className="bg-[#0a0a0a]">Select Scale</option>
                        {[4, 5, 7, 8, 10, 20, 100].map(v => <option key={v} value={v} className="bg-[#0a0a0a]">{v}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a84c]">
                        <ArrowRight size={20} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-[#c9a84c]/10 rounded-full flex items-center justify-center border border-[#c9a84c]/20">
                    <GraduationCap size={48} className="text-[#c9a84c]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Ready to Save</h2>
                    <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Confirm your details to add them to your profile.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 py-4 text-[10px] font-black text-white/50 border border-[#d4af37]/20 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-[2] py-4 bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#d4a843] transition-all shadow-[0_0_30px_rgba(201,168,76,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2"
            >
              {step === totalSteps - 1 ? 'Submit' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
