"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Sparkles } from "lucide-react";
import { setToken, setUser, getToken } from "@/app/lib/token";

type User = {
  role: string;
  email: string;
  isVerified: boolean;
};

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== 'undefined') ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:5001';
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      const { token, user }: { token: string; user: User } = data;
      const role = user.role;

      if (!user.isVerified) {
        router.push(`/auth/RegisterStudent`); // Point to registration for verification
        return;
      }

      // Save session credentials using custom lib
      setToken(token);
      setUser(user);

      setTimeout(() => {
        if (role === "admin") router.push("/admin-dashboard");
        else if (role === "consultant") router.push("/consultant-dashboard");
        else if (role === "parent") router.push("/parent-dashboard");
        else router.push("/User/dashboard");
      }, 500);

    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setErrorMsg(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-[#C5A059] selection:text-white font-sans relative overflow-hidden bg-[#FDFBF7]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#C5A059]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#C5A059]/15 rounded-[2rem] md:rounded-[2.5rem] shadow-3xl w-full max-w-4xl flex flex-col lg:flex-row h-auto lg:h-[500px] max-h-[90vh] overflow-hidden relative z-10 mx-auto"
      >
        {/* Left Side - Brand Promise */}
        <div className="hidden lg:flex lg:w-[38%] p-10 flex-col justify-between relative overflow-hidden group bg-gradient-to-b from-[#3C2A21] to-[#2D2926] text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-8 backdrop-blur-xl">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h1 className="text-4xl font-black mb-6 uppercase tracking-tighter italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Architect <br /> Your <br /> <span className="text-[#C5A059]">Global</span> <br /> Legacy.
            </h1>
            <p className="text-white/60 text-[10px] font-black leading-relaxed max-w-xs uppercase tracking-widest pl-4 border-l-2 border-[#C5A059]/30">
              Elite academic mentorship for the Ivy League and beyond. Access your centralized dashboard.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-8 mt-12">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-[#2D2926] overflow-hidden flex items-center justify-center text-[10px] font-black text-white/40">U{i}</div>)}
            </div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">Standard Protocol Verified</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[62%] p-6 md:p-10 flex flex-col justify-center relative bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#3C2A21] mb-2 uppercase tracking-tight italic" style={{ fontFamily: 'Georgia, serif' }}>Member Sync</h2>
            <div className="h-1 w-12 bg-[#C5A059] rounded-full" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">Terminal Node Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/40 group-focus-within:text-[#C5A059] transition-all" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@university.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold placeholder:text-[#6B5E51]/20 focus:border-[#C5A059] transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">Access Passcode</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/40 group-focus-within:text-[#C5A059] transition-all" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] transition-all outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/40 hover:text-[#C5A059] transition-all outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button type="button" className="text-[9px] font-black text-[#6B5E51]/40 hover:text-[#C5A059] uppercase tracking-widest transition-all">Forgot Credentials?</button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group uppercase tracking-widest text-[11px] active:scale-95 mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Establish Connection"}
              {!isSubmitting && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            {errorMsg && (
              <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-rose-500 text-[10px] items-center justify-center flex mt-6 font-black uppercase italic bg-rose-50/50 py-4 rounded-xl border border-rose-100 px-4 text-center">
                {errorMsg}
              </motion.p>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-[#F1EDEA] flex flex-col gap-4 items-center">
             <p className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-widest">New Node Initialization?</p>
             <button 
                onClick={() => router.push("/auth/RegisterStudent")} 
                className="text-[10px] font-black text-[#C5A059] hover:text-[#3C2A21] transition-all uppercase tracking-widest"
             >
                Initialize Student Account
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;