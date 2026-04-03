"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, Mail, Lock, Briefcase, Image as ImageIcon, Calendar, Plus, X, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";
import { getToken } from "@/app/lib/token";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RegisterConsultant = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "",
    expertise: "", experience: "", bio: "",
    availability: [] as { day: string, startTime: string, endTime: string }[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Verification states
  const [verifyModal, setVerifyModal] = useState({ show: false, email: "", otp: "", mode: "confirm" });
  const [otpValue, setOtpValue] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // Slots
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") setIsEmailVerified(false);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.role) return alert("Please fill all required basic fields.");
      if (!isEmailVerified) return alert("Please verify your email before proceeding.");
      setStep(2);
    } else if (step === 2) {
      if (!form.expertise || !form.experience || !form.bio) return alert("Please fill out all professional details.");
      setStep(3);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  // --- OTP Logic ---
  const handleSendOtp = async () => {
    setVerifyModal(p => ({ ...p, mode: 'loading' }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/send-otp-signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVerifyModal(p => ({ ...p, mode: 'otp' }));
    } catch (err: any) {
      alert(err.message);
      setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" });
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp-signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsEmailVerified(true);
      setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsVerifyLoading(false);
    }
  };

  // --- Slots Logic ---
  const toggleDay = (day: string) => {
    setSelectedDays(p => p.includes(day) ? p.filter(d => d !== day) : [...p, day]);
  };

  const addSlot = () => {
    if (!selectedDays.length || !startTime || !endTime) return alert("Select days and times.");
    const newSlots = selectedDays.map(day => ({ day, startTime, endTime }));
    setForm(p => ({ ...p, availability: [...p.availability, ...newSlots] }));
    setSelectedDays([]); setStartTime(""); setEndTime("");
  };

  const removeSlot = (idx: number) => {
    setForm(p => ({ ...p, availability: p.availability.filter((_, i) => i !== idx) }));
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!form.availability.length) return alert("Add at least one slot.");
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "availability") formData.append(key, JSON.stringify(val));
        else formData.append(key, val as string);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register-consultant`, {
        method: "POST", body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("🎉 Elite Consultant Registration Successful!");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-gold-500 selection:text-black font-sans relative overflow-hidden">
      
      {/* Verify Modal Overlay */}
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-[#0f1115] border border-[#d4af37]/20 p-7 rounded-[28px] w-full max-w-[320px] relative shadow-2xl text-center">
              <button onClick={() => setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" })} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 border border-gold-500/20 mx-auto">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1.5">Verify Identity</h3>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-6 leading-relaxed">System Verification Required</p>
              
              {verifyModal.mode === 'confirm' && (
                <div className="space-y-3">
                  <div className="bg-white/5 py-3 px-4 rounded-xl border border-white/5">
                    <p className="text-white font-black text-[11px] truncate whitespace-nowrap overflow-hidden">{verifyModal.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setVerifyModal(p => ({ ...p, show: false }))} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-lg text-[9px] transition-colors">Back</button>
                    <button onClick={handleSendOtp} className="flex-[2] py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase tracking-widest rounded-lg text-[9px] transition-colors shadow-lg">Send Code</button>
                  </div>
                </div>
              )}
              
              {verifyModal.mode === 'otp' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-4">Code sent to your email</p>
                  <input type="text" maxLength={6} value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl mb-4 text-gold-500 outline-none focus:border-gold-500 transition-all shadow-[0_0_20px_rgba(234,179,8,0.05)]" placeholder="000000" />
                  <button onClick={handleVerifyOtp} disabled={otpValue.length !== 6 || isVerifyLoading} className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase tracking-[2px] rounded-xl text-[10px] transition-colors shadow-lg shadow-gold-500/20 disabled:opacity-50">
                    {isVerifyLoading ? 'Verifying...' : 'Verify Protocol'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#090909]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="bg-[#0f1115]/90 backdrop-blur-3xl border border-[#d4af37]/20 rounded-[32px] shadow-2xl w-full max-w-5xl flex overflow-hidden relative z-10">
        
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#050505] p-10 flex-col justify-between relative overflow-hidden group border-r border-white/5 text-white">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]"><Sparkles className="w-5 h-5 text-black" /></div>
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Join the<br />Elite Circle</h1>
            <p className="text-gray-500 text-xs font-bold leading-relaxed max-w-sm uppercase tracking-widest border-l-2 border-gold-500/20 pl-4">Connect with ambitious students as a certified consultant.</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[60%] p-6 md:p-8 flex flex-col justify-center bg-transparent">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Consultant Application</h2>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-10 bg-gold-500 rounded-full" />
                <p className="text-gray-500 text-[8px] font-black uppercase tracking-[3px]">Step {step} of 3</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Doe" maxLength={50} className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 transition-colors" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Role Title</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                        <input name="role" value={form.role} onChange={handleChange} placeholder="Senior Admissions Counselor" maxLength={50} className="w-full pl-10 pr-3 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 transition-colors" />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isEmailVerified ? 'text-green-500' : 'text-gray-500 group-focus-within:text-gold-500'}`} />
                        <input name="email" value={form.email} onChange={handleChange} placeholder="email@address.com" className={`w-full pl-10 pr-20 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none transition-colors ${isEmailVerified ? 'border-green-500/50' : 'focus:border-gold-500'}`} />
                        {form.email && !isEmailVerified && (
                          <button onClick={(e) => { e.preventDefault(); setVerifyModal({ show: true, email: form.email, otp: '', mode: 'confirm' }); }} className="absolute right-1.5 top-1.5 bottom-1.5 bg-gold-500 hover:bg-gold-400 text-black px-3 rounded-lg font-black text-[9px] uppercase transition-colors">Verify</button>
                        )}
                        {isEmailVerified && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-black text-[9px] uppercase flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /></div>}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                        <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" minLength={6} maxLength={32} className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 transition-colors" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); nextStep(); }} className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase tracking-[2px] shadow-xl rounded-xl text-[10px] mt-2 flex items-center justify-center gap-2 transition-colors">Proceed to Profile <ChevronRight className="w-3.5 h-3.5" /></button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Expertise</label>
                      <input name="expertise" value={form.expertise} onChange={handleChange} placeholder="e.g. Ivy League, MBA..." maxLength={100} className="w-full px-4 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 transition-colors" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Experience</label>
                      <select name="experience" value={form.experience} onChange={handleChange as any} className="w-full px-4 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 appearance-none">
                        <option value="" className="bg-black">Select Experience</option>
                        <option value="1-3 years" className="bg-black">1-3 Years</option>
                        <option value="3-5 years" className="bg-black">3-5 Years</option>
                        <option value="5-10 years" className="bg-black">5-10 Years</option>
                        <option value="10+ years" className="bg-black">10+ Years</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Professional Bio</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Describe your methodology and success rate..." maxLength={500} className="w-full px-4 py-2.5 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white outline-none focus:border-gold-500 transition-colors min-h-[60px] resize-none" />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Profile Photo</label>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 border border-[#d4af37]/20 flex items-center justify-center overflow-hidden shrink-0">
                           {imageFile ? <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" alt="Preview"/> : <User className="w-3.5 h-3.5 text-gray-500"/>}
                         </div>
                         <div className="flex-1 relative">
                           <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                           <div className="w-full px-3 py-2 bg-white/[0.03] border border-[#d4af37]/20 rounded-lg flex items-center gap-2 text-gray-400 hover:border-gold-500 transition-colors">
                             <ImageIcon className="w-3.5 h-3.5" />
                             <span className="text-[9px] font-bold truncate tracking-widest uppercase">{imageFile ? imageFile.name : 'Upload HD Photo'}</span>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={(e) => { e.preventDefault(); prevStep(); }} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase rounded-lg text-[9px] transition-colors tracking-widest">Back</button>
                    <button onClick={(e) => { e.preventDefault(); nextStep(); }} className="flex-[2] py-2.5 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase rounded-lg text-[9px] transition-colors tracking-widest shadow-lg">Configure Slots</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day} onClick={(e) => { e.preventDefault(); toggleDay(day); }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${selectedDays.includes(day) ? 'bg-gold-500 border-gold-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-transparent border-[#d4af37]/20 text-gray-500 hover:border-white/30'}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-end gap-3 mb-4">
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">Start Time</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2 bg-white/[0.05] border border-[#d4af37]/20 rounded-lg text-xs text-white outline-none focus:border-gold-500 [color-scheme:dark]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[2px] mb-1.5 ml-1">End Time</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-3 py-2 bg-white/[0.05] border border-[#d4af37]/20 rounded-lg text-xs text-white outline-none focus:border-gold-500 [color-scheme:dark]" />
                      </div>
                      <button onClick={(e) => { e.preventDefault(); addSlot(); }} className="px-4 py-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/50 rounded-lg font-black uppercase tracking-wider text-[10px] transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add</button>
                    </div>

                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                      {form.availability.map((slot, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white/[0.05] border border-white/5 rounded-lg group hover:border-white/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-gold-500/10 flex items-center justify-center"><Calendar className="w-2.5 h-2.5 text-gold-500" /></div>
                            <div>
                              <p className="text-[9px] font-black text-white uppercase tracking-wider">{slot.day}</p>
                              <p className="text-[8px] text-gray-400 font-bold tracking-widest">{slot.startTime} - {slot.endTime}</p>
                            </div>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); removeSlot(idx); }} className="w-5 h-5 flex items-center justify-center rounded hover:bg-rose-500/20 text-gray-500 hover:text-rose-500 transition-colors"><X className="w-2.5 h-2.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={(e) => { e.preventDefault(); prevStep(); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl text-[10px] transition-colors">Back</button>
                    <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} disabled={isSubmitting} className="flex-[2] py-3 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase tracking-[2px] shadow-xl rounded-xl text-[10px] disabled:opacity-50 transition-colors">
                      {isSubmitting ? "Finalizing..." : "Complete"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="mt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            Step {step} Complete • Application Secure
          </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px;}
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px;}
      `}} />
    </div>
  );
};

export default RegisterConsultant;
