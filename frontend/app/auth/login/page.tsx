"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { setToken, setUser } from "@/app/lib/token";

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
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotOtp, setForgotOtp] = useState<string>("");
  const [forgotPassword, setForgotPassword] = useState<string>("");
  const [forgotConfirm, setForgotConfirm] = useState<string>("");
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [forgotMessage, setForgotMessage] = useState<{ text: string; type: "success" | "error" }>({ text: "", type: "error" });

  // ✅ FIXED: Proper backend URL with fallback
  const BACKEND_URL =
    typeof process.env.NEXT_PUBLIC_BACKEND_URL === "string" &&
    process.env.NEXT_PUBLIC_BACKEND_URL.trim() !== "" &&
    process.env.NEXT_PUBLIC_BACKEND_URL !== "undefined"
      ? process.env.NEXT_PUBLIC_BACKEND_URL.trim()
      : "http://localhost:5001";

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
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

      if (!user.isVerified) {
        router.push(`/auth/RegisterStudent`);
        return;
      }

      setToken(token);
      setUser(user);

      setTimeout(() => {
        if (user.role === "admin") router.push("/admin-dashboard");
        else if (user.role === "consultant") router.push("/consultant-dashboard");
        else if (user.role === "parent") router.push("/parent-dashboard");
        else router.push("/User/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setErrorMsg(err.message || "Failed to fetch. Check if backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordStep1 = async () => {
    if (!forgotEmail.trim()) {
      setForgotMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    setForgotLoading(true);
    setForgotMessage({ text: "", type: "error" });

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to send reset code");

      setForgotMessage({ text: "Reset code sent to your email. Check your inbox.", type: "success" });
      setTimeout(() => setForgotStep(2), 1500);
    } catch (err: any) {
      setForgotMessage({ text: err.message || "Failed to send reset code", type: "error" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotPasswordStep2 = async () => {
    if (!forgotOtp.trim() || !forgotPassword.trim() || !forgotConfirm.trim()) {
      setForgotMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    if (forgotPassword !== forgotConfirm) {
      setForgotMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(forgotPassword)) {
      setForgotMessage({ text: "Password must be 8+ characters with uppercase, lowercase & numbers", type: "error" });
      return;
    }

    setForgotLoading(true);
    setForgotMessage({ text: "", type: "error" });

    try {
      // Try regular verify-otp first
      const verifyRes = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim() }),
      });

      if (!verifyRes.ok) {
        // Fallback: try admin verify-otp
        const adminVerifyRes = await fetch(`${BACKEND_URL}/api/auth/admin/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim() }),
        });
        if (!adminVerifyRes.ok) {
          const verifyData = await verifyRes.json();
          throw new Error(verifyData.error || "Invalid reset code");
        }
      }

      // Try regular reset-password
      const resetRes = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim(), newPassword: forgotPassword.trim() }),
      });

      if (!resetRes.ok) {
        // Fallback: try admin reset-password
        const adminResetRes = await fetch(`${BACKEND_URL}/api/auth/admin/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim(), newPassword: forgotPassword.trim() }),
        });
        const adminResetData = await adminResetRes.json();
        if (!adminResetRes.ok) throw new Error(adminResetData.error || "Failed to reset password");
      }

      setForgotMessage({ text: "Password reset successfully! Redirecting to login...", type: "success" });
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotEmail("");
        setForgotOtp("");
        setForgotPassword("");
        setForgotConfirm("");
      }, 2000);
    } catch (err: any) {
      setForgotMessage({ text: err.message || "Failed to reset password", type: "error" });
    } finally {
      setForgotLoading(false);
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
        {/* Left Side - Brand */}
        <div className="hidden lg:flex lg:w-[38%] p-10 flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#3C2A21] to-[#2D2926] text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-8 backdrop-blur-xl">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h1 className="text-4xl font-black mb-6 uppercase tracking-tighter italic leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Architect <br /> Your <br /> <span className="text-[#C5A059]">Global</span> <br /> Legacy.
            </h1>
            <p className="text-white/60 text-[10px] font-black leading-relaxed max-w-xs uppercase tracking-widest pl-4 border-l-2 border-[#C5A059]/30">
              Elite academic mentorship for the Ivy League and beyond. Access your centralized dashboard.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-8 mt-12">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-[#2D2926] overflow-hidden flex items-center justify-center text-[10px] font-black text-white/40">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">Standard Protocol Verified</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[62%] p-6 md:p-10 flex flex-col justify-center relative bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#3C2A21] mb-2 uppercase tracking-tight italic" style={{ fontFamily: "Georgia, serif" }}>
              Member Sync
            </h2>
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
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[9px] font-black text-[#6B5E51]/40 hover:text-[#C5A059] uppercase tracking-widest transition-all"
              >
                Forgot Credentials?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group uppercase tracking-widest text-[11px] active:scale-95 mt-2 hover:bg-[#C5A059]"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
              {!isSubmitting && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-rose-500 text-[10px] items-center justify-center flex mt-6 font-black uppercase italic bg-rose-50/50 py-4 rounded-xl border border-rose-100 px-4 text-center"
              >
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white border border-[#C5A059]/20 rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#3C2A21] uppercase italic tracking-tight">Reset Password</h3>
              <button
                onClick={() => { setShowForgotModal(false); setForgotStep(1); setForgotMessage({ text: "", type: "error" }); }}
                className="text-[#6B5E51]/40 hover:text-[#C5A059] transition-all text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {forgotMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] font-black uppercase mb-4 p-3 rounded-lg border flex items-center gap-2 ${
                  forgotMessage.type === "success"
                    ? "bg-green-500/10 border-green-500/20 text-green-600"
                    : "bg-red-500/10 border-red-500/20 text-red-600"
                }`}
              >
                <AlertCircle size={14} />
                {forgotMessage.text}
              </motion.div>
            )}

            {forgotStep === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/40 group-focus-within:text-[#C5A059] transition-all" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-xs text-[#3C2A21] font-bold placeholder:text-[#6B5E51]/20 focus:border-[#C5A059] transition-all outline-none shadow-inner"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowForgotModal(false); setForgotStep(1); setForgotMessage({ text: "", type: "error" }); }}
                    disabled={forgotLoading}
                    className="flex-1 py-3 bg-white border border-[#C5A059]/20 text-[#6B5E51] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#FDFBF7] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForgotPasswordStep1}
                    disabled={forgotLoading}
                    className="flex-1 py-3 bg-[#C5A059] text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#3C2A21] transition-all shadow-lg disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Code"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">Reset Code</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-xs text-[#3C2A21] font-bold placeholder:text-[#6B5E51]/20 focus:border-[#C5A059] transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">New Password</label>
                  <input
                    type="password"
                    value={forgotPassword}
                    onChange={(e) => setForgotPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-xs text-[#3C2A21] font-bold placeholder:text-[#6B5E51]/20 focus:border-[#C5A059] transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={forgotConfirm}
                    onChange={(e) => setForgotConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-xs text-[#3C2A21] font-bold placeholder:text-[#6B5E51]/20 focus:border-[#C5A059] transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setForgotStep(1)}
                    disabled={forgotLoading}
                    className="flex-1 py-3 bg-white border border-[#C5A059]/20 text-[#6B5E51] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#FDFBF7] transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleForgotPasswordStep2}
                    disabled={forgotLoading}
                    className="flex-1 py-3 bg-[#C5A059] text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#3C2A21] transition-all shadow-lg disabled:opacity-50"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
