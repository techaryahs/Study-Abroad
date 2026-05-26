"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import { clearAuth, getToken, getUser, setToken, setUser } from "@/app/lib/token";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import { UserX, Clock, Gift, UserPlus, Phone } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot {
  time: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  past: boolean;
}

interface BookingResult {
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  consultantName: string;
  userEmail: string;
  userPhone?: string;
  isFreeBooking?: boolean;
  isPaid?: boolean;
  amountPaid?: number;
  consultantVideoEnabled?: boolean;
}

interface FreeEligibility {
  eligible: boolean;
  isNewUser: boolean;
  hasUsedFreeBooking?: boolean;
  message: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
const DEFAULT_COUNTRY_ISO = "IN";

function normalizeDialCode(phonecode: string): string {
  const digits = phonecode.replace(/\D/g, "");
  return digits ? `+${digits}` : "+91";
}

const COUNTRY_CODE_OPTIONS = Country.getAllCountries()
  .map(country => ({
    isoCode: country.isoCode,
    name: country.name,
    flag: country.flag,
    dialCode: normalizeDialCode(country.phonecode)
  }))
  .filter(country => country.dialCode.length > 1)
  .sort((a, b) => {
    if (a.isoCode === DEFAULT_COUNTRY_ISO) return -1;
    if (b.isoCode === DEFAULT_COUNTRY_ISO) return 1;
    return a.name.localeCompare(b.name);
  });

function getDialCode(isoCode: string): string {
  return COUNTRY_CODE_OPTIONS.find(country => country.isoCode === isoCode)?.dialCode || "+91";
}

function buildPhoneNumber(isoCode: string, nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, "");
  return digits ? `${getDialCode(isoCode)}${digits}` : "";
}

