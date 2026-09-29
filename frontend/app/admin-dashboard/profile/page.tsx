"use client";

import React, { useState, useEffect } from "react";
import { getUser, getToken } from "@/app/lib/token";
import {
  User,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Mail,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const e = err as { response?: { data?: { error?: string; message?: string } } };
    return e.response?.data?.error || e.response?.data?.message || "Something went wrong";
  }
  return "Something went wrong";
}

export default function AdminProfilePage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");

  // Change Password Form State
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwOk, setPwOk] = useState(false);

  // Forgot Password / OTP State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPw, setForgotNewPw] = useState("");
  const [forgotConfirmPw, setForgotConfirmPw] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotOk, setForgotOk] = useState(false);

  useEffect(() => {
    const user = getUser();
    const t = getToken();
    if (user) {
      setAdminUser(user);
      setForgotEmail(user.email || "");
    }
    if (t) setToken(t);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg("");
    setPwOk(false);

    if (!currentPw || !newPw || !confirmPw) {
      setPwMsg("All fields are required");
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg("New passwords do not match");
      return;
    }
    if (!PW_REGEX.test(newPw)) {
      setPwMsg("Password must be at least 8 characters with uppercase, lowercase, and a number");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
          confirmPassword: confirmPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update password");

      setPwMsg("Password updated successfully!");
      setPwOk(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwMsg(extractError(err));
      setPwOk(false);
    } finally {
      setPwLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setForgotMsg("");
    setForgotOk(false);
    if (!forgotEmail.trim()) {
      setForgotMsg("Enter your administrator email address");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to send reset code");

      setForgotMsg("6-digit verification code sent to your email!");
      setForgotOk(true);
      setTimeout(() => {
        setForgotStep(2);
        setForgotMsg("");
        setForgotOk(false);
      }, 1200);
    } catch (err) {
      setForgotMsg(extractError(err));
      setForgotOk(false);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotMsg("");
    setForgotOk(false);
    if (!forgotOtp || !forgotNewPw || !forgotConfirmPw) {
      setForgotMsg("All fields are required");
      return;
    }
    if (forgotNewPw !== forgotConfirmPw) {
      setForgotMsg("Passwords do not match");
      return;
    }
    if (!PW_REGEX.test(forgotNewPw)) {
      setForgotMsg("Password must be at least 8 characters with uppercase, lowercase, and a number");
      return;
    }

    setForgotLoading(true);
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/auth/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim() }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok)
        throw new Error(verifyData.error || verifyData.message || "OTP verification failed");

      const res = await fetch(`${BACKEND_URL}/api/auth/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Reset failed");

      setForgotMsg("Password reset successfully! You can now use your new password.");
      setForgotOk(true);
      setTimeout(() => setShowForgotModal(false), 2000);
    } catch (err) {
      setForgotMsg(extractError(err));
      setForgotOk(false);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Admin Profile & Security</h2>
        <p className="text-xs text-white/50 mt-1">
          Manage administrator account information, credentials, and authentication security.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#c2a878] to-[#917646] flex items-center justify-center text-black font-black text-2xl shadow-lg shrink-0">
            {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white">{adminUser?.name || "Administrator"}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#c2a878]/15 text-[#c2a878] border border-[#c2a878]/30">
                <ShieldCheck size={11} />
                <span>Super Administrator</span>
              </span>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <Mail size={12} />
              <span>{adminUser?.email || "admin@eduleader.global"}</span>
            </p>
            <p className="text-[11px] text-white/30 pt-1">
              Role: <span className="font-semibold text-white/60 uppercase">{adminUser?.role || "admin"}</span> • Multi-tenant Scope: <span className="text-emerald-400 font-semibold">Global System Wide</span>
            </p>
          </div>
        </div>
      </div>

      {/* Password Management Card */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c2a878]/10 text-[#c2a878] flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Change Password
              </h4>
              <p className="text-xs text-white/40">
                Update your login password to maintain high security.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setForgotStep(1);
              setForgotMsg("");
            }}
            className="text-xs font-bold text-[#c2a878] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {pwMsg && (
          <div
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold ${
              pwOk
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {pwOk ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{pwMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="px-6 py-2.5 bg-[#c2a878] hover:bg-[#d4ba8a] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {pwLoading && (
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Key size={18} className="text-[#c2a878]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Reset Administrator Password
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-1">
              <div className="h-1 flex-1 rounded-full bg-[#c2a878]" />
              <div
                className={`h-1 flex-1 rounded-full transition-all ${
                  forgotStep === 2 ? "bg-[#c2a878]" : "bg-white/10"
                }`}
              />
            </div>

            {forgotMsg && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold ${
                  forgotOk
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {forgotMsg}
              </div>
            )}

            {forgotStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={forgotLoading}
                  className="w-full py-2.5 bg-[#c2a878] hover:bg-[#d4ba8a] text-black font-bold uppercase text-xs tracking-wider rounded-xl transition-all disabled:opacity-50"
                >
                  {forgotLoading ? "Sending Code..." : "Send Verification Code"}
                </button>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xl font-mono text-center tracking-[0.4em] text-[#c2a878] focus:outline-none focus:border-[#c2a878]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotNewPw}
                    onChange={(e) => setForgotNewPw(e.target.value)}
                    placeholder="Min 8 chars, uppercase, number"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={forgotConfirmPw}
                    onChange={(e) => setForgotConfirmPw(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/50"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="flex-1 py-2.5 border border-white/10 text-white/70 hover:text-white text-xs font-semibold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 bg-[#c2a878] hover:bg-[#d4ba8a] text-black font-bold uppercase text-xs tracking-wider rounded-xl disabled:opacity-50"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
