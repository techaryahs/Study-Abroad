"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, Mail, Lock, Briefcase, Image as ImageIcon, Calendar, Plus, X, ShieldCheck, Sparkles } from "lucide-react";
import { getToken } from "@/app/lib/token";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RegisterConsultant = () => {
  const router = useRouter();
  
  // Basic redirect if already logged in
  useEffect(() => {
    if (getToken()) {
      router.push("/User/dashboard");
    }
  }, [router]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "",
    expertise: "", experience: "", bio: "",
    availability: [] as { day: string, startTime: string, endTime: string }[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Verification states
  const [verifyModal, setVerifyModal] = useState({ show: false, email: "", otp: "", mode: "confirm" });
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Slots
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setVerifyModal(p => ({ ...p, mode: 'loading' }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp-signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: verifyModal.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsEmailVerified(true);
      setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" });
    } catch (err: any) {
      alert(err.message);
      setVerifyModal(p => ({ ...p, mode: 'otp' }));
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-black flex items-center justify-center p-4 selection:bg-yellow-500/30">
      
      {/* Verify Modal Overlay */}
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0f1115] border border-white/10 p-6 rounded-[24px] w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setVerifyModal({ show: false, email: "", otp: "", mode: "confirm" })} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Verify Identity</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">Let's verify {verifyModal.email}</p>

              {verifyModal.mode === 'confirm' && (
                <button onClick={handleSendOtp} className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl text-xs transition-all">Send Code</button>
              )}

              {verifyModal.mode === 'loading' && (
                <div className="flex justify-center p-4"><div className="w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div></div>
              )}

              {verifyModal.mode === 'otp' && (
                <div className="space-y-4">
                  <input type="text" value={verifyModal.otp} onChange={e => setVerifyModal(p => ({ ...p, otp: e.target.value }))} placeholder="Enter 6-digit code" className="w-full text-center tracking-[10px] py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-xl outline-none focus:border-yellow-500 transition-colors" maxLength={6} />
                  <button onClick={handleVerifyOtp} className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl text-xs transition-all">Verify Code</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f1115]/80 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-2/5 p-8 flex-col justify-between relative overflow-hidden group border-r border-white/5">
          <div className="absolute inset-0 bg-yellow-500/5 transition-opacity duration-500 m-3 rounded-[20px]" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center mb-6"><Sparkles className="w-5 h-5 text-black" /></div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Join the<br/>Elite Circle</h1>
            <p className="text-gray-400 text-[10px] font-bold leading-relaxed max-w-sm uppercase tracking-widest">Connect with ambitious students as a certified consultant.</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 flex flex-col justify-center relative">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wider">Consultant Application</h2>
            <div className="h-1 w-12 bg-yellow-500 rounded-full mb-3" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[4px]">Step {step} of 3</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500" />
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Role Title</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500" />
                      <input name="role" value={form.role} onChange={handleChange} placeholder="Career Coach" className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isEmailVerified ? 'text-green-500' : 'text-gray-500 group-focus-within:text-yellow-500'}`} />
                      <input name="email" value={form.email} onChange={handleChange} placeholder="email@address.com" className={`w-full pl-10 pr-24 py-3 bg-black/40 border rounded-xl text-sm text-white outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white] ${isEmailVerified ? 'border-green-500/50' : 'border-white/5 focus:border-yellow-500'}`} />
                      {form.email && !isEmailVerified && (
                         <button onClick={(e) => { e.preventDefault(); setVerifyModal({ show: true, email: form.email, otp: '', mode: 'confirm' }); }} className="absolute right-1.5 top-1.5 bottom-1.5 bg-yellow-500 hover:bg-yellow-400 text-black px-3 rounded-lg font-black text-[10px] uppercase transition-colors">Verify</button>
                      )}
                      {isEmailVerified && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-black text-[10px] uppercase flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Verified</div>}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500" />
                      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    </div>
                  </div>
                </div>
                <button onClick={(e) => { e.preventDefault(); nextStep(); }} className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl text-[11px] mt-4 flex items-center justify-center gap-2 transition-colors">Proceed to Profile <ChevronRight className="w-4 h-4"/></button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Expertise</label>
                    <input name="expertise" value={form.expertise} onChange={handleChange} placeholder="e.g. Ivy League Admissions" className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Years of Experience</label>
                    <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5+ Years" className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Short Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about your background..." rows={2} className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-yellow-500 resize-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Profile Image</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl flex items-center gap-3 text-gray-400 hover:border-yellow-500 transition-colors">
                           <ImageIcon className="w-4 h-4" />
                           <span className="text-xs font-bold truncate">{imageFile ? imageFile.name : 'Upload HD Photo'}</span>
                        </div>
                      </div>
                      {imageFile && (
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                   <button onClick={(e) => { e.preventDefault(); prevStep(); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase rounded-xl text-[11px] transition-colors">Back</button>
                   <button onClick={(e) => { e.preventDefault(); nextStep(); }} className="flex-[2] py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase rounded-xl text-[11px] transition-colors">Configure Slots</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {DAYS_OF_WEEK.map(day => (
                      <button 
                        key={day} onClick={(e) => { e.preventDefault(); toggleDay(day); }} 
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${selectedDays.includes(day) ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}
                      >
                        {day.slice(0,3)}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-4 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Start Time</label>
                      <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-yellow-500 [color-scheme:dark]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">End Time</label>
                      <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-yellow-500 [color-scheme:dark]" />
                    </div>
                    <button onClick={(e) => { e.preventDefault(); addSlot(); }} className="px-4 py-2.5 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/50 rounded-lg font-black uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5"/> Add</button>
                  </div>

                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {form.availability.length === 0 && <p className="text-gray-600 text-[10px] text-center py-2 font-bold uppercase italic tracking-widest">No slots configured yet</p>}
                    {form.availability.map((slot, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-black/60 border border-white/5 rounded-lg group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-7 h-7 rounded-md bg-yellow-500/10 flex items-center justify-center"><Calendar className="w-3.5 h-3.5 text-yellow-500"/></div>
                           <div>
                             <p className="text-xs font-black text-white uppercase tracking-wider">{slot.day}</p>
                             <p className="text-[10px] text-gray-400 font-bold tracking-widest">{slot.startTime} - {slot.endTime}</p>
                           </div>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); removeSlot(idx); }} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-500/20 text-gray-500 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                   <button onClick={(e) => { e.preventDefault(); prevStep(); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase rounded-xl text-[11px] transition-colors">Back</button>
                   <button onClick={(e) => { e.preventDefault(); handleSubmit(); }} disabled={isSubmitting} className="flex-[2] py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl text-[11px] disabled:opacity-50 transition-colors">
                     {isSubmitting ? "Finalizing..." : "Complete Registration"}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-6 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
             Step {step} Complete • Application Secure
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px;}
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px;}
      `}} />
    </div>
  );
};

export default RegisterConsultant;
