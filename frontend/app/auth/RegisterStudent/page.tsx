"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Country, State } from "country-state-city";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, GraduationCap, Globe,
  Phone, Mail, User, Lock, Calendar, Eye, EyeOff, Sparkles,
  ShieldCheck, X
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

  // Verification State
  const [verifyModal, setVerifyModal] = useState<{
    show: boolean,
    type: 'email' | 'mobile',
    value: string,
    mode: 'confirm' | 'otp' | 'loading' | 'success' | 'error'
  }>({
    show: false,
    type: 'email',
    value: '',
    mode: 'confirm'
  });

  const [otpValue, setOtpValue] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

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
    { value: "University of Cambridge", label: "University of Cambridge" },
    { value: "ETH Zurich", label: "ETH Zurich" },
    { value: "University of Toronto", label: "University of Toronto" },
    { value: "National University of Singapore", label: "National University of Singapore" },
  ];

  const majors = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Business Administration (MBA)", label: "Business Administration (MBA)" },
    { value: "Biology", label: "Biology" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Psychology", label: "Psychology" },
    { value: "Economics", label: "Economics" },
    { value: "Civil Engineering", label: "Civil Engineering" },
  ];

  const terms = ["Spring", "Fall", "Summer"];
  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());
  
  const customSelectStyles = {
    control: (b: any) => ({ ...b, minHeight: '34px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }),
    singleValue: (b: any) => ({ ...b, color: 'white' }),
    menu: (b: any) => ({ ...b, backgroundColor: '#090909', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', zIndex: 50 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#c9a84c' : state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      color: state.isSelected ? 'black' : 'white',
      cursor: 'pointer',
      ":active": { backgroundColor: '#c9a84c' }
    }),
    input: (base: any) => ({ ...base, color: 'white' }),
    placeholder: (base: any) => ({ ...base, color: 'rgba(255,255,255,0.3)' })
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid";

    if (!formData.dob) {
      newErrors.dob = "Required";
    } else {
      const selectedDate = new Date(formData.dob);
      if (selectedDate > maxDob) {
        newErrors.dob = "Must be at least 10 years old";
      }
    }

    if (!formData.gender) newErrors.gender = "Required";
    if (!formData.country) newErrors.country = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.mobile.trim()) newErrors.mobile = "Required";

    if (!formData.password) newErrors.password = "Required";
    else if (formData.password.length < 6) newErrors.password = "Short";

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mismatch";
    if (!acceptedPolicy) newErrors.policy = "Required";

    if (!isEmailVerified || !isMobileVerified) {
      newErrors.verification = "Please verify both contacts";
    }

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

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 10);
  const maxDobString = maxDob.toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 50) return;
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name as keyof FormErrors];
        return n;
      });
    }

    if (name === "mobile") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 12);
      setFormData(prev => ({ ...prev, mobile: numericValue }));
      setIsMobileVerified(false);
      return;
    }
    if (name === "email") {
      setFormData(prev => ({ ...prev, [name]: value }));
      setIsEmailVerified(false);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleLookUp = (val: string) => {
    setFormData(prev => ({
      ...prev,
      lookUpFor: prev.lookUpFor.includes(val)
        ? prev.lookUpFor.filter(i => i !== val)
        : [...prev.lookUpFor, val]
    }));
  };

  const handleCountryChange = (selected: any) => {
    const countryInfo = Country.getCountryByCode(selected.value);
    setFormData(prev => ({
      ...prev,
      country: selected,
      state: null,
      mobilePrefix: countryInfo ? `+${countryInfo.phonecode}` : "+91"
    }));
    if (errors.country) setErrors(prev => { const n = { ...prev }; delete n.country; return n; });
  };

  const handleStateChange = (selected: any) => {
    setFormData(prev => ({ ...prev, state: selected }));
    if (errors.state) setErrors(prev => { const n = { ...prev }; delete n.state; return n; });
  };

  const handleSendOtp = async () => {
    setVerifyModal(prev => ({ ...prev, mode: 'loading' }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/send-otp-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyModal.value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");
      setVerifyModal(prev => ({ ...prev, mode: 'otp' }));
      setOtpValue("");
    } catch (err: any) {
      alert(err.message);
      setVerifyModal(prev => ({ ...prev, mode: 'confirm' }));
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyModal(prev => ({ ...prev, mode: 'loading' }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyModal.value, otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");
      if (verifyModal.type === 'email') setIsEmailVerified(true);
      else setIsMobileVerified(true);
      setVerifyModal(prev => ({ ...prev, mode: 'success' }));
      setTimeout(() => setVerifyModal(prev => ({ ...prev, show: false })), 1500);
    } catch (err: any) {
      alert(err.message);
      setVerifyModal(prev => ({ ...prev, mode: 'otp' }));
    }
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: `${formData.mobilePrefix}${formData.mobile}`,
        password: formData.password,
        role: "student",
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country?.label,
        state: formData.state?.label,
        profile: {
          source: formData.source,
          lookUpFor: formData.lookUpFor,
          loanInterest: formData.loanInterest,
          goal: {
            degree: formData.degree,
            targetUniv: formData.targetUniv?.label,
            targetMajor: formData.targetMajor?.label,
            targetTerm: formData.targetTerm,
            targetYear: formData.targetYear,
          }
        }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      alert("✅ Account Architected Successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-2 selection:bg-gold-500 selection:text-black font-sans relative overflow-hidden bg-[#090909]">
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-[320px] bg-[#0f1115] rounded-[24px] shadow-2xl p-6 text-center border border-[#d4af37]/20">
              {verifyModal.mode !== 'loading' && (
                <button onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
              )}
              <div className="mb-4 flex justify-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${verifyModal.mode === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-gold-500/10 border-gold-500 text-gold-500'}`}>
                  <ShieldCheck className={`w-6 h-6 ${verifyModal.mode === 'loading' ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              {verifyModal.mode === 'confirm' && (
                <div className="animate-in fade-in">
                  <h3 className="text-lg font-black text-white mb-1">Confirm Identity</h3>
                  <p className="text-gray-500 text-[9px] mb-4 uppercase tracking-widest">Verify ownership for: <span className="text-white block mt-1">{verifyModal.value}</span></p>
                  <button onClick={() => verifyModal.type === 'email' ? handleSendOtp() : (setVerifyModal(p => ({ ...p, show: false })), setIsMobileVerified(true))} className="w-full py-3 bg-gold-500 text-black font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-gold-400">Send Code</button>
                </div>
              )}
              {verifyModal.mode === 'otp' && (
                <div className="animate-in fade-in">
                  <h3 className="text-lg font-black text-white mb-4 tracking-tighter">Enter Code</h3>
                  <input type="text" maxLength={6} value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="w-full text-center text-xl font-black tracking-[0.5em] py-3 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg mb-4 text-gold-500 outline-none focus:border-gold-500" placeholder="000000" />
                  <button onClick={handleVerifyOtp} disabled={otpValue.length !== 6} className="w-full py-3 bg-gold-500 text-black font-black rounded-lg disabled:opacity-50 text-[10px] uppercase tracking-widest">Verify Protocol</button>
                </div>
              )}
              {verifyModal.mode === 'success' && <h3 className="text-xl font-black text-white">Verified!</h3>}
              {verifyModal.mode === 'loading' && <div className="py-6"><div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-[#0f1115]/90 backdrop-blur-3xl border border-[#d4af37]/20 rounded-[24px] shadow-2xl w-full max-w-5xl flex h-[90vh] lg:h-auto max-h-[700px] overflow-hidden relative z-10">
        {/* Left Branding - Slimmer */}
        <div className="hidden lg:flex lg:w-[35%] bg-[#050505] p-8 flex-col justify-between text-white relative border-r border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">StudyAbroad</span>
            </div>
            <h1 className="text-3xl font-black leading-tight uppercase mb-4 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
              Architect <br /> <span className="text-gold-500">Global</span> <br /> Careers.
            </h1>
            <p className="text-gray-500 text-xs leading-relaxed italic border-l-2 border-gold-500/20 pl-3">
              Elite academic mentorship for the Ivy League and beyond.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black" />)}
            </div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">+2k Aspirants</p>
          </div>
        </div>

        {/* Right Form - Compacted */}
        <div className="w-full lg:w-[65%] p-5 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <div className="max-w-[500px] mx-auto w-full">
            <div className="mb-4 flex items-end justify-between border-b border-white/5 pb-2">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Create Account</h2>
                <p className="text-gray-500 text-[8px] font-black uppercase tracking-[2px]">Step {step} of {formData.lookUpFor.includes("Admissions") ? 3 : 2}</p>
              </div>
              <div className="flex gap-1 h-1">
                {[1, 2, (formData.lookUpFor.includes("Admissions") ? 3 : null)].filter(Boolean).map(i => (
                  <div key={i} className={`w-6 rounded-full ${step >= (i as number) ? 'bg-gold-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 group-focus-within:text-gold-500" />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" maxLength={50} className="w-full pl-8 pr-3 py-1.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg text-[11px] text-white focus:border-gold-500 outline-none" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block ml-1">Email</label>
                      <div className="relative">
                        <Mail className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${isEmailVerified ? 'text-green-500' : 'text-gray-500'}`} />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`w-full pl-8 pr-14 py-1.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg text-[11px] text-white outline-none ${isEmailVerified ? 'border-green-500/50' : 'focus:border-gold-500'}`} />
                        {formData.email && !isEmailVerified && (
                          <button onClick={() => setVerifyModal({ show: true, type: 'email', value: formData.email, mode: 'confirm' })} className="absolute right-1 top-1 bottom-1 bg-gold-500 text-black px-2 rounded-md font-black text-[8px] uppercase">Verify</button>
                        )}
                        {isEmailVerified && <ShieldCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-green-500" />}
                      </div>
                    </div>

                    <div className="md:col-span-1 col-span-2 grid grid-cols-2 gap-2">
                       <div>
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">DOB</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} max={maxDobString} className={`w-full px-2 py-1.5 bg-white/[0.03] border rounded-lg text-[10px] text-white focus:border-gold-500 outline-none [color-scheme:dark] ${errors.dob ? 'border-red-500' : 'border-[#d4af37]/20'}`} />
                        {errors.dob && <p className="text-red-500 text-[8px] font-bold mt-1 uppercase tracking-tighter">{errors.dob}</p>}
                       </div>
                       <div>
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-2 py-1.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg text-[10px] text-white focus:border-gold-500 outline-none appearance-none">
                          <option value="" className="bg-black">Select</option>
                          <option value="Male" className="bg-black">Male</option>
                          <option value="Female" className="bg-black">Female</option>
                        </select>
                       </div>
                    </div>

                    <div className="md:col-span-1 col-span-2 grid grid-cols-2 gap-2">
                       <div>
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Country</label>
                        <Select
                          instanceId="country-select"
                          options={Country.getAllCountries().map((c: any) => ({ value: c.isoCode, label: c.name }))}
                          onChange={handleCountryChange} value={formData.country} placeholder="..."
                          styles={customSelectStyles}
                        />
                       </div>
                       <div>
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">State</label>
                        <Select
                          instanceId="state-select"
                          options={formData.country ? State.getStatesOfCountry(formData.country.value).map((s: any) => ({ value: s.isoCode, label: s.name })) : []}
                          onChange={handleStateChange} value={formData.state} placeholder="..." isDisabled={!formData.country}
                          styles={customSelectStyles}
                        />
                       </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Mobile</label>
                      <div className="flex gap-1.5">
                        <div className="w-12 py-1.5 bg-white/5 border border-[#d4af37]/20 rounded-lg text-white font-black text-[10px] text-center">{formData.mobilePrefix}</div>
                        <div className="relative flex-1">
                          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={15} className={`w-full px-3 py-1.5 pr-14 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg text-[11px] text-white outline-none ${isMobileVerified ? 'border-green-500' : 'focus:border-gold-500'}`} />
                          {formData.mobile && !isMobileVerified && (
                            <button onClick={() => setVerifyModal({ show: true, type: 'mobile', value: `${formData.mobilePrefix} ${formData.mobile}`, mode: 'confirm' })} className="absolute right-1 top-1 bottom-1 bg-gold-500 text-black px-2 rounded-md font-black text-[8px] uppercase">Verify</button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Source</label>
                      <select name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-1.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg text-[11px] text-white focus:border-gold-500 outline-none appearance-none">
                        <option value="" className="bg-black">Select Source</option>
                        <option value="Google" className="bg-black">Google</option>
                        <option value="Instagram" className="bg-black">Instagram</option>
                        <option value="LinkedIn" className="bg-black">LinkedIn</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} minLength={6} maxLength={32} className={`w-full px-3 pr-8 py-1.5 bg-white/[0.03] border rounded-lg text-[11px] text-white focus:border-gold-500 outline-none ${errors.password ? 'border-red-500' : 'border-[#d4af37]/20'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600"><Eye className="w-3 h-3" /></button>
                      </div>
                      {errors.password && <p className="text-red-500 text-[8px] font-bold mt-0.5 uppercase tracking-tighter">{errors.password}</p>}
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Confirm</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full px-3 pr-8 py-1.5 bg-white/[0.03] border rounded-lg text-[11px] text-white focus:border-gold-500 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-[#d4af37]/20'}`} />
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-[8px] font-bold mt-0.5 uppercase tracking-tighter">Passwords don't match</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} className="w-3.5 h-3.5 rounded bg-white/5 accent-gold-500" />
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Accept Privacy Policy & Terms</p>
                  </div>

                  <button 
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                      }
                    }} 
                    className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-black rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                  >
                    Proceed to Goals <ChevronRight className="w-3 h-3" />
                  </button>
                  {errors.verification && <p className="text-rose-500 text-[8px] text-center font-black uppercase tracking-tighter">{errors.verification}</p>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Admissions", "Scholarships", "Visa", "Research", "Jobs"].map(item => (
                      <button key={item} onClick={() => toggleLookUp(item)} className={`py-3 px-2 rounded-xl border text-center transition-all ${formData.lookUpFor.includes(item) ? 'bg-gold-500 border-gold-500 text-black' : 'bg-white/[0.03] border-white/5 text-white'}`}>
                        <span className="font-black uppercase tracking-widest text-[9px]">{item}</span>
                      </button>
                    ))}
                  </div>

                  {formData.lookUpFor.includes("Admissions") ? (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Degree of Choice</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Bachelor's", "Master's", "Ph.D."].map(deg => (
                          <button key={deg} onClick={() => setFormData(p => ({ ...p, degree: deg }))} className={`py-3 rounded-xl border transition-all ${formData.degree.includes(deg) ? 'border-gold-500 bg-gold-500/10 text-white' : 'border-white/5 bg-white/[0.02] text-gray-500'}`}>
                            <div className="font-black text-[9px] uppercase">{deg}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    formData.lookUpFor.length > 0 && (
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-gold-500/20 bg-gold-500/5 cursor-pointer">
                        <input type="checkbox" name="loanInterest" checked={formData.loanInterest} onChange={(e) => setFormData(p => ({ ...p, loanInterest: e.target.checked }))} className="w-4 h-4 accent-gold-500" />
                        <div>
                          <div className="font-black text-white text-[10px] uppercase">Educational Loan Interest?</div>
                          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Get exclusive partner rates.</p>
                        </div>
                      </label>
                    )
                  )}

                  <div className="pt-4 flex gap-2">
                    <button onClick={prevStep} className="flex-1 py-3 bg-white/5 text-white font-black rounded-lg text-[9px] uppercase">Back</button>
                    <button onClick={nextStep} className="flex-[2] py-3 bg-gold-500 text-black font-black rounded-lg text-[9px] uppercase shadow-lg">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Target University</label>
                    <Select
                      instanceId="target-univ-select"
                      options={universities} onChange={(s: any) => setFormData(p => ({ ...p, targetUniv: s }))} value={formData.targetUniv} placeholder="Search..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Term</label>
                      <select name="targetTerm" value={formData.targetTerm} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-[11px] text-white outline-none">
                        <option value="" className="bg-black">Select Term</option>
                        {terms.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Year</label>
                      <select name="targetYear" value={formData.targetYear} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-[11px] text-white outline-none">
                        {years.map(y => <option key={y} value={y} className="bg-black">{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Target Major</label>
                    <Select
                      instanceId="target-major-select"
                      options={majors} onChange={(s: any) => setFormData(p => ({ ...p, targetMajor: s }))} value={formData.targetMajor} placeholder="Search Major..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button onClick={prevStep} className="flex-1 py-3 bg-white/5 text-white font-black rounded-lg text-[9px] uppercase">Back</button>
                    <button onClick={handleRegister} disabled={isSubmitting} className="flex-[2] py-3 bg-gold-500 text-black font-black rounded-lg text-[9px] uppercase shadow-lg disabled:opacity-50">
                      {isSubmitting ? "Processing..." : "Finalize Registration"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center border-t border-white/5 pt-3">
              <button onClick={() => router.push("/auth/login")} className="text-[9px] font-black uppercase tracking-[2px] text-gray-600 hover:text-gold-500 transition-colors">Already a Member? Log In</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default Register;