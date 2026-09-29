import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GraduationCap, ArrowRight, ArrowLeft, School, AlertCircle } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

interface MastersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: any;
}

export const MastersModal = ({ isOpen, onClose, onSubmit, initialData }: MastersModalProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    uniName: '',
    degreeName: '',
    backlogs: '',
    cgpa: '',
    outOf: '',
    documentUrl: '',
    documentName: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [formErrorMsg, setFormErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        uniName: initialData.uniName || initialData.university || '',
        degreeName: initialData.degreeName || initialData.major || '',
        backlogs: initialData.backlogs || '',
        cgpa: initialData.cgpa || '',
        outOf: initialData.outOf || '',
        documentUrl: initialData.documentUrl || '',
        documentName: initialData.documentName || ''
      });
    } else {
      setFormData({
        uniName: '',
        degreeName: '',
        backlogs: '',
        cgpa: '',
        outOf: '',
        documentUrl: '',
        documentName: ''
      });
    }
    setErrors({});
    setFormErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: { [key: string]: boolean } = {};
    setFormErrorMsg('');

    if (currentStep === 0) {
      if (!formData.uniName.trim()) newErrors.uniName = true;
      if (!formData.degreeName.trim()) newErrors.degreeName = true;
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please fill in Institution & Master Degree Name.');
      }
    } else if (currentStep === 1) {
      if (!formData.cgpa.trim()) newErrors.cgpa = true;
      if (!formData.outOf) newErrors.outOf = true;
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please fill in CGPA Metric & Standardized Scale.');
      }
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
    setFormErrorMsg('');
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#3C2A21]/50 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] my-auto border border-[#C5A059]/15 font-sans z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-[#6B5E51]/70 hover:text-[#C5A059] z-30 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group shadow-sm"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left Banner */}
        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-4 sm:p-6 md:p-8 flex flex-row md:flex-col items-center justify-center text-center text-white relative shrink-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
            <GraduationCap size={28} className="sm:w-8 sm:h-8 md:w-[48px] md:h-[48px]" />
          </div>
          <div className="ml-3 sm:ml-4 md:ml-0 md:mt-4 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-sm sm:text-base md:text-xl font-black leading-tight tracking-widest uppercase italic">
              Master Node
            </h2>
            <p className="text-white/70 text-[11px] sm:text-[12px] font-bold leading-relaxed uppercase tracking-widest hidden sm:block mt-1">
              {step === 0 && "Identify your institution."}
              {step === 1 && "Document scholastic standing."}
              {step === 2 && "Protocol Verified."}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col min-w-0 relative text-[#3C2A21] overflow-y-auto">
          <div className="mb-4 sm:mb-6 pr-8">
            <div className="flex justify-between items-end mb-2 sm:mb-3">
              <h1 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-widest italic">
                Postgraduate Data
              </h1>
              <span className="text-[11px] sm:text-[12px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                Phase {step + 1} of 3
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full overflow-hidden border border-[#F1EDEA]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-[#C5A059]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#6B5E51] uppercase ml-1">
                      Academic Institution <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]/50" size={18} />
                      <input
                        type="text"
                        placeholder="e.g., MIT"
                        value={formData.uniName}
                        onChange={(e) => {
                          setFormData({ ...formData, uniName: e.target.value });
                          setErrors({ ...errors, uniName: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full bg-[#FDFBF7] border rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${
                          errors.uniName ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#6B5E51] uppercase ml-1">
                      Degree / Specialization <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., M.S. Data Science"
                      value={formData.degreeName}
                      onChange={(e) => {
                        setFormData({ ...formData, degreeName: e.target.value });
                        setErrors({ ...errors, degreeName: false });
                        setFormErrorMsg('');
                      }}
                      className={`w-full bg-[#FDFBF7] border rounded-2xl py-3.5 px-4 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${
                        errors.degreeName ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA]'
                      }`}
                    />
                  </div>

                  <DocumentUpload
                    label="Master's Degree / Transcript (Optional)"
                    documentUrl={formData.documentUrl}
                    documentName={formData.documentName}
                    onDocumentChange={(doc) => {
                      setFormData({
                        ...formData,
                        documentUrl: doc?.documentUrl || '',
                        documentName: doc?.documentName || ''
                      });
                    }}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#6B5E51] uppercase ml-1">
                        Active Backlogs (Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.backlogs}
                        onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                        className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl py-3.5 px-4 text-xs font-bold text-center text-[#3C2A21] focus:border-[#C5A059] outline-none shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#6B5E51] uppercase ml-1">
                        CGPA Metric <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="0.00"
                        value={formData.cgpa}
                        onChange={(e) => {
                          setFormData({ ...formData, cgpa: e.target.value });
                          setErrors({ ...errors, cgpa: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full bg-[#FDFBF7] border rounded-2xl py-3.5 px-4 text-xs font-bold text-center text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner ${
                          errors.cgpa ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black tracking-widest text-[#6B5E51] uppercase ml-1">
                      Standardized Scale <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.outOf}
                      onChange={(e) => {
                        setFormData({ ...formData, outOf: e.target.value });
                        setErrors({ ...errors, outOf: false });
                        setFormErrorMsg('');
                      }}
                      className={`w-full bg-[#FDFBF7] border rounded-2xl py-3.5 px-4 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner cursor-pointer ${
                        errors.outOf ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA]'
                      }`}
                    >
                      <option value="">Select Protocol Scale</option>
                      <option value="4.0">4.0 Scale</option>
                      <option value="10.0">10.0 Scale</option>
                      <option value="100">100 (Percentage)</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-4 space-y-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] shadow-inner">
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#3C2A21] uppercase tracking-widest italic leading-tight">
                    Verification Ready
                  </h3>
                  <div className="p-4 sm:p-5 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl w-full text-left space-y-1">
                    <p className="text-xs sm:text-sm font-black text-[#C5A059] uppercase tracking-widest">
                      {formData.uniName}
                    </p>
                    <p className="text-xs font-bold text-[#3C2A21]">
                      {formData.degreeName} {formData.cgpa ? `• ${formData.cgpa}/${formData.outOf}` : ''}
                    </p>
                    {formData.documentName && (
                      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider pt-1 border-t border-[#F1EDEA] mt-2 flex items-center gap-1">
                        <CheckCircle size={14} /> Document Attached: {formData.documentName}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {formErrorMsg && (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mt-3 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formErrorMsg}</span>
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-3 border-t border-[#F1EDEA] flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 sm:py-3.5 text-xs font-black text-[#6B5E51] border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-widest"
              >
                Reverse
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="flex-[2] py-3 sm:py-3.5 bg-[#3C2A21] text-white text-xs font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
            >
              {step === 2 ? 'Initialize Submission' : 'Proceed'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
