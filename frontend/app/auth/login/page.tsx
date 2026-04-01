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

  useEffect(() => {
    // Basic redirect if token exists
    const token = getToken();
    if (token) {
      router.push("/User/dashboard"); // Defaulting to User dashboard since they use it
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-black flex items-center justify-center p-4 selection:bg-yellow-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1115]/80 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden min-h-[500px]"
      >

        {/* Left Side - Brand Promise */}
        <div className="hidden lg:flex lg:w-2/5 p-8 flex-col justify-between relative overflow-hidden group border-r border-white/5">
          <div className="absolute inset-0 bg-yellow-500/5 transition-opacity duration-500 m-3 rounded-[20px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
               <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>
              Welcome<br/>Back to Elite
            </h1>
            <p className="text-gray-400 text-[10px] font-bold leading-relaxed max-w-sm uppercase tracking-widest">
              Access your personalized dashboard, track applications, and manage your academic aspirations with precision.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 mt-8">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#0f1115]" />)}
            </div>
            <p className="text-[9px] font-black text-gray-500 italic uppercase tracking-widest shadow-white/5">Secure Area</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 flex flex-col justify-center relative">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wider">Member Login</h2>
            <div className="h-1 w-12 bg-yellow-500 rounded-full mb-3" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                 <input 
                   type="email" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
                   required
                   placeholder="johndoe@university.com" 
                   className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-700 focus:border-yellow-500 focus:bg-white/[0.05] transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                 />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1.5 ml-1">Password</label>
              <div className="relative group">
                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                 <input 
                   type={showPassword ? "text" : "password"} 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   required
                   placeholder="••••••••" 
                   className="w-full pl-10 pr-10 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:border-yellow-500 focus:bg-white/[0.05] transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                 />
                 <button 
                   type="button" 
                   onClick={() => setShowPassword(!showPassword)} 
                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors outline-none"
                 >
                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
               <button type="button" className="text-[10px] font-black text-gray-500 hover:text-yellow-500 uppercase tracking-[2px] transition-colors">Forgot Password?</button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 group uppercase tracking-[3px] text-[11px] mt-4"
            >
              {isSubmitting ? "Authenticating..." : "Access Dashboard"}
              {!isSubmitting && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> }
            </button>

            {errorMsg && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-500 text-[10px] items-center justify-center flex mt-4 font-black uppercase italic bg-rose-500/10 py-2.5 rounded-lg border border-rose-500/20">
                {errorMsg}
              </motion.p>
            )}
          </form>

          <div className="mt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <button onClick={() => router.push("/auth/RegisterStudent")} className="hover:text-yellow-500 transition-colors">Not a Member? Apply Now</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;