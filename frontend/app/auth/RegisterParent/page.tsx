"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, Sparkles, 
  ChevronRight, ShieldCheck, Search, Link as LinkIcon,
  CheckCircle2, AlertCircle, X, Loader2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterParent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: ''
  });

  // Student Search
  const [studentSearch, setStudentSearch] = useState('');
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // OTP Modal
  const [verifyModal, setVerifyModal] = useState({ show: false, otp: '' });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // SEND OTP
  const sendEmailOtp = async () => {
    if (!formData.email) return toast.error("Please enter email first");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp-signup`, { 
        email: formData.email 
      });
      toast.success(res.data.message);
      setVerifyModal({ ...verifyModal, show: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    setIsVerifying(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp-signup`, {
        email: formData.email,
        otp: verifyModal.otp
      });
      setIsEmailVerified(true);
      setVerifyModal({ show: false, otp: '' });
      toast.success("Email verified!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // SEARCH STUDENT
  const handleSearchStudent = async () => {
    if (!studentSearch) return;
    setIsSearching(true);
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/search-student?email=${studentSearch}`);
        setFoundStudent(res.data.student);
        setFormData(p => ({ ...p, studentId: res.data.student._id }));
    } catch (err: any) {
        toast.error(err.response?.data?.error || "Student not found");
        setFoundStudent(null);
    } finally {
        setIsSearching(false);
    }
  };

  // FINAL SUBMIT
  const handleSubmit = async () => {
    if (!formData.studentId) return toast.error("Please link a student first");
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-parent`, {
        parentName: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId
      });
      toast.success("Parent account created! Please log in.");
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-gold-500 selection:text-black font-sans relative overflow-hidden bg-[#090909]">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="bg-[#0f1115]/90 backdrop-blur-3xl border border-[#d4af37]/20 rounded-[32px] shadow-2xl w-full max-w-4xl flex overflow-hidden relative z-10">
        
        {/* Left Side - Brand */}
        <div className="hidden lg:flex lg:w-2/5 bg-[#050505] p-10 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">StudyAbroad</span>
            </div>
            <h1 className="text-4xl font-black leading-tight uppercase italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Parental <span className="text-gold-500">Guidance</span> for the Elite.
            </h1>
            <p className="text-gray-500 text-xs font-medium italic border-l-2 border-gold-500/20 pl-4">
              Monitor your child's journey to prestigious global universities.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 flex flex-col justify-center bg-transparent">
          <div className="max-w-[420px] mx-auto w-full">
            
            <div className="mb-4">
              <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>Parent Registration</h2>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-8 bg-gold-500 rounded-full" />
                <p className="text-gray-500 text-[8px] font-black uppercase tracking-[2px]">Step {step} of 2</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[2px] mb-1 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white focus:border-gold-500 transition-all outline-none"
                        placeholder="John Doe"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[2px] mb-1 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isEmailVerified ? 'text-green-500' : 'text-gray-500 group-focus-within:text-gold-500'} transition-colors`} />
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        disabled={isEmailVerified}
                        className={`w-full pl-9 pr-16 py-2 bg-white/[0.03] border ${isEmailVerified ? 'border-green-500/30' : 'border-[#d4af37]/20'} rounded-xl text-xs text-white focus:border-gold-500 transition-all outline-none`}
                        placeholder="parent@example.com"
                      />
                      {!isEmailVerified && formData.email && (
                        <button 
                          onClick={sendEmailOtp}
                          className="absolute right-1 top-1 bottom-1 bg-gold-500 text-black px-3 rounded-lg font-black text-[8px] uppercase tracking-wider hover:bg-gold-400 transition-all"
                        >Verify</button>
                      )}
                      {isEmailVerified && <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[2px] mb-1 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white focus:border-gold-500 transition-all outline-none"
                          placeholder="••••••••"
                          minLength={6}
                          maxLength={32}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-gray-500 uppercase tracking-[2px] mb-1 ml-1">Confirm</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-[#d4af37]/20 rounded-xl text-xs text-white focus:border-gold-500 transition-all outline-none"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!isEmailVerified || !formData.name || !formData.password || formData.password !== formData.confirmPassword}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase rounded-xl text-[10px] tracking-[2px] mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    Next: Link Student <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white/[0.03] border border-[#d4af37]/20 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-white uppercase tracking-wider mb-2">Search your child</p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="email" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-10 pr-24 py-2.5 bg-black/40 border border-[#d4af37]/20 rounded-xl text-xs text-white focus:border-gold-500 outline-none"
                        placeholder="child.email@gmail.com"
                      />
                      <button 
                        onClick={handleSearchStudent}
                        disabled={isSearching}
                        className="absolute right-1 top-1 bottom-1 bg-white/10 hover:bg-white/20 text-white px-3 rounded-lg text-[8px] font-black uppercase transition-all flex items-center gap-1.5"
                      >
                        {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />} Search
                      </button>
                    </div>
                  </div>

                  {foundStudent && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gold-500/5 border border-gold-500/20 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                        {foundStudent.profile?.profileImage ? (
                          <img src={foundStudent.profile.profileImage} className="w-full h-full object-cover rounded-xl" alt="Child" />
                        ) : (
                          <User className="w-6 h-6 text-gold-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-black text-white text-sm uppercase tracking-tight">{foundStudent.name}</h3>
                           <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{foundStudent.email}</p>
                        <div className="mt-1 flex gap-2">
                           <span className="text-[7px] font-black bg-gold-500/10 text-gold-500 px-1.5 py-0.5 rounded border border-gold-500/20 uppercase tracking-tighter">{foundStudent.country}</span>
                        </div>
                      </div>
                      <LinkIcon className="w-5 h-5 text-gold-500 ml-auto" />
                    </motion.div>
                  )}

                  {!foundStudent && !isSearching && studentSearch && (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3 text-rose-500">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">No student found. Ensure the email is correct.</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase rounded-xl text-[9px] tracking-widest transition-all">Back</button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!foundStudent || isSubmitting}
                      className="flex-[2] py-3 bg-gold-500 hover:bg-gold-400 text-black font-black uppercase rounded-xl text-[9px] tracking-[2px] shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LinkIcon className="w-3.5 h-3.5" />} Create Account
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      <AnimatePresence>
        {verifyModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setVerifyModal({ ...verifyModal, show: false })}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a1a1a] border border-[#d4af37]/20 rounded-[28px] p-8 w-full max-w-[320px] shadow-2xl text-center"
            >
              <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <ShieldCheck className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-black text-white italic mb-1 uppercase tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Verify Identity</h3>
              <p className="text-[9px] text-gray-500 mb-6 uppercase tracking-widest font-bold">Six digits sent to your inbox</p>
              
              <input 
                type="text" value={verifyModal.otp} onChange={(e) => setVerifyModal({ ...verifyModal, otp: e.target.value })}
                placeholder="000 000"
                className="w-full text-center text-2xl font-black bg-white/[0.05] border border-[#d4af37]/20 rounded-xl py-3 text-gold-500 outline-none focus:border-gold-500/50 mb-6 tracking-[8px]"
                maxLength={6}
              />

              <button 
                onClick={verifyOtp}
                disabled={isVerifying || verifyModal.otp.length !== 6}
                className="w-full py-4 bg-gold-500 text-black rounded-xl font-black text-[10px] shadow-lg shadow-gold-500/10 hover:bg-gold-400 transition-all uppercase tracking-[2px] flex items-center justify-center gap-2 group"
              >
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Access"}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setVerifyModal({ ...verifyModal, show: false })}
                className="mt-4 text-[8px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
              >I'll do it later</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
