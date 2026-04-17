'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, CheckCircle, ArrowRight, ArrowLeft, Calendar, MapPin, AlignLeft } from 'lucide-react';

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
  });

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
      });
    } else if (isOpen) {
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
          });
          setStep(0);
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, boolean> = {};
    if (currentStep === 0) {
      if (!formData.role.trim()) newErrors.role = true;
      if (!formData.organization.trim()) newErrors.organization = true;
    } else if (currentStep === 1) {
      if (!formData.country) newErrors.country = true;
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = true;
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
        // Sanitize data before sending to backend
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

  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  const selectedCountryData = COUNTRIES.find(c => c.name === formData.country);

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
                <Briefcase size={32} className="md:w-[60px] md:h-[60px]" />
             </div>
             <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
                <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">Work History</h2>
                <p className="text-white/70 text-[13px] font-bold md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
                  {step === 0 && "Identify your role."}
                  {step === 1 && "Sync the coordinates."}
                  {step === 2 && "Sync the timeline."}
                  {step === 3 && "Protocol Verified."}
                </p>
             </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest italic">Experience Data</h1>
              <span className="text-[14px] font-bold font-black text-[#C5A059] uppercase tracking-[0.3em]">Step {step + 1} of 4</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${((step + 1) / 4) * 100}%` }} className="bg-[#C5A059] h-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Designation / Role</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Senior Architect" className={`w-full px-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 transition-all shadow-inner ${errors.role ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Organization</label>
                    <input type="text" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} placeholder="e.g. Global Tech Corp" className={`w-full px-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 transition-all shadow-inner ${errors.organization ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Job Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] shadow-inner appearance-none cursor-pointer">
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
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Country / Region</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]" />
                        <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, state: ""})} className={`w-full pl-14 pr-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] shadow-inner appearance-none cursor-pointer ${errors.country ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`}>
                            <option value="">Select Country</option>
                            {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                  </div>
                  {formData.country && selectedCountryData && selectedCountryData.states.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">State / Province</label>
                        <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] shadow-inner appearance-none cursor-pointer">
                            <option value="">Select State</option>
                            {selectedCountryData.states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Description / Impact</label>
                    <div className="relative">
                        <AlignLeft size={16} className="absolute left-6 top-6 text-[#C5A059]" />
                        <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe your key responsibilities and achievements..." className="w-full pl-14 pr-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 resize-none shadow-inner" />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">Start Date</label>
                       <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className={`w-full px-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] shadow-inner ${errors.startDate ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`} />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[14px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-[0.3em] ml-2">End Date</label>
                       <input type="date" disabled={formData.isOngoing} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] disabled:opacity-20 shadow-inner" />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, isOngoing: !formData.isOngoing, endDate: !formData.isOngoing ? "" : formData.endDate })}>
                     <div className={`w-5 h-5 rounded border-2 transition-all ${formData.isOngoing ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[#F1EDEA]'}`}>
                        {formData.isOngoing && <CheckCircle size={16} className="text-white" />}
                     </div>
                     <span className="text-[14px] font-bold font-black uppercase tracking-widest text-[#6B5E51]/60">Currently working in this role</span>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6 justify-center h-full">
                   <div className="w-24 h-24 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 shadow-inner">
                      <CheckCircle size={48} className="text-[#C5A059]" />
                   </div>
                   <h2 className="text-xl font-black text-[#3C2A21] uppercase tracking-widest italic">Protocol Verified</h2>
                   <p className="text-[#6B5E51]/70 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Work experience has been synchronized and validated by the platform node.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-4">
            {step > 0 && <button disabled={isSubmitting} onClick={handleBack} className="flex-1 py-4 text-[14px] font-bold font-black text-[#6B5E51]/60 border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>}
            <button disabled={isSubmitting} onClick={handleNext} className="flex-[2] py-4 bg-[#3C2A21] text-white text-[14px] font-bold font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {isSubmitting ? 'Synchronizing...' : step === 3 ? 'Save Experience' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
