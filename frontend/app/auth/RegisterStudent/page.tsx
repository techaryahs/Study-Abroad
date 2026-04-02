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

    if (!isEmailVerified) {
       newErrors.verification = "Please verify both your email and mobile number to continue";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  // --- Verification API Calls ---

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
      setTimeout(() => {
        setVerifyModal(prev => ({ ...prev, show: false }));
      }, 1500);
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
        profile: {
          dob: formData.dob,
          gender: formData.gender,
          country: formData.country?.label,
          state: formData.state?.label,
          source: formData.source,
          lookUpFor: formData.lookUpFor,
          goal: {
            degree: formData.degree,
            targetUniv: formData.targetUniv?.label,
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

      alert("✅ Account Architected Successfully! Welcome to the Elite.");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center p-4 selection:bg-yellow-500 selection:text-black font-sans">
      
      {/* Integrated Verification Modal */}
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVerifyModal(p => ({ ...p, show: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-2xl p-10 text-center border border-white/10"
            >
              {verifyModal.mode !== 'loading' && (
                <button 
                  onClick={() => setVerifyModal(p => ({ ...p, show: false }))}
                  className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              <div className="mb-8 flex justify-center">
                 <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                   verifyModal.mode === 'success' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'
                 } border-2`}>
                    {verifyModal.mode === 'success' ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                        <ShieldCheck className="w-10 h-10 text-green-600" />
                      </motion.div>
                    ) : (
                      <ShieldCheck className={`w-10 h-10 ${verifyModal.mode === 'loading' ? 'animate-pulse' : ''} text-yellow-600`} />
                    )}
                 </div>
              </div>

              {verifyModal.mode === 'confirm' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-3xl font-black text-black mb-2 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Confirm Identity</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                    We'll send a One-Time Password (OTP) to verify ownership of your contact ID.
                  </p>
                  <div className="bg-gray-50 rounded-2xl py-5 px-6 mb-10 border border-gray-100">
                     <p className="text-black font-black text-xl truncate">{verifyModal.value}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (verifyModal.type === 'email') {
                         handleSendOtp();
                      } else {
                         // Temporary static behavior for mobile
                         setVerifyModal(p => ({ ...p, show: false }));
                         setIsMobileVerified(true);
                      }
                    }}
                    className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-[20px] shadow-2xl shadow-yellow-500/30 transition-all flex items-center justify-center gap-3 mb-6"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {verifyModal.type === 'email' ? 'Send Verification Code' : 'Yes, Confirm'}
                  </button>
                  <button onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="text-xs font-bold text-gray-400 hover:text-black underline underline-offset-4">This is not mine</button>
                </motion.div>
              )}

              {verifyModal.mode === 'otp' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-3xl font-black text-black mb-2 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Enter Code</h3>
                  <p className="text-gray-500 text-sm mb-8 font-medium">Verify the 6-digit code sent to<br/><span className="text-black font-bold">{verifyModal.value}</span></p>
                  <input 
                    type="text" 
                    maxLength={6} 
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="w-full text-center text-4xl font-black tracking-[12px] py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl mb-8 focus:border-yellow-500 transition-all outline-none"
                    placeholder="000000"
                  />
                  <button 
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length !== 6}
                    className="w-full py-5 bg-black text-yellow-500 font-black rounded-[20px] shadow-xl hover:bg-gray-900 transition-all disabled:opacity-50"
                  >
                    Verify & Proceed
                  </button>
                </motion.div>
              )}

              {verifyModal.mode === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <h3 className="text-3xl font-black text-black mb-2 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Verified!</h3>
                  <p className="text-gray-500 font-medium">Thank you for confirming your identity.</p>
                </motion.div>
              )}

              {verifyModal.mode === 'loading' && (
                <div className="py-10 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-yellow-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-500/5 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D0D0D] border border-white/5 rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-6xl flex overflow-hidden min-h-[750px] relative z-10"
      >
        {/* Left Branding */}
        <div className="hidden lg:flex lg:w-[45%] bg-[#050505] p-16 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Sparkles className="w-7 h-7 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">StudyAbroad</span>
            </div>
            
            <h1 className="text-6xl font-black leading-[1] uppercase mb-8 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
              Architect <br />
              <span className="text-yellow-500">Global</span> <br />
              Careers<span className="text-yellow-500 italic">.</span>
            </h1>
            <p className="text-gray-500 text-xl font-medium leading-relaxed italic border-l-2 border-yellow-500/20 pl-6 max-w-sm">
              Elite academic mentorship for the Ivy League and beyond.
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 font-bold tracking-widest text-[10px] uppercase text-yellow-500">
              The Global Elite Choice
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black" />)}
              </div>
              <p className="text-xs font-bold text-gray-500 italic">+2,000 Premium Aspirants</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[55%] p-10 md:p-20 flex flex-col justify-center bg-[#090909]">
          <div className="max-w-md mx-auto w-full">
            
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Create Account</h2>
              <div className="flex items-center gap-4">
                <div className="h-1 w-20 bg-yellow-500 rounded-full" />
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[4px]">Step {step} of {formData.lookUpFor.includes("Admissions") ? 3 : 2}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                   key="step1" 
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Full Name</label>
                       <div className="relative group">
                         <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                         <input 
                           type="text" name="name" value={formData.name} onChange={handleChange} 
                           placeholder="Enter your full name" 
                           className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white placeholder:text-gray-700 focus:border-yellow-500 focus:bg-white/[0.05] transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                         />
                       </div>
                       {errors.name && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-black uppercase italic">{errors.name}</p>}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">
                        Email Address
                      </label>
                      <div className="relative group">
                         <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEmailVerified ? 'text-green-500' : 'text-gray-500 group-focus-within:text-yellow-500'}`} />
                         <input 
                           type="email" name="email" value={formData.email} onChange={handleChange} 
                           placeholder="johndoe@university.com" 
                           className={`w-full pl-14 pr-28 py-5 bg-white/[0.03] border rounded-[24px] text-white placeholder:text-gray-700 transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white] ${isEmailVerified ? 'border-green-500/50' : 'border-white/5 focus:border-yellow-500'}`} 
                         />
                         {formData.email.length > 0 && !isEmailVerified && (
                           <button 
                             onClick={(e) => { e.preventDefault(); setVerifyModal({ show: true, type: 'email', value: formData.email, mode: 'confirm' }); }}
                             className="absolute right-2 top-2 bottom-2 bg-yellow-500 text-black px-4 rounded-[16px] font-black text-[10px] uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center"
                           >
                             Verify
                           </button>
                         )}
                         {isEmailVerified && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                             <ShieldCheck className="w-4 h-4" /> Verified
                           </div>
                         )}
                      </div>
                      {errors.email && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-black uppercase italic">{errors.email}</p>}
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">DOB</label>
                      <input 
                        type="date" name="dob" value={formData.dob} onChange={handleChange} 
                        className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white focus:border-yellow-500 outline-none [color-scheme:dark]" 
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Gender</label>
                      <select 
                        name="gender" value={formData.gender} onChange={handleChange} 
                        className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white focus:border-yellow-500 outline-none appearance-none"
                      >
                        <option value="" className="bg-black">Select...</option>
                        <option value="Male" className="bg-black">Male</option>
                        <option value="Female" className="bg-black">Female</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Country</label>
                      <Select
                        options={Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))}
                        onChange={handleCountryChange}
                        value={formData.country}
                        placeholder="Country..."
                        styles={{ 
                          control: (base) => ({ 
                            ...base, 
                            borderRadius: '24px', 
                            padding: '10px 14px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            border: errors.country ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'none',
                            color: 'white'
                          }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          input: (base) => ({ ...base, color: 'white' }),
                          menu: base => ({ ...base, zIndex: 9999, backgroundColor: '#090909', border: '1px solid rgba(255,255,255,0.1)' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? 'rgba(234, 179, 8, 0.2)' : 'transparent', color: state.isFocused ? '#EAB308' : 'white' })
                        }}
                      />
                      {errors.country && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-black uppercase italic">{errors.country}</p>}
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">State</label>
                      <Select
                        options={formData.country ? State.getStatesOfCountry(formData.country.value).map(s => ({ value: s.isoCode, label: s.name })) : []}
                        onChange={handleStateChange}
                        value={formData.state}
                        placeholder="State..."
                        isDisabled={!formData.country}
                        styles={{ 
                          control: (base) => ({ 
                            ...base, 
                            borderRadius: '24px', 
                            padding: '10px 14px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            border: errors.state ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'none',
                            color: 'white'
                          }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                          input: (base) => ({ ...base, color: 'white' }),
                          menu: base => ({ ...base, zIndex: 9999, backgroundColor: '#090909', border: '1px solid rgba(255,255,255,0.1)' }),
                          option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? 'rgba(234, 179, 8, 0.2)' : 'transparent', color: state.isFocused ? '#EAB308' : 'white' })
                        }}
                      />
                      {errors.state && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-black uppercase italic">{errors.state}</p>}
                    </div>

                    <div className="col-span-2">
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Mobile Number</label>
                       <div className="relative flex gap-3">
                          <div className="w-20 px-4 py-5 bg-white/[0.03] rounded-[24px] text-white font-black flex items-center justify-center border border-white/5 text-sm">{formData.mobilePrefix}</div>
                          <div className="relative flex-1 group">
                            <input 
                               type="text" name="mobile" value={formData.mobile} onChange={handleChange} 
                               className={`w-full px-6 py-5 pr-28 bg-white/[0.03] border rounded-[24px] text-white outline-none transition-all [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white] ${isMobileVerified ? 'border-green-500/50' : 'border-white/5 focus:border-yellow-500'}`} 
                            />
                            {formData.mobile.length > 0 && !isMobileVerified && (
                               <button 
                                 onClick={(e) => { e.preventDefault(); setVerifyModal({ show: true, type: 'mobile', value: `${formData.mobilePrefix} ${formData.mobile}`, mode: 'confirm' }); }}
                                 className="absolute right-2 top-2 bottom-2 bg-yellow-500 text-black px-4 rounded-[16px] font-black text-[10px] uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center"
                               >
                                 Verify
                               </button>
                            )}
                            {isMobileVerified && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> Verified
                              </div>
                            )}
                          </div>
                       </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Password</label>
                      <input 
                        type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} 
                        className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Confirm</label>
                      <input 
                        type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} 
                        className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Where did you hear about us?</label>
                      <select name="source" value={formData.source} onChange={handleChange} className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white focus:border-yellow-500 outline-none appearance-none">
                        <option value="" className="bg-black">Select Source</option>
                        <option value="Google" className="bg-black">Google</option>
                        <option value="Instagram" className="bg-black">Instagram</option>
                        <option value="LinkedIn" className="bg-black">LinkedIn</option>
                        <option value="Friend" className="bg-black">Friend</option>
                        <option value="Other" className="bg-black">Other</option>
                      </select>
                    </div>

                    <div className="col-span-2 flex items-center gap-4 mt-6">
                      <input 
                        type="checkbox" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-yellow-500"
                      />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Accept Privacy Policy & Terms</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!isEmailVerified || !isMobileVerified}
                    className="w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-[24px] shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 group uppercase tracking-[3px] text-xs mt-8"
                  >
                    Proceed to Goals
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {errors.verification && <p className="text-rose-500 text-[10px] text-center mt-4 font-black uppercase">{errors.verification}</p>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Admissions", "Scholarships", "Visa", "Research Papers", "Jobs"].map(item => (
                      <button 
                        key={item} onClick={(e) => { e.preventDefault(); toggleLookUp(item); }}
                        className={`p-6 rounded-[24px] border transition-all text-left ${formData.lookUpFor.includes(item) ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/[0.03] border-white/5 text-white'}`}
                      >
                         <span className="font-black uppercase tracking-widest text-xs">{item}</span>
                      </button>
                    ))}
                  </div>

                  {formData.lookUpFor.includes("Admissions") ? (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Which degree are you going for?</label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { id: "Bachelor's Degree", desc: "Undergraduate programs" },
                          { id: "Master's Degree", desc: "Graduate programs" },
                          { id: "Ph.D. Degree", desc: "Doctoral research" }
                        ].map(degree => (
                          <label key={degree.id} className={`flex items-center gap-4 cursor-pointer p-4 rounded-[20px] border transition-all ${formData.degree === degree.id ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/5 bg-white/[0.03] hover:border-white/10'}`}>
                            <input 
                              type="radio" name="degree" value={degree.id}
                              checked={formData.degree === degree.id} onChange={handleChange}
                              className="w-5 h-5 accent-yellow-500 cursor-pointer" 
                            />
                            <div>
                               <div className="font-black text-white text-sm">{degree.id}</div>
                               <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{degree.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    formData.lookUpFor.length > 0 && (
                      <label className="flex items-start gap-4 p-5 rounded-[20px] border border-yellow-500/30 bg-yellow-500/5 cursor-pointer mt-4">
                        <input 
                          type="checkbox" name="loanInterest" checked={formData.loanInterest} onChange={handleChange}
                          className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 accent-yellow-500" 
                        />
                        <div>
                          <div className="block font-black text-white text-sm">Educational Loan Interest?</div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Connect with partners for special rates.</p>
                        </div>
                      </label>
                    )
                  )}

                  <div className="pt-10 flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-6 bg-white/[0.03] border border-white/5 text-white font-black rounded-[24px]">Back</button>
                    <button onClick={nextStep} className="flex-[2] py-6 bg-yellow-500 text-black font-black rounded-[24px]">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3 ml-1">Target University (Optional)</label>
                    <Select
                      options={universities}
                      onChange={(sel) => setFormData(p => ({ ...p, targetUniv: sel }))}
                      value={formData.targetUniv}
                      placeholder="Search University..."
                      styles={{ 
                        control: (base) => ({ ...base, borderRadius: '24px', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }),
                        singleValue: (base) => ({ ...base, color: 'white' }),
                        input: (base) => ({ ...base, color: 'white' }),
                        menu: base => ({ ...base, zIndex: 9999, backgroundColor: '#090909', border: '1px solid rgba(255,255,255,0.1)' }),
                        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? 'rgba(234, 179, 8, 0.2)' : 'transparent', color: state.isFocused ? '#EAB308' : 'white' })
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3 ml-1">Term</label>
                      <select name="targetTerm" value={formData.targetTerm} onChange={handleChange} className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white outline-none appearance-none">
                        <option value="" className="bg-black">Select Term</option>
                        {terms.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3 ml-1">Year</label>
                      <select name="targetYear" value={formData.targetYear} onChange={handleChange} className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white outline-none appearance-none">
                        {years.map(y => <option key={y} value={y} className="bg-black">{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-3 ml-1">Target Major (Optional)</label>
                    <Select
                      options={majors}
                      onChange={(sel) => setFormData(p => ({ ...p, targetMajor: sel }))}
                      value={formData.targetMajor}
                      placeholder="Search Major..."
                      styles={{ 
                        control: (base) => ({ ...base, borderRadius: '24px', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }),
                        singleValue: (base) => ({ ...base, color: 'white' }),
                        input: (base) => ({ ...base, color: 'white' }),
                        menu: base => ({ ...base, zIndex: 9999, backgroundColor: '#090909', border: '1px solid rgba(255,255,255,0.1)' }),
                        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? 'rgba(234, 179, 8, 0.2)' : 'transparent', color: state.isFocused ? '#EAB308' : 'white' })
                      }}
                    />
                  </div>

                  <label className="flex items-start gap-4 p-5 rounded-[20px] border border-yellow-500/30 bg-yellow-500/5 cursor-pointer mt-6">
                    <input 
                      type="checkbox" name="loanInterest" checked={formData.loanInterest} onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 accent-yellow-500 inline-block align-middle" 
                    />
                    <div>
                      <div className="block font-black text-white text-sm">Educational Loan Interest?</div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Connect with partners for special rates.</p>
                    </div>
                  </label>

                  <div className="pt-10 flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-6 bg-white/[0.03] border border-white/5 text-white font-black rounded-[24px]">Back</button>
                    <button 
                      onClick={handleRegister} disabled={isSubmitting}
                      className="flex-[2] py-6 bg-yellow-500 text-black font-black rounded-[24px] disabled:opacity-50"
                    >
                      {isSubmitting ? "Architecting..." : "Finalize Registration"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 text-center">
              <button onClick={() => router.push("/auth/login")} className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 hover:text-yellow-500">Already a Member? Log In</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
