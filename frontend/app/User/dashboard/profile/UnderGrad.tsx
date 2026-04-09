import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GraduationCap, ArrowRight, ArrowLeft, School } from 'lucide-react';

interface UnderGradModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: any;
}

export const UnderGradModal = ({ isOpen, onClose, onSubmit, initialData }: UnderGradModalProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    uniName: '',
    degreeName: '',
    backlogs: '',
    cgpa: '',
    outOf: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        uniName: initialData.uniName || initialData.university || '',
        degreeName: initialData.degreeName || initialData.major || '',
        backlogs: initialData.backlogs || '',
        cgpa: initialData.cgpa || '',
        outOf: initialData.outOf || '',
      });
    } else {
        setFormData({
            uniName: '',
            degreeName: '',
            backlogs: '',
            cgpa: '',
            outOf: '',
          });
    }
  }, [initialData, isOpen]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: { [key: string]: boolean } = {};
    if (currentStep === 0) {
      if (!formData.uniName.trim()) newErrors.uniName = true;
      if (!formData.degreeName.trim()) newErrors.degreeName = true;
    } else if (currentStep === 1) {
      if (!formData.backlogs.trim()) newErrors.backlogs = true;
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] max-h-[95vh] border border-[#C5A059]/15 font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-[#6B5E51]/40 hover:text-[#C5A059] z-20 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group">
             <X size={18} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-6 md:p-10 flex flex-row md:flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-0 md:mb-6 p-3 md:p-5 bg-white/10 rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
            <GraduationCap size={32} className="md:w-[60px] md:h-[60px]" />
          </div>
          <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">Degree Node</h2>
            <p className="text-white/70 text-[9px] md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
              {step === 0 && "Identify your alma mater."}
              {step === 1 && "Document scholastic standing."}
              {step === 2 && "Protocol Verified."}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto md:overflow-hidden">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-sm md:text-xl font-black uppercase tracking-widest italic">Scholastic Data</h1>
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">Phase {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full overflow-hidden border border-[#F1EDEA]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-[#C5A059]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-[#6B5E51]/60 uppercase ml-1">Academic Institution</label>
                    <div className="relative">
                      <School className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]/40" size={18} />
                      <input
                        type="text"
                        placeholder="e.g., Stanford University"
                        value={formData.uniName}
                        onChange={(e) => {setFormData({ ...formData, uniName: e.target.value }); setErrors({...errors, uniName: false})}}
                        className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 pl-16 pr-8 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.uniName ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-[#6B5E51]/60 uppercase ml-1">Degree Nomenclature</label>
                    <input
                      type="text"
                      placeholder="e.g., B.Tech Computer Science"
                      value={formData.degreeName}
                      onChange={(e) => {setFormData({ ...formData, degreeName: e.target.value }); setErrors({...errors, degreeName: false})}}
                      className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-8 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.degreeName ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black tracking-widest text-[#6B5E51]/60 uppercase ml-1">Active Backlogs</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={formData.backlogs}
                          onChange={(e) => {setFormData({ ...formData, backlogs: e.target.value }); setErrors({...errors, backlogs: false})}}
                          className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-8 text-xs font-bold text-center text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.backlogs ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black tracking-widest text-[#6B5E51]/60 uppercase ml-1">CGPA Metric</label>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={formData.cgpa}
                          onChange={(e) => {setFormData({ ...formData, cgpa: e.target.value }); setErrors({...errors, cgpa: false})}}
                          className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-8 text-xs font-bold text-center text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${errors.cgpa ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-[#6B5E51]/60 uppercase ml-1">Standardized Scale</label>
                      <select
                        value={formData.outOf}
                        onChange={(e) => {setFormData({ ...formData, outOf: e.target.value }); setErrors({...errors, outOf: false})}}
                        className={`w-full bg-[#FDFBF7] border rounded-2xl py-5 px-8 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner appearance-none cursor-pointer ${errors.outOf ? 'border-red-500/50' : 'border-[#F1EDEA]'}`}
                      >
                        <option value="">Select Protocol</option>
                        <option value="4.0">4.0 Scale</option>
                        <option value="10.0">10.0 Scale</option>
                        <option value="100">100 (Percentage)</option>
                      </select>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center h-full space-y-4">
                  <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] shadow-inner mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#3C2A21] uppercase tracking-widest italic leading-tight">Verification Ready</h3>
                  <div className="p-6 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl w-full">
                     <p className="text-[10px] md:text-[11px] font-black text-[#C5A059] uppercase tracking-widest">{formData.uniName}</p>
                     <p className="text-[12px] md:text-[13px] font-bold text-[#3C2A21] mt-1">{formData.degreeName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center gap-4 mt-8">
            {step > 0 && (
              <button onClick={prevStep} className="flex-1 px-4 py-4 rounded-2xl border border-[#F1EDEA] text-[#6B5E51] font-black uppercase text-[10px] tracking-widest hover:bg-[#FDFBF7] transition-all">
                Reverse
              </button>
            )}
            <button onClick={nextStep} className="flex-[2] bg-[#3C2A21] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#C5A059] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
              {step === 2 ? 'Initialize Submission' : 'Proceed'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
