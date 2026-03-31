"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkExpProps {
  onClose: () => void;
}

const COUNTRIES = [
  { name: "India", states: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat", "Rajasthan", "Punjab", "West Bengal", "Madhya Pradesh", "Haryana", "Bihar", "Odisha"] },
  { name: "United States", states: ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Massachusetts", "Georgia", "Ohio", "Michigan", "Virginia", "Colorado"] },
  { name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan"] },
  { name: "Australia", states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"] },
  { name: "Germany", states: ["Berlin", "Bavaria", "Hamburg", "Baden-Württemberg", "Hesse"] },
  { name: "France", states: ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Occitanie"] },
  { name: "Singapore", states: ["Central", "North", "North-East", "East", "West"] },
];

export default function WorkExp({ onClose }: WorkExpProps) {
  const [step, setStep] = useState(0); // 0 to 4
  const [formData, setFormData] = useState({
    role: "",
    organization: "",
    type: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    urlInput: "",
    addedUrl: "", 
    description: "",
    country: "",
    state: "",
  });
  
  const [countryQuery, setCountryQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setShowCountrySuggestions(false);
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) setShowStateSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!formData.role) newErrors.role = "required";
      if (!formData.organization) newErrors.organization = "required";
    } else if (currentStep === 1) {
      if (!formData.country) newErrors.country = "required";
      if (!formData.state) newErrors.state = "required";
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const filteredCountries = useMemo(() => {
    if (!countryQuery) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(countryQuery.toLowerCase()));
  }, [countryQuery]);

  const filteredStates = useMemo(() => {
    const currentCountryData = COUNTRIES.find(c => c.name === formData.country);
    if (!currentCountryData) return [];
    if (!stateQuery) return currentCountryData.states;
    return currentCountryData.states.filter(s => s.toLowerCase().includes(stateQuery.toLowerCase()));
  }, [formData.country, stateQuery]);

  const handleAddUrl = () => {
    if (formData.urlInput) {
      setFormData(prev => ({ ...prev, addedUrl: prev.urlInput, urlInput: "" }));
      setIsAddingUrl(false);
    }
  };

  const removeUrl = () => setFormData(prev => ({ ...prev, addedUrl: "" }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="w-[750px] mx-auto bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[520px] relative font-sans animate-in fade-in zoom-in duration-300 border border-gray-100">
      {/* LEFT PANEL */}
      <div className="w-[33%] bg-[#FFB300] p-8 flex flex-col items-center justify-center text-center gap-6 relative">
        <div className="w-[100px] h-[100px] bg-[#C5E1A5] rounded-full flex items-center justify-center shadow-inner relative">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
            <svg className="w-10 h-10 text-[#757575] mt-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
             <div className="w-full h-[1.5px] bg-white translate-y-[-45%] rotate-45"></div>
             <div className="w-full h-[1.5px] bg-white translate-y-[-45%] -rotate-45"></div>
          </div>
        </div>
        <div className="z-10">
          <h2 className="text-[24px] font-bold text-white mb-6 uppercase tracking-tight">Add Work Experience</h2>
          <p className="text-white font-medium leading-tight px-2 text-[12px] opacity-100">Be sure to mention any relevant academic and professional expertise that could help you gain more recognition.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 p-8 bg-white flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-[18px] font-bold text-[#424242]">Work Experience</h1>
          <button onClick={onClose} className="text-[#424242] hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="text-[11px] text-[#9E9E9E] font-medium mb-1 text-right">{step} of 4 completed</div>
        <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mb-8">
          <motion.div className="h-full bg-[#4CAF50]" initial={{ width: 0 }} animate={{ width: `${(step / 4) * 100}%` }} />
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                <div className="space-y-1">
                  <input type="text" value={formData.role} onChange={(e) => handleInputChange("role", e.target.value)} placeholder="Role" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.role ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                  {errors.role && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.role}</p>}
                </div>
                <div className="space-y-1">
                  <input type="text" value={formData.organization} onChange={(e) => handleInputChange("organization", e.target.value)} placeholder="Organization" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.organization ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                  {errors.organization && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.organization}</p>}
                </div>
                <div className="relative group">
                  <select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)} className="w-full bg-white border border-[#4CAF50] rounded-md py-3 px-4 text-[#757575] text-[15px] outline-none appearance-none cursor-pointer">
                    <option value="">Select Employment Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Trainee">Trainee</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#757575]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                </div>
                <div className="flex justify-end pt-8"><button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] shadow-sm active:scale-95 transition-all">Next</button></div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                <p className="text-[#757575] text-[15px] font-medium ml-1">Start Typing to See Suggestions</p>
                <div className="relative space-y-1" ref={countryRef}>
                  <input 
                    type="text" 
                    value={countryQuery || formData.country} 
                    onChange={(e) => { setCountryQuery(e.target.value); setShowCountrySuggestions(true); handleInputChange("country", ""); }}
                    onFocus={() => setShowCountrySuggestions(true)}
                    placeholder="Select Country" 
                    className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none placeholder:text-[#9E9E9E] transition-all ${formData.country ? "border-[#4CAF50]" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} 
                  />
                  <AnimatePresence>
                    {showCountrySuggestions && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-white border border-[#E0E0E0] rounded-md shadow-lg max-h-[180px] overflow-y-auto">
                        {filteredCountries.map(c => (
                          <div key={c.name} onClick={() => { handleInputChange("country", c.name); setCountryQuery(c.name); setShowCountrySuggestions(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#424242] text-[14px] border-b border-gray-50 last:border-0">{c.name}</div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative space-y-1" ref={stateRef}>
                  <input 
                    type="text" 
                    disabled={!formData.country}
                    value={stateQuery || formData.state} 
                    onChange={(e) => { setStateQuery(e.target.value); setShowStateSuggestions(true); handleInputChange("state", ""); }}
                    onFocus={() => setShowStateSuggestions(true)}
                    placeholder="Select State" 
                    className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none placeholder:text-[#9E9E9E] transition-all disabled:opacity-50 ${formData.state ? "border-[#4CAF50]" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} 
                  />
                  {!formData.country && <p className="text-red-500 text-[12px] ml-1 italic">*Please select country first</p>}
                  <AnimatePresence>
                    {showStateSuggestions && formData.country && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-white border border-[#E0E0E0] rounded-md shadow-lg max-h-[180px] overflow-y-auto">
                        {filteredStates.map(s => (
                          <div key={s} onClick={() => { handleInputChange("state", s); setStateQuery(s); setShowStateSuggestions(false); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#424242] text-[14px] border-b border-gray-50 last:border-0">{s}</div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                  <button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all">Next</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-2">
                <div className="space-y-1">
                  <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} placeholder="Start Date" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] ${errors.startDate ? "border-red-500" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                  {errors.startDate && <p className="text-red-500 text-[12px] ml-1 font-medium italic">*{errors.startDate}</p>}
                </div>
                <div className="space-y-1">
                  <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} disabled={formData.isOngoing} value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} placeholder="End Date" className={`w-full border rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] disabled:bg-gray-50 ${formData.isOngoing ? "border-[#E0E0E0]" : "border-[#E0E0E0] focus:border-[#4CAF50]"}`} />
                </div>
                <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => handleInputChange("isOngoing", !formData.isOngoing)}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.isOngoing ? "bg-[#4CAF50] border-[#4CAF50]" : "border-[#E0E0E0]"}`}>
                    {formData.isOngoing && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <span className="text-[#9E9E9E] text-[15px] font-medium">Currently ongoing</span>
                </div>
                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                  <button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all">Next</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 pt-2">
                <p className="text-[#424242] font-bold text-[14px]">Work URLs</p>
                {!formData.addedUrl ? (
                  <div className="space-y-4">
                    {!isAddingUrl ? (
                      <button onClick={() => setIsAddingUrl(true)} className="text-[#2196F3] font-bold text-[14px] flex items-center gap-1 hover:underline">+ Add URL</button>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative group">
                          <label className="absolute left-3 -top-2 px-1 bg-white text-[11px] font-bold uppercase text-[#4CAF50] z-10 transition-colors">URL Link</label>
                          <input type="text" value={formData.urlInput} onChange={(e) => handleInputChange("urlInput", e.target.value)} placeholder="Example: https://www.ymgrad.com" className="w-full border border-[#4CAF50] rounded-md py-3 px-4 text-[#424242] text-[14px] outline-none" autoFocus />
                        </div>
                        <button onClick={handleAddUrl} className="bg-[#FFB300] hover:bg-[#FFA000] text-white px-5 py-2 rounded-md font-bold text-[13px] active:scale-95 transition-all">Add URL</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group animate-in fade-in slide-in-from-top-1">
                    <a href={formData.addedUrl.startsWith('http') ? formData.addedUrl : `https://${formData.addedUrl}`} target="_blank" rel="noopener noreferrer" className="block border border-[#E0E0E0] rounded-md p-4 pr-10 bg-white hover:border-[#4CAF50] transition-colors cursor-pointer">
                      <div className="flex flex-col gap-1">
                         <span className="text-[15px] font-bold text-[#424242] leading-tight truncate">{formData.addedUrl.replace(/^https?:\/\//i, '').split('/')[0]}</span>
                         <span className="text-[12px] text-[#9E9E9E]">Click to visit: {formData.addedUrl.replace(/^https?:\/\//i, '').split('/')[0]}</span>
                      </div>
                    </a>
                    <button onClick={(e) => { e.preventDefault(); removeUrl(); }} className="absolute top-4 right-4 text-[#BDBDBD] hover:text-[#424242] transition-colors z-10"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                )}
                <div className="relative pt-4">
                  <textarea rows={4} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Description" className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none resize-none focus:border-[#4CAF50] transition-all" />
                  <div className="absolute bottom-3 right-4 text-[12px] text-[#9E9E9E]">{formData.description.length}/3000</div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className="bg-[#E0E0E0] text-[#616161] px-10 py-3 rounded-lg font-bold text-[15px] hover:bg-gray-300">Previous</button>
                  <button onClick={nextStep} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all">Next</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full space-y-6 py-6">
                <div className="w-24 h-24 text-[#212121]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><circle cx="12" cy="15" r="3" /><path d="m10 15 1.5 1.5L15 13" /></svg></div>
                <div className="text-center"><h3 className="text-[22px] font-bold text-[#424242] mb-2 tracking-tight">All Done</h3><p className="text-[#9E9E9E] text-[15px] leading-relaxed">Click Submit to save details or Previous to edit.</p></div>
                <div className="flex justify-between w-full pt-12">
                  <button onClick={prevStep} className="bg-[#F5F5F5] text-[#9E9E9E] px-10 py-3 rounded-lg font-bold text-[15px]">Previous</button>
                  <button onClick={handleSubmit} className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-12 py-3 rounded-lg font-bold text-[15px] active:scale-95 transition-all">Submit</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[10px] p-10 max-w-[400px] w-full text-center shadow-2xl">
              <div className="text-[#212121] text-[15px] font-bold mb-8">Your details has been added successfully</div>
              <button onClick={onClose} className="w-[120px] bg-[#FFFF00] hover:bg-[#FFFF33] text-black font-bold py-3 rounded-full transition-all border-[1.5px] border-[#212121] mx-auto block text-[13px] active:scale-95 shadow-sm">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
