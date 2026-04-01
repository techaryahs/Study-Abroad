"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Country, State } from "country-state-city";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, GraduationCap, Globe, 
  Phone, Mail, User, Lock, Calendar, Eye, EyeOff, Sparkles
} from "lucide-react";

// --- Interfaces ---

interface RegisterFormData {
  name: string;
  email: string;
  mobile: string;
  mobilePrefix: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  country: { value: string; label: string } | null;
  state: { value: string; label: string } | null;
  source: string;
  lookUpFor: string[];
  degree: string;
  loanInterest: boolean;
  targetUniv: { value: string; label: string } | null;
  targetTerm: string;
  targetYear: string;
  targetMajor: { value: string; label: string } | null;
}

interface FormErrors {
  [key: string]: string;
}

const Register = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    mobile: "",
    mobilePrefix: "+91",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    country: null,
    state: null,
    source: "",
    lookUpFor: [],
    degree: "Bachelor's Degree",
    loanInterest: false,
    targetUniv: null,
    targetTerm: "",
    targetYear: "2025",
    targetMajor: null,
  });

  const universities = [
    { value: "Harvard University", label: "Harvard University" },
    { value: "Stanford University", label: "Stanford University" },
    { value: "MIT", label: "MIT" },
    { value: "Oxford University", label: "Oxford University" },
    { value: "University of Toronto", label: "University of Toronto" },
  ];

  const majors = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Business Administration (MBA)", label: "Business Administration (MBA)" },
    { value: "Biology", label: "Biology" },
  ];

  const terms = ["Spring", "Fall", "Summer"];
  const years = Array.from({ length: 7 }, (_, i) => (2025 + i).toString());

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!acceptedPolicy) newErrors.policy = "Please accept the policies";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (formData.lookUpFor.includes("Admissions")) {
        setStep(3);
      } else {
        handleRegister();
      }
    } else if (step === 3) {
       handleRegister();
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "mobile") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 12);
      setFormData(prev => ({ ...prev, mobile: numericValue }));
      return;
    }

    if (type === "checkbox" && name === "lookUpFor") {
      const updatedInterests = checked 
        ? [...formData.lookUpFor, value]
        : formData.lookUpFor.filter(item => item !== value);
      setFormData(prev => ({ ...prev, lookUpFor: updatedInterests }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      mobile: `${formData.mobilePrefix}${formData.mobile}`,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      country: formData.country?.label,
      state: formData.state?.label,
      // Additional fields could be sent to a separate profile update endpoint or handled by a more robust register controller
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      alert("✅ OTP sent to your email!");
      router.push(`/auth/VerifyOtp?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl w-full max-w-5xl flex overflow-hidden min-h-[650px] relative z-10"
      >
        {/* Left Side - Visual Content */}
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-gray-900 to-black p-12 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">StudyAbroad</span>
            </div>
            
            <h1 className="text-4xl font-black leading-[1.1] uppercase mb-6 tracking-tight">
              Architect <br />
              Your <span className="text-yellow-500 italic">Future</span>.
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed italic border-l-2 border-yellow-500/30 pl-4">
              Premium academic mentorship for Ivy League and Global Tier-1 excellence.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 shadow-xl" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-yellow-500 bg-yellow-500 flex items-center justify-center text-[10px] font-black text-black shadow-lg shadow-yellow-500/20">
                +2k
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">The Global Choice</p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full -ml-32 -mb-32 blur-[100px]" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[60%] p-8 md:p-12 flex flex-col justify-center bg-gray-900/40 backdrop-blur-md">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Create Account</h2>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Step {step} of {formData.lookUpFor.includes("Admissions") ? 3 : 2}: <span className="text-yellow-500">Personal Details</span></p>
            </div>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                       <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                         <input 
                           type="text" 
                           name="name" 
                           value={formData.name} 
                           onChange={handleChange} 
                           placeholder="Enter your full name" 
                           className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                         />
                       </div>
                       {errors.name && <p className="text-rose-500 text-[11px] mt-1.5 ml-1 font-medium italic opacity-80">{errors.name}</p>}
                    </div>

                    <div className="col-span-2">
                       <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                       <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                         <input 
                           type="email" 
                           name="email" 
                           value={formData.email} 
                           onChange={handleChange} 
                           placeholder="name@university.com" 
                           className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                         />
                       </div>
                       {errors.email && <p className="text-rose-500 text-[11px] mt-1.5 ml-1 font-medium italic opacity-80">{errors.email}</p>}
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        <input 
                          type="date" 
                          name="dob" 
                          value={formData.dob} 
                          onChange={handleChange} 
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all [color-scheme:dark]" 
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select...</option>
                        <option value="Male" className="bg-gray-800">Male</option>
                        <option value="Female" className="bg-gray-800">Female</option>
                        <option value="Other" className="bg-gray-800">Other</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Country</label>
                      <Select
                        options={Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))}
                        onChange={(sel) => setFormData(p => ({ ...p, country: sel, state: null, mobilePrefix: `+${Country.getCountryByCode(sel?.value || '')?.phonecode || '91'}` }))}
                        value={formData.country}
                        placeholder="Search..."
                        styles={{ 
                          control: (base) => ({ 
                            ...base, 
                            borderRadius: '16px', 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '4px'
                          }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          placeholder: (base) => ({ ...base, color: '#4b5563' }),
                          menu: (base) => ({ ...base, backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#EAB308' : 'transparent', color: 'white' })
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">State</label>
                      <Select
                        options={formData.country ? State.getStatesOfCountry(formData.country.value).map(s => ({ value: s.isoCode, label: s.name })) : []}
                        onChange={(sel) => setFormData(p => ({ ...p, state: sel }))}
                        value={formData.state}
                        placeholder="Search..."
                        isDisabled={!formData.country}
                        styles={{ 
                          control: (base) => ({ 
                            ...base, 
                            borderRadius: '16px', 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '4px'
                          }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          placeholder: (base) => ({ ...base, color: '#4b5563' }),
                          menu: (base) => ({ ...base, backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#EAB308' : 'transparent', color: 'white' })
                        }}
                      />
                    </div>

                    <div className="col-span-2">
                       <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
                       <div className="flex gap-2">
                          <div className="w-20 px-4 py-3 bg-white/10 rounded-2xl text-white font-bold flex items-center justify-center border border-white/10">{formData.mobilePrefix}</div>
                          <input 
                            type="text" 
                            name="mobile" 
                            value={formData.mobile} 
                            onChange={handleChange} 
                            placeholder="Mobile" 
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-mono" 
                          />
                       </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" 
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-3 mt-4">
                      <input 
                        type="checkbox" 
                        id="policy" 
                        checked={acceptedPolicy} 
                        onChange={(e) => setAcceptedPolicy(e.target.checked)}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-yellow-500 focus:ring-yellow-500 transition-all cursor-pointer"
                      />
                      <label htmlFor="policy" className="text-xs text-gray-400">
                        I agree to the <span className="text-white font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-white font-bold cursor-pointer hover:underline">Privacy Policy</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xl font-bold text-white mb-6">What you are looking for?</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['Admissions', 'Scholarships', 'Visa', 'Research'].map(item => (
                         <label key={item} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.lookUpFor.includes(item) ? 'bg-yellow-500/10 border-yellow-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                           <input 
                             type="checkbox" 
                             name="lookUpFor" 
                             value={item} 
                             checked={formData.lookUpFor.includes(item)}
                             onChange={handleChange}
                             className="w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500" 
                           />
                           <span className="font-semibold text-sm">{item}</span>
                         </label>
                       ))}
                    </div>
                  </div>

                  {formData.lookUpFor.includes("Admissions") && (
                    <div className="pt-6 border-t border-white/10">
                      <label className="block text-lg font-bold text-white mb-4">Target Degree</label>
                      <div className="grid grid-cols-1 gap-3">
                        {["Bachelor's Degree", "Master's Degree", "Ph.D. Degree"].map(degree => (
                          <label key={degree} className={`flex items-center gap-4 cursor-pointer p-4 rounded-2xl border transition-all ${formData.degree === degree ? 'bg-yellow-500/10 border-yellow-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                            <input 
                              type="radio" 
                              name="degree" 
                              value={degree}
                              checked={formData.degree === degree}
                              onChange={handleChange}
                              className="w-5 h-5 border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500" 
                            />
                            <span className="font-bold text-sm">{degree}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/20 mb-8">
                     <h3 className="text-xl font-bold text-white mb-2">{formData.degree} Preferences</h3>
                     <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Help us personalize your study recommendations.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Target University</label>
                      <Select
                        options={universities}
                        onChange={(sel) => setFormData(p => ({ ...p, targetUniv: sel }))}
                        value={formData.targetUniv}
                        placeholder="Search universities..."
                        styles={{ 
                          control: (base) => ({ ...base, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px' }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          placeholder: (base) => ({ ...base, color: '#4b5563' }),
                          menu: (base) => ({ ...base, backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#EAB308' : 'transparent', color: 'white' })
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Target Term</label>
                        <select 
                          name="targetTerm" 
                          value={formData.targetTerm} 
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none appearance-none"
                        >
                          <option value="" className="bg-gray-800">Select...</option>
                          {terms.map(t => <option key={t} value={t} className="bg-gray-800">{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Year</label>
                        <select 
                          name="targetYear" 
                          value={formData.targetYear} 
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none appearance-none"
                        >
                          {years.map(y => <option key={y} value={y} className="bg-gray-800">{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="mt-12 space-y-6">
              <div className="flex gap-4">
                {step > 1 && (
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-4 px-6 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                )}
                <button 
                  onClick={() => nextStep()}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg shadow-xl shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {step === 3 || (step === 2 && !formData.lookUpFor.includes("Admissions")) ? "Complete Registration" : "Continue"} 
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-500 font-medium">
                  Already have an account? <span onClick={() => router.push('/auth/login')} className="text-yellow-500 font-bold cursor-pointer hover:text-yellow-400 transition-colors">Sign In</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
