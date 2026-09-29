'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, CheckCircle, ArrowRight, ArrowLeft, MapPin, AlignLeft, AlertCircle } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

interface WorkExpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

const COUNTRIES = [
  { name: "India", states: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat", "Other"] },
  { name: "United States", states: ["California", "New York", "Texas", "Florida", "Other"] },
  { name: "United Kingdom", states: ["England", "Scotland", "Wales", "Other"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia", "Other"] },
  { name: "Other", states: [] }
];

export default function WorkExp({ isOpen, onClose, onSubmit, initialData }: WorkExpProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    organization: "",
    type: "Full-time",
    startDate: "",
    endDate: "",
    isOngoing: false,
    description: "",
    country: "",
    state: "",
    documentUrl: "",
    documentName: ""
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
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

  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split('T')[0];
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.role || "",
        organization: initialData.organization || "",
        type: initialData.type || "Full-time",
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        isOngoing: initialData.isOngoing || false,
        description: initialData.description || "",
        country: initialData.country || "",
        state: initialData.state || "",
        documentUrl: initialData.documentUrl || "",
        documentName: initialData.documentName || ""
      });
    } else {
      setFormData({
        role: "",
        organization: "",
        type: "Full-time",
        startDate: "",
        endDate: "",
        isOngoing: false,
        description: "",
        country: "",
        state: "",
        documentUrl: "",
        documentName: ""
      });
    }
    setErrors({});
    setFormErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, boolean> = {};
    setFormErrorMsg('');

    if (currentStep === 0) {
      if (!formData.role.trim()) newErrors.role = true;
      if (!formData.organization.trim()) newErrors.organization = true;
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please fill in Designation / Role & Organization.');
      }
    } else if (currentStep === 1) {
      if (!formData.country) newErrors.country = true;
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please select a Country / Region.');
      }
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = true;
      if (Object.keys(newErrors).length > 0) {
        setFormErrorMsg('Please select a Start Date.');
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step < 3) {
      if (!validateStep(step)) return;
      setStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const sanitizedData = {
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.isOngoing ? null : (formData.endDate || null),
        };

        await onSubmit(sanitizedData);
        onClose();
      } catch (error: any) {
        console.error("❌ Update failed:", error);
        if (typeof window !== "undefined") {
          alert(`Submission Error: ${error.message}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setFormErrorMsg('');
    setStep(prev => Math.max(prev - 1, 0));
  };

  const selectedCountryData = COUNTRIES.find(c => c.name === formData.country);

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
            <Briefcase size={28} className="sm:w-8 sm:h-8 md:w-[48px] md:h-[48px]" />
          </div>
          <div className="ml-3 sm:ml-4 md:ml-0 md:mt-4 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-sm sm:text-base md:text-xl font-black leading-tight tracking-widest uppercase italic">
              Work History
            </h2>
            <p className="text-white/70 text-[11px] sm:text-[12px] font-bold leading-relaxed uppercase tracking-widest hidden sm:block mt-1">
              {step === 0 && "Identify your role."}
              {step === 1 && "Sync the coordinates."}
              {step === 2 && "Sync the timeline."}
              {step === 3 && "Protocol Verified."}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col min-w-0 relative text-[#3C2A21] overflow-y-auto">
          <div className="mb-4 sm:mb-6 pr-8">
            <div className="flex justify-between items-end mb-2 sm:mb-3">
              <h1 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-widest italic">
                Experience Data
              </h1>
              <span className="text-[11px] sm:text-[12px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                Step {step + 1} of 4
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                className="bg-[#C5A059] h-full shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                      Designation / Role <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        setErrors({ ...errors, role: false });
                        setFormErrorMsg('');
                      }}
                      placeholder="e.g. Senior Architect"
                      className={`w-full px-4 py-3.5 bg-[#FDFBF7] border rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner ${
                        errors.role ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                      Organization <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => {
                        setFormData({ ...formData, organization: e.target.value });
                        setErrors({ ...errors, organization: false });
                        setFormErrorMsg('');
                      }}
                      placeholder="e.g. Global Tech Corp"
                      className={`w-full px-4 py-3.5 bg-[#FDFBF7] border rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner ${
                        errors.organization ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                      Country / Region <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" />
                      <select
                        value={formData.country}
                        onChange={(e) => {
                          setFormData({ ...formData, country: e.target.value, state: "" });
                          setErrors({ ...errors, country: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full pl-10 pr-4 py-3.5 bg-[#FDFBF7] border rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner cursor-pointer ${
                          errors.country ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                        }`}
                      >
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {formData.country && selectedCountryData && selectedCountryData.states.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                        State / Province
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {selectedCountryData.states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                      Description / Impact
                    </label>
                    <div className="relative">
                      <AlignLeft size={16} className="absolute left-4 top-4 text-[#C5A059]" />
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your key responsibilities and achievements..."
                        className="w-full pl-10 pr-4 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-xs text-[#3C2A21] placeholder:text-[#6B5E51]/30 resize-none shadow-inner"
                      />
                    </div>
                  </div>

                  <DocumentUpload
                    label="Experience Certificate / Offer Letter (Optional)"
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

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                        Start Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => {
                          setFormData({ ...formData, startDate: e.target.value });
                          setErrors({ ...errors, startDate: false });
                          setFormErrorMsg('');
                        }}
                        className={`w-full px-4 py-3.5 bg-[#FDFBF7] border rounded-2xl outline-none font-bold text-xs text-[#3C2A21] shadow-inner ${
                          errors.startDate ? 'border-rose-500 bg-rose-50/30' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-[12px] font-black text-[#6B5E51] uppercase tracking-widest ml-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        disabled={formData.isOngoing}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-xs text-[#3C2A21] disabled:opacity-30 shadow-inner"
                      />
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isOngoing: !formData.isOngoing,
                        endDate: !formData.isOngoing ? "" : formData.endDate
                      })
                    }
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                        formData.isOngoing ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[#F1EDEA]'
                      }`}
                    >
                      {formData.isOngoing && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#6B5E51]">
                      Currently working in this role
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 justify-center py-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 shadow-inner text-[#C5A059]">
                    <CheckCircle size={36} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#3C2A21] uppercase tracking-widest italic">
                    Protocol Verified
                  </h2>
                  <div className="p-4 sm:p-5 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl w-full text-left space-y-1">
                    <p className="text-xs sm:text-sm font-black text-[#C5A059] uppercase tracking-widest">
                      {formData.role}
                    </p>
                    <p className="text-xs font-bold text-[#3C2A21]">
                      {formData.organization} • {formData.type}
                    </p>
                    {formData.documentName && (
                      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider pt-2 border-t border-[#F1EDEA] mt-2 flex items-center gap-1">
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
                disabled={isSubmitting}
                onClick={handleBack}
                className="flex-1 py-3 sm:py-3.5 text-xs font-black text-[#6B5E51] border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="flex-[2] py-3 sm:py-3.5 bg-[#3C2A21] text-white text-xs font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Synchronizing...' : step === 3 ? 'Save Experience' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
