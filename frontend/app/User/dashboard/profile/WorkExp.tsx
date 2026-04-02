'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, CheckCircle, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';

interface WorkExpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

const COUNTRIES = [
  { name: "India", states: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"] },
  { name: "United States", states: ["California", "New York", "Texas", "Florida"] },
  { name: "United Kingdom", states: ["England", "Scotland", "Wales"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia"] },
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.role || "",
        organization: initialData.organization || "",
        type: initialData.type || "Full-time",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        isOngoing: initialData.isOngoing || false,
        description: initialData.description || "",
        country: initialData.country || "",
        state: initialData.state || "",
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
          });
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
      if (typeof window !== "undefined") {
         console.log("🚀 Finalizing Record...");
         // alert("Dispatching Finalization node...");
      }
      try {
        await onSubmit(formData);
      } catch (error: any) {
        console.error("❌ Update failed:", error);
        if (typeof window !== "undefined") {
          const reason = (error.message || "Could not save experience").toString();
          alert(`Error: ${reason}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-[520px] border border-white/10">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 p-2"><X size={24} /></button>

        <div className="w-full md:w-[40%] bg-green-600 p-12 flex flex-col items-center justify-center text-center text-black">
          <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-white/10"><Briefcase size={80} /></div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-widest">Work History</h2>
          <p className="text-black/70 text-[11px] font-black uppercase tracking-widest">
            {step === 0 && "Enter your job title and company."}
            {step === 1 && "Where was this job located?"}
            {step === 2 && "Enter your start and end dates."}
            {step === 3 && "All details ready for saving."}
          </p>
        </div>

        <div className="flex-1 p-12 flex flex-col text-white">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
               <h1 className="text-xl font-black uppercase tracking-widest">Experience Details</h1>
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Step {step + 1} of 4</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ width: `${((step + 1) / 4) * 100}%` }} className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" /></div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
               {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Designation</label>
                       <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Lead Engineer" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none text-sm font-bold ${errors.role ? 'border-red-500' : 'border-white/5 focus:border-green-500/50'}`} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Organization</label>
                       <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} placeholder="e.g. Google" className={`w-full px-6 py-4 bg-white/5 border-2 rounded-2xl outline-none text-sm font-bold ${errors.organization ? 'border-red-500' : 'border-white/5 focus:border-green-500/50'}`} />
                    </div>
                  </motion.div>
               )}
               {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Location</label>
                    <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-white uppercase text-[10px] tracking-widest">
                       <option value="">Select Region</option>
                       {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </motion.div>
               )}
               {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2"><label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Start</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold" /></div>
                       <div className="space-y-2"><label className="text-[9px] font-black uppercase text-white/30 tracking-widest">End</label><input type="date" disabled={formData.isOngoing} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold disabled:opacity-20" /></div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={formData.isOngoing} onChange={() => setFormData({...formData, isOngoing: !formData.isOngoing})} className="hidden" /><div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isOngoing ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>{formData.isOngoing && <CheckCircle size={14} className="text-black" />}</div><span className="text-[9px] font-black uppercase tracking-widest text-white/40">Ongoing Role</span></label>
                  </motion.div>
               )}
               {step === 3 && (
                  <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                     <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20"><CheckCircle size={40} className="text-green-500" /></div>
                    <h2 className="text-lg font-black uppercase tracking-widest">Ready to Save</h2>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">All details have been added.</p>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
             {step > 0 && <button disabled={isSubmitting} onClick={handleBack} className="flex-1 py-4 text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all">Back</button>}
             <button disabled={isSubmitting} onClick={handleNext} className="flex-[2] py-4 bg-green-500 text-black text-[10px] font-black rounded-2xl hover:bg-green-400 transition-all uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                {isSubmitting ? 'Saving...' : step === 3 ? 'Save Experience' : 'Continue'} <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
