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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-yellow-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#090909] rounded-[32px] border border-white/5 shadow-2xl w-full max-w-5xl flex overflow-hidden min-h-[600px]"
      >

        {/* Left Side - Brand Promise */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/5 transition-opacity duration-500 rounded-[32px] m-4" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
               <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>
              Welcome<br/>Back to Elite
            </h1>
            <p className="text-gray-400 text-sm font-bold leading-relaxed max-w-sm uppercase tracking-widest mt-4">
              Access your personalized dashboard, track applications, and manage your academic aspirations with precision.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-8 mt-12">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black" />)}
            </div>
            <p className="text-[10px] font-bold text-gray-500 italic uppercase">Secure Dashboard Area</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-[#090909] relative z-20 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.5)]">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-wider">Member Login</h2>
              <div className="h-1 w-16 bg-yellow-500 rounded-full" />
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                   <input 
                     type="email" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     required
                     placeholder="johndoe@university.com" 
                     className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white placeholder:text-gray-700 focus:border-yellow-500 focus:bg-white/[0.05] transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                   />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-2 ml-1">Password</label>
                <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                   <input 
                     type={showPassword ? "text" : "password"} 
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)} 
                     required
                     placeholder="••••••••" 
                     className="w-full pl-14 pr-12 py-5 bg-white/[0.03] border border-white/5 rounded-[24px] text-white focus:border-yellow-500 focus:bg-white/[0.05] transition-all outline-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" 
                   />
                   <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)} 
                     className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors outline-none"
                   >
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                 <button type="button" className="text-[10px] font-black text-gray-500 hover:text-yellow-500 uppercase tracking-[2px] transition-colors">Forgot Password?</button>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-[24px] shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 group uppercase tracking-[3px] text-xs mt-8"
              >
                {isSubmitting ? "Authenticating..." : "Access Dashboard"}
                {!isSubmitting && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
              </button>

              {errorMsg && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-500 text-[10px] items-center justify-center flex mt-6 font-black uppercase italic bg-rose-500/10 py-3 rounded-[12px] border border-rose-500/20">
                  {errorMsg}
                </motion.p>
              )}
            </form>

            <div className="mt-12 text-center">
              <button onClick={() => router.push("/auth/RegisterStudent")} className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-yellow-500 transition-colors">Not a Member? Apply Now</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;