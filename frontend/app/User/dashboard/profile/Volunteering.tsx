import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Calendar, CheckCircle, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

interface VolunteeringProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: any;
}

export default function AddVolunteer({ isOpen, onClose, onSubmit, initialData }: VolunteeringProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    cause: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        organization: initialData.organization || "",
        role: initialData.role || "",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        isOngoing: initialData.isOngoing || false,
        cause: initialData.cause || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        isOngoing: false,
        cause: "",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressPercent = ((step + 1) / 3) * 100;

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, boolean> = {};
    if (currentStep === 0) {
      if (!formData.organization.trim()) newErrors.organization = true;
      if (!formData.role.trim()) newErrors.role = true;
    } else if (currentStep === 1) {
      if (!formData.startDate) newErrors.startDate = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(step)) {
      if (step < 2) setStep(prev => prev + 1);
      else {
        try {
          // Sanitize data before sending to backend
          const sanitizedData = {
            ...formData,
            startDate: formData.startDate || null,
            endDate: formData.isOngoing ? null : (formData.endDate || null),
          };
          await onSubmit(sanitizedData);
        } catch (error: any) {
          console.error("❌ Update failed:", error);
          if (typeof window !== "undefined") {
            const reason = (error.message || "Could not save volunteering records").toString();
            alert(`Error: ${reason}`);
          }
        }
      }
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

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
            <Heart size={32} className="md:w-[60px] md:h-[60px]" />
          </div>
          <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">Impact Node</h2>
            <p className="text-white/70 text-[9px] md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
              {step === 0 && "Identify your cause."}
              {step === 1 && "Sync the timeline."}
              {step === 2 && "Protocol Verified."}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest italic">Social Data</h1>
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">Step {step + 1} of 3</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#C5A059] h-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-[0.3em] ml-2">Organization</label>
                    <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} placeholder="e.g. Global NGO" className={`w-full px-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 transition-all shadow-inner ${errors.organization ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-[0.3em] ml-2">Role / Node Input</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Volunteer Lead" className={`w-full px-6 py-4 bg-[#FDFBF7] border-2 rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 transition-all shadow-inner ${errors.role ? 'border-red-500/50' : 'border-[#F1EDEA] focus:border-[#C5A059]'}`} />
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-[0.3em] ml-2">Initiation</label>
                      <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-[0.3em] ml-2">Conclusion</label>
                      <input type="date" disabled={formData.isOngoing} value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] disabled:opacity-20 shadow-inner" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({ ...formData, isOngoing: !formData.isOngoing })}>
                    <div className={`w-5 h-5 rounded border-2 transition-all ${formData.isOngoing ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[#F1EDEA]'}`}>
                      {formData.isOngoing && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6B5E51]/60">Active Mission</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-[0.3em] ml-2">Impact Description</label>
                    <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your contribution and social impact..." className="w-full px-6 py-4 bg-[#FDFBF7] border-2 border-[#F1EDEA] focus:border-[#C5A059] rounded-2xl outline-none font-bold text-[#3C2A21] placeholder:text-[#6B5E51]/20 resize-none transition-all shadow-inner" />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6 justify-center h-full">
                  <div className="w-24 h-24 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 shadow-inner">
                    <CheckCircle size={48} className="text-[#C5A059]" />
                  </div>
                  <h2 className="text-xl font-black text-[#3C2A21] uppercase tracking-widest italic">Protocol Verified</h2>
                  <p className="text-[#6B5E51]/40 text-[11px] font-black uppercase tracking-[0.2em] max-w-[240px]">Impact data has been synchronized with the social network.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-4">
            {step > 0 && <button onClick={prevStep} className="flex-1 py-4 text-[10px] font-black text-[#6B5E51]/60 border border-[#F1EDEA] rounded-2xl hover:bg-[#FDFBF7] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>}
            <button onClick={nextStep} className="flex-[2] py-4 bg-[#3C2A21] text-white text-[10px] font-black rounded-2xl hover:bg-[#C5A059] transition-all shadow-xl uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              {step === 2 ? 'Incorporate Impact' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}