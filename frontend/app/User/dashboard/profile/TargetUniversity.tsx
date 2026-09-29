'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Target, ArrowRight, ArrowLeft, Globe, AlertCircle } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

interface TargetUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const TargetUniversityModal: React.FC<TargetUniversityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    degree: '',
    uniName: '',
    major: '',
    targetCountry: '',
    tuitionBudget: '',
    scholarshipRequired: false,
    term: '',
    year: '',
    documentUrl: '',
    documentName: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [formErrorMsg, setFormErrorMsg] = useState('');

  // Lock background scroll when modal is open
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
        degree: initialData.degree || '',
        uniName: initialData.uniName || initialData.university || '',
        major: initialData.major || '',
        targetCountry: initialData.targetCountry || initialData.country || '',
        tuitionBudget: initialData.tuitionBudget || initialData.budget || '',
        scholarshipRequired: initialData.scholarshipRequired || false,
        term: initialData.term || '',
        year: initialData.year || '',
        documentUrl: initialData.documentUrl || '',
        documentName: initialData.documentName || ''
      });
    } else {
      setFormData({
        degree: '',
        uniName: '',
        major: '',
        targetCountry: '',
        tuitionBudget: '',
        scholarshipRequired: false,
        term: '',
        year: '',
        documentUrl: '',
        documentName: ''
      });
    }
    setErrors({});
    setFormErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = () => {
    let newErrors: { [key: string]: boolean } = {};
    setFormErrorMsg('');

    if (step === 0) {
      if (!formData.degree) {
        newErrors.degree = true;
        setFormErrorMsg('Please select a terminal objective degree to continue.');
      }
    } else if (step === 1) {
      if (!formData.uniName || !formData.uniName.trim()) {
        newErrors.uniName = true;
      }
      if (!formData.major || !formData.major.trim()) {
        newErrors.major = true;
      }
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please fill in the required fields (University Node & Specialization).');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === totalSteps - 1) {
        onSubmit(formData);
      } else {
        setStep(step + 1);
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#3C2A21]/50 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] my-auto border border-[#C5A059]/15 font-sans z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-[#6B5E51]/70 hover:text-[#C5A059] z-30 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group shadow-sm"
          aria-label="Close Modal"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left Panel - Strategy Node */}
        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-row md:flex-col items-center justify-center text-center text-white relative shrink-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
            <Target size={28} className="sm:w-8 sm:h-8 md:w-[48px] md:h-[48px]" />
          </div>
          <div className="ml-3 sm:ml-4 md:ml-0 md:mt-4 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-sm sm:text-base md:text-xl font-black leading-tight tracking-widest uppercase italic">
              Strategy Node
            </h2>
            <p className="text-white/70 text-[11px] sm:text-[12px] font-bold leading-relaxed uppercase tracking-widest hidden sm:block mt-1">
              {step === 0 && "Define terminal objective."}
              {step === 1 && "Identify transition node."}
              {step === 2 && "Protocol Verified."}
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col min-w-0 relative text-[#3C2A21] overflow-y-auto">
          {/* Header & Progress */}
          <div className="mb-4 sm:mb-6 pr-8">
            <div className="flex justify-between items-end mb-2 sm:mb-3">
              <h1 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-widest italic">
                Target Params
              </h1>
              <span className="text-[11px] sm:text-[12px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                Step {step + 1} of 3
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="bg-[#C5A059] h-full shadow-sm"
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                    Terminal Objective
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {['Bachelors', 'Masters', 'PhD'].map((degree) => (
                      <button
                        key={degree}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, degree });
                          setErrors({ ...errors, degree: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-xs font-black transition-all text-left flex items-center justify-between uppercase tracking-widest ${
                          formData.degree === degree
                            ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                            : 'border-[#F1EDEA] text-[#6B5E51]/70 hover:border-[#C5A059]/30 hover:text-[#3C2A21] bg-[#FDFBF7]'
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
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                        University Node <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        value={formData.uniName}
                        onChange={(e) => {
                          setFormData({ ...formData, uniName: e.target.value });
                          setErrors({ ...errors, uniName: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-xs text-[#3C2A21] placeholder:text-[#6B5E51]/30 shadow-inner ${
                          errors.uniName ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.uniName && (
                        <p className="text-[10px] text-rose-500 font-bold ml-1">University name is required</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                        Specialization <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={formData.major}
                        onChange={(e) => {
                          setFormData({ ...formData, major: e.target.value });
                          setErrors({ ...errors, major: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#FDFBF7] border rounded-2xl transition-all outline-none font-bold text-xs text-[#3C2A21] placeholder:text-[#6B5E51]/30 shadow-inner ${
                          errors.major ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.major && (
                        <p className="text-[10px] text-rose-500 font-bold ml-1">Specialization is required</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                          Target Country
                        </label>
                        <select
                          value={formData.targetCountry}
                          onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                          className="w-full px-3 sm:px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl transition-all outline-none font-bold text-[#3C2A21] text-xs uppercase tracking-widest shadow-inner cursor-pointer focus:border-[#C5A059]"
                        >
                          <option value="">Select Country</option>
                          <option value="USA">USA</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="Australia">Australia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Ireland">Ireland</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="France">France</option>
                          <option value="Switzerland">Switzerland</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                          Annual Budget
                        </label>
                        <select
                          value={formData.tuitionBudget}
                          onChange={(e) => setFormData({ ...formData, tuitionBudget: e.target.value })}
                          className="w-full px-3 sm:px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl transition-all outline-none font-bold text-[#3C2A21] text-xs uppercase tracking-widest shadow-inner cursor-pointer focus:border-[#C5A059]"
                        >
                          <option value="">Select Budget</option>
                          <option value="Under $15,000">Under $15,000 / yr</option>
                          <option value="$15,000 - $30,000">$15,000 - $30,000 / yr</option>
                          <option value="$30,000 - $50,000">$30,000 - $50,000 / yr</option>
                          <option value="$50,000+">$50,000+ / yr</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                          Term (Optional)
                        </label>
                        <select
                          value={formData.term}
                          onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                          className="w-full px-3 sm:px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl transition-all outline-none font-bold text-[#3C2A21] text-xs uppercase tracking-widest shadow-inner cursor-pointer focus:border-[#C5A059]"
                        >
                          <option value="">Select Term</option>
                          <option value="Fall">Fall</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                          Year (Optional)
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-3 sm:px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl transition-all outline-none font-bold text-[#3C2A21] text-xs uppercase tracking-widest shadow-inner cursor-pointer focus:border-[#C5A059]"
                        >
                          <option value="">Select Year</option>
                          {[2024, 2025, 2026, 2027, 2028].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl">
                      <input
                        type="checkbox"
                        id="scholarshipRequired"
                        checked={formData.scholarshipRequired}
                        onChange={(e) => setFormData({ ...formData, scholarshipRequired: e.target.checked })}
                        className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                      />
                      <label htmlFor="scholarshipRequired" className="text-xs font-bold text-[#3C2A21] cursor-pointer">
                        Scholarship / Financial Aid Required
                      </label>
                    </div>

                    {/* Optional Document Upload Section */}
                    <DocumentUpload
                      label="Academic Transcript / Documents (Optional)"
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
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 justify-center py-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 shadow-inner text-[#C5A059]">
                    <Globe size={36} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#3C2A21] uppercase tracking-widest italic leading-tight">
                    Timeline Locked
                  </h2>
                  <div className="p-4 sm:p-5 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl w-full text-left space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                        {formData.uniName || "Target University"}
                      </p>
                      {formData.targetCountry && (
                        <span className="text-[10px] font-bold bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/20 uppercase">
                          {formData.targetCountry}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#3C2A21]">
                      {formData.degree ? `${formData.degree} in ` : ''}{formData.major} {formData.term ? `• ${formData.term}` : ''} {formData.year || ''}
                    </p>
                    {(formData.tuitionBudget || formData.scholarshipRequired) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {formData.tuitionBudget && <span className="text-[11px] font-semibold text-[#6B5E51]">Budget: {formData.tuitionBudget}</span>}
                        {formData.scholarshipRequired && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Scholarship Required</span>}
                      </div>
                    )}
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

          {/* Inline Error Alert */}
          {formErrorMsg && (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mt-3 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formErrorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 pt-3 border-t border-[#F1EDEA] flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 sm:py-3.5 text-xs font-black text-[#6B5E51] border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="flex-[2] py-3 sm:py-3.5 bg-[#3C2A21] text-white text-xs font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
            >
              {step === totalSteps - 1 ? 'Integrate' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
