"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken, removeToken } from "@/app/lib/token";
import { Video, Calendar, Clock, User, X, CheckCircle,
         Lock, Key, Eye, EyeOff, LogOut, ChevronRight, Tag } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface CounsellingSession {
  _id: string;
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  userName: string;
  userEmail: string;
  consultantName: string;
  status: "booked" | "completed" | "cancelled";
  createdAt: string;
}

type ActiveTab = "active" | "past" | "profile" | "coupons";
type PasswordModal = "none" | "change" | "forgot";
type ForgotStep = 1 | 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const e = err as { response?: { data?: { error?: string; message?: string } } };
    return e.response?.data?.error || e.response?.data?.message || "Something went wrong";
  }
  return "Something went wrong";
}

// ─── Small components ────────────────────────────────────────────────────────
function Banner({ msg, ok }: { msg: string; ok: boolean }) {
  if (!msg) return null;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-semibold mb-4 ${
      ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
         : "bg-red-500/10 border-red-500/20 text-red-400"
    }`}>
      {ok ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <X size={16} className="shrink-0 mt-0.5" />}
      <span className="text-[12px]">{msg}</span>
    </div>
  );
}

function PasswordInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[14px] font-bold font-black uppercase tracking-[0.15em] text-[#c2a878]/60 mb-2">{label}</label>
      <div className="relative">
        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2a878]/40" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          className="w-full bg-white/[0.03] border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/40 transition-colors"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#c2a878] transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function EmailInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[14px] font-bold font-black uppercase tracking-[0.15em] text-[#c2a878]/60 mb-2">{label}</label>
      <input
        type="email"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="admin@domain.com"
        className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/40 transition-colors"
      />
    </div>
  );
}

function OtpInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[14px] font-bold font-black uppercase tracking-[0.15em] text-[#c2a878]/60 mb-2">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-2xl font-black text-center tracking-[0.5em] text-[#c2a878] placeholder:text-white/10 focus:outline-none focus:border-[#c2a878]/40 transition-colors"
      />
    </div>
  );
}

function GoldBtn({ children, onClick, loading, disabled }: {
  children: React.ReactNode; onClick: () => void; loading?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 w-full py-3 bg-[#c2a878] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-yellow-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        : children}
    </button>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-2 w-full py-3 bg-transparent border border-white/10 text-white/60 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:border-white/20 hover:text-white transition-all active:scale-95">
      {children}
    </button>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose, onForgot, token }: {
  onClose: () => void; onForgot: () => void; token: string;
}) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  const handleSubmit = async () => {
    setMsg(""); setOk(false);
    if (!current || !newPw || !confirm) { setMsg("All fields are required"); return; }
    if (newPw !== confirm) { setMsg("Passwords do not match"); return; }
    if (!PW_REGEX.test(newPw)) { setMsg("Min 8 chars with uppercase, lowercase & number"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed");
      setMsg("Password updated successfully!"); setOk(true);
      setTimeout(() => onClose(), 1500);
    } catch (e) {
      setMsg(extractError(e)); setOk(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-[#0d0f12] border border-white/8 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#c2a878]/10 flex items-center justify-center">
            <Lock size={18} className="text-[#c2a878]" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-white">Change Password</h2>
            <p className="text-[14px] font-bold font-semibold text-white/40 uppercase tracking-widest">Update admin credentials</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <Banner msg={msg} ok={ok} />

        <div className="space-y-4">
          <PasswordInput label="Current Password" value={current} onChange={setCurrent} />
          <PasswordInput label="New Password" value={newPw} onChange={setNewPw} placeholder="Min 8 chars, uppercase & number" />
          <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} />
        </div>

        <button onClick={onForgot}
          className="mt-3 text-[14px] font-bold font-black text-[#c2a878]/60 hover:text-[#c2a878] transition-colors float-right uppercase tracking-wider">
          Forgot current password?
        </button>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
          <GoldBtn onClick={handleSubmit} loading={loading}>Update Password</GoldBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ForgotStep>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  const handleSendOtp = async () => {
    setMsg(""); setOk(false);
    if (!email.trim()) { setMsg("Enter your admin email address"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed");
      setMsg("Reset code sent! Check your email."); setOk(true);
      setTimeout(() => { setStep(2); setMsg(""); setOk(false); }, 1200);
    } catch (e) {
      setMsg(extractError(e)); setOk(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    setMsg(""); setOk(false);
    if (!otp || !newPw || !confirm) { setMsg("All fields are required"); return; }
    if (newPw !== confirm) { setMsg("Passwords do not match"); return; }
    if (!PW_REGEX.test(newPw)) { setMsg("Min 8 chars with uppercase, lowercase & number"); return; }
    setLoading(true);
    try {
      const verifyRes = await fetch(`${BACKEND}/api/auth/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || verifyData.message || "OTP verification failed");

      const res = await fetch(`${BACKEND}/api/auth/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed");
      setMsg("Password reset successfully! You can now log in."); setOk(true);
      setTimeout(() => onClose(), 2000);
    } catch (e) {
      setMsg(extractError(e)); setOk(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-[#0d0f12] border border-white/8 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#c2a878]/10 flex items-center justify-center">
            <Key size={18} className="text-[#c2a878]" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-white">Forgot Password</h2>
            <p className="text-[14px] font-bold font-semibold text-white/40 uppercase tracking-widest">
              Step {step} of 2 — {step === 1 ? "Verify Identity" : "Set New Password"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="flex gap-1 mb-5">
          <div className="h-1 flex-1 rounded-full bg-[#c2a878]" />
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 2 ? "bg-[#c2a878]" : "bg-white/10"}`} />
        </div>

        <Banner msg={msg} ok={ok} />

        {step === 1 && (
          <div className="space-y-4">
            <EmailInput label="Admin Email Address" value={email} onChange={setEmail} />
            <GoldBtn onClick={handleSendOtp} loading={loading}>Send Reset Code</GoldBtn>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <OtpInput label="6-Digit Reset Code (from your email)" value={otp} onChange={setOtp} />
            <PasswordInput label="New Password" value={newPw} onChange={setNewPw} placeholder="Min 8 chars, uppercase & number" />
            <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} />
            <div className="grid grid-cols-2 gap-3">
              <OutlineBtn onClick={() => { setStep(1); setMsg(""); }}>← Back</OutlineBtn>
              <GoldBtn onClick={handleVerifyAndReset} loading={loading}>Reset Password</GoldBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ user, token, onLogout }: {
  user: Record<string, string>; token: string; onLogout: () => void;
}) {
  const [modal, setModal] = useState<PasswordModal>("none");

  const profileActions = [
    {
      id: "change-pw",
      icon: Lock,
      label: "Change Password",
      desc: "Update your admin login credentials",
      onClick: () => setModal("change"),
    },
  ];

  return (
    <>
      <div className="bg-[#c2a878]/[0.03] border border-[#c2a878]/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#c2a878]/10 flex items-center justify-center">
            <User size={28} className="text-[#c2a878]" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{user?.name || "Admin"}</p>
            <p className="text-sm text-white/40 mt-0.5">{user?.email || ""}</p>
            <span className="mt-2 inline-block text-[13px] font-bold font-black px-3 py-1 rounded-full bg-[#c2a878] text-black uppercase tracking-widest">
              Administrator
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {profileActions.map(({ id, icon: Icon, label, desc, onClick }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className="w-full group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/6 rounded-xl hover:bg-[#c2a878]/[0.04] hover:border-[#c2a878]/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#c2a878]/10 flex items-center justify-center group-hover:bg-[#c2a878]/20 transition-colors">
              <Icon size={16} className="text-[#c2a878]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">{label}</p>
              <p className="text-[14px] font-bold text-white/40 mt-0.5">{desc}</p>
            </div>
            <ChevronRight size={14} className="text-white/20 group-hover:text-[#c2a878] transition-colors" />
          </button>
        ))}
      </div>

      {modal === "change" && (
        <ChangePasswordModal
          token={token}
          onClose={() => setModal("none")}
          onForgot={() => setModal("forgot")}
        />
      )}
      {modal === "forgot" && (
        <ForgotPasswordModal onClose={() => setModal("none")} />
      )}
    </>
  );
}

