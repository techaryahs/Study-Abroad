"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

const VerifyOtpContent = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const verifyOtp = async (enteredOtp: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");

      alert("✅ Email verified successfully! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsResending(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      alert("✅ New OTP sent successfully!");
      setTimer(30);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        verifyOtp(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/[^0-9]/g, "");
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      verifyOtp(pastedData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-yellow-500 selection:text-black">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 text-center"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-yellow-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/20">
            <ShieldCheck className="w-9 h-9 text-black" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter">Verify Identity</h2>
          <p className="text-gray-400 text-sm leading-relaxed px-4 font-medium italic">
            We've sent a 6-digit verification code to <br />
            <span className="font-bold text-yellow-500">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-3 mb-10" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => { inputRefs.current[index] = el; }}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-16 text-center text-2xl font-black rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all caret-transparent"
              required
            />
          ))}
        </div>

        <button
          onClick={() => verifyOtp(otp.join(""))}
          disabled={isVerifying || otp.some(d => !d)}
          className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-lg rounded-2xl shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 group"
        >
          {isVerifying ? (
            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              Verify Code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
          <p className="text-gray-500 text-sm font-medium">
            Didn't receive the code?
          </p>
          <button 
            onClick={handleResendOtp} 
            disabled={timer > 0 || isResending}
            className={`flex items-center justify-center gap-2 mx-auto font-black text-xs uppercase tracking-widest transition-all ${timer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-yellow-500 hover:text-yellow-400'}`}
          >
            {isResending ? (
              <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
          </button>
        </div>

        {/* Small badge */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-yellow-500" /> Secure
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