// ─── Helper: Format YYYY-MM-DD → "Mon, 14 Apr 2025" ─────────────────────────
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// ─── Helper: Build a 42-cell calendar grid ───────────────────────────────────
function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Helper: Parse Time and Check Blocked ──────────────────────────────────────
function parseTime(timeStr: string) {
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM|am|pm)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function isSlotBlocked(slot: Slot, isToday: boolean) {
  if (!slot.available) return true;
  if (isToday && slot.time) {
    const parsed = parseTime(slot.time);
    if (!parsed) return false;
    const now = new Date();
    // Device local time check
    const slotDt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parsed.hours, parsed.minutes);
    return slotDt <= now;
  }
  return false;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[14px] font-bold md:text-xs font-bold border-2 transition-all duration-300 ${done
          ? "bg-[#D4A848] border-[#D4A848] text-[#2D1F1D]"
          : active
            ? "bg-transparent border-[#D4A848] text-[#D4A848]"
            : "bg-transparent border-white/20 text-white/30"
          }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[12px] font-black md:text-[13px] font-bold font-semibold uppercase tracking-wider ${active ? "text-[#D4A848]" : done ? "text-white/60" : "text-white/25"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookCounsellingModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [freeEligibility, setFreeEligibility] = useState<FreeEligibility | null>(null);
  const [showAuthStep, setShowAuthStep] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [shouldPromptProfileCompletion, setShouldPromptProfileCompletion] = useState(false);
  const [lastBookingWasFree, setLastBookingWasFree] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authConflict, setAuthConflict] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const resetOtpState = useCallback(() => {
    setOtpSent(false);
    setOtp("");
    setOtpVerified(false);
    setOtpError("");
    setAuthConflict(false);
    setOtpTimer(0);
  }, []);

  const resetGuestDetails = useCallback(() => {
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setSelectedCountryIso(DEFAULT_COUNTRY_ISO);
    setPhoneNumber("");
    setIsLoggedIn(false);
    setShowAuthStep(true);
    setFreeEligibility(null);
    setShouldPromptProfileCompletion(false);
    resetOtpState();
  }, [resetOtpState]);

  const useDifferentDetails = useCallback(() => {
    clearAuth();
    setSelectedDate("");
    setSelectedSlot(null);
    setError("");
    resetGuestDetails();
    setStep(1);
  }, [resetGuestDetails]);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setError("");
    try {
      const params = new URLSearchParams({ date });
      const res = await fetch(`${API_BASE}/api/bookings/available-slots?${params}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError("Could not load time slots. Please try again.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const checkFreeEligibility = useCallback(async (email: string): Promise<FreeEligibility | null> => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) return null;

    setIsCheckingEligibility(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/free-eligibility?email=${encodeURIComponent(emailTrimmed)}`);
      const data = await res.json();
      console.log("Free eligibility check:", data);
      if (!res.ok) {
        setFreeEligibility(null);
        return null;
      }
      setFreeEligibility(data);
      return data;
    } catch {
      console.error("Eligibility check failed");
      setFreeEligibility(null);
      return null;
    } finally {
      setIsCheckingEligibility(false);
    }
  }, []);

  const createBasicAccount = async (phoneOverride?: string) => {
    const phoneForAccount = phoneOverride || userPhone;

    if (!userEmail || !phoneForAccount) {
      const message = "Please enter your email and phone number";
      setError(message);
      setOtpError(message);
      return false;
    }

    setAuthLoading(true);
    setError("");
    setOtpError("");
    setAuthConflict(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/create-basic-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "Guest User",
          email: userEmail,
          phone: phoneForAccount
        })
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Failed to create account";
        setError(message);
        setOtpError(message);
        setAuthConflict(data.code === "LOGIN_REQUIRED");
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      setUserPhone(phoneForAccount);
      setIsLoggedIn(true);
      setOtpVerified(true);
      setShouldPromptProfileCompletion(Boolean(data.user?.isBasicAccount || data.isNewUser));

      await checkFreeEligibility(userEmail);
      setShowAuthStep(false);
      setStep(1);
      return true;
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      setOtpError(message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const sendOtp = async () => {
    const fullPhone = buildPhoneNumber(selectedCountryIso, phoneNumber);

    if (!phoneNumber) {
      setOtpError("Please enter your phone number");
      return;
    }

    if (phoneNumber.replace(/\D/g, "").length < 6 || !fullPhone) {
      setOtpError("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setError("");
    setAuthConflict(false);
    setOtp("");
    setOtpVerified(false);
    setUserPhone(fullPhone);

    try {
      const res = await fetch(`${API_BASE}/api/bookings/send-booking-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, mobile: fullPhone })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Failed to send OTP");
        setAuthConflict(data.code === "LOGIN_REQUIRED");
        return;
      }

      setOtpSent(true);
      setOtpTimer(data.expiresIn || 600);
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }

    const mobileForOtp = userPhone || buildPhoneNumber(selectedCountryIso, phoneNumber);

    setOtpLoading(true);
    setOtpError("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/bookings/verify-booking-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileForOtp, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Invalid OTP");
        return;
      }

      setOtpVerified(true);
      setUserPhone(mobileForOtp);
      const accountReady = await createBasicAccount(mobileForOtp);
      if (!accountReady) {
        setOtpVerified(false);
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const token = getToken();
    const user = token ? getUser() : null;
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
      setUserPhone(user.mobile || "");
      setSelectedCountryIso(DEFAULT_COUNTRY_ISO);
      setPhoneNumber("");
      setIsLoggedIn(true);
      resetOtpState();
      setOtpVerified(true);
      setShowAuthStep(false);
      setShouldPromptProfileCompletion(Boolean(user.isBasicAccount));
      if (user.email) {
        void checkFreeEligibility(user.email);
      }
    } else {
      resetGuestDetails();
    }
  }, [isOpen, checkFreeEligibility, resetGuestDetails, resetOtpState]);

  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [step, selectedDate, fetchSlots]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate("");
        setSelectedSlot(null);
        setBooking(null);
        setError("");
        setFreeEligibility(null);
        setLastBookingWasFree(false);
        setIsCheckoutOpen(false);
        resetOtpState();
      }, 300);
    }
  }, [isOpen, resetOtpState]);

  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  const cells = buildCalendarGrid(calYear, calMonth);
  const todayStr = today.toISOString().split("T")[0];

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };
  const isCellDisabled = (day: number | null) => {
    if (!day) return true;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr < todayStr;
  };
  const selectDay = (day: number | null) => {
    if (!day || isCellDisabled(day)) return;
    setSelectedDate(`${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const confirmBooking = async (paymentId?: string, forceFree = false) => {
    if (!selectedSlot || !selectedDate || !userEmail || !userPhone) {
      setError("Please fill in all required fields.");
      return;
    }
    setBookingLoading(true);
    setError("");
    try {
      const isFree = Boolean((forceFree || freeEligibility?.eligible) && !paymentId);
      console.log("Booking details:", {
        isFree,
        hasPaymentId: Boolean(paymentId),
        eligible: freeEligibility?.eligible
      });
      const body = {
        date: selectedDate,
        time: selectedSlot.time,
        userEmail,
        userName,
        userPhone,
        paymentId: paymentId || null,
        amount: 599,
        isFreeBooking: isFree
      };
      const res = await fetch(`${API_BASE}/api/bookings/book-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Booking failed.");
        return;
      }
      console.log("Booking successful:", data);
      if (isFree) {
        const currentUser = getUser();
        if (currentUser) {
          setUser({ ...currentUser, hasUsedFreeBooking: true });
        }
      }
      setLastBookingWasFree(isFree);
      setBooking(data.booking);
      setStep(4);
    } catch {
      setError("Network error.");
    } finally {
      setBookingLoading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const [dir, setDir] = useState(1);
  const goNext = (nextStep: number) => { setDir(1); setStep(nextStep); };
  const goBack = (prevStep: number) => { setDir(-1); setStep(prevStep); };
  const needsQuickAuth = showAuthStep && !isLoggedIn && step === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[340px] md:max-w-[400px] bg-[#2D1F1D] border border-[#D4A848]/20 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[82vh]">

              {/* Header */}
              <div className="relative flex items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3 flex-shrink-0">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#D4A848]/10 border border-[#D4A848]/25 rounded-full px-2.5 py-0.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A848] animate-pulse" />
                    <span className="text-[#D4A848] text-[12px] font-black md:text-[13px] font-bold font-bold tracking-widest uppercase">Book Session</span>
                  </div>
                  <h2 className="text-base md:text-lg font-black text-white leading-tight">Counselling Session</h2>
                  <p className="text-white/40 text-[13px] font-bold md:text-[14px] font-bold mt-0.5">1-hour private session</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Steps */}
              {step < 4 && !needsQuickAuth && (
                <div className="flex items-center gap-2 px-4 md:px-5 pb-3 flex-shrink-0">
                  <StepDot step={1} current={step} label="Date" />
                  <div className={`flex-1 h-px ${step > 1 ? "bg-[#D4A848]/40" : "bg-white/10"}`} />
                  <StepDot step={2} current={step} label="Time" />
                  <div className={`flex-1 h-px ${step > 2 ? "bg-[#D4A848]/40" : "bg-white/10"}`} />
                  <StepDot step={3} current={step} label="Confirm" />
                </div>
              )}

              {/* Admin Badge */}
              {step < 4 && !needsQuickAuth && (
                <div className="px-4 md:px-5 pb-2 flex-shrink-0">
                  <div className="inline-flex items-center gap-2 bg-[#D4A848]/10 border border-[#D4A848]/25 rounded-full px-2.5 py-1">
                    <span className="text-[#D4A848] text-[12px] font-black md:text-[13px] font-bold font-bold uppercase tracking-tight">👤 Counselling with Admin</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-white/5 flex-shrink-0" />

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0 bg-black/10">
                {needsQuickAuth ? (
                  <motion.div key="auth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#D4A848]/10 border border-[#D4A848]/25 flex items-center justify-center text-[#D4A848]">
                        {otpSent ? <Phone size={18} /> : <UserPlus size={18} />}
                      </div>
                      <div className="text-white text-sm font-bold">Quick Booking</div>
                      <div className="text-white/40 text-xs">
                        {otpSent ? "Verify your phone number" : "Enter your details to get started"}
                      </div>
                    </div>

                    {!otpSent ? (
                      <>
                        <input type="text" placeholder="Your Name" value={userName} onChange={e => setUserName(e.target.value)}
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none" />
                        <input type="email" placeholder="Email Address *" value={userEmail} onChange={e => setUserEmail(e.target.value)} required
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none" />
                        <div className="grid grid-cols-[116px_1fr] gap-2">
                          <select
                            aria-label="Country code"
                            value={selectedCountryIso}
                            onChange={e => {
                              const nextIso = e.target.value;
                              setSelectedCountryIso(nextIso);
                              setUserPhone(buildPhoneNumber(nextIso, phoneNumber));
                            }}
                            className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-2 py-2.5 text-xs text-white focus:border-[#D4A848]/40 outline-none"
                          >
                            {COUNTRY_CODE_OPTIONS.map(country => (
                              <option key={country.isoCode} value={country.isoCode}>
                                {country.flag} {country.dialCode}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            placeholder="Phone Number *"
                            value={phoneNumber}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                              setPhoneNumber(digits);
                              setUserPhone(buildPhoneNumber(selectedCountryIso, digits));
                            }}
                            required
                            className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none"
                          />
                        </div>

                        {(otpError || error) && <div className="text-red-400 text-xs px-1">{otpError || error}</div>}
                        {authConflict && (
                          <button
                            type="button"
                            onClick={() => router.push("/auth/login")}
                            className="w-full py-2.5 rounded-lg border border-[#D4A848]/40 text-[#D4A848] text-xs font-black uppercase tracking-widest hover:bg-[#D4A848]/10 transition-all"
                          >
                            Login Instead
                          </button>
                        )}

                        <button type="button" onClick={sendOtp} disabled={otpLoading || authLoading || !userEmail || !phoneNumber}
                          className="w-full py-2.5 rounded-lg bg-[#D4A848] text-[#2D1F1D] text-[14px] font-black uppercase tracking-widest disabled:opacity-30 transition-all">
                          {otpLoading ? "Sending..." : "Send OTP"}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="bg-[#362B25]/60 border border-[#D4A848]/10 rounded-xl p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848]">
                              <Phone size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-xs font-bold">OTP sent to</div>
                              <div className="text-[#D4A848] text-xs truncate">{userPhone}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setOtp("");
                                setOtpError("");
                                setError("");
                                setOtpTimer(0);
                                setOtpVerified(false);
                              }}
                              className="text-white/40 hover:text-white text-[10px] uppercase"
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setOtp(val);
                            }}
                            maxLength={6}
                            className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-center text-lg tracking-[0.5em] text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none font-mono"
                          />

                          {otpTimer > 0 && (
                            <div className="text-center text-white/40 text-[11px]">
                              OTP expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}
                            </div>
                          )}
                        </div>

                        {(otpError || error) && <div className="text-red-400 text-xs px-1">{otpError || error}</div>}
                        {authConflict && (
                          <button
                            type="button"
                            onClick={() => router.push("/auth/login")}
                            className="w-full py-2.5 rounded-lg border border-[#D4A848]/40 text-[#D4A848] text-xs font-black uppercase tracking-widest hover:bg-[#D4A848]/10 transition-all"
                          >
                            Login Instead
                          </button>
                        )}

                        <button type="button" onClick={verifyOtp} disabled={otpLoading || authLoading || otpVerified || otp.length !== 6}
                          className="w-full py-2.5 rounded-lg bg-[#D4A848] text-[#2D1F1D] text-[14px] font-black uppercase tracking-widest disabled:opacity-30 transition-all">
                          {otpLoading || authLoading ? "Verifying..." : otpVerified ? "Verified" : "Verify & Continue"}
                        </button>

                        {otpTimer === 0 && (
                          <button type="button" onClick={sendOtp} disabled={otpLoading || authLoading}
                            className="w-full text-[#D4A848] text-xs hover:underline disabled:opacity-40">
                            Resend OTP
                          </button>
                        )}
                      </>
                    )}

                    <div className="text-center">
                      <button onClick={() => router.push("/auth/login")} className="text-[#D4A848] text-xs hover:underline">
                        Already have an account? Login
                      </button>
                    </div>
                  </motion.div>
                ) : (
                <AnimatePresence mode="wait" custom={dir}>
                  {step === 1 && (
                    <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold md:text-[14px] font-bold font-bold text-white/50 uppercase tracking-widest block">Select Date</label>
                        <div className="bg-[#362B25]/40 border border-[#D4A848]/10 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-3">
                            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white">‹</button>
                            <span className="text-sm font-black text-white">{monthNames[calMonth]} {calYear}</span>
                            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white">›</button>
                          </div>
                          <div className="grid grid-cols-7 mb-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                              <div key={d} className="text-center text-[13px] font-bold font-bold text-white/20 uppercase py-1">{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((day, i) => {
                              const dateStr = day ? `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                              const disabled = isCellDisabled(day);
                              const isSelected = dateStr === selectedDate;
                              const isToday = dateStr === todayStr;
                              return (
                                <button key={i} onClick={() => selectDay(day)} disabled={disabled}
                                  className={`h-8 w-full rounded-lg text-xs font-bold transition-all
                                    ${!day ? "invisible" : ""}
                                    ${disabled ? "text-white/10 cursor-not-allowed" : "hover:bg-[#D4A848]/10 text-white"}
                                    ${isSelected ? "!bg-[#D4A848] !text-[#2D1F1D] shadow-lg shadow-[#D4A848]/10" : ""}
                                    ${isToday && !isSelected ? "text-[#D4A848] ring-1 ring-[#D4A848]/30" : ""}
                                  `}
                                >{day}</button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      <div className="flex items-center gap-3 bg-[#362B25]/60 border border-[#D4A848]/10 rounded-xl px-3 py-2.5">
                        <span className="text-lg">📅</span>
                        <div>
                          <div className="text-white font-bold text-xs">{formatDate(selectedDate)}</div>
                          <div className="text-white/40 text-[13px] font-bold">Select a preferred slot below</div>
                        </div>
                      </div>
                      {error && <div className="text-red-400 text-[14px] font-bold px-2">{error}</div>}
                      {slotsLoading ? (
                        <div className="grid grid-cols-3 gap-2">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.length === 0 ? (
                            <div className="col-span-3 text-center py-6">
                              <div className="text-3xl mb-2">⏰</div>
                              <div className="text-white/70 text-xs font-bold">No slots available</div>
                              <div className="text-white/40 text-[10px]">Please select another date</div>
                            </div>
                          ) : slots.map((slot) => {
                            const isToday = selectedDate === todayStr;
                            const blocked = isSlotBlocked(slot, isToday);
                            const isSelected = selectedSlot?.time === slot.time && !blocked;
                            const isBooked = !slot.available;
                            const isPast = !isBooked && blocked;

                            let subLabel = slot.endTime;
                            if (isBooked) subLabel = "Booked";
                            else if (isPast) subLabel = "Past";

                            return (
                              <button key={slot.time} disabled={blocked} onClick={() => setSelectedSlot(slot)}
                                className={`h-12 rounded-lg text-[11px] font-bold border flex flex-col items-center justify-center transition-all relative overflow-hidden
                                  ${isSelected
                                    ? "bg-[#D4A848] border-[#D4A848] text-[#2D1F1D]"
                                    : blocked ? "bg-[#362B25]/20 border-white/5 opacity-50 cursor-not-allowed" : "bg-[#362B25]/40 border-white/5 text-white/70 hover:border-[#D4A848]/30"
                                  }
                                `}
                              >
                                <span className={blocked ? "line-through text-white/40" : ""}>{slot.time}</span>
                                <span className={`text-[8px] ${isSelected ? "text-[#2D1F1D]/60" : blocked ? "text-red-400/70" : "text-white/30"}`}>{subLabel}</span>
                                {blocked && (
                                  <div className="absolute top-1 right-1 opacity-40">
                                    {isBooked ? (
                                      <UserX size={10} className="text-red-400" />
                                    ) : (
                                      <Clock size={10} className="text-white/50" />
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      {freeEligibility?.eligible && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                              <Gift size={16} />
                            </div>
                            <div>
                              <div className="text-green-400 text-sm font-bold">Your First Session is FREE!</div>
                              <div className="text-green-400/60 text-xs">No payment required</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!freeEligibility?.eligible && freeEligibility?.message && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white/45 text-xs">
                          {freeEligibility.message}
                        </div>
                      )}

                      <div className="bg-[#362B25]/60 border border-[#D4A848]/10 rounded-xl p-3.5 space-y-2">
                        <div className="text-[13px] font-bold font-bold text-white/30 uppercase tracking-widest">Summary</div>
                        <div className="text-white text-xs font-bold leading-none">{formatDate(selectedDate)}</div>
                        <div className="text-[#D4A848] text-[14px] font-bold font-bold uppercase">{selectedSlot?.time} – {selectedSlot?.endTime}</div>
                      </div>
                      <div className="space-y-2">
                        <input type="text" placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)}
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none" />
                        <input type="email" placeholder="Email Address *" value={userEmail} onChange={e => setUserEmail(e.target.value)} onBlur={() => void checkFreeEligibility(userEmail)} required disabled={isLoggedIn}
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none disabled:opacity-50" />
                        <input type="tel" placeholder="Phone Number *" value={userPhone} onChange={e => setUserPhone(e.target.value)} required disabled={isLoggedIn}
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none disabled:opacity-50" />
                      </div>
                      {isLoggedIn && (
                        <div className="flex items-center justify-between gap-3 text-[11px] px-1">
                          <span className="text-white/35">Using saved account details</span>
                          <button
                            type="button"
                            onClick={useDifferentDetails}
                            className="text-[#D4A848] hover:underline font-bold"
                          >
                            Use different details
                          </button>
                        </div>
                      )}
                      {error && <div className="text-red-400 text-xs px-1">{error}</div>}
                      {!freeEligibility?.eligible && (
                        <div className="bg-[#D4A848]/10 border border-[#D4A848]/20 rounded-xl p-3.5 space-y-1">
                        <div className="flex justify-between items-center text-[14px] font-bold font-bold text-white/50 uppercase">
                          <span>Session Charge</span>
                          <span className="text-white">Rs. 599</span>
                        </div>
                        <div className="text-[13px] font-bold text-[#D4A848]/60 font-medium">Charges are fully adjustable in any service you opt for later.</div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 4 && booking && (
                    <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-5 text-center">
                      <div className="w-14 h-14 bg-[#D4A848]/10 border border-[#D4A848]/30 rounded-full flex items-center justify-center mx-auto text-[#D4A848] text-xs font-black">
                        {lastBookingWasFree ? <Gift size={22} /> : "OK"}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white leading-tight">
                          {lastBookingWasFree ? "Free Session Booked!" : "Confirmed!"}
                        </h3>
                        <p className="text-white/40 text-[14px] font-bold mt-1">Confirmation sent to {userEmail}</p>
                      </div>
                      <div className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-2 text-left">
                        <Row label="Date" value={formatDate(booking.date)} />
                        <Row label="Time" value={booking.time} />
                        <div className="pt-2 border-t border-white/5">
                          <div className="text-[12px] font-black text-white/30 uppercase mb-0.5">Meeting ID</div>
                          <code className="text-[#D4A848] text-xs font-bold font-mono">{booking.meetingId}</code>
                        </div>
                      </div>
                      {shouldPromptProfileCompletion && lastBookingWasFree && (
                        <div className="bg-[#D4A848]/10 border border-[#D4A848]/20 rounded-xl p-3 text-left">
                          <div className="text-[#D4A848] text-sm font-bold mb-1">Complete Your Profile</div>
                          <div className="text-white/50 text-xs mb-2">Add your profile details to book more sessions and access your student dashboard.</div>
                          <button onClick={() => { onClose(); router.push("/User/edit-profile"); }}
                            className="w-full py-2 rounded-lg border border-[#D4A848] text-[#D4A848] text-xs uppercase tracking-wider">
                            Complete Profile
                          </button>
                        </div>
                      )}
                      <button onClick={() => { onClose(); router.push(`/meeting/${booking.sessionId}`); }}
                        className="w-full bg-[#D4A848] text-[#2D1F1D] font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-xl shadow-[#D4A848]/10">Join Room</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {step < 4 && !needsQuickAuth && (
                <div className="p-3 md:p-4 border-t border-white/5 flex gap-2">
                  {step > 1 && (
                    <button onClick={() => goBack(step - 1)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/50 text-[14px] font-bold font-bold uppercase transition-all">Back</button>
                  )}
                  <button
                    onClick={async () => {
                      if (step === 1 && selectedDate) goNext(2);
                      else if (step === 2 && selectedSlot) {
                        if (userEmail) {
                          await checkFreeEligibility(userEmail);
                        }
                        goNext(3);
                      }
                      else if (step === 3) {
                        if (!userName || !userEmail || !userPhone) {
                          setError("Please fill all details");
                          return;
                        }

                        const eligibility = await checkFreeEligibility(userEmail);
                        if ((eligibility || freeEligibility)?.eligible === true) {
                          console.log("Free booking eligible - skipping payment");
                          await confirmBooking(undefined, true);
                        } else {
                          console.log("Payment required - opening checkout");
                          setIsCheckoutOpen(true);
                        }
                      }
                    }}
                    disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedSlot) || (step === 3 && (bookingLoading || isCheckingEligibility))}
                    className="flex-1 py-2.5 rounded-lg bg-[#D4A848] text-[#2D1F1D] text-[14px] font-bold font-black uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    {bookingLoading ? "Booking..." : isCheckingEligibility ? "Checking..." : step === 3 ? (freeEligibility?.eligible ? "Confirm Free Booking" : "Confirm & Pay") : "Continue"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={confirmBooking}
            items={[{ name: "Counselling Session", price: 999 }]}
            subtotal={999}
            discount={400}
            total={599}
            currency="INR"
          />
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/30 text-[14px] font-bold font-bold uppercase">{label}</span>
      <span className="text-white text-[11px] font-bold">{value}</span>
    </div>
  );
}
