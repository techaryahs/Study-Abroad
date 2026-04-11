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
      className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md"
    />
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative bg-white p-12 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-[#C5A059]/20"
    >
      <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#C5A059]/30 shadow-inner">
        <CheckCircle size={40} className="text-[#C5A059]" />
      </div>
      <h3 className="text-2xl font-black text-[#3C2A21] mb-4 uppercase tracking-widest">Success</h3>
      <p className="text-[#6B5E51] text-sm font-bold mb-10 leading-relaxed uppercase tracking-widest">Your school details have been saved.</p>
      <button
        onClick={onClose}
        className="w-full bg-[#C5A059] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95"
      >
        Dismiss
      </button>
    </motion.div>
  </div>
);

interface HighSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
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

  const nextStep = async () => {
    if (validateStep(step)) {
      if (step < totalSteps - 1) setStep(step + 1);
      else {
        try {
          await onSubmit(formData);
        } catch (error: any) {
          console.error("❌ Update failed:", error);
          if (typeof window !== "undefined") {
            const reason = (error.message || "Could not save academic records").toString();
            alert(`Error: ${reason}`);
          }
        }
      }
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
        className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] max-h-[95vh] border border-[#C5A059]/15 font-sans"
      >
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-[#6B5E51]/40 hover:text-[#C5A059] z-20 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group">
             <X size={18} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-6 md:p-10 flex flex-row md:flex-col items-center justify-center text-center text-white relative">
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
             <div className="mb-0 md:mb-6 p-3 md:p-5 bg-white/10 rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
                <School size={32} className="md:w-[60px] md:h-[60px]" />
             </div>
             <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
                <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">School Node</h2>
                <p className="text-white/70 text-[9px] md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
                  {step === 0 && "Identify your institution."}
                  {step === 1 && "Sync academic metrics."}
                  {step === 2 && "Protocol Verified."}
                </p>
             </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto md:overflow-hidden">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-black text-[#3C2A21] uppercase tracking-[0.2em] italic">High School Profile</h2>
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">Step {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#C5A059] h-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E51] ml-1">Current School Name</label>
                    <div className={`relative transition-all duration-300 ${errors.schoolName ? 'translate-x-1' : ''}`}>
                      <School className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059]/40" size={18} />
                      <input
                        type="text"
                        placeholder="Enter Institution Name..."
                        value={formData.schoolName}
                        onChange={(e) => { setFormData({ ...formData, schoolName: e.target.value }); setErrors({ ...errors, schoolName: false }); }}
                        className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.schoolName ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E51] ml-1">CGPA / Percentage</label>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={formData.cgpa}
                          onChange={(e) => { setFormData({ ...formData, cgpa: e.target.value }); setErrors({ ...errors, cgpa: false }); }}
                          className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-6 text-xs font-bold text-center text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.cgpa ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E51] ml-1">Out Of / Scale</label>
                        <select
                          value={formData.outOf}
                          onChange={(e) => { setFormData({ ...formData, outOf: e.target.value }); setErrors({ ...errors, outOf: false }); }}
                          className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-6 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner appearance-none cursor-pointer ${errors.outOf ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                        >
                          <option value="">Select Scale</option>
                          <option value="4.0">4.0 Scale</option>
                          <option value="5.0">5.0 Scale</option>
                          <option value="10.0">10.0 Scale</option>
                          <option value="100">100 (Percentage)</option>
                        </select>
                     </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6 justify-center h-full">
                  <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto text-[#C5A059] shadow-inner">
                    <GraduationCap size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#3C2A21] uppercase tracking-wider italic">Verification</h3>
                    <p className="text-[10px] text-[#6B5E51] font-bold uppercase tracking-widest mt-2">{formData.schoolName}</p>
                    <p className="text-[11px] text-[#C5A059] font-black uppercase tracking-widest mt-1">Score: {formData.cgpa} / {formData.outOf}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-8 gap-4">
            {step > 0 && (
              <button onClick={prevStep} className="flex-1 px-8 py-4 rounded-2xl border border-[#F1EDEA] text-[#6B5E51] font-black uppercase text-[10px] tracking-widest hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            
            <button onClick={nextStep} className="flex-[2] bg-[#3C2A21] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#C5A059] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
              {step === 2 ? 'Finalize' : 'Proceed'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