// ─── Coupons Tab ──────────────────────────────────────────────────────────────
function CouponsTab() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="bg-[#c2a878]/[0.03] border border-[#c2a878]/10 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c2a878]/10 flex items-center justify-center">
            <Tag size={22} className="text-[#c2a878]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Coupon Management</h3>
            <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest">Create & manage discount codes</p>
          </div>
        </div>
        <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
          Generate coupon codes for your users. Set flat or percentage discounts, expiry dates, and usage limits.
        </p>
        <button
          onClick={() => router.push("/admin-dashboard/coupons")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-95"
        >
          <Tag size={14} /> Manage Coupons →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<Record<string, string>>({});
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (!user || user.role !== "admin" || !token) {
      router.replace("/auth/login");
      return;
    }
    setAdminUser(user);
    setAdminToken(token);
    setAuthChecked(true);
    fetchSessions(token);
  }, [router]);

  const fetchSessions = async (token: string) => {
    try {
      const res = await fetch(`${BACKEND}/api/bookings?bookingType=counselling`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.bookings || data || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    if (!window.confirm("Cancel this counselling session?")) return;
    try {
      const res = await fetch(`${BACKEND}/api/bookings/cancel/${sessionId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status: "cancelled" } : s));
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  const isSessionPast = (s: CounsellingSession) => {
    try {
      const [day, month, year] = s.date.split("/");
      const dt = new Date(`${year}-${month}-${day} ${s.endTime}`);
      return dt < new Date();
    } catch { return false; }
  };

  const activeSessions = sessions.filter(s => s.status?.toLowerCase() === "booked" && !isSessionPast(s));
  const pastSessions   = sessions.filter(s => ["completed", "cancelled"].includes(s.status?.toLowerCase()) || isSessionPast(s));

  if (!mounted || !authChecked) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "active",  label: `Active (${activeSessions.length})` },
    { id: "past",    label: `Past (${pastSessions.length})` },
    { id: "profile", label: "Profile" },
    { id: "coupons", label: "🎟 Coupons" },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-black uppercase italic font-serif tracking-tighter">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-[14px] font-bold font-black uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1 ml-5">
            Session Management & Admin Controls
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "text-[#c2a878] border-b-2 border-[#c2a878]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={() => router.push("/admin-dashboard/slots")}
            className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-white transition-all">
            Manage Slots
          </button>
          <button onClick={() => router.push("/admin-dashboard/articles")}
            className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-white transition-all">
            Articles
          </button>
          <button onClick={() => router.push("/admin/consultants")}
            className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-500 hover:text-white transition-all">
            Counsellors
          </button>
        </div>

        {/* Active Sessions */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
              </div>
            ) : activeSessions.length > 0 ? activeSessions.map(s => (
              <div key={s._id}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#c2a878]/[0.02] border border-[#c2a878]/10 rounded-2xl hover:bg-[#c2a878]/[0.04] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={16} className="text-[#c2a878]" />
                    <span className="text-white font-bold">{s.userName || s.userEmail}</span>
                    <span className="text-[12px] font-black px-2 py-0.5 bg-[#c2a878] text-black font-black uppercase rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-4 text-[14px] font-bold font-black uppercase tracking-widest text-gray-600">
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-[#c2a878]" /><span>{s.date}</span></div>
                    <div className="flex items-center gap-2"><Clock size={12} className="text-[#c2a878]" /><span>{s.time} - {s.endTime}</span></div>
                  </div>
                  <div className="text-[14px] font-bold text-gray-500 mt-1">
                    Meeting ID: <span className="text-[#c2a878] font-mono">{s.meetingId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => router.push(`/meeting/${s.sessionId}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[14px] font-bold uppercase tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-95">
                    <Video size={14} /> Join Meeting
                  </button>
                  <button onClick={() => cancelSession(s._id)}
                    className="p-3 text-gray-700 hover:text-rose-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center rounded-2xl border border-dashed border-white/5">
                <p className="text-[14px] font-bold font-black uppercase tracking-[0.3em] text-gray-700">No active sessions scheduled</p>
              </div>
            )}
          </div>
        )}

        {/* Past Sessions */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
              </div>
            ) : pastSessions.length > 0 ? pastSessions.map(s => (
              <div key={s._id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-2xl opacity-60">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-white font-bold">{s.userName || s.userEmail}</span>
                    <span className={`text-[12px] font-black px-2 py-0.5 font-black uppercase rounded-full ${
                      s.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}>{s.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[14px] font-bold font-black uppercase tracking-widest text-gray-600">
                    <div className="flex items-center gap-2"><Calendar size={12} /><span>{s.date}</span></div>
                    <div className="flex items-center gap-2"><Clock size={12} /><span>{s.time} - {s.endTime}</span></div>
                  </div>
                </div>
                <div className="text-[14px] font-bold text-gray-600 uppercase tracking-wider">
                  {s.status === "completed" ? "Session Complete" : "Cancelled"}
                </div>
              </div>
            )) : (
              <div className="py-20 text-center rounded-2xl border border-dashed border-white/5">
                <p className="text-[14px] font-bold font-black uppercase tracking-[0.3em] text-gray-700">No past sessions found</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <ProfileTab user={adminUser} token={adminToken} onLogout={handleLogout} />
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && <CouponsTab />}

      </div>
    </div>
  );
}