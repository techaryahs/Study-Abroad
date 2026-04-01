"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [isOngoing, setIsOngoing] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    purpose: "",
    startDate: "",
    endDate: "",
    url: "",
    description: "",
  });

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.title && formData.role && formData.purpose;
    }
    if (step === 2) {
      return formData.startDate && (isOngoing || formData.endDate);
    }
    if (step === 3) {
      return formData.url && formData.description;
    }
    return true;
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
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
        className="relative w-[750px] bg-white rounded-xl shadow-2xl flex overflow-hidden font-sans"
      >
        {/* LEFT PANEL */}
        <div className="w-1/3 bg-[#FFB300] flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="text-4xl text-white">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Add Projects</h2>
          <p className="text-white/90 text-sm font-medium leading-relaxed italic">
            Include your professional or academic projects to showcase your expertise.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 bg-white flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[18px] font-bold text-[#424242]">Project Details</h3>
            <button onClick={onClose} className="text-[#424242] hover:opacity-70 transition-opacity">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-[11px] text-[#9E9E9E] font-medium mb-1 text-right">
            Step {step} of 4 completed
          </div>

          {/* PROGRESS */}
          <div className="w-full bg-[#EEEEEE] h-[3px] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-[#4CAF50]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 pt-2"
                >
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Project Title *</label>
                    <input
                      name="title"
                      value={formData.title}
                      placeholder="e.g. AI Career Recommender"
                      onChange={handleChange}
                      className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Your Role *</label>
                    <input
                      name="role"
                      value={formData.role}
                      placeholder="e.g. ML Developer"
                      onChange={handleChange}
                      className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Project Purpose *</label>
                    <div className="relative">
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none appearance-none bg-white focus:border-[#4CAF50] transition-all"
                      >
                        <option value="">Select Purpose</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Academic">Academic</option>
                        <option value="Personal">Personal</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#757575]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 pt-2"
                >
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      disabled={isOngoing}
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all focus:border-[#4CAF50] ${isOngoing ? "bg-gray-50 opacity-60" : ""}`}
                    />
                  </div>

                  <div 
                    className="flex items-center gap-3 py-2 cursor-pointer" 
                    onClick={() => setIsOngoing(!isOngoing)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isOngoing ? "bg-[#4CAF50] border-[#4CAF50]" : "border-[#E0E0E0]"}`}>
                      {isOngoing && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-[#757575] text-[15px] font-medium">Currently ongoing</span>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 pt-2"
                >
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Project URL *</label>
                    <input
                      name="url"
                      value={formData.url}
                      placeholder="e.g. projectlink.com"
                      onChange={handleChange}
                      className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none transition-all placeholder:text-[#9E9E9E] focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[13px] font-bold text-[#757575] ml-1">Description *</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      placeholder="Explain your project..."
                      onChange={handleChange}
                      className="w-full border border-[#E0E0E0] rounded-md py-3 px-4 text-[#424242] text-[15px] outline-none resize-none transition-all focus:border-[#4CAF50]"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-6 py-6 text-center"
                >
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
                    <h2 className="text-[22px] font-bold text-[#424242] mb-2">All Done</h2>
                    <p className="text-[#9E9E9E] text-[15px]">Click Submit to save details or Previous to edit.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-8 pt-4">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-10 py-3 rounded-lg font-bold text-[15px] transition-all ${step === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-[#E0E0E0] text-[#616161] hover:bg-gray-300"}`}
            >
              Previous
            </button>
          
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-12 py-3 rounded-lg text-white font-bold text-[15px] transition-all active:scale-95 ${
                  isStepValid()
                    ? "bg-[#1DB954] hover:bg-[#1AA34A] shadow-sm"
                    : "bg-gray-300 cursor-not-allowed text-white/70"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-12 py-3 bg-[#1DB954] hover:bg-[#1AA34A] text-white font-bold text-[15px] rounded-lg shadow-sm transition-all active:scale-95"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}