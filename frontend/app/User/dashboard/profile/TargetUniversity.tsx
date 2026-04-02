"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TargetUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const DegreeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
);

const UniversityIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M3 21h18"></path>
    <path d="M10 21V8l8 5v8"></path>
    <path d="M4 21V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16"></path>
  </svg>
);

const DoneIcon = () => (
  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  </div>
);

export const TargetUniversityModal: React.FC<TargetUniversityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    degree: '',
    university: '',
    major: '',
    term: '',
    year: ''
  });

  const [errors, setErrors] = useState({
    degree: false,
    university: false,
    major: false,
    term: false,
    year: false
  });

  const validateStep = () => {
    if (step === 0) {
      if (!formData.degree) {
        setErrors({ ...errors, degree: true });
        return false;
      }
    } else if (step === 1) {
      const newErrors = {
        ...errors,
        university: !formData.university,
        major: !formData.major,
        term: !formData.term,
        year: !formData.year
      };
      setErrors(newErrors);
      if (Object.values(newErrors).some(v => v === true)) return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === totalSteps - 1) {
        onSubmit();
      } else {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[460px]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Left Side Panel */}
        <div className="w-full md:w-[38%] bg-[#6a5acd] p-8 flex flex-col items-center justify-center text-center text-white relative">
             <div className="mb-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm animate-float">
                {step === 0 ? <DegreeIcon /> : <UniversityIcon />}
             </div>
             <h2 className="text-xl font-extrabold mb-2 leading-tight tracking-tight">Target University</h2>
             <p className="text-white/90 text-sm max-w-[200px] font-medium leading-relaxed">
               {step === 0 && "Select the degree level you are aiming for."}
               {step === 1 && "Which institution and major are your primary targets?"}
               {step === 2 && "Great choice! This will help us tailor recommendations."}
             </p>
        </div>

        {/* Right Side Panel / Form */}
        <div className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="mb-4">
            <h1 className="text-lg font-bold text-gray-800 mb-2">Target University</h1>
            <div className="relative pt-1">
              <div className="flex mb-2 items-end justify-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                {step} of 2 completed
              </div>
              <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#5bbd7b] transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="step1" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-3"
                >
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Select Your Degree</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Bachelors', 'Masters', 'PhD'].map((degree) => (
                      <button
                        key={degree}
                        onClick={() => {
                          setFormData({ ...formData, degree });
                          setErrors({ ...errors, degree: false });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all text-left flex items-center justify-between ${
                          formData.degree === degree 
                            ? 'border-[#5bbd7b] bg-green-50 text-[#5bbd7b]' 
                            : 'border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {degree}
                        {formData.degree === degree && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.degree && <p className="text-red-500 text-xs text-left ml-2 animate-pulse">*required</p>}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div 
                  key="step2" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="Target University Name" 
                        value={formData.university}
                        onChange={(e) => {
                          setFormData({ ...formData, university: e.target.value });
                          if (errors.university) setErrors({ ...errors, university: false });
                        }}
                        list="universities"
                        className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl transition-all outline-none font-medium text-gray-800 placeholder:text-gray-300 ${errors.university ? 'border-red-400' : 'border-gray-200 focus:border-[#5bbd7b]'}`}
                      />
                      <datalist id="universities">
                        <option value="Harvard University" />
                        <option value="MIT" />
                        <option value="Oxford University" />
                        <option value="Stanford University" />
                      </datalist>
                      {errors.university && <p className="text-red-500 text-[10px] text-left ml-2">*required</p>}
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="Select Your Interested Major" 
                        value={formData.major}
                        onChange={(e) => {
                          setFormData({ ...formData, major: e.target.value });
                          if (errors.major) setErrors({ ...errors, major: false });
                        }}
                        list="majors"
                        className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl transition-all outline-none font-medium text-gray-800 placeholder:text-gray-300 ${errors.major ? 'border-red-400' : 'border-gray-200 focus:border-[#5bbd7b]'}`}
                      />
                      <datalist id="majors">
                        <option value="Computer Science" />
                        <option value="Business Administration" />
                        <option value="Mechanical Engineering" />
                      </datalist>
                      {errors.major && <p className="text-red-500 text-[10px] text-left ml-2">*required</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 relative">
                        <select
                          value={formData.term}
                          onChange={(e) => {
                            setFormData({ ...formData, term: e.target.value });
                            if (errors.term) setErrors({ ...errors, term: false });
                          }}
                          className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl appearance-none outline-none font-medium bg-white text-gray-800 ${errors.term ? 'border-red-400' : 'border-gray-200 focus:border-[#5bbd7b]'}`}
                        >
                          <option value="">Interested Term</option>
                          <option value="Fall">Fall</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        {errors.term && <p className="text-red-500 text-[10px] text-left ml-2">*required</p>}
                      </div>

                      <div className="space-y-1 relative">
                        <select
                          value={formData.year}
                          onChange={(e) => {
                            setFormData({ ...formData, year: e.target.value });
                            if (errors.year) setErrors({ ...errors, year: false });
                          }}
                          className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl appearance-none outline-none font-medium bg-white text-gray-800 ${errors.year ? 'border-red-400' : 'border-gray-200 focus:border-[#5bbd7b]'}`}
                        >
                          <option value="">Interested Year</option>
                          {[...Array(6)].map((_, i) => {
                            const y = new Date().getFullYear() + i;
                            return <option key={y} value={y}>{y}</option>;
                          })}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        {errors.year && <p className="text-red-500 text-[10px] text-left ml-2">*required</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step3" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }} 
                  className="flex flex-col items-center text-center justify-center h-full pb-4"
                >
                   <DoneIcon />
                   <h2 className="text-lg font-bold text-gray-800 mb-1">Ready to Go</h2>
                   <p className="text-gray-500 text-[13px] font-medium px-4 leading-relaxed">Your target is set. Click submit to save your preferences.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-4 flex gap-4 justify-end">
            {step > 0 && (
              <button onClick={prevStep} className="px-6 py-2.5 text-xs font-bold text-gray-400 border-2 border-gray-100 rounded-lg hover:bg-gray-50 transition-all uppercase tracking-widest">
                Previous
              </button>
            )}
            <button 
              onClick={nextStep}
              className="px-10 py-3.5 bg-[#5bbd7b] text-white text-sm font-extrabold rounded-xl hover:bg-[#4ea96a] transition-all shadow-lg uppercase tracking-widest transform active:scale-95"
            >
              {step === totalSteps - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-gray-50">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-inner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Goal Set!</h2>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">Your target university details have been successfully captured.</p>
        <button onClick={onClose} className="w-full py-4 bg-[#5bbd7b] hover:bg-[#4ea96a] text-white rounded-2xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95">Great!</button>
      </motion.div>
    </div>
  );
};
