"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const MOCK_CONTRIBUTORS = [
  { id: 1, name: "Soma Roy", avatar: "https://i.pravatar.cc/150?u=soma" },
  { id: 2, name: "Sabrina Maxkamova", avatar: "https://i.pravatar.cc/150?u=sabrina" },
  { id: 3, name: "Sharika Malik", avatar: "https://i.pravatar.cc/150?u=sharika" },
  { id: 4, name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?u=rahul" },
  { id: 5, name: "Anish Gupta", avatar: "https://i.pravatar.cc/150?u=anish" },
];

export default function Research({ isOpen, onClose, onSubmit }: ResearchProps) {
  const [step, setStep] = useState(0); // 0 to 3
  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    date: "",
    url: "",
    description: "",
    contributors: [] as number[],
  });
  
  const [contributorQuery, setContributorQuery] = useState("");
  const [showContributors, setShowContributors] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowContributors(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!formData.title) newErrors.title = "required";
      if (!formData.publisher) newErrors.publisher = "required";
    } else if (currentStep === 1) {
      if (!formData.date) newErrors.date = "required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const filteredContributors = useMemo(() => {
    if (!contributorQuery) return MOCK_CONTRIBUTORS;
    return MOCK_CONTRIBUTORS.filter(c => c.name.toLowerCase().includes(contributorQuery.toLowerCase()));
  }, [contributorQuery]);

  const toggleContributor = (id: number) => {
    setFormData(prev => ({
      ...prev,
      contributors: prev.contributors.includes(id) 
        ? prev.contributors.filter(cid => cid !== id)
        : [...prev.contributors, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-[750px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] font-sans border border-gray-100"
      >
        {/* LEFT PANEL */}
        <div className="w-[33%] bg-[#FFB300] p-8 flex flex-col items-center justify-center text-center gap-6 relative">
          <div className="w-[100px] h-[100px] bg-[#C5E1A5] rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
               <div className="absolute w-[60px] h-[60px] rounded-full border-[8px] border-emerald-400 rotate-45 border-t-red-400 border-r-orange-400" />
               <div className="absolute w-12 h-12 flex items-center justify-center translate-x-2 translate-y-2">
                  <div className="w-8 h-8 rounded-full border-[3px] border-gray-600 bg-white/80" />
                  <div className="absolute w-6 h-[4px] bg-gray-600 rotate-45 translate-x-5 translate-y-5 rounded-full" />
               </div>
            </div>
          </div>

          <div className="z-10">
            <h2 className="text-[24px] font-bold text-white mb-6 tracking-tight leading-tight">
              Add Researches
            </h2>
            <p className="text-white font-medium leading-tight px-2 text-[12px] opacity-100 italic">
              Did you know? Adding research experience boosts your profile to employers and schools both!
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 bg-white flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-[18px] font-bold text-[#424242]">Research Paper</h1>
            <button onClick={onClose} className="text-[#424242] hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-[11px] text-[#9E9E9E] font-medium mb-1 text-right">
            {step} of 3 completed
          </div>

          <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-[#4CAF50]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                  <div className="space-y-1">
                    <input type="text" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Research Paper Title" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.title ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                    {errors.title && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.title}</p>}
                  </div>
                  <div className="space-y-1">
                    <input type="text" value={formData.publisher} onChange={(e) => handleInputChange("publisher", e.target.value)} placeholder="Publication/Publisher Name" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.publisher ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                    {errors.publisher && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.publisher}</p>}
                  </div>
                  <div className="flex justify-end pt-12"><button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] shadow-sm active:scale-95 transition-all">Next</button></div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                  <div className="space-y-2">
                     <p className="text-[#757575] text-[14px] font-bold">Publication Date</p>
                     <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} placeholder="MM/DD/YYYY" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.date ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                     {errors.date && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.date}</p>}
                  </div>
                  
                  <div className="space-y-2 relative" ref={searchRef}>
                    <p className="text-[#757575] text-[14px] font-bold">Add research contributors</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={contributorQuery} 
                        onChange={(e) => { setContributorQuery(e.target.value); setShowContributors(true); }}
                        onFocus={() => setShowContributors(true)}
                        className="w-full border border-[#4CAF50] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none" 
                        placeholder="Search contributors..." 
                      />
                      <AnimatePresence>
                        {showContributors && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-white border border-[#E0E0E0] rounded-md shadow-xl max-h-[300px] overflow-y-auto">
                            {filteredContributors.map(c => (
                              <div key={c.id} onClick={() => { toggleContributor(c.id); setShowContributors(false); setContributorQuery(""); }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0 transition-colors">
                                <img src={c.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={c.name} />
                                <span className="font-bold text-[#424242] text-[15px]">{c.name}</span>
                                {formData.contributors.includes(c.id) && <span className="ml-auto text-emerald-500 font-bold text-sm">✓</span>}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* SELECTED CONTRIBUTORS LIST */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.contributors.map(id => {
                        const c = MOCK_CONTRIBUTORS.find(u => u.id === id);
                        return c ? (
                          <div key={id} className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1 flex items-center gap-2 pr-1.5">
                             <img src={c.avatar} className="w-5 h-5 rounded-full" alt="" />
                             <span className="text-[12px] font-bold text-[#424242]">{c.name}</span>
                             <button onClick={() => toggleContributor(id)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                    <button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] transition-all active:scale-95">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                  <div className="space-y-1">
                    <input type="url" value={formData.url} onChange={(e) => handleInputChange("url", e.target.value)} placeholder="Research Paper URL" className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] focus:border-[#4CAF50]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#424242] font-bold text-[14px]">Add research paper document</p>
                    <div className="flex items-center gap-3">
                      <label className="bg-[#E0E0E0] hover:bg-gray-300 text-[#424242] font-bold text-[13px] px-4 py-2 rounded border border-gray-300 shadow-sm cursor-pointer transition-all active:scale-95">
                        Choose file <input type="file" className="hidden" />
                      </label>
                      <span className="text-[#9E9E9E] text-[13px] italic">No file chosen</span>
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <textarea rows={4} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Description" className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none resize-none transition-all focus:border-[#4CAF50]" />
                    <div className="absolute bottom-3 right-4 text-[12px] text-[#9E9E9E]">{formData.description.length}/3000</div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                    <button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full space-y-6 py-6 text-center">
                  <div className="w-24 h-24 text-[#212121]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18h.01" /><path d="M16 18h.01" /><path d="M8 18h.01" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" />
                      <circle cx="12" cy="14" r="3" className="text-emerald-500" strokeWidth={1.5}/>
                      <path d="m10.5 14 1 1 2-2" className="text-emerald-500" strokeWidth={1.5} />
                    </svg>
                  </div>
                  <div>
                     <h3 className="text-[22px] font-bold text-[#424242] mb-2">All Done</h3>
                     <p className="text-[#9E9E9E] text-[15px]">Click Submit to save details or Previous to edit.</p>
                  </div>
                  <div className="flex justify-between w-full pt-10">
                    <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                    <button onClick={handleSubmit} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all shadow-sm">Submit</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
