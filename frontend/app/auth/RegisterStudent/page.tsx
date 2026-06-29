"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    control: (b: any) => ({
      ...b,
      minHeight: '40px',
      borderRadius: '10px',
      backgroundColor: '#FDFBF7',
      border: '1px solid #F1EDEA',
      fontSize: '11px',
      fontWeight: '700',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      '&:hover': { border: '1px solid #C5A059' }
    }),
    singleValue: (b: any) => ({ ...b, color: '#3C2A21' }),
    menu: (b: any) => ({
      ...b,
      backgroundColor: 'white',
      border: '1px solid #F1EDEA',
      fontSize: '11px',
      zIndex: 50,
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#C5A059' : state.isFocused ? '#FDFBF7' : 'transparent',
      color: state.isSelected ? 'white' : '#3C2A21',
      cursor: 'pointer',
      fontWeight: '600'
    }),
    input: (base: any) => ({ ...base, color: '#3C2A21' }),
    placeholder: (base: any) => ({ ...base, color: '#6B5E51', opacity: '0.4' })
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid";

    if (!formData.dob) {
      newErrors.dob = "Required";
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
      newErrors.verification = "Verify both contacts";
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

  const handleSendOtp = async (type: 'email' | 'mobile' = verifyModal.type) => {
    setVerifyModal(prev => ({ ...prev, mode: 'loading', type }));
    try {
      const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== 'undefined') ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:5001';

      const endpoint = type === 'email' ? 'send-otp-signup' : 'send-otp-mobile';
      const payload = type === 'email' ? { email: verifyModal.value } : { mobile: verifyModal.value };

      const response = await fetch(`${BACKEND_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== 'undefined') ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:5001';

      const endpoint = verifyModal.type === 'email' ? 'verify-otp-signup' : 'verify-otp-mobile';
      const payload = verifyModal.type === 'email'
        ? { email: verifyModal.value, otp: otpValue }
        : { mobile: verifyModal.value, otp: otpValue };

      const response = await fetch(`${BACKEND_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== 'undefined') ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:5001';
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      alert("✅ Account Synchronized!");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-[#C5A059] selection:text-white font-sans relative overflow-hidden bg-[#FDFBF7]">
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-[320px] bg-white rounded-[24px] shadow-2xl p-6 text-center border border-[#C5A059]/15">
              {verifyModal.mode !== 'loading' && (
                <button onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="absolute top-4 right-4 text-[#6B5E51]/70 hover:text-[#C5A059]"><X className="w-4 h-4" /></button>
              )}
              <div className="mb-4 flex justify-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${verifyModal.mode === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]'}`}>
                  <ShieldCheck className={`w-6 h-6 ${verifyModal.mode === 'loading' ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              {verifyModal.mode === 'confirm' && (
                <div className="animate-in fade-in">
                  <h3 className="text-lg font-black text-[#3C2A21] mb-1 uppercase tracking-tight italic">Verify Account</h3>
                  <p className="text-[#6B5E51]/70 text-[13px] font-bold mb-6 uppercase tracking-widest leading-relaxed">Identity verification required for: <span className="text-[#3C2A21] block mt-1 lowercase font-bold">{verifyModal.value}</span></p>
                  <button onClick={() => handleSendOtp()} className="w-full py-4 bg-[#C5A059] text-white font-black rounded-xl text-[14px] font-bold uppercase tracking-widest hover:bg-[#3C2A21] shadow-xl shadow-[#C5A059]/20 transition-all">Send Verification Code</button>
                </div>
              )}
              {verifyModal.mode === 'otp' && (
                <div className="animate-in fade-in">
                  <h3 className="text-lg font-black text-[#3C2A21] mb-4 tracking-tighter uppercase italic">Secure Code</h3>
                  <input type="text" maxLength={6} value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="w-full text-center text-xl font-bold tracking-[0.5em] py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl mb-4 text-[#C5A059] outline-none focus:border-[#C5A059] shadow-inner" placeholder="000000" />
                  <button onClick={handleVerifyOtp} disabled={otpValue.length !== 6} className="w-full py-4 bg-[#C5A059] text-white font-black rounded-xl disabled:opacity-50 text-[14px] font-bold uppercase tracking-widest shadow-xl shadow-[#C5A059]/20 transition-all">Verify Code</button>
                </div>
              )}
              {verifyModal.mode === 'success' && <h3 className="text-xl font-black text-[#3C2A21] uppercase tracking-tighter italic">OTP VERIFIED</h3>}
              {verifyModal.mode === 'loading' && <div className="py-6"><div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin mx-auto" /></div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-[#C5A059]/15 rounded-[2rem] md:rounded-[2.5rem] shadow-3xl w-full max-w-5xl flex flex-col lg:flex-row h-auto lg:h-[580px] max-h-[90vh] overflow-hidden relative z-10 mx-auto">
        {/* Left Branding */}
        <div className="hidden lg:flex lg:w-[32%] bg-[#3C2A21] p-10 flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#C5A059] rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">EduLeaderGlobal</span>
            </div>
            <h1 className="text-4xl font-black leading-tight uppercase mb-6 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
              Build <br /> <span className="text-[#C5A059]">Global</span> <br /> Careers.
            </h1>
            <p className="text-white/40 text-[14px] font-bold leading-relaxed uppercase tracking-[0.2em] italic border-l-2 border-[#C5A059]/30 pl-4">
              Elite academic mentorship for the Ivy League and beyond. Start your journey here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#3C2A21] flex items-center justify-center text-[11px] font-black font-bold">U{i}</div>)}
            </div>
            <p className="text-[13px] font-bold font-bold text-white/30 uppercase tracking-[0.2em]">+2k Aspirants</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[68%] p-5 md:p-7 flex flex-col justify-center overflow-y-auto lg:overflow-visible no-scrollbar">
          <div className="max-w-[550px] mx-auto w-full">
            <div className="mb-4 flex items-end justify-between border-b border-[#F1EDEA] pb-2">
              <div>
                <h2 className="text-2xl font-black text-[#3C2A21] uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Create Your Account</h2>
                <p className="text-[#C5A059] text-[13px] font-bold font-black uppercase tracking-[0.3em] mt-1">Step {step} of {formData.lookUpFor.includes("Admissions") ? 3 : 2}</p>
              </div>
              <div className="flex gap-1.5 h-1">
                {[1, 2, (formData.lookUpFor.includes("Admissions") ? 3 : null)].filter(Boolean).map(i => (
                  <div key={i} className={`w-8 rounded-full transition-all duration-700 ${step >= (i as number) ? 'bg-[#C5A059]' : 'bg-[#F1EDEA]'}`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Enter Student Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B5E51]/30 group-focus-within:text-[#C5A059]" />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" maxLength={50} className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none shadow-inner" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Enter Email</label>
                      <div className="relative">
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isEmailVerified ? 'text-green-500' : 'text-[#6B5E51]/30'}`} />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@university.com" className={`w-full pl-10 pr-16 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] outline-none shadow-inner ${isEmailVerified ? 'border-green-500/50' : 'focus:border-[#C5A059]'}`} />
                        {formData.email && !isEmailVerified && (
                          <button onClick={() => setVerifyModal({ show: true, type: 'email', value: formData.email, mode: 'confirm' })} className="absolute right-1 top-1 bottom-1 bg-[#3C2A21] text-white px-2 rounded-lg font-black text-[12px] font-black uppercase shadow-lg hover:bg-[#C5A059] transition-all">Verify</button>
                        )}
                        {isEmailVerified && <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                      </div>
                    </div>

                    <div className="md:col-span-1 col-span-2 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">DOB</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} max={maxDobString} className={`w-full px-2.5 py-2 bg-[#FDFBF7] border rounded-xl text-[10px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none shadow-inner ${errors.dob ? 'border-red-500' : 'border-[#F1EDEA]'}`} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-2.5 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[10px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none appearance-none shadow-inner">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-1 col-span-2 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Country</label>
                        <Select
                          instanceId="country-select"
                          options={Country.getAllCountries().map((c: any) => ({ value: c.isoCode, label: c.name }))}
                          onChange={handleCountryChange} value={formData.country} placeholder="..."
                          styles={customSelectStyles}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">State</label>
                        <Select
                          instanceId="state-select"
                          options={formData.country ? State.getStatesOfCountry(formData.country.value).map((s: any) => ({ value: s.isoCode, label: s.name })) : []}
                          onChange={handleStateChange} value={formData.state} placeholder="..." isDisabled={!formData.country}
                          styles={customSelectStyles}
                        />
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Mobile Access</label>
                      <div className="flex gap-2">
                        <div className="w-14 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[#3C2A21] font-black text-[14px] font-bold text-center shadow-inner">{formData.mobilePrefix}</div>
                        <div className="relative flex-1">
                          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={15} className={`w-full px-3 py-2 pr-16 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] outline-none shadow-inner ${isMobileVerified ? 'border-green-500' : 'focus:border-[#C5A059]'}`} />
                          {formData.mobile && !isMobileVerified && (
                            <button onClick={() => setVerifyModal({ show: true, type: 'mobile', value: `${formData.mobilePrefix}${formData.mobile}`, mode: 'confirm' })} className="absolute right-1 top-1 bottom-1 bg-[#3C2A21] text-white px-2 rounded-lg font-black text-[12px] font-black uppercase shadow-lg hover:bg-[#C5A059] transition-all">Verify</button>
                          )}
                          {isMobileVerified && <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Inquiry Source</label>
                      <select name="source" value={formData.source} onChange={handleChange} className="w-full px-4 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none appearance-none shadow-inner">
                        <option value="">Select Source</option>
                        <option value="Google">Google search</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Enter Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} minLength={6} maxLength={32} className={`w-full px-4 pr-10 py-2 bg-[#FDFBF7] border rounded-xl text-[11px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none shadow-inner ${errors.password ? 'border-red-500' : 'border-[#F1EDEA]'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B5E51]/30"><Eye className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Confirm Password</label>
                      <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full px-4 py-2 bg-[#FDFBF7] border rounded-xl text-[11px] font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none shadow-inner ${errors.confirmPassword ? 'border-red-500' : 'border-[#F1EDEA]'}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input type="checkbox" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} className="w-3.5 h-3.5 rounded bg-[#FDFBF7] accent-[#C5A059] border-[#F1EDEA]" />
                    <p className="text-[10px] font-black text-black font-bold uppercase tracking-widest">
                      I accept the <Link href="/privacy-policy" className="text-[#C5A059] hover:underline">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="text-[#C5A059] hover:underline">Terms & Conditions</Link>
                    </p>
                  </div>

                  <button
                    onClick={() => { if (validateStep1()) setStep(2); }}
                    className="w-full py-3 bg-[#C5A059] hover:bg-[#3C2A21] text-white font-black rounded-xl shadow-xl shadow-[#C5A059]/10 transition-all flex items-center justify-center gap-3 text-[14px] font-bold uppercase tracking-[0.2em] mt-1 active:scale-95"
                  >
                    Proceed to Goals <ChevronRight className="w-4 h-4" />
                  </button>
                  {errors.verification && <p className="text-rose-500 text-[12px] font-black text-center font-black uppercase tracking-widest mt-2 italic">{errors.verification}</p>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 ">
                    {["Admissions", "Scholarships", "Visa", "Research", "Jobs"].map(item => (
                      <button key={item} onClick={() => toggleLookUp(item)} className={`py-3 px-2 rounded-2xl border text-center transition-all shadow-sm ${formData.lookUpFor.includes(item) ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-[#C5A059]/30' : 'bg-[#FDFBF7] border-[#F1EDEA] text-[#6B5E51]/40 hover:border-[#C5A059]/20'}`}>
                        <span className="font-black uppercase tracking-widest text-[9px] text-[#3C2A21]">{item}</span>
                      </button>
                    ))}
                  </div>

                  {formData.lookUpFor.includes("Admissions") ? (
                    <div className="space-y-3 pt-4 border-t border-[#F1EDEA]">
                      <p className="text-[9px] font-black text-[#3C2A21] uppercase tracking-widest text-center">Objective Degree</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Bachelor's", "Master's", "Ph.D."].map(deg => (
                          <button
                            key={deg}
                            onClick={() =>
                              setFormData(p => ({
                                ...p,
                                degree: deg
                              }))
                            }
                            className={`py-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${formData.degree.includes(deg)
                              ? 'border-[#C5A059] bg-[#C5A059]/5 text-[#3C2A21]'
                              : 'border-[#F1EDEA] bg-[#FDFBF7] text-[#6B5E51]/40'
                              }`}
                          >
                            {deg}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    formData.lookUpFor.length > 0 && (
                      <label className="flex items-center gap-4 p-4 rounded-2xl border border-[#C5A059]/20 bg-[#C5A059]/5 cursor-pointer shadow-inner">
                        <input type="checkbox" name="loanInterest" checked={formData.loanInterest} onChange={(e) => setFormData(p => ({ ...p, loanInterest: e.target.checked }))} className="w-4 h-4 accent-[#C5A059]" />
                        <div>
                          <div className="font-black text-[#3C2A21] text-[10px] uppercase tracking-tight">Financing Interest?</div>
                          <p className="text-[8px] text-[#3C2A21] font-bold uppercase tracking-widest">Access elite partner loan rates.</p>
                        </div>
                      </label>
                    )
                  )}

                  <div className="pt-4 flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] text-[#3C2A21] font-black rounded-2xl text-[9px] uppercase tracking-widest hover:text-[#C5A059] transition-all">Back</button>
                    <button onClick={nextStep} className="flex-[2] py-3.5 bg-[#C5A059] text-white font-black rounded-2xl text-[9px] uppercase tracking-widest shadow-xl shadow-[#C5A059]/10 hover:bg-[#3C2A21] transition-all active:scale-95">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Target University Node</label>
                    <Select
                      instanceId="target-univ-select"
                      options={universities} onChange={(s: any) => setFormData(p => ({ ...p, targetUniv: s }))} value={formData.targetUniv} placeholder="Search Node..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Terminal Term</label>
                      <select name="targetTerm" value={formData.targetTerm} onChange={handleChange} className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] outline-none shadow-inner">
                        <option value="">Select Term</option>
                        {terms.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Academic Year</label>
                      <select name="targetYear" value={formData.targetYear} onChange={handleChange} className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] font-bold text-[#3C2A21] outline-none shadow-inner">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Target Specialization</label>
                    <Select
                      instanceId="target-major-select"
                      options={majors} onChange={(s: any) => setFormData(p => ({ ...p, targetMajor: s }))} value={formData.targetMajor} placeholder="Search Major..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-3.5 bg-[#FDFBF7] border border-[#F1EDEA] text-[#6B5E51] font-black rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:text-[#C5A059] transition-all">Back</button>
                    <button onClick={handleRegister} disabled={isSubmitting} className="flex-[2] py-3.5 bg-[#C5A059] text-white font-black rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl shadow-[#C5A059]/10 hover:bg-[#3C2A21] transition-all disabled:opacity-50 active:scale-95">
                      {isSubmitting ? "Finalizing..." : "Finalize Registry"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center border-t border-[#F1EDEA] pt-4">
              <button onClick={() => router.push("/auth/login")} className="text-[13px] font-bold font-black uppercase tracking-[0.3em] text-[#6B5E51]/70 hover:text-[#C5A059] transition-all italic">Already a Synchronized Member? Log In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;